import { parseCsv, cleanUrl, generateSlug, type LinkReport } from "./utils"
import { Impit } from "impit"
import { chromium, type Browser } from "playwright"
import fs from "fs"
import path from "path"

const CSV_PATH = path.resolve(__dirname, "../MasterScholarshipList.csv")
const OUTPUT_DIR = path.resolve(__dirname, "output")
const REPORT_PATH = path.join(OUTPUT_DIR, "link-report.json")

const TIMEOUT_MS = 15_000
const PLAYWRIGHT_TIMEOUT_MS = 30_000
const BATCH_SIZE = 5
const BATCH_DELAY_MS = 1_000

const BROWSER_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"

type CheckResult = {
  status: "alive" | "redirect" | "dead" | "unknown"
  statusCode: number | null
  redirectUrl: string | null
}

// impit with Chrome TLS fingerprint impersonation
const impit = new Impit({ browser: "chrome", timeout: TIMEOUT_MS })

// Playwright browser (lazy-launched, for hard 403s)
let browser: Browser | null = null

async function getBrowser(): Promise<Browser> {
  if (!browser) {
    browser = await chromium.launch({ headless: true })
  }
  return browser
}

async function closeBrowser(): Promise<void> {
  if (browser) {
    await browser.close()
    browser = null
  }
}

function classifyResponse(code: number, headers: Headers): CheckResult {
  if (code >= 200 && code < 300) {
    return { status: "alive", statusCode: code, redirectUrl: null }
  }
  if (code >= 300 && code < 400) {
    return { status: "redirect", statusCode: code, redirectUrl: headers.get("location") }
  }
  return { status: "dead", statusCode: code, redirectUrl: null }
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit
): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    return await fetch(url, { ...options, signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}

async function checkWithPlaywright(url: string): Promise<CheckResult | null> {
  try {
    const b = await getBrowser()
    const page = await b.newPage()
    try {
      const response = await page.goto(url, {
        waitUntil: "load",
        timeout: PLAYWRIGHT_TIMEOUT_MS,
      })
      const status = response?.status() ?? 0
      if (status >= 200 && status < 400) {
        return { status: "alive", statusCode: status, redirectUrl: null }
      }
      return null
    } finally {
      await page.close()
    }
  } catch {
    return null
  }
}

async function checkUrl(url: string): Promise<CheckResult> {
  // Strategy 1: impit HEAD with Chrome TLS fingerprint (fast, low bandwidth)
  try {
    const response = await impit.fetch(url, { method: "HEAD", redirect: "manual" })
    const result = classifyResponse(response.status, response.headers)
    if (result.status !== "dead") return result
    if (response.status !== 403 && response.status !== 405) return result
  } catch {
    // impit HEAD failed (connection error, TLS mismatch) — fall through
  }

  // Strategy 2: impit GET with Chrome TLS fingerprint
  let lastStatusCode: number | null = null
  try {
    const response = await impit.fetch(url, { method: "GET", redirect: "manual" })
    const result = classifyResponse(response.status, response.headers)
    if (result.status !== "dead") return result
    lastStatusCode = response.status
  } catch {
    // impit GET failed — fall through
  }

  // Strategy 3: impit GET following redirects (catches redirect chains → 200)
  try {
    const response = await impit.fetch(url, { method: "GET", redirect: "follow" })
    if (response.status >= 200 && response.status < 400) {
      return { status: "alive", statusCode: response.status, redirectUrl: null }
    }
    lastStatusCode = response.status

    // Check for Cloudflare challenge page (site is alive, just behind JS challenge)
    if (response.status === 403) {
      const body = await response.text()
      if (body.includes("Just a moment") || body.includes("cf-browser-verification") || body.includes("challenge-platform")) {
        return { status: "alive", statusCode: 200, redirectUrl: null }
      }
    }
  } catch {
    // impit entirely failed (TLS incompatibility) — fall through to native fetch
  }

  // Strategy 4: Native fetch fallback (handles sites with TLS configs impit can't negotiate)
  try {
    const response = await fetchWithTimeout(url, {
      method: "GET",
      redirect: "follow",
      headers: { "User-Agent": BROWSER_UA },
    })
    if (response.status >= 200 && response.status < 400) {
      return { status: "alive", statusCode: response.status, redirectUrl: null }
    }
    lastStatusCode = response.status
  } catch {
    // Native fetch also failed — fall through to Playwright
  }

  // Strategy 5: Playwright headless browser (last resort for hard 403s from nginx/WAFs)
  if (lastStatusCode === 403 || lastStatusCode === null) {
    const pwResult = await checkWithPlaywright(url)
    if (pwResult) return pwResult
  }

  return { status: "dead", statusCode: lastStatusCode, redirectUrl: null }
}

async function processBatch(entries: { url: string; slug: string; name: string }[]): Promise<LinkReport[]> {
  return Promise.all(
    entries.map(async ({ url, slug, name }) => {
      const result = await checkUrl(url)
      return { url, slug, name, ...result }
    })
  )
}

async function main() {
  console.log("--- Scholarship Link Health Check ---\n")

  const rows = parseCsv(CSV_PATH)
  console.log(`Parsed ${rows.length} scholarships from CSV\n`)

  fs.mkdirSync(OUTPUT_DIR, { recursive: true })

  const entries = rows
    .filter((row) => row.Link && row.Link.trim())
    .map((row) => ({
      url: cleanUrl(row.Link),
      slug: generateSlug(row["Scholarship Name"], row.Deadline),
      name: row["Scholarship Name"],
    }))

  console.log(`Checking ${entries.length} URLs...\n`)

  const allResults: LinkReport[] = []

  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    const batch = entries.slice(i, i + BATCH_SIZE)
    const results = await processBatch(batch)
    allResults.push(...results)

    const progress = Math.min(i + BATCH_SIZE, entries.length)
    process.stdout.write(`\r  Progress: ${progress}/${entries.length}`)

    if (i + BATCH_SIZE < entries.length) {
      await new Promise((r) => setTimeout(r, BATCH_DELAY_MS))
    }
  }

  console.log("\n")

  fs.writeFileSync(REPORT_PATH, JSON.stringify(allResults, null, 2))

  const alive = allResults.filter((r) => r.status === "alive").length
  const redirect = allResults.filter((r) => r.status === "redirect").length
  const dead = allResults.filter((r) => r.status === "dead").length
  const unknown = allResults.filter((r) => r.status === "unknown").length

  console.log("--- Summary ---")
  console.log(`  Alive:    ${alive}`)
  console.log(`  Redirect: ${redirect}`)
  console.log(`  Dead:     ${dead}`)
  console.log(`  Unknown:  ${unknown}`)
  console.log(`  Total:    ${allResults.length}`)
  console.log(`\nReport saved to: ${REPORT_PATH}`)

  await closeBrowser()
}

main().catch(async (err) => {
  await closeBrowser()
  console.error("Fatal error:", err)
  process.exit(1)
})

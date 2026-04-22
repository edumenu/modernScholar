import { parseCsv, cleanUrl, generateSlug, type LinkReport } from "./utils"
import fs from "fs"
import path from "path"

const CSV_PATH = path.resolve(__dirname, "../Master Scholarship List.csv")
const OUTPUT_DIR = path.resolve(__dirname, "output")
const REPORT_PATH = path.join(OUTPUT_DIR, "link-report.json")

const TIMEOUT_MS = 10_000
const MAX_RETRIES = 1
const BATCH_SIZE = 5
const BATCH_DELAY_MS = 1_000

async function checkUrl(
  url: string,
  retries = MAX_RETRIES
): Promise<{ status: "alive" | "redirect" | "dead" | "unknown"; statusCode: number | null; redirectUrl: string | null }> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

      const response = await fetch(url, {
        method: "HEAD",
        redirect: "manual",
        signal: controller.signal,
      })

      clearTimeout(timer)

      const code = response.status

      if (code >= 200 && code < 300) {
        return { status: "alive", statusCode: code, redirectUrl: null }
      }

      if (code >= 300 && code < 400) {
        const location = response.headers.get("location")
        return { status: "redirect", statusCode: code, redirectUrl: location }
      }

      return { status: "dead", statusCode: code, redirectUrl: null }
    } catch {
      if (attempt < retries) continue
      return { status: "unknown", statusCode: null, redirectUrl: null }
    }
  }

  return { status: "unknown", statusCode: null, redirectUrl: null }
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
}

main().catch((err) => {
  console.error("Fatal error:", err)
  process.exit(1)
})

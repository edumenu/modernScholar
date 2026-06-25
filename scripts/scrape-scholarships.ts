import { chromium, type Browser } from "playwright"
import fs from "fs"
import path from "path"

import { classify } from "@/lib/eligibility"
import {
  generateSlug,
  deriveSeason,
  deriveDeadlineYear,
  normalizeClassification,
  extractDomain,
  formatProviderFromDomain,
  parseCsv,
  cleanUrl,
  generateDescription,
  type LinkReport,
  type EnrichedScholarship,
  type CsvRow,
  type Season,
} from "./utils"

const CSV_PATH = path.resolve(__dirname, "../MasterScholarshipList.csv")
const OUTPUT_DIR = path.resolve(__dirname, "output")
const SCRAPED_DIR = path.join(OUTPUT_DIR, "scraped")
const LINK_REPORT_PATH = path.join(OUTPUT_DIR, "link-report.json")
const ENRICHED_PATH = path.resolve(
  __dirname,
  "../src/data/scholarships-enriched.json"
)

const BATCH_SIZE = 5
const BATCH_DELAY_MS = 1_000
const SCRAPE_TIMEOUT_MS = 30_000

// --- Types ---

interface ScrapeResult {
  title: string | null
  ogDescription: string | null
  ogSiteName: string | null
  bodyText: string
}

// --- Browser management (lazy launch, same pattern as check-links.ts) ---

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

// --- Helpers ---

function loadLinkReport(): LinkReport[] {
  if (!fs.existsSync(LINK_REPORT_PATH)) {
    console.error(
      `Link report not found at ${LINK_REPORT_PATH}. Run check-links first.`
    )
    process.exit(1)
  }
  return JSON.parse(fs.readFileSync(LINK_REPORT_PATH, "utf-8"))
}

function buildCsvLookup(rows: CsvRow[]): Map<string, CsvRow> {
  const map = new Map<string, CsvRow>()
  for (const row of rows) {
    if (!row["Scholarship Name"] || !row.Link) continue
    const slug = generateSlug(row["Scholarship Name"], row.Deadline)
    const prev = map.get(slug)
    if (prev) {
      const fieldsDiffer =
        (prev.Link || "").trim() !== (row.Link || "").trim() ||
        (prev["Award amount"] || "").trim() !== (row["Award amount"] || "").trim() ||
        (prev.Eligibility || "").trim() !== (row.Eligibility || "").trim()
      if (fieldsDiffer) {
        console.warn(
          `  WARN: CSV slug collision "${slug}" — keeping later row, dropping earlier with different content`
        )
        console.warn(`    dropped: link=${prev.Link} | award=${prev["Award amount"]}`)
        console.warn(`    kept:    link=${row.Link} | award=${row["Award amount"]}`)
      }
    }
    map.set(slug, row)
  }
  return map
}

async function scrapeUrl(url: string): Promise<ScrapeResult | null> {
  const b = await getBrowser()
  const page = await b.newPage()
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: SCRAPE_TIMEOUT_MS })

    const [title, ogDescription, ogSiteName, bodyText] = await Promise.all([
      page.title(),
      page.evaluate(() =>
        document.querySelector('meta[property="og:description"]')?.getAttribute("content")
        ?? document.querySelector('meta[name="description"]')?.getAttribute("content")
        ?? null
      ),
      page.evaluate(() =>
        document.querySelector('meta[property="og:site_name"]')?.getAttribute("content") ?? null
      ),
      page.evaluate(() => document.body?.innerText?.slice(0, 10_000) ?? ""),
    ])

    return { title, ogDescription, ogSiteName, bodyText }
  } catch (err) {
    console.error(`  ERROR scraping ${url}: ${err instanceof Error ? err.message : String(err)}`)
    return null
  } finally {
    await page.close()
  }
}

async function processScholarship(
  entry: LinkReport,
  csvRow: CsvRow,
  force: boolean
): Promise<{
  scholarship: Partial<EnrichedScholarship>
  scraped: boolean
}> {
  const slug = entry.slug

  // Check cache (skip if --force)
  const scrapedPath = path.join(SCRAPED_DIR, `${slug}.json`)
  if (!force && fs.existsSync(scrapedPath)) {
    const existing = JSON.parse(fs.readFileSync(scrapedPath, "utf-8"))
    return { scholarship: existing, scraped: false }
  }

  const result = await scrapeUrl(entry.url)

  const eligibility = csvRow.Eligibility?.trim() ?? ""

  const scholarship: Partial<EnrichedScholarship> = {
    id: slug,
    name: csvRow["Scholarship Name"].trim(),
    deadline: csvRow.Deadline.trim(),
    deadlineYear: deriveDeadlineYear(csvRow.Deadline),
    awardAmount: csvRow["Award amount"]?.trim() ?? "",
    classification: normalizeClassification(csvRow["Education Level"]),
    link: cleanUrl(csvRow.Link),
    openDate: csvRow["Open date"]?.trim() || null,
    eligibility,
    eligibilityTags: classify(eligibility),
    season: deriveSeason(csvRow.Deadline),
    image: "gradient",
    description: "",
    provider: "",
  }

  if (result) {
    scholarship.provider =
      result.ogSiteName ?? formatProviderFromDomain(extractDomain(entry.url))

    scholarship.description = generateDescription(
      result.bodyText,
      csvRow["Scholarship Name"],
      result.ogDescription
    )

    // Cache scraped data
    fs.writeFileSync(
      scrapedPath,
      JSON.stringify(
        {
          ...scholarship,
          _scraped: {
            title: result.title,
            ogDescription: result.ogDescription,
            ogSiteName: result.ogSiteName,
            bodyText: result.bodyText.slice(0, 2000),
          },
        },
        null,
        2
      )
    )
  } else {
    scholarship.provider = formatProviderFromDomain(
      extractDomain(entry.url)
    )
    fs.writeFileSync(scrapedPath, JSON.stringify(scholarship, null, 2))
  }

  return { scholarship, scraped: true }
}

// --- CLI flag parsers ---

function parseLimit(): number | null {
  const idx = process.argv.indexOf("--limit")
  if (idx === -1) return null
  const val = parseInt(process.argv[idx + 1], 10)
  if (isNaN(val) || val <= 0) {
    console.error("--limit requires a positive number (e.g. --limit 2)")
    process.exit(1)
  }
  return val
}

function parseSeason(): Season | "all" {
  if (process.argv.includes("--all")) return "all"

  const idx = process.argv.indexOf("--season")
  if (idx === -1) return "all"

  const val = process.argv[idx + 1]
  const validSeasons: Season[] = ["winter", "spring", "summer", "fall"]
  if (val && validSeasons.includes(val as Season)) {
    return val as Season
  }

  console.error(`--season requires one of: ${validSeasons.join(", ")}`)
  process.exit(1)
}

function parseForce(): boolean {
  return process.argv.includes("--force")
}

async function main() {
  const limit = parseLimit()
  const season = parseSeason()
  const force = parseForce()

  console.log("--- Scholarship Scraper (Playwright) ---")
  if (limit) console.log(`  Test mode:   --limit ${limit}`)
  if (season !== "all") console.log(`  Season:      ${season}`)
  else console.log(`  Season:      all (no filter)`)
  if (process.argv.includes("--all")) {
    console.log(`  Note:        --all is now the default; you can drop the flag.`)
  }
  if (force) console.log(`  Force:       re-scraping all entries`)
  console.log()

  fs.mkdirSync(SCRAPED_DIR, { recursive: true })

  const linkReport = loadLinkReport()
  const csvRows = parseCsv(CSV_PATH)
  const csvLookup = buildCsvLookup(csvRows)

  let aliveEntries = linkReport.filter(
    (r) => r.status === "alive" || r.status === "redirect"
  )
  console.log(`Found ${aliveEntries.length} alive/redirect URLs from link report`)

  // Dedupe by slug — the CSV can list the same scholarship twice (same name +
  // deadline → same slug), and each row turns into a link-report entry. Without
  // this, both rows get pushed into the output JSON and React throws a
  // duplicate-key error rendering the scholarships grid.
  const seenByslug = new Map<string, LinkReport>()
  aliveEntries = aliveEntries.filter((e) => {
    const prev = seenByslug.get(e.slug)
    if (prev) {
      if ((prev.url || "").trim() !== (e.url || "").trim()) {
        console.warn(
          `  WARN: link-report slug collision "${e.slug}" — keeping first entry, dropping later with different URL`
        )
        console.warn(`    kept:    ${prev.url}`)
        console.warn(`    dropped: ${e.url}`)
      }
      return false
    }
    seenByslug.set(e.slug, e)
    return true
  })

  // Filter by season
  if (season !== "all") {
    aliveEntries = aliveEntries.filter((entry) => {
      const csvRow = csvLookup.get(entry.slug)
      if (!csvRow) return false
      return deriveSeason(csvRow.Deadline) === season
    })
    console.log(`Filtered to ${season}: ${aliveEntries.length} URLs`)
  }

  if (limit) {
    aliveEntries = aliveEntries.slice(0, limit)
    console.log(`Processing ${aliveEntries.length} of them (--limit ${limit})`)
  }
  console.log()

  let scraped = 0
  let skipped = 0
  let failed = 0

  const allScholarships: Partial<EnrichedScholarship>[] = []

  for (let i = 0; i < aliveEntries.length; i += BATCH_SIZE) {
    const batch = aliveEntries.slice(i, i + BATCH_SIZE)

    const results = await Promise.all(
      batch.map(async (entry) => {
        const csvRow = csvLookup.get(entry.slug)
        if (!csvRow) {
          console.log(`  SKIP: No CSV match for slug "${entry.slug}"`)
          return null
        }
        return processScholarship(entry, csvRow, force)
      })
    )

    for (const result of results) {
      if (!result) {
        failed++
        continue
      }
      allScholarships.push(result.scholarship)
      if (result.scraped) scraped++
      else skipped++
    }

    const progress = Math.min(i + BATCH_SIZE, aliveEntries.length)
    process.stdout.write(`\r  Progress: ${progress}/${aliveEntries.length}`)

    if (i + BATCH_SIZE < aliveEntries.length) {
      await new Promise((r) => setTimeout(r, BATCH_DELAY_MS))
    }
  }

  // In full mode (no limit), include remaining CSV entries with minimal data
  if (!limit) {
    for (const row of csvRows) {
      const slug = generateSlug(row["Scholarship Name"], row.Deadline)
      const alreadyProcessed = allScholarships.some((s) => s.id === slug)
      if (alreadyProcessed) continue

      if (season !== "all" && deriveSeason(row.Deadline) !== season) continue

      const eligibility = row.Eligibility?.trim() ?? ""

      allScholarships.push({
        id: slug,
        name: row["Scholarship Name"].trim(),
        deadline: row.Deadline.trim(),
        deadlineYear: deriveDeadlineYear(row.Deadline),
        awardAmount: row["Award amount"]?.trim() ?? "",
        classification: normalizeClassification(row["Education Level"]),
        link: cleanUrl(row.Link || ""),
        openDate: row["Open date"]?.trim() || null,
        eligibility,
        eligibilityTags: classify(eligibility),
        season: deriveSeason(row.Deadline),
        image: "gradient",
        description: "",
        provider: row.Link
          ? formatProviderFromDomain(extractDomain(cleanUrl(row.Link)))
          : "",
      })
    }

    fs.writeFileSync(ENRICHED_PATH, JSON.stringify(allScholarships, null, 2))
  }

  console.log("\n\n--- Summary ---")
  if (limit) console.log(`  Mode:             TEST (--limit ${limit})`)
  if (season !== "all") console.log(`  Season:           ${season}`)
  console.log(`  Scraped:          ${scraped}`)
  console.log(`  Skipped (cached): ${skipped}`)
  console.log(`  Failed:           ${failed}`)
  console.log(`  Total output:     ${allScholarships.length}`)
  if (!limit) {
    console.log(`\nEnriched data: ${ENRICHED_PATH}`)
  }
  console.log(`Scraped data:  ${SCRAPED_DIR}`)

  await closeBrowser()
}

main().catch(async (err) => {
  await closeBrowser()
  console.error("Fatal error:", err)
  process.exit(1)
})


/**
 *   Usage:
  npm run scrape-scholarships                    # All seasons (default), cached
  npm run scrape-scholarships -- --limit 3       # Test with 3 URLs
  npm run scrape-scholarships -- --force         # Re-scrape everything
  npm run scrape-scholarships -- --all           # All seasons (explicit)
  npm run scrape-scholarships -- --season winter # Specific season (dev override)
  -------------------------------------------------------------------------------
  Run the full data pipeline (`npm run check-links && npm run scrape-scholarships && npm run tag-eligibilities`) to refresh `scholarships-enriched.json` to the full catalog now that the scrape default flipped.
 */

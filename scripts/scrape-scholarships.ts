import Firecrawl from "@mendable/firecrawl-js"
import sharp from "sharp"
import fs from "fs"
import path from "path"
import {
  generateSlug,
  deriveSeason,
  normalizeClassification,
  extractDomain,
  formatProviderFromDomain,
  parseCsv,
  cleanUrl,
  type LinkReport,
  type EnrichedScholarship,
  type CsvRow,
} from "./utils"

const CSV_PATH = path.resolve(__dirname, "../Master Scholarship List.csv")
const OUTPUT_DIR = path.resolve(__dirname, "output")
const SCRAPED_DIR = path.join(OUTPUT_DIR, "scraped")
const IMAGES_RAW_DIR = path.join(OUTPUT_DIR, "images-raw")
const IMAGES_OUT_DIR = path.resolve(__dirname, "../public/scholarships")
const LINK_REPORT_PATH = path.join(OUTPUT_DIR, "link-report.json")
const ENRICHED_PATH = path.resolve(
  __dirname,
  "../src/data/scholarships-enriched.json"
)

const BATCH_SIZE = 5
const BATCH_DELAY_MS = 1_000
const RATE_LIMIT_BACKOFF_MS = 5_000
const IMAGE_MAX_WIDTH = 800
const IMAGE_MAX_HEIGHT = 400
const WEBP_QUALITY = 80

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
    map.set(slug, row)
  }
  return map
}

async function downloadImage(
  url: string,
  destPath: string
): Promise<boolean> {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(10_000),
    })
    if (!response.ok) return false

    const buffer = Buffer.from(await response.arrayBuffer())
    fs.writeFileSync(destPath, buffer)
    return true
  } catch {
    return false
  }
}

async function compressImage(
  inputPath: string,
  outputPath: string
): Promise<boolean> {
  try {
    await sharp(inputPath)
      .resize(IMAGE_MAX_WIDTH, IMAGE_MAX_HEIGHT, {
        fit: "cover",
        withoutEnlargement: true,
      })
      .webp({ quality: WEBP_QUALITY })
      .toFile(outputPath)
    return true
  } catch {
    return false
  }
}

async function scrapeUrl(
  firecrawl: Firecrawl,
  url: string,
  retries = 1
): Promise<{
  markdown: string
  ogImage: string | null
  ogDescription: string | null
  ogSiteName: string | null
} | null> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const result = await firecrawl.scrape(url, {
        formats: ["markdown"],
      })

      return {
        markdown: result.markdown ?? "",
        ogImage: result.metadata?.ogImage ?? null,
        ogDescription: result.metadata?.description ?? null,
        ogSiteName: result.metadata?.ogSiteName ?? null,
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      if (message.includes("429") && attempt < retries) {
        console.log(`    Rate limited, backing off ${RATE_LIMIT_BACKOFF_MS}ms...`)
        await new Promise((r) => setTimeout(r, RATE_LIMIT_BACKOFF_MS))
        continue
      }
      if (attempt < retries) continue
      return null
    }
  }
  return null
}

async function processScholarship(
  firecrawl: Firecrawl,
  entry: LinkReport,
  csvRow: CsvRow
): Promise<{
  scholarship: Partial<EnrichedScholarship>
  hasImage: boolean
  scraped: boolean
}> {
  const slug = entry.slug

  // Check if already scraped
  const scrapedPath = path.join(SCRAPED_DIR, `${slug}.json`)
  if (fs.existsSync(scrapedPath)) {
    const existing = JSON.parse(fs.readFileSync(scrapedPath, "utf-8"))
    const imagePath = path.join(IMAGES_OUT_DIR, `${slug}.webp`)
    return {
      scholarship: existing,
      hasImage: fs.existsSync(imagePath),
      scraped: false,
    }
  }

  const result = await scrapeUrl(firecrawl, entry.url)

  const scholarship: Partial<EnrichedScholarship> = {
    id: slug,
    name: csvRow["Scholarship Name"].trim(),
    deadline: csvRow.Deadline.trim(),
    awardAmount: csvRow["Award amount"]?.trim() ?? "",
    classification: normalizeClassification(csvRow.Classification),
    link: cleanUrl(csvRow.Link),
    openDate: csvRow["Open date"]?.trim() || null,
    eligibility: csvRow.Eligibility?.trim() ?? "",
    season: deriveSeason(csvRow.Deadline),
    image: "gradient",
    description: "",
    provider: "",
  }

  let hasImage = false

  if (result) {
    // Save scraped content
    fs.writeFileSync(
      scrapedPath,
      JSON.stringify({ ...scholarship, _scraped: result }, null, 2)
    )

    // Extract provider
    scholarship.provider =
      result.ogSiteName ?? formatProviderFromDomain(extractDomain(entry.url))

    // Use og:description as placeholder until Claude Code enrichment
    scholarship.description = result.ogDescription ?? ""

    // Download and compress image
    if (result.ogImage) {
      const imageUrl = result.ogImage.startsWith("http")
        ? result.ogImage
        : new URL(result.ogImage, entry.url).href

      const ext = path.extname(new URL(imageUrl).pathname) || ".jpg"
      const rawPath = path.join(IMAGES_RAW_DIR, `${slug}${ext}`)
      const webpPath = path.join(IMAGES_OUT_DIR, `${slug}.webp`)

      const downloaded = await downloadImage(imageUrl, rawPath)
      if (downloaded) {
        const compressed = await compressImage(rawPath, webpPath)
        if (compressed) {
          scholarship.image = `/scholarships/${slug}.webp`
          hasImage = true
        }
      }
    }

    // Update scraped file with final state
    fs.writeFileSync(
      scrapedPath,
      JSON.stringify({ ...scholarship, _scraped: result }, null, 2)
    )
  } else {
    scholarship.provider = formatProviderFromDomain(
      extractDomain(entry.url)
    )
    fs.writeFileSync(scrapedPath, JSON.stringify(scholarship, null, 2))
  }

  return { scholarship, hasImage, scraped: true }
}

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

async function main() {
  const apiKey = process.env.FIRECRAWL_API_KEY
  if (!apiKey) {
    console.error("FIRECRAWL_API_KEY not set. Add it to .env.local")
    process.exit(1)
  }

  const limit = parseLimit()
  const firecrawl = new Firecrawl({ apiKey })

  console.log("--- Scholarship Scraper (Firecrawl) ---")
  if (limit) console.log(`  TEST MODE: limiting to ${limit} URL(s)`)
  console.log()

  // Ensure directories
  for (const dir of [SCRAPED_DIR, IMAGES_RAW_DIR, IMAGES_OUT_DIR]) {
    fs.mkdirSync(dir, { recursive: true })
  }

  // Load link report and CSV
  const linkReport = loadLinkReport()
  let aliveEntries = linkReport.filter(
    (r) => r.status === "alive" || r.status === "redirect"
  )
  console.log(
    `Found ${aliveEntries.length} alive/redirect URLs from link report`
  )

  if (limit) {
    aliveEntries = aliveEntries.slice(0, limit)
    console.log(`  Processing ${aliveEntries.length} of them (--limit ${limit})`)
  }
  console.log()

  const csvRows = parseCsv(CSV_PATH)
  const csvLookup = buildCsvLookup(csvRows)

  let scraped = 0
  let skipped = 0
  let images = 0
  let gradients = 0
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
        return processScholarship(firecrawl, entry, csvRow)
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
      if (result.hasImage) images++
      else gradients++
    }

    const progress = Math.min(i + BATCH_SIZE, aliveEntries.length)
    process.stdout.write(`\r  Progress: ${progress}/${aliveEntries.length}`)

    if (i + BATCH_SIZE < aliveEntries.length) {
      await new Promise((r) => setTimeout(r, BATCH_DELAY_MS))
    }
  }

  // In full mode, also include dead/unknown URLs from CSV with minimal data
  if (!limit) {
    for (const row of csvRows) {
      const slug = generateSlug(row["Scholarship Name"], row.Deadline)
      const alreadyProcessed = allScholarships.some((s) => s.id === slug)
      if (alreadyProcessed) continue

      allScholarships.push({
        id: slug,
        name: row["Scholarship Name"].trim(),
        deadline: row.Deadline.trim(),
        awardAmount: row["Award amount"]?.trim() ?? "",
        classification: normalizeClassification(row.Classification),
        link: cleanUrl(row.Link || ""),
        openDate: row["Open date"]?.trim() || null,
        eligibility: row.Eligibility?.trim() ?? "",
        season: deriveSeason(row.Deadline),
        image: "gradient",
        description: "",
        provider: row.Link
          ? formatProviderFromDomain(extractDomain(cleanUrl(row.Link)))
          : "",
      })
    }
  }

  // Write enriched output (Phase 3 will update descriptions via Claude Code)
  if (!limit) {
    fs.writeFileSync(ENRICHED_PATH, JSON.stringify(allScholarships, null, 2))
  }

  console.log("\n\n--- Summary ---")
  if (limit) console.log(`  Mode:          TEST (--limit ${limit})`)
  console.log(`  Scraped:       ${scraped}`)
  console.log(`  Skipped (cached): ${skipped}`)
  console.log(`  Images saved:  ${images}`)
  console.log(`  Gradient fallback: ${gradients}`)
  console.log(`  Failed:        ${failed}`)
  console.log(`  Total output:  ${allScholarships.length}`)
  if (!limit) {
    console.log(`\nEnriched data: ${ENRICHED_PATH}`)
  }
  console.log(`Scraped data:  ${SCRAPED_DIR}`)
}

main().catch((err) => {
  console.error("Fatal error:", err)
  process.exit(1)
})

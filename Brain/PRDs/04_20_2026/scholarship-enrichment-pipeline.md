# Scholarship Enrichment Pipeline

## Problem Statement

The scholarship website currently relies on ~54 hardcoded placeholder scholarships with fake data. The real scholarship data lives in a CSV file (`Master Scholarship List.csv`) hosted on Google Drive with ~200+ entries. There is no automated way to transform this CSV into a format the website can consume, nor to enrich it with images and descriptions that the UI requires but the CSV lacks.

## Solution

A 3-phase enrichment pipeline:

1. **Node.js link health check script** — validates all scholarship URLs from the CSV before scraping
2. **Node.js Firecrawl scraping script** — scrapes alive URLs for images, descriptions, and metadata using Firecrawl's hosted API
3. **Claude Code interactive enrichment** — generates descriptions, reviews image quality, and produces the final JSON output

The output becomes the single source of truth for the website's scholarship data.

## User Stories

1. As a site maintainer, I want to run a link health check (`npm run check-links`) to identify dead URLs before spending scrape credits, so I know the state of my data.
2. As a site maintainer, I want to run a scraping command (`npm run scrape-scholarships`) that uses Firecrawl to fetch metadata, images, and page content from each alive scholarship URL.
3. As a site maintainer, I want scraped images to be automatically compressed (sharp) and saved locally as WebP, so that page load performance is optimized.
4. As a site maintainer, I want Claude Code to generate short descriptions for each scholarship based on scraped page content, replacing the need for a local LLM.
5. As a site maintainer, I want Claude Code to review scraped images and decide which are worth keeping vs. falling back to a gradient, so cards have quality visuals.
6. As a site maintainer, I want scholarships with no usable image to receive a deterministic gradient identifier, so that the UI can generate a unique visual fallback.
7. As a site maintainer, I want the script to normalize CSV classification values into a consistent `EducationLevel[]` array, so that filtering works reliably.
8. As a site maintainer, I want the script to derive a `season` field from each scholarship's deadline month, so that seasonal grouping is pre-computed.
9. As a site maintainer, I want the script to handle duplicate scholarships (same name, different deadlines) as separate entries with unique IDs, so that recurring scholarships appear in the correct season.
10. As a site maintainer, I want the script to gracefully handle network failures (timeouts, unreachable sites) without crashing, so that partial enrichment still produces usable output.
11. As a site maintainer, I want the script to produce a summary report (e.g., "180 processed, 15 dead links, 22 gradient fallback"), so that I can review the enrichment quality.

## Implementation Decisions

### Data Model

```ts
type EducationLevel = "High School" | "Undergraduate" | "Graduate" | "K-8" | "K-12"
type Season = "winter" | "spring" | "summer" | "fall"

interface EnrichedScholarship {
  id: string                        // slug: slugify(name + "-" + deadline)
  name: string                      // CSV: "Scholarship Name"
  deadline: string                  // CSV: "January 1" (month + day, no year)
  deadlineYear: number              // Derived: if deadline hasn't passed this year → this year, else next year
  awardAmount: string               // CSV: "$1,000" (kept as string — formats vary)
  classification: EducationLevel[]  // CSV: "Classification" → split + normalized
  link: string                      // CSV: "Link"
  openDate: string | null           // CSV: "Open date" (nullable)
  eligibility: string               // CSV: "Eligibility" (multi-line text)
  season: Season                    // Derived: deadline month → season
  image: string                     // Local path or "gradient" for fallback
  description: string               // Claude Code generated from scraped content
  provider: string                  // Scraped og:site_name or cleaned domain name
}
```

**Dropped from previous model:** `rating`, `tag`, `category` (subject-based), `linkStatus`
**Changed:** Subject categories → education level classification from CSV

### Season Mapping

| Season | Months |
|--------|--------|
| Winter | December, January, February |
| Spring | March, April, May |
| Summer | June, July, August |
| Fall   | September, October, November |

### Pipeline Phases

#### Phase 1: Link Health Check (Node script)

- Parse CSV with `papaparse`
- HEAD request each URL (10s timeout, 1 retry)
- Output: `scripts/output/link-report.json` — list of alive/redirect/dead URLs
- Print summary to stdout: "X alive, Y dead, Z redirect"
- **Purpose:** Know how many Firecrawl credits needed; don't waste credits on dead links

#### Phase 2: Scrape with Firecrawl (Node script)

- Read alive URLs from Phase 1 output
- Call Firecrawl API (`firecrawl` npm SDK) for each alive URL
- Firecrawl returns: page markdown, metadata (og:image, og:description, og:site_name)
- Save per-scholarship: `scripts/output/scraped/{slug}.json`
- Download og:image to `scripts/output/images-raw/{slug}.{ext}`
- Compress with `sharp`: resize 800x400 max, convert to WebP quality 80
- Save to `public/scholarships/{slug}.webp`
- Concurrency: 5 concurrent requests, 1s delay between batches
- **Firecrawl:** Hosted free tier (500 credits/month). ~150-200 alive URLs fits within limit.

#### Phase 3: Enrich with Claude Code (interactive)

- Claude Code reads scraped content from `scripts/output/scraped/`
- For each scholarship (in batches of ~15):
  - Generate 1-2 sentence description from page content
  - Review downloaded image — keep or flag for gradient fallback
  - Extract provider name from og:site_name or domain
- Output: `src/data/scholarships-enriched.json`
- **This phase is manual/interactive** — estimated ~30-45 min for 200 scholarships

### Classification Normalization Rules

| CSV Value | Normalized |
|-----------|-----------|
| "High school" | ["High School"] |
| "Undergraduate" | ["Undergraduate"] |
| "Graduate" | ["Graduate"] |
| "High school & Undergraduate" | ["High School", "Undergraduate"] |
| "High school, undergraduate, graduate" | ["High School", "Undergraduate", "Graduate"] |
| "Undergraduate & Graduate" | ["Undergraduate", "Graduate"] |
| "K-8" | ["K-8"] |
| "K-12" | ["K-12"] |

Split on `,` or `&`, trim whitespace, title-case normalize.

### Dependencies

- `papaparse` — CSV parsing
- `slugify` — ID generation
- `sharp` — image compression (WebP output)
- `firecrawl` — Firecrawl hosted API SDK

**Removed:** `ollama` (replaced by Claude Code), `cheerio` (Firecrawl handles HTML parsing)

### Concurrency & Rate Limiting

- Process scholarships in batches of 5 concurrent requests
- 1-second delay between batches
- 10-second timeout per request
- Retry once on timeout before marking as "unknown"

### Output Location

- Scraped data: `scripts/output/scraped/*.json` (not committed)
- Link report: `scripts/output/link-report.json` (not committed)
- Final JSON: `src/data/scholarships-enriched.json` (committed to repo)
- Images: `public/scholarships/*.webp` (committed to repo)
- Report: printed to stdout at end of run

### File Structure

```
scripts/
├── check-links.ts          # Phase 1: link health check
├── scrape-scholarships.ts  # Phase 2: Firecrawl scraping + image download
├── output/                 # Working directory (gitignored)
│   ├── link-report.json
│   ├── scraped/
│   └── images-raw/
src/data/
└── scholarships-enriched.json  # Phase 3: final enriched data
public/scholarships/
└── *.webp                  # Compressed scholarship images
```

### Firecrawl Setup & Usage

#### Account & API Key

- **Tier:** Hosted free tier (500 credits/month, 1 credit = 1 page)
- **API key:** Stored in `.env.local` as `FIRECRAWL_API_KEY`
- **Fallback plan:** If free tier becomes limiting, consider self-hosting (Docker + Redis + Playwright) for unlimited scraping

#### Install (CLI + Skills)

```bash
npx -y firecrawl-cli@latest init --all --browser
```

This installs:
- **CLI tools** — `firecrawl search`, `firecrawl scrape`, `firecrawl interact`
- **CLI skills** — `firecrawl/cli`, `firecrawl-search`, `firecrawl-scrape`, `firecrawl-interact`, `firecrawl-crawl`, `firecrawl-map`
- **Build skills** — `firecrawl-build`, `firecrawl-build-scrape`, `firecrawl-build-search`, etc.
- **Browser auth** — prompts sign-in or account creation

Verify install:

```bash
mkdir -p .firecrawl
firecrawl --status
firecrawl scrape "https://firecrawl.dev" -o .firecrawl/install-check.md
```

#### Usage in This Pipeline

This pipeline uses **Path B (app integration)** from the Firecrawl skill. The scraping script (`scripts/scrape-scholarships.ts`) calls the Firecrawl REST API via the `firecrawl` npm SDK.

**Endpoint used:** `POST /scrape` — extract clean markdown + metadata from a single URL

**Per-URL request flow:**
1. Call `firecrawl.scrapeUrl(url)` with default options
2. Firecrawl returns: page markdown, `og:image`, `og:description`, `og:site_name`
3. Script extracts metadata fields and saves to `scripts/output/scraped/{slug}.json`
4. If `og:image` URL found, script downloads and compresses the image separately

**SDK usage example:**

```ts
import FirecrawlApp from '@mendable/firecrawl-js'

const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY })

const result = await firecrawl.scrapeUrl(scholarshipUrl, {
  formats: ['markdown', 'html'],
})

// result.markdown — clean page content for Claude Code description generation
// result.metadata?.ogImage — image URL to download
// result.metadata?.description — fallback description
// result.metadata?.ogSiteName — provider name
```

**Rate limiting:** The script handles this via batch concurrency (5 concurrent, 1s delay). Firecrawl free tier has its own rate limits — the SDK throws on 429, and the script retries once after a 5s backoff.

#### Alternative: CLI for One-Off Scraping

For debugging or re-scraping individual URLs outside the pipeline:

```bash
firecrawl scrape "https://example.com/scholarship" -o .firecrawl/debug.md
```

#### Full Firecrawl Reference

See `.claude/skills/firecrawl/SKILL.md` for complete documentation including:
- Path A (live CLI tools) for ad-hoc scraping
- Path C (auth flow) if API key needs renewal
- Path D (direct REST API) for custom integrations

## Testing Decisions

- **Modules to test**: CSV parser normalization (classification splitting, season derivation, slug generation). These are pure functions with clear inputs/outputs.
- **Not tested**: Network scraping (integration concerns, flaky by nature). Instead, the summary report serves as verification.
- **Prior art**: No existing test patterns for scripts in this repo. Use Vitest for unit tests on utility functions.

## Verification

- Phase 1: Check stdout summary matches CSV row count
- Phase 2: Verify `scripts/output/scraped/` has one JSON per alive URL; verify `public/scholarships/` has WebP images
- Phase 3: Verify `scholarships-enriched.json` has all scholarships with descriptions; spot-check 5-10 descriptions for quality
- Final: `JSON.parse()` the output file, confirm it matches the `EnrichedScholarship` interface

## Out of Scope

- **Website UI changes** — new filter component for education level, gradient fallback rendering, data model swap (separate PR)
- Automated Google Drive sync (manual download for now)
- Scheduled/cron-based re-enrichment
- Subject-based categorization (needs backend tagging logic)
- Rating, tags, or profile matching data
- Incremental updates (script processes entire CSV each run)
- Firecrawl self-hosting (revisit if free tier becomes limiting)

## Open Questions

- CSV column names — need to verify exact headers in `Master Scholarship List.csv` before building parser
- Firecrawl API key management — `.env.local` or passed as CLI arg?

## Further Notes

- **Image sizing**: Cards are rendered at max ~325px wide at 2x DPI. 800x400 WebP at quality 80 should be under 50KB per image.
- **CSV quirks**: Some rows have typos in month names ("Feburary"). The parser should handle common misspellings.
- **Empty rows**: The CSV has blank rows (around line 500). Parser should skip rows where Scholarship Name is empty.
- **Gradient fallback**: When `image === "gradient"`, the UI component should generate a deterministic gradient from the scholarship ID. Implementation deferred to website UI PR.
- **Claude Code as Ollama replacement**: Claude Code reads scraped page content and generates descriptions interactively. Prompt: "Summarize this scholarship in 1-2 sentences for a student browsing scholarships. Focus on who it's for and what it offers."

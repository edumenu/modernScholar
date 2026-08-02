---
applies_to: ["scripts/**/*.ts", "src/data/**", "MasterScholarshipList.csv"]
load_when: "running, debugging, or modifying the scholarship data pipeline"
---

# Data Pipeline Rules

The scholarship dataset is **derived**, not authored. The pipeline runs in strict order — skipping a step or running them out of order will leave stale or invalid data.

## Pipeline order

```
MasterScholarshipList.csv  (source of truth, hand-curated)
        ↓ npm run check-links
scripts/output/link-report.json
        ↓ npm run scrape-scholarships
src/data/scholarships-enriched.json
        ↓ npm run tag-eligibilities  (only when retagging)
src/data/scholarships-enriched.json  (in-place rewrite)
        ↓ import in code
src/data/scholarships.ts             (typed export consumed by app)
```

## Step-by-step

1. `npm run check-links` — reads `MasterScholarshipList.csv`, HEAD-checks every URL, writes `scripts/output/link-report.json` with alive/dead status.
2. `npm run scrape-scholarships` — reads `link-report.json` (errors if missing), scrapes alive URLs with `impit`, writes `src/data/scholarships-enriched.json`.
3. `npm run tag-eligibilities` — reads `scholarships-enriched.json`, runs keyword matching to attach `eligibilityTags`, rewrites the file in-place. **Only run when retagging logic changes** — re-runs replace existing tags.
4. `src/data/scholarships.ts` is the typed module that components import — it loads the enriched JSON and exports the `Scholarship[]`.

## Running the scripts

- **The source CSV must be named `MasterScholarshipList.csv`** (single `t`) at the repo root — `check-links.ts` and `scrape-scholarships.ts` hard-code that path. A typo name like `MasterScholarshipListt.csv` will make step 1 fail with "file not found". Rename with `git mv` before running.
- **`scrape-scholarships` caches per scholarship in `scripts/output/scraped/<slug>.json`.** By default a cached slug is reused (not re-fetched); only new slugs are scraped. CSV fields (name, deadline, amount, eligibility) are re-read every run regardless of cache — only the scraped *web* content (og data, description, provider) is cached.
- **You do NOT need to delete `scripts/output/` before re-running.** `scholarships-enriched.json` is fully overwritten each run. Never delete the whole `output/` folder — `scrape-scholarships` reads `link-report.json` and errors if it's missing.
- **To force a full re-scrape** (e.g. URLs changed for existing slugs, or you want fresh web content): `npm run scrape-scholarships -- --force`. Deleting only `scripts/output/scraped/` has the same effect while preserving `link-report.json`.
- **`check-links` HEAD-checks every URL** in the CSV, so a full run over the ~1.2k-row list takes a while — that's expected, not a hang.

## Critical rules

1. **Never edit `scholarships-enriched.json` by hand.** Regenerate from CSV.
2. **Never add a scholarship by editing `scholarships.ts`.** Add it to `MasterScholarshipList.csv` and re-run the pipeline.
3. **Commit the regenerated JSON** when you've intentionally rerun the pipeline — downstream type inference depends on the committed snapshot.
4. **Script tests** are in `scripts/utils.test.ts` — run via `vitest run --project unit`.

## Schema (Scholarship)

See `src/data/scholarships.ts` for the authoritative type. Key fields:

- `id`, `title`, `provider`, `amount`, `deadline` (ISO date), `url`
- `description`, `eligibility` (free text), `eligibilityTags` (string[])
- `category`, `applicationStatus` (derived from `deadline` + today)

`applicationStatus` is computed at render time — don't bake it into the JSON.

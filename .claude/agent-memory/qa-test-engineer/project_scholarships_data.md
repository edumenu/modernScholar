---
name: Scholarships data ground truth
description: How to verify the /scholarships page rendered output against the underlying data source
type: project
---

The scholarships page reads from `src/data/scholarships-enriched.json` (211 entries as of 2026-05-07), which is generated from `MasterScholarshipList.csv` (550 rows) via `npm run scrape-scholarships` and tagged via `npm run tag-eligibilities`.

**Why:** When verifying that search/filter/sort results match what should appear, the JSON file is the actual source the React code consumes — not the CSV. The CSV is upstream and may include rows that didn't make it through the scrape (broken links, etc.).

**How to apply:** When verifying QA results, parse `scholarships-enriched.json` directly with Node (treating each entry as `{id, name, deadline, deadlineYear, awardAmount, classification: [], eligibility, eligibilityTags: [], season, provider, link, openDate, description}`).

To replicate the page's "active vs expired" partition:
- Compute `deadlineMs = new Date("${deadline}, ${deadlineYear}").getTime()`. If NaN (e.g. typo), it falls to 0 — those records sort to epoch in deadline-ascending mode.
- A record is "active" iff `deadlineMs >= today.getTime()`.

**Active count vs corpus count (2026-05-07): 181 active, 30 expired, 211 total.**
The hero stat "X scholarships" shows 181 (active only). Level tab badges and the filter sheet footer show 211 (entire corpus). Pagination is computed off 211. This inconsistency is reported as H-2 in the 2026-05-07 QA report.

**Known data defects (2026-05-07 — verified live):**
- 9 distinct names appear with multiple records (e.g. "J&Y 'Books for Good' Scholarship" ×13 monthly cohorts, "JMJ Phillip Group College Scholarship" ×4 quarterly). These are intentional in the CSV but visually appear as duplicate cards.
- Two **duplicate IDs** cause React `key` collisions in the grid: `young-american-creative-patriotic-art-contest-march-31` and `jandy-books-for-good-scholarship-march-31`.
- Three records have a "Feburary" typo in `deadline` ("Feburary 13", "Feburary 15" ×2) — both rendered to the user AND fail to parse, so they sort to epoch.

The seasonal filter that previously gated the corpus has been removed. The current code uses `corpus = allScholarships` directly (no `season` filter). The `season` field is still on each record but unused at the page level.

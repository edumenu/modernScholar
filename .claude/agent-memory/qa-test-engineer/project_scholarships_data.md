---
name: Scholarships data ground truth
description: How to verify the /scholarships page rendered output against the underlying data source
type: project
---

The scholarships page reads from `src/data/scholarships-enriched.json` (158 entries currently), which is generated from `MasterScholarshipList.csv` (550 rows) via `npm run scrape-scholarships` and tagged via `npm run tag-eligibilities`.

**Why:** When verifying that search/filter/sort results match what should appear, the JSON file is the actual source the React code consumes — not the CSV. The CSV is upstream and may include rows that didn't make it through the scrape (broken links, etc.).

**How to apply:** When verifying QA results, parse `scholarships-enriched.json` directly with Python (treating each entry as `{name, deadline, deadlineYear, awardAmount, classification: [], eligibility, eligibilityTags: [], season, provider}`). To replicate the page's seasonal-visibility filter, drop entries whose `deadline + ", " + deadlineYear` is before today.

The seasonal filter uses month-based seasons (Jan/Feb/Dec → winter, Mar/Apr/May → spring, Jun/Jul/Aug → summer, Sep/Oct/Nov → fall) defined in `src/lib/seasons.ts`. Currently (2026-05-03 = Spring) all 158 entries in the JSON have `season: "spring"`, and the visible-after-deadline filter narrows them to 129. If you see "129 scholarships" in the hero, that count is correct for May 2026.

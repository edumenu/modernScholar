---
name: Pagination total page count stale on /scholarships
description: /scholarships pagination shows full unfiltered page count even when filter narrows results; tapping last page lands on empty state
type: project
---

`/scholarships` pagination renders pages `1, 2, …, 38, Next` regardless of active filter. Confirmed at 2026-05-17 audit: applying `?level=K-12` (22 results) still shows 38 pages.

**Why:** the page-count math appears to use the static-stat module constant (e.g. 421) instead of the filtered result count. Likely separate computation paths between the count label ("22 scholarships") and the pagination component.

**How to apply:**
- Treat the visible `1…38` page links as a known bug, not a sign that pagination state is fresh.
- When auditing list filtering, always verify pagination updates separately — visible result count alone is insufficient.
- Even unfiltered, 421 ÷ 12 cards per page = 35 pages (with partial last page). UI shows 38, so per-page denominator is also suspect.

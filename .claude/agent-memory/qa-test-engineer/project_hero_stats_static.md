---
name: Hero stats are static
description: ScholarshipHero counters are computed at module load and never update with filter state
type: project
---

`src/components/scholarships/scholarship-hero.tsx` declares `totalScholarships`, `educationLevelsCount`, `maxAmount`, and `deadlinesThisMonth` as TOP-LEVEL `const` expressions at module-load time, before the React component is even defined.

**Why:** This means the hero strip ("129 scholarships · 3 education levels · Up to $50,000 · 2 deadlines this month") is essentially a static badge. When a user types into the search box, applies tag filters, or narrows the award range, the hero numbers do NOT update — but the grid below them does. A user searching for a non-existent term sees "129 scholarships" in the hero while the grid says "No scholarships found".

**How to apply:**
- When QA-ing this page, do not interpret the hero numbers as a result count — they are a "catalog at a glance" indicator only.
- If the engineering team accepts the QA fix recommendation to either gate the hero behind no-active-filters or make it dynamic, the easiest path is to hide the stat row inside the component (using the `hasActiveFilters` value from `useScholarshipFilters`) rather than replumb the hero into the filter store.
- If audit-time totals ever start mismatching what's in the data, check that this module isn't being cached at build time across SSG runs.

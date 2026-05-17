# PRD — K-12 Filter Merge

> Merge the `K-8` education level into `K-12` so the scholarships page exposes a single young-grade filter.

## Problem Statement

- The scholarships filter bar currently offers both `K-8` and `K-12` chips.
- `K-12` is the semantic superset of `K-8`; users see two filters that overlap.
- Only one record in `scholarships-enriched.json` carries `K-8` alone, so the chip is noisy with negligible filtering value.
- Site is pre-launch — fixing the taxonomy now is free; doing it after launch costs a URL migration.

## Location

`Brain/PRDs/05_16_2026/k-12-filter-merge/k-12-filter-merge.md`

No companion decisions file — rationale fits inside the PRD.

## Solution

- Drop `"K-8"` from the `EducationLevel` union. `"K-12"` becomes the canonical young-grade label.
- Re-classify every existing `K-8` record (CSV + enriched JSON) as `K-12`.
- Filter chip set shrinks from five to four: All, High School, Undergraduate, Graduate, K-12.
- `K-12` keeps its current secondary (sage) tint. `K-8` color/tint entries are removed.
- Existing nuqs sanitizer in `use-scholarship-filters.ts` silently drops stray `?level=K-8` URLs to `"All"` — acceptable since site is pre-launch.
- Patch enriched JSON in place. Fix CSV + pipeline scripts so the next pipeline run produces consistent data. No full pipeline re-run.

## User Stories

1. As a student browsing scholarships, I want a single young-grade filter so I'm not guessing which of `K-8` or `K-12` shows what I need.
2. As a content curator, I want one canonical young-grade label so future scholarship entries are tagged consistently.
3. As a developer, I want the type system to reject `"K-8"` so stale references surface at compile time.

## Implementation Decisions

**Modules** (all edits to existing files; no new modules):

- `scripts/utils.ts` (existing) — remove `"K-8"` from `EducationLevel` union. Keep `"k-8"` in `VALID_LEVELS` lowercase map but **re-target it to `"K-12"`** so any future `K-8` CSV row is auto-coerced to the merged label rather than silently dropped.
- `scripts/utils.test.ts` (existing) — replace the `normalizeClassification("K-8") → ["K-8"]` assertion with a coercion test asserting `normalizeClassification("K-8") → ["K-12"]` and that `"K-8, K-12"` dedupes to `["K-12"]`.
- `MasterScholarshipList.csv` (existing) — replace `K-8` with `K-12` across all rows. Multi-level cells like `"K-8, High school"` become `"K-12, High school"`.
- `src/data/scholarships-enriched.json` (existing) — replace the single `"K-8"` literal with `"K-12"`. Verify resulting array has no duplicate `"K-12"` entries.
- `src/data/scholarships.ts` (existing) — drop `"K-8"` from `EducationLevel` union (L10–15), `EDUCATION_LEVELS` (L17–24), `CLASSIFICATION_COLORS` (L29–35), `CLASSIFICATION_TINTS` (L87–123).
- Tests + stories — drop `"K-8"` fixture entries wholesale: `src/data/__tests__/scholarships.test.ts`, `src/components/scholarships/__tests__/sort-by-filter.test.ts`, `src/components/scholarships/__tests__/scholarship-card.component.test.tsx`, `src/hooks/__tests__/use-scholarship-filters.component.test.tsx`, `src/lib/__tests__/scholarship-utils.test.ts`, `src/components/scholarships/scholarship-card.stories.tsx`, `src/components/scholarships/scholarship-list-card.stories.tsx`, `src/components/scholarships/comparison-sheet.stories.tsx`.

**Key decisions**:

- Drop `"K-8"` entirely (not aliased under `K-12` button) — only one record uses it, dual-source confuses curators.
- No URL backward compat — site pre-launch, existing sanitizer handles strays.
- Keep `K-12` secondary (sage) tint — five of six merged records already render sage; avoid visual churn.
- Patch JSON in place, do not re-run full pipeline — `check-links` hits live URLs and is slow; upstream fixes prevent regression without the cost.
- CSV is canonical — every change ships at both the CSV and enriched-JSON layer so the next pipeline run stays consistent.

No schema, API, or dependency changes.

## Testing Decisions

- **Test**: existing `scholarships.test.ts` fixture-driven assertions — update fixtures, rely on the suite to confirm filter counts and classification helpers still behave.
- **Test**: existing `use-scholarship-filters.component.test.tsx` — confirm `levelCounts` returns the four-key record and sanitizer drops `?level=K-8` to `"All"`.
- **Test**: existing `scholarship-utils.test.ts` — confirm `filterByLevel` still narrows on `K-12`.
- **Skip**: explicit K-8 negative case — TS compile catches stale `"K-8"` references; a runtime assertion adds no signal.
- **Skip**: pipeline re-run — out of scope; CSV/scripts fix is verified by reading the diff.
- **Prior art**: mirror the existing fixture shape in `src/data/__tests__/scholarships.test.ts:71` when trimming.

## Out of Scope

- Re-running the full scraping pipeline (`check-links` → `scrape-scholarships` → `tag-eligibilities`).
- URL redirects for `?level=K-8` — pre-launch, sanitizer fallback is sufficient.
- Re-designing the filter bar layout or chip styling.
- Splitting `K-12` into sub-bands (e.g., elementary vs. middle vs. high) — single label is the explicit goal.
- Touching cached `scripts/output/scraped/*.json` files — naturally regenerate on next pipeline run.

# PRD — Drop Seasonal Filtering, Show Full Active Catalog Year-Round

> Author: Edem Dumenu · Date: 2026-05-04 · Source: `modern-scholar/DECISIONS.md`

## Problem Statement

The `/scholarships` page currently scopes its corpus to the current season (winter / spring / summer / fall) plus a "deadline >= today" gate. Two pain points result:

1. **Students see a fraction of the catalog at any given time.** A user landing in May only sees scholarships whose deadline falls in summer. They miss scholarships closing in June (next season) or already in their planning window for fall — even though those opportunities exist in our database.
2. **The seasonal model fights the way students actually plan.** Application timelines stretch across multiple seasons; students researching for next year cannot browse what's available beyond the current quarter.

Empty-state messaging like "New scholarships are coming in fall" reinforces a false scarcity that is purely a UI artifact, not a data reality. The catalog is rich; the page hides it.

## Location

- Primary PRD: `Brain/PRDs/05_04_2026/scholarships-all-corpus/scholarships-all-corpus.md` (this file).
- Supporting decisions doc: `modern-scholar/DECISIONS.md` (kept in repo for traceability).
- Single PRD — refactor is broad but cohesive; splitting it would fragment shared cross-cutting concerns (expired-state pill, full-corpus stats, etc.).

## Solution

The `/scholarships` page now surfaces the **full active catalog year-round**:

- The seasonal gate is removed. The page shows every scholarship in the catalog regardless of which "season" it was authored under.
- **Expired scholarships** (deadline already passed) remain visible but are dimmed and sorted to the bottom of the grid. Each expired card displays a "check back" message: when the scholarship has an `openDate`, the message reads "Reopens {Month}"; otherwise it reads "Check back in {deadlineYear + 1}".
- A new **month filter** sits as a horizontally scrollable pill row between the education-level tabs and the layout/sort/filter-sheet row. It contains 12 month pills (Jan–Dec) plus "All", each annotated with a count of scholarships whose deadline falls in that month. Selecting a month narrows the grid to scholarships closing that month, regardless of year. Default is "All".
- **Hero stats** ("X scholarships, Y education levels, Up to $Z, N closing soon") describe the full active corpus rather than a seasonal slice. The "deadlines this month" stat is replaced with "Closing soon" computed over a rolling 30-day window.
- **Filter sheet tag chip counts** are derived from the active corpus (not full corpus) so users see counts they can actually act on.
- **Coverflow on the home page** filters its feed to active-only — the existing seasonal micro-tag stays since the underlying `season` field is retained.
- **Profile setup UI** (`profile-setup.tsx`) and its store (`stores/profile.ts`) are deleted; they are unreferenced and were tied to the seasonal preference model.
- The **scrape script** (`scripts/scrape-scholarships.ts`) flips its default mode to `--all`. The `--season` flag is retained as a developer override for partial scrapes. The per-scholarship `season` field is still computed and stored (still used by coverflow).
- A new **`month` URL param** joins the existing `nuqs` keys (`q`, `level`, `sort`, `tags`, `min`, `max`, `page`, `layout`). It accepts a lowercase month name (e.g. `month=march`), is reset by `clearAll()`, and surfaces in `ActiveFilterStrip` as a removable chip.

## User Stories

### Browsing (happy path)

1. As a student, I want to see every scholarship in the catalog when I land on `/scholarships`, so that I can grasp the full breadth of opportunities without thinking about "seasons."
2. As a student, I want hero-strip stats that reflect the entire active catalog, so that I trust the platform has scale.
3. As a student, I want scholarships sorted by deadline ascending by default, so that the most urgent opportunities surface first.
4. As a student, I want pages of 12 scholarships with pagination controls, so that the grid stays scannable.

### Expired scholarships

5. As a student, I want expired scholarships visible but dimmed, so that I learn what existed and can plan to apply when they reopen.
6. As a student, I want expired scholarships sorted to the bottom of every page regardless of my chosen sort, so that they never push active opportunities off my screen.
7. As a student, I want each expired scholarship to tell me when to check back — either a specific reopen month from `openDate` or "Check back in {next year}" — so that I can set a personal reminder.
8. As a student opening the expanded view of an expired scholarship, I want the same reopen message displayed prominently, so that the cue is consistent across surfaces.
9. As a student adding scholarships to comparison, I want expired ones to render their reopen cue inside the comparison sheet, so that I can compare past and active scholarships in context.

### Filtering by month

10. As a student, I want a horizontal pill row of all 12 months plus "All", with counts per month, so that I can see at a glance where the catalog is densest.
11. As a student, I want selecting a month to narrow the grid to scholarships whose deadline falls in that month, regardless of year, so that I can plan around my own calendar.
12. As a student, I want my month selection to appear as a removable chip in the active-filter strip, so that I can clear it with one click.
13. As a student, I want my month selection encoded in the URL (`?month=march`) so that I can share or bookmark a filtered view.
14. As a student clicking "Clear all", I want my month selection reset along with every other filter, so that "Clear all" is honest.

### Filtering, sorting, and combining

15. As a student, I want the existing search, education-level, eligibility-tag, and award-range filters to behave exactly as they do today, so that nothing I already use breaks.
16. As a student combining a month filter with eligibility tags, I want only matching active scholarships to count toward chip counts, so that counts stay actionable.
17. As a student sorting by Amount with the month filter active, I want expired scholarships still pushed to the bottom, so that the "expired tier" rule is universal across sort modes.

### Empty states and edge cases

18. As a student narrowing filters to zero results, I want a clear empty state and a "Clear all filters" button, so that I can recover quickly.
19. As a student selecting a month with no scholarships matching my other filters, I want a polite empty-state message rather than a broken-feeling page.
20. As a developer running the platform with an empty `scholarships-enriched.json`, I want a defensive "No scholarships in our catalog right now. Check back soon." state, so that the page degrades gracefully.
21. As a student loading the page near midnight, I accept that scholarships freshly expiring at midnight may stay listed as active until I reload; this is acceptable behavior for v1.

### Home page and copy

22. As a visitor on the home page, I want the coverflow carousel to show only active scholarships, so that I don't pursue something already closed.
23. As a visitor reading the FAQ, I want the catalog refresh cadence described without seasonal language, so that the messaging matches the new product model.

### Operational / developer flows

24. As a content operator, I want `npm run scrape-scholarships` to default to scraping the entire catalog, so that the production data always reflects the full corpus.
25. As a developer iterating on a slice, I want `npm run scrape-scholarships -- --season spring` still available, so that I can do faster partial reruns.
26. As a developer, I want the `season` field retained on `Scholarship` records, so that the coverflow's seasonal micro-tag and any future seasonal carousels keep working without re-scraping.

## Implementation Decisions

### Module: `data/scholarships`

- **Responsibility**: Source of truth for `Scholarship` type, the JSON corpus, and pure visibility helpers.
- **Changes**:
  - Rename `isScholarshipVisible(scholarship, season, today)` to `isScholarshipActive(scholarship, today)`. The new function returns `parseDeadlineDate(deadline, deadlineYear) >= today.getTime()` — no season check.
  - Delete `getSeasonalScholarships`. No remaining consumers after refactor.
  - Keep `Scholarship.season: Season` field on the type and JSON output. Coverflow uses it.
  - Keep `parseAwardAmount` and `getClassificationTint` unchanged.
- **Rationale**: Renaming makes the new semantics explicit. Retaining the `season` field preserves existing surfaces (coverflow) without forcing data migration.

### Module: `lib/seasons`

- **Responsibility**: Season helpers (still used by coverflow + scripts).
- **Changes**: None. `getCurrentSeason`, `getNextSeason`, `seasonForMonthName`, and `SEASONS` all stay.

### Module: `lib/expired-status` (new)

- **Responsibility**: Single source of truth for "is this scholarship expired" and "what should we tell the user about reopening".
- **Interface**:
  - `isExpired(scholarship, today): boolean` — inverse of `isScholarshipActive`.
  - `getReopenLabel(scholarship): string` — returns `"Reopens {Month}"` when `openDate` is populated and parseable, else `"Check back in {deadlineYear + 1}"`. Centralizes the fallback rule from the decisions doc.
  - `getExpiredBadge(scholarship, today): { isExpired: boolean; label: string | null }` — a single call site convenience for cards that need both signals.
- **Rationale**: Deep module — multiple surfaces (card pill, expanded view, comparison sheet, possibly empty states) need the same logic. Putting this behind one tiny module avoids drift.

### Module: `lib/scholarship-utils`

- **Responsibility**: `filterAndSort` — now grows to support month filter and expired-tier sorting.
- **Interface change**: `filterAndSort` takes a new `month` parameter (`Month | "All"`, where `Month = "january" | ... | "december"`) and an internal `today` reference for expired classification.
- **Behavior**:
  - Apply month filter as a hard filter (excluded if non-matching month, identical pattern to eligibility-tags hard filter).
  - After existing sort (deadline or amount), partition the result into `[active, expired]` and concatenate `active` then `expired`. The "education level non-matching dim tier" already uses partitioning; the expired tier is a second partition that always wins.
- **Returns**: `{ scholarship, matches }[]` — `matches` remains the dim signal used by cards. Cards independently render expired badge/dim from `expired-status`. Cards may be both `!matches` (filter-mismatch) and `expired`; both dim treatments compose visually.
- **Rationale**: Keeps the sort/filter logic in one place. Expired tier is universal, applied last, so it's invariant to the user-selected sort.

### Module: `hooks/use-scholarship-filters`

- **Responsibility**: URL-state-backed filter values + setters.
- **Changes**:
  - Add `month: Month | "All"` to `ScholarshipFiltersValue` and a `setMonth` setter.
  - Use `nuqs` `parseAsString.withDefault("all")`. Mount-time sanitization checks against the 12 lowercase month names + `"all"`; unknown values reset to `null` (cleared param, defaults to "All").
  - Include `month !== "all"` in `hasActiveFilters`.
  - Add `setMonthUrl(null)` to `clearAll`.
- **Rationale**: Mirrors the existing `level` / `sort` / `tags` patterns one-to-one — no new abstractions.

### Module: `components/scholarships/month-filter` (new)

- **Responsibility**: The pill row UI. Shared between desktop and mobile filter components.
- **Props**: `value: Month | "All"`, `onValueChange: (next) => void`, `monthCounts: Record<Month, number>`, `totalCount: number`.
- **Visual**: Identical pattern to the education-level tab row (`scholarship-filters.tsx:65–116`) — `motion.span` highlight with `layoutId`, ghost button, count badge in trailing pill. Horizontally scrollable on overflow.
- **Rationale**: Reusing the level-tabs visual language keeps the page coherent; users learn one chip pattern, not two.

### Module: `components/scholarships/scholarship-filters` + `scholarship-filters-mobile`

- **Changes**:
  - Rename `seasonalScholarships` prop to `corpus`.
  - Render the new `month-filter` row between Row 1 (level tabs + search) and Row 2 (layout + sort + filter sheet).
  - Compute `monthCounts` from the active corpus passed in.
  - Mobile variant: render the month row above the layout/sort/filter-sheet trigger.
- **Rationale**: Stacked-filter convention puts categorical pills together; refine controls sit below.

### Module: `components/scholarships/filter-sheet`

- **Changes**:
  - Rename `seasonalScholarships` prop to `corpus`.
  - `tagCounts` computation now iterates only over active scholarships (`!isExpired(s, today)`), so chip counts represent what users can act on.
  - `ActiveFilterStrip`: add a month chip rendered when `month !== "All"`. Chip uses the same shrink/scale animation pattern; clicking clears the month back to "All". Also include month in the "any active filter" check that decides whether the strip renders.
- **Rationale**: Counts must mean what users see. `ActiveFilterStrip` is the universal "what's filtered" bar — adding the chip there keeps mental model consistent.

### Module: `components/scholarships/scholarship-grid`

- **Changes**:
  - Replace `seasonalScholarships` derivation (currently `allScholarships.filter(isScholarshipVisible(...))`) with `corpus = allScholarships` (no filtering at this layer; expired tier handled inside `filterAndSort`).
  - Pass `filters.month` to `filterAndSort`.
  - Update the three empty-state branches (corpus empty / filtered to zero / level-empty) per the new copy in `DECISIONS.md`.
  - Drop the `currentSeason` / `nextSeason` `useMemo` blocks.
- **Rationale**: Grid becomes the dumb composer — corpus comes in, filters apply, render. All "active vs expired" decisions live in `filterAndSort` + `expired-status`.

### Module: `components/scholarships/scholarship-hero` + `scholarship-hero-stats`

- **Changes**:
  - Hero stats compute from active corpus (`scholarships.filter(s => isScholarshipActive(s, now))`).
  - Replace the "deadlines this month" stat with "Closing soon": count scholarships whose deadline is within the next 30 days.
  - Hero copy: replace `Explore {Season} scholarships you can apply to right now…` with `Browse our full catalog of scholarships. Filter by education level, eligibility, and award amount to find what fits your journey.`
- **Rationale**: Stats describe what users see; rolling 30-day window matches the year-round model.

### Module: card surfaces (`scholarship-card`, `scholarship-list-card`, `expanded-scholarship`, `comparison-sheet`)

- **Changes**:
  - Each surface calls `getExpiredBadge(scholarship, today)`.
  - When expired, render the dimmed treatment (existing `dimmed` styling already used for filter-mismatch, reused) AND a small pill (or inline line in expanded/comparison) showing the reopen label.
  - Pill placement on grid card: replace or augment the existing classification badge area; visual weight low so it doesn't compete with active cards.
- **Rationale**: Single helper, four call sites, consistent message.

### Module: `components/home/coverflow-carousel`

- **Changes**: Filter its source array to active-only (`scholarships.filter(s => isScholarshipActive(s, now))`). Season micro-tag rendering unchanged.
- **Rationale**: Don't tease scholarships that already closed on the home page.

### Module: `components/home/faq-section`

- **Changes**: Single copy edit — replace "added throughout each season" with "added regularly" or "refreshed continuously".

### Module: deletions

- Delete `src/components/ui/profile-setup.tsx`.
- Delete `src/stores/profile.ts`.
- No remaining consumers (verified).

### Module: `scripts/scrape-scholarships`

- **Changes**:
  - `parseSeason()` returns `"all"` by default instead of `getCurrentSeason()`. The `--season <name>` flag still works for dev overrides; the `--all` flag becomes redundant but is left as a no-op alias for muscle memory.
  - Console banner updates to reflect the new default.
  - `deriveSeason()` continues to populate the `season` field on each row.
- **Rationale**: Default matches the new product model; partial scrapes remain available for dev iteration.

### URL contract

- New param: `month=<lowercase>` (e.g. `month=march`). Default unset; default value "All".
- All other params unchanged.
- Mount-time sanitization drops unknown month values.

### Schema / data model

- `Scholarship.season: Season` retained.
- No data migration required — existing JSON has the field already.

### Cross-cutting invariants

- "Active" = `deadline >= today`. Every surface that decides active vs expired uses `isScholarshipActive` / `isExpired` from the shared modules.
- Hero stats and filter-sheet chip counts use the active corpus only.
- Expired tier is the last sort key, applied after the user's chosen sort.
- Both dim signals (filter-mismatch, expired) compose without conflict — they're CSS-level opacity reductions.

## Step 5: Submit an Asana ticket

After review, create a ticket in the Scholarship Website Asana project via `/create-asana-ticket`. Title: "Refactor /scholarships to drop seasonal filter, show full active catalog year-round." Description: paste the Problem Statement + Solution + a link to this PRD.

## Testing Decisions

- **Modules to test**:
  - `lib/expired-status.ts` (new) — pure functions, three branches (`openDate` parses, `openDate` missing, `openDate` malformed). High value, near-zero cost.
  - `data/scholarships.ts` — new `isScholarshipActive` (replaces deleted `isScholarshipVisible` test).
  - `lib/scholarship-utils.ts` — month-filter behavior (matches by month-name regardless of year), expired-tier ordering invariant under both sort modes, interaction with eligibility tags.
  - `hooks/use-scholarship-filters.ts` — month URL param parsing, sanitization, `clearAll` includes month, `hasActiveFilters` includes month.
  - `components/scholarships/scholarship-card.tsx` and `expanded-scholarship.tsx` — expired pill / reopen line render with the right copy under both `openDate` paths.
  - `components/scholarships/scholarship-grid.tsx` — empty-state copy and the level-empty hint reflect the new wording.
- **Stories** (visual regression):
  - `scholarship-card.stories.tsx`, `scholarship-list-card.stories.tsx`, `comparison-sheet.stories.tsx` — add expired example.
- **Prior art**:
  - `lib/__tests__/seasons.test.ts` and `data/__tests__/scholarships.test.ts` are the existing pure-helper test patterns to mirror.
  - `hooks/__tests__/use-scholarship-filters.component.test.tsx` already covers URL-param round-tripping for other filters — extend the same pattern to `month`.
  - `components/scholarships/__tests__/sort-by-filter.test.ts` is the closest existing example for testing sort tier behavior.

## Out of Scope

- **No new "deadline window" quick filter** ("Next 30 / 90 days / This year / Any"). Sort-by-deadline + month filter cover urgency. Revisit if user feedback asks.
- **No deadline-year disambiguation in the month filter.** Picking "March" matches every March across all years in the catalog. If the catalog ever spans more than ~14 months of forward dates, a year sub-selector may be added.
- **No cross-midnight live update** of the active/expired tier. The `SESSION_DATE` snapshot at module load means a scholarship that expires at midnight stays listed as active until reload. Acceptable for v1.
- **No backfill or migration of historical scholarship JSON.** The `season` field stays; nothing to change at the data layer.
- **No infinite scroll.** Pagination at PAGE_SIZE = 12 is preserved exactly.
- **No changes to Storybook configuration** beyond adding stories.

## Further Notes

### Migration / rollout

- This is a single-PR refactor. No flag, no staged rollout. Behavior change is user-visible (more scholarships shown, expired tier appears) and should ship behind a normal preview-environment review.
- Production data: rerun `npm run check-links && npm run scrape-scholarships && npm run tag-eligibilities` after the script default changes, so `scholarships-enriched.json` reflects the full catalog. (This is the first scrape run after the default flips — verify output count matches the CSV.)

### Performance

- Full corpus is on the order of low hundreds of rows; client-side filtering remains trivial. No virtualization needed.
- `monthCounts` and `tagCounts` are `useMemo`'d on the corpus; no per-render cost concern.

### Design / QA

- Visual pass on the new month-filter row: confirm it doesn't make the filter area feel crowded on tablet.
- Visual pass on expired card treatment: ensure the dim opacity is distinct enough from filter-mismatch dim that users can read "this is closed" vs "this is hidden by my filter."

### Open questions

- None remaining at the design level. Implementation may surface micro-decisions (exact copy of the empty-state buttons, exact pixel placement of the expired pill on the list-card variant) — those should be made in the PR and reviewed in the design pass above.

### Follow-up work after this PRD ships

- Consider a "Pinned to my plan" feature so students can save scholarships across visits — natural extension once the corpus is fully visible. Not in this scope.
- Consider analytics on month-filter usage to inform whether a year sub-selector (deferred above) is worth building.

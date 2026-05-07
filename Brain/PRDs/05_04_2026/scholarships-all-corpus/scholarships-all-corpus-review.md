# Code Review: Drop Seasonal Filtering, Show Full Active Catalog Year-Round

**Branch:** `feature/scholarships-all-corpus`
**Reviewer:** `nextjs-code-reviewer` agent
**Date:** 2026-05-04
**PRD:** [scholarships-all-corpus.md](./scholarships-all-corpus.md)
**Verification:** [scholarships-all-corpus-verification.md](./scholarships-all-corpus-verification.md)

## Summary

The refactor is architecturally sound and the core logic is correct. The `expired-status` module, the `filterAndSort` expired-tier partitioning, and the `month` URL-param integration are all implemented cleanly. The issues below are genuine bugs or maintainability traps — none require revisiting the PRD's design decisions.

**Severity distribution:** 3 Critical · 7 Important · 6 Nit · **16 total**

**Resolution status:** All 16 findings addressed. Compile-time invariants (Critical-1, Important-4/7/8) verified by `tsc --noEmit`; behavioral fixes (Critical-3 inert, Nit-12 dual-line suppression, Nit-14 sort exclusion) verified live in browser. Vitest 357/357 (after a related test-data-brittleness cleanup in `featured-scholarships.component.test.tsx`).

---

## Critical

### 1. `Month` type defined twice with no shared source of truth

- Files: `src/lib/scholarship-utils.ts` lines 7–19 and `src/hooks/use-scholarship-filters.ts` lines 26–40
- The hook derives `Month` from `MONTHS as const` and exports both. `scholarship-utils.ts` defines its own independent `Month` union literal and its own `MonthFilter = Month | "all"`. TypeScript treats these as compatible but they are structurally separate — a month added to one but not the other would silently compile while producing a runtime mismatch between the filter and the URL parser.
- **Fix:** delete the `Month` / `MonthFilter` declarations from `scholarship-utils.ts` and import `Month` from the hook. The `MonthFilter` alias can stay in `scholarship-utils.ts` as `type MonthFilter = import("@/hooks/use-scholarship-filters").Month | "all"`, or the hook can export `MonthFilter` directly.

### 2. `ActiveFilterStrip` visibility gate is a manually duplicated filter checklist

- File: `src/components/scholarships/scholarship-grid.tsx` lines 168–174
- The `AnimatePresence` render condition manually re-enumerates every filter dimension. `filters.hasActiveFilters` exists on the same object and is exactly this calculation. If a new filter is added to the hook in the future, this gate will silently stop including it.
- **Fix:** replace the entire inline condition with `{filters.hasActiveFilters && (`.

### 3. `dimmed` expired card is `pointer-events-none` in grid view, but `inert` only on the list card — inconsistent keyboard accessibility

- Files: `src/components/scholarships/scholarship-card.tsx` line 61 vs `src/components/scholarships/scholarship-list-card.tsx` line 69
- `ScholarshipCard` uses `pointer-events-none saturate-50` for dimmed cards but does not set `inert`. `ScholarshipListCardSpread` correctly sets `inert={dimmed}`. Keyboard users tabbing through the grid can still focus a dimmed card because `pointer-events-none` only suppresses mouse events, not focus.
- **Fix:** add `inert={dimmed}` to the `motion.article` in `ScholarshipCard`, consistent with the list card.

---

## Important

### 4. `filterAndSort` `today` parameter defaults to `new Date()` — fresh clock per call

- File: `src/lib/scholarship-utils.ts` line 57
- The signature `today: Date = new Date()` means a forgotten argument gets a fresh clock. `filter-sheet.tsx` line 56 does `const now = new Date()` for tag-count computation — a different clock than the grid's `SESSION_DATE`. Across a midnight boundary, tag counts and the grid's expired tier can disagree on the same scholarship.
- **Fix:** export `SESSION_DATE` from `scholarship-grid.tsx` (or a shared module) and import it in `filter-sheet.tsx`.

### 5. `monthCounts` computation duplicated verbatim across desktop and mobile

- Files: `src/components/scholarships/scholarship-filters.tsx` lines 65–82 and `src/components/scholarships/scholarship-filters-mobile.tsx` lines 85–102
- Both components contain an identical `useMemo` that iterates the corpus and splits deadline strings.
- **Fix:** extract `computeMonthCounts(corpus: Scholarship[]): Record<Month, number>` into `lib/scholarship-utils.ts` and import in both filter components.

### 6. Mobile filter sheet `hasActiveFilters` excludes the `month` param — "Clear" link disappears when month is the only active filter

- File: `src/components/scholarships/scholarship-filters-mobile.tsx` lines 107–119
- The local `hasActiveFilters` does not include `filters.month !== "all"`. The "Clear" link at line 236 calls `filters.clearAll()` (which does reset month), but the link itself disappears when only month is active — leaving users with no visible way to clear the month filter except selecting "All months" in the dropdown.
- **Fix:** include `filters.month !== "all"` in the mobile `hasActiveFilters` check. Badge count inside the Filters button can remain month-exclusive.

### 7. Card `getExpiredBadge` uses live `new Date()`, grid uses `SESSION_DATE` — clock skew during open session

- File: `src/lib/expired-status.ts` line 41 / `src/components/scholarships/scholarship-card.tsx` line 38
- Cards call `getExpiredBadge(scholarship)` with no `today` argument, so they use a live clock. The grid uses `SESSION_DATE`. During a session where a deadline passes while the page is open, the card will show the expired pill while `filterAndSort`'s tier ordering still treats it as active.
- **Fix:** thread `SESSION_DATE` to card components, or document this as an extension of the accepted midnight-boundary caveat.

### 8. Tag-counts useMemo creates fresh `now`, separate from `SESSION_DATE`

- File: `src/components/scholarships/filter-sheet.tsx` line 56
- `const now = new Date()` inside the `tagCounts` useMemo is a different clock from `SESSION_DATE`. Same root cause as #4.

### 9. "Varies" amount=0 excluded when range narrowed — now applies to expired scholarships too

- File: `src/lib/scholarship-utils.ts` line 74
- Pre-existing behavior, but now applies to expired scholarships as well. An expired scholarship with "Varies" amount disappears entirely when the award range slider is active, with no indication it existed.
- **Fix:** acceptable for now; flag in a code comment.

### 10. `ActiveFilterStrip` month label uses hand-rolled string capitalization

- File: `src/components/scholarships/filter-sheet.tsx` line 405
- `month.charAt(0).toUpperCase() + month.slice(1)` works, but `MONTH_LABELS` already exists in both filter components mapping exactly this.
- **Fix:** export `MONTH_LABELS` from the hook (or a shared location) and use it in `ActiveFilterStrip`.

---

## Nit

### 11. Dead commented code in `faq-section.tsx`

- File: `src/components/home/faq-section.tsx` lines 31–68
- Four FAQ items remain commented out without TODO or explanation.
- **Fix:** add a brief WHY comment if intentional hold; otherwise delete.

### 12. `expanded-scholarship.tsx` may show both raw `openDate` and derived `getReopenLabel`

- File: `src/components/scholarships/expanded-scholarship.tsx` lines 200–228
- On an expired scholarship with `openDate`, both "Opens: January 1" and "Reopens January" lines show with slightly different phrasing for the same information.
- **Fix:** when expired and `reopenLabel` is present, suppress the raw "Opens:" line; or rename to "Next opens:".

### 13. `ScholarshipHeroStats` redeclares its own `useQueryState` subscribers

- File: `src/components/scholarships/scholarship-hero-stats.tsx` lines 28–46
- The component subscribes to 7 URL params independently, re-deriving the same `anyFilterActive` boolean that `useScholarshipFilters` already computes.
- Pre-existing structural choice; flagged for a future cleanup.

### 14. Hero stats hide on sort change — but sort is not a filter

- File: `src/components/scholarships/scholarship-hero-stats.tsx` line 43
- Changing sort to "amount" hides the stats strip. Stats describe corpus size, not filtering — sort should arguably not trigger the hide.
- **Fix:** remove `sort !== "deadline"` from `anyFilterActive` in `ScholarshipHeroStats`.

### 15. `getExpiredBadge` called inside IIFE in expanded view

- File: `src/components/scholarships/expanded-scholarship.tsx` line 96
- `{(() => { ... })()}` IIFE exists solely to introduce a JSX-scoped variable. Other card components compute the badge at the top of the function.
- **Fix:** move `const { isExpired, label } = getExpiredBadge(scholarship)` before the return statement.

### 16. `--all` flag is silent no-op after default flip

- File: `scripts/scrape-scholarships.ts` lines 224–231
- The `--all` flag is accepted but does nothing different from the new default. Developers passing it explicitly won't see any indication.
- **Fix:** add a banner note when `--all` is passed: "`--all` flag is now the default; no need to pass it".

---

## Recommended action order

| Priority | Finding | Effort |
| --- | --- | --- |
| 1 | Critical-1 — Consolidate `Month` type | 5 min |
| 2 | Critical-2 — Use `filters.hasActiveFilters` in `scholarship-grid.tsx` | 2 min |
| 3 | Critical-3 — Add `inert={dimmed}` to `ScholarshipCard` root | 1 min |
| 4 | Important-6 — Include `month` in mobile `hasActiveFilters` for Clear link | 1 min |
| 5 | Important-5 — Extract `computeMonthCounts` to scholarship-utils | 10 min |
| 6 | Important-4/7/8 — Thread `SESSION_DATE` to filter-sheet + card components | 15 min |
| 7 | Nit-15 — Lift `getExpiredBadge` out of IIFE | 2 min |
| 8 | Nit-14 — Remove `sort` from hero-stats `anyFilterActive` | 1 min |
| 9 | Nit-10 — Use `MONTH_LABELS` in `ActiveFilterStrip` | 5 min |

Bottom of the list (low-priority follow-ups): #11 (commented FAQ items), #12 (expanded view dual-line), #16 (`--all` no-op banner), #13 (hero stats re-subscribe).

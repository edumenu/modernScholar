# Verification Report: useScholarshipFilters Hook

**PRD:** [scholarship-filters-hook.md](scholarship-filters-hook.md)
**Tasks file:** [scholarship-filters-hook-tasks.json](scholarship-filters-hook-tasks.json)
**Progress log:** [scholarship-filters-hook-progress.txt](scholarship-filters-hook-progress.txt)
**Date:** 2026-05-02
**Status:** Complete

## Changes Made

| File                                                                | Change Summary                                                                                                                                                             |
| ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/hooks/use-scholarship-filters.ts`                              | NEW. Owns URL hydration (page/q/sort/level/tags/min/max via Nuqs), client-only `layout`, derived `levelCounts`/`hasActiveFilters`, stale-tag filtering against `ALL_TAGS`, rAF-deferred filter setters, `clearAll`. Exports `useScholarshipFilters` and `ScholarshipFiltersValue`. |
| `src/hooks/__tests__/use-scholarship-filters.component.test.tsx`    | NEW. 19 tests across hydration (4), page-reset (7 via `it.each` + 2 negative), derived (3), `onFilterChangeWhileExpanded` (3), `clearAll` (2). 19/19 pass.                  |
| `src/components/scholarships/scholarship-grid.tsx`                  | Deleted ~80 lines: 4 useState + 3 useQueryState + 6 useCallback handlers + Tag/EducationLevelFilter/useQueryState/parseAs*/GridLayout imports. Added `const filters = useScholarshipFilters({ scholarships, onFilterChangeWhileExpanded: () => setExpandedId(null) })`. Threaded `filters.*` everywhere. Removed bridge cast `as (tags: string[]) => void`. |
| `src/components/scholarships/scholarship-filters.tsx`               | Collapsed 14-prop interface to `{ filters, resultCount, seasonalScholarships }`. Deleted local `levelCounts` useMemo. Dropped `filteredCount` prop. Removed bridge cast.    |
| `src/components/scholarships/scholarship-filters-mobile.tsx`        | Same 3-prop collapse. `clearFilters` now delegates to `filters.clearAll`.                                                                                                  |
| `src/components/scholarships/filter-sheet.tsx`                      | Tightened `FilterSheet` and `ActiveFilterStrip` prop types: `selectedTags: Tag[]`, `onTagsChange: (tags: Tag[]) => void`. Narrowed internal `toggleTag`/`removeTag` from `string` → `Tag`.       |

Net: +1 hook file, +1 hook test file, 4 consumer files modified. Grid line count drops materially (deleted ~80 lines of state + handlers).

## Verification Checklist

### T01 — Create `src/hooks/use-scholarship-filters.ts`
- [x] `useScholarshipFilters(args: { scholarships: Scholarship[]; onFilterChangeWhileExpanded?: () => void }): ScholarshipFiltersValue`.
- [x] Returns activeFilter, layout, searchQuery, sortBy, selectedTags, page, awardRange (state); levelCounts, hasActiveFilters (derived); setActiveFilter, setLayout, setSearchQuery, setSortBy, setSelectedTags, setPage, setAwardRange, clearAll (setters).
- [x] URL schema: page/q/sort/level/tags/min/max with the spec'd defaults.
- [x] `layout` stays client-only state.
- [x] Setting any filter setter resets page to default.
- [x] `onFilterChangeWhileExpanded` callback fires before state updates via `requestAnimationFrame` when provided.
- [x] Stale tags filtered against `ALL_TAGS` on hydration.

### T02 — Rewire grid + collapse filter component prop interfaces
- [x] `scholarship-grid.tsx` deletes its filter useState/useQueryState/useCallback block; uses `useScholarshipFilters` with `onFilterChangeWhileExpanded: () => setExpandedId(null)`.
- [x] Pagination math (PAGE_SIZE, safePage, getPageNumbers) and modal (`expandedId`) stay in the grid.
- [x] `scholarship-filters.tsx` and `scholarship-filters-mobile.tsx` both reduced to `{ filters, resultCount, seasonalScholarships }`.
- [x] `levelCounts` ceases to be a prop; both UIs read from `filters`.
- [x] User behaviour preserved: page resets on filter change; modal closes via rAF; `level` migrated to URL.

### T03 — Tighten `filter-sheet.tsx` Tag types
- [x] `FilterSheet` props `selectedTags`/`onTagsChange` typed as `Tag[]` / `(tags: Tag[]) => void`.
- [x] `ActiveFilterStrip` props (same file) typed as `Tag[]` / `(tags: Tag[]) => void`.

### T04 — Hook tests
- [x] Hydration: hook initialised with `?page=2&q=art&sort=amount&level=Undergraduate&tags=Merit-Based,Need-Based` exposes those values.
- [x] Page reset: `setActiveFilter("Graduate")` resets page to 1.
- [x] Same for `setSearchQuery`, `setSortBy`, `setSelectedTags`, `setAwardRange`.
- [x] `levelCounts` reflects input scholarships array.
- [x] `hasActiveFilters` is `false` for default state, `true` when any non-default value is set.
- [x] `onFilterChangeWhileExpanded` invoked exactly once per filter change when provided.
- [x] Stale-tag hydration: URL with unknown tag drops it silently.

## End-of-loop gates

- ✅ `npm run build` — production build succeeds (24/24 static pages).
- ✅ `npm run lint` — 0 errors, 6 warnings (all pre-existing in `featured-scholarships.component.test.tsx`, unrelated).
- ✅ `npx tsc --noEmit` — clean.
- ✅ Targeted: `use-scholarship-filters.component.test.tsx` 19/19, `sort-by-filter.test.ts` 13/13, `eligibility.test.ts` 8/8.
- ⚠️ Full `npx vitest run` — 13 failures / 283 passed. **All 13 failures pre-existing on HEAD** (same set as eligibility-classifier-completion verification: 11 component-test failures + 1 not-found + 1 getClassificationTint). No new failures introduced. +33 net passing tests added by this loop.

## Issues Found

None blocking.

## Notes

- **Deep module pattern realised.** The hook hides URL ↔ state binding, derived counts, reset rules, and tag-selection serialisation behind a small interface. Filter UIs receive 3 props instead of 9–14. Adding a future filter is a one-edit change to `ScholarshipFiltersValue` plus rendering — no prop signature churn.
- **`null` sentinel convention.** All 7 URL setters write `null` when their value equals the default, dropping the URL param. Extends the q/sort/level/page convention to the new tags/min/max params for consistent clean URLs.
- **`requestAnimationFrame` modal coordination.** Setters call `onFilterChangeWhileExpanded?.()` synchronously, then defer the actual state update via `rAF`. This preserves the existing close-modal-then-filter UX (the grid passes `() => setExpandedId(null)` as the callback). `setPage` and `setLayout` skip rAF because they're not "filter changes".
- **Stale-tag guard.** URL `tags` is read raw, then filtered against `ALL_TAGS` and cast to `Tag[]`. A bookmark referencing a removed tag silently drops it instead of crashing or showing a phantom chip.
- **`Tag[]` is now end-to-end.** From hook → consumer prop chain → `FilterSheet`/`ActiveFilterStrip` internal helpers. The only remaining `as Tag` cast is on the dynamic `${category}:${subOption}` template literal in `filter-sheet.tsx` (TypeScript can't narrow template-literal types to a specific union member without inference machinery the codebase doesn't use).
- **Test infrastructure.** Tests live in `use-scholarship-filters.component.test.tsx` (not `.test.tsx`) because vitest config gates jsdom on the `.component.test.tsx` suffix; `renderHook` requires DOM. `NuqsTestingAdapter` requires `hasMemory` for set-then-read assertions (the default freezes searchParams). `requestAnimationFrame` is stubbed with `vi.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => { cb(0); return 0 })` so callback ordering tests run synchronously inside `act()`.

## Recommended follow-ups

- File a triage ticket for the 13 pre-existing vitest failures (component tests + `getClassificationTint` data drift). Persists across all three architecture-deepening PRDs.
- The `as Tag` cast on the template literal in `filter-sheet.tsx:fullTag` could be eliminated by using `isEligibilityFlatTag`-style narrowing or a typed builder. Optional cleanup; pattern is already used elsewhere in the codebase.
- Part 4 of the architecture-deepening series (if any) can build on this hook; the prop shape is now stable.

# `useScholarshipFilters` Hook

> Part 3 of the Architecture Deepening series. See `architecture-deepening-overview.md`. Depends on the `Tag` type produced by `eligibility-classifier-completion.md`.

## Problem Statement

Scholarship filtering state is split across three files that each know a fragment of the model:

- `src/components/scholarships/scholarship-grid.tsx` lines 49–195 own three `useState` hooks (`activeFilter`, `expandedId`, `layout`), three `useQueryState` (Nuqs) hooks (`page`, `q`, `sort`), three change handlers that bake in business rules (e.g., resetting `page` when `activeFilter` changes), and a `useMemo` for derived counts.
- `src/components/scholarships/scholarship-filters.tsx` lines 28–39 take ten props (nine state-and-callback pairs plus `seasonalScholarships`). It internally re-derives `levelCounts` (lines 59–76) using the seasonal list.
- `src/components/scholarships/scholarship-filters-mobile.tsx` lines 30–40 take a near-identical nine-prop interface but does **not** re-derive `levelCounts` — meaning desktop shows count badges and mobile does not.

The three locations cross no shared interface. Adding a new filter (for example `selectedTags: Tag[]` from the eligibility classifier) requires editing the grid's state declarations, both filter components' prop interfaces, and the `filterAndSort` call. Today's "page resets when filter changes" invariant lives implicitly inside one of the grid's `useCallback` bodies; nothing else can see it or test it directly.

The same shape would persist if any future page reused the filter UI: there is no extractable filter model.

## Location

`Brain/PRDs/05_02_2026/scholarship-filters-hook.md`

## Solution

Extract one hook at `src/hooks/use-scholarship-filters.ts` that owns URL hydration, filter state, derived data, and reset rules. The hook returns a single value object that both filter UIs consume; their prop interfaces collapse from 9–10 props to 3. The grid keeps `expandedId` (modal selection is a separate concern) and pagination math (specific to the grid layout) but delegates everything else to the hook.

## User Stories

Developer-facing:

1. As a developer, I want one hook that exposes the full filter state and setters so that I can read the model without bouncing across grid + filter UIs.
2. As a developer, I want the URL schema (`?page=…&q=…&sort=…&level=…&tags=…`) defined in one place so that adding a new URL-bound filter is a one-edit change.
3. As a developer, I want the "page resets when filter changes" rule expressed at the hook level so that both filter UIs benefit and the rule is testable in isolation.
4. As a developer, I want the desktop and mobile filter UIs to take the same prop interface so that they stay in feature parity by construction.
5. As a developer, I want `levelCounts` derived once in the hook so that the mobile UI gets count badges without duplicating the calculation.

User-facing:

6. As a student, I want bookmarked filter URLs to round-trip exactly across reloads.
7. As a student, I want changing a filter to reset pagination to page 1 (today's invariant) so that I never get stuck on an empty page.
8. As a student, I want the modal to close automatically when I change a filter from the filter UI (today's behaviour preserved).

## Implementation Decisions

### New module: `src/hooks/use-scholarship-filters.ts`

The hook is a deep module: a small interface, with URL ↔ state binding, derived counts, reset rules, and tag-selection serialization all hidden behind it.

**Hook signature:**

```
useScholarshipFilters(args: {
  scholarships: Scholarship[]
  onFilterChangeWhileExpanded?: () => void
}): ScholarshipFiltersValue
```

**Returned value (`ScholarshipFiltersValue`):**

- Current state: `activeFilter`, `layout`, `searchQuery`, `sortBy`, `selectedTags`, `page`.
- Derived: `levelCounts` (a `Record<EducationLevelFilter, number>` computed from `args.scholarships`), `hasActiveFilters` (boolean — true when any filter is non-default).
- Setters: `setActiveFilter`, `setLayout`, `setSearchQuery`, `setSortBy`, `setSelectedTags`, `setPage`. Each setter encapsulates today's reset rules (changing any filter sets `page` to its default; setters that affect filter results call `onFilterChangeWhileExpanded` if provided).

### URL schema

Bound via Nuqs:

- `page` — integer, default 1.
- `q` — string, default "".
- `sort` — string, default "deadline".
- `level` — `EducationLevelFilter`, default "All". (Currently held in `useState` only; this PR lifts it into URL state for bookmarkability per user story 6.)
- `tags` — comma-separated `Tag[]`, default `[]`. New, introduced by this PR's interaction with the eligibility classifier.

`layout` (grid vs. list) remains client-only state — it is a UI preference, not a discoverable filter, and does not belong in shareable URLs.

### Reset rules expressed at the hook level

- Setting `activeFilter`, `searchQuery`, `sortBy`, or `selectedTags` resets `page` to its default. Today these rules are spread across three `useCallback`s in the grid; they collapse into the hook's setters.
- When the optional `onFilterChangeWhileExpanded` callback is provided and a filter setter is called, the hook invokes it before applying the new state via a `requestAnimationFrame` boundary, preserving the existing close-modal-then-filter UX from grid lines 129–143. The hook is unaware of the modal; the grid passes the close callback.

### Filter UI prop reductions

`scholarship-filters.tsx` and `scholarship-filters-mobile.tsx` both reduce to:

```
{
  filters: ScholarshipFiltersValue
  resultCount: number
  seasonalScholarships: Scholarship[]   // for chip lists / empty-state copy
}
```

`levelCounts` ceases to be a prop; both UIs read it from `filters`. Adding a future filter is a one-line addition to `ScholarshipFiltersValue` plus rendering — no prop signature churn.

### Grid changes

`scholarship-grid.tsx` deletes its filter `useState`/`useQueryState`/`useCallback` block (lines 49–195) and instead does:

```
const filters = useScholarshipFilters({
  scholarships: seasonalScholarships,
  onFilterChangeWhileExpanded: () => setExpandedId(null),
})
```

Pagination math (`PAGE_SIZE`, `safePage`, `getPageNumbers`) stays in the grid because it is layout-specific. `expandedId` stays in the grid because it represents modal selection, not filter state, and is being extracted separately by the overlay PRD.

### Interaction with the eligibility classifier

`selectedTags` is typed as `Tag[]` from `src/lib/eligibility.ts`. The hook serializes/deserializes it to/from a comma-separated URL value. Validation: tags not in `ALL_TAGS` (e.g., from a stale bookmark after a taxonomy change) are silently dropped on hydration.

## Testing Decisions

### Modules to Test

- `src/hooks/use-scholarship-filters.ts` — primary surface. Cases (renderHook with a Nuqs adapter):
  - Hydration: hook initialised with simulated URL `?page=2&q=art&sort=amount&level=Undergraduate&tags=Merit-Based,Need-Based` exposes those values.
  - Page reset: `setActiveFilter("Graduate")` resets `page` to 1.
  - Same for `setSearchQuery`, `setSortBy`, `setSelectedTags`.
  - `levelCounts` reflects the input `scholarships` array.
  - `hasActiveFilters` is `false` for default state and `true` when any non-default value is set.
  - `onFilterChangeWhileExpanded` is invoked exactly once per filter change when provided.
  - Stale-tag hydration: URL with an unknown tag drops it silently.

### Prior Art

- `src/components/scholarships/__tests__/sort-by-filter.test.ts` — patterns for `filterAndSort` interaction (which the hook ultimately drives).
- `src/hooks/__tests__/use-focus-trap.component.test.tsx` — pattern for hook tests in this codebase.

## Out of Scope

- Pagination logic. Stays in the grid; layout-specific.
- Modal selection (`expandedId`). Stays in the grid; extracted separately by `expanded-scholarship-overlay.md`.
- Filter UI styling, animation, or sheet presentation. The prior UX PRD (`04_29_2026/eligibility-tag-filters.md`) covers those.
- Persistence beyond the URL (no localStorage backup of filter state).

## Further Notes

- This PR depends on `eligibility-classifier-completion.md` having landed first so that `Tag` is importable. The hook can be merged with `selectedTags` typed as `string[]` if the merges interleave, but that defeats the type-safety win.
- `level` migrating from `useState` to URL state is a small user-visible improvement: bookmarked filtered URLs now round-trip the level too, matching prior PRD user story #15. If the user prefers level to remain client-only, the hook supports that with a one-line change in the URL schema configuration.
- The grid's line count drops from 651 to ~410 after this PR alone (before the overlay extraction), which compounds with `expanded-scholarship-overlay.md` to bring the grid into a comfortable readable range.

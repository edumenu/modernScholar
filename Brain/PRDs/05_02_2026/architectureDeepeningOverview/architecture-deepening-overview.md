# Architecture Deepening — Overview

## Problem Statement

Recent feature work has spread architectural friction across the scholarship discovery surface. Four specific shapes of friction harm both maintainability and AI navigability:

1. The `feature/eligibility-tag-filters` branch is half-built. The tagger script that produced `eligibilityTags` exists only in git history (commit `408d305`); the `Scholarship` type has no `eligibilityTags` field; the JSON does not carry tags; the filter UI is commented out with a `TODO`. The eligibility tag taxonomy is referenced in three places (build script, runtime filter, UI) with no single source of truth.
2. `MONTH_TO_SEASON` and `getCurrentSeason` are defined twice — once in `scripts/utils.ts` (string-keyed) and once in `src/data/scholarships.ts` (number-keyed). A change to season boundaries silently requires two edits.
3. `scholarship-grid.tsx` is 651 lines mixing URL state, pagination, layout switching, focus management, scroll lock, and a modal overlay. Reading "what happens when a card is expanded" requires tracing ~240 interleaved lines.
4. The two filter UIs (desktop and mobile) each accept nine identical callback props, with desktop independently re-deriving `levelCounts` that mobile does not. Adding a new filter is a nine-prop signature change in two components.

Each is a shallow module by the deepening criterion: the interface is nearly as complex as the implementation, or the same logic is split across files that would silently diverge.

## Location

This is an umbrella PRD for an architecture refactor. It is split into four part PRDs in this folder:

- `season-calendar-module.md`
- `eligibility-classifier-completion.md`
- `scholarship-filters-hook.md`
- `expanded-scholarship-overlay.md`

## Solution

Four targeted refactors, each turning a shallow or duplicated module into a deep one with a single interface, deliverable independently as separate PRs.

1. **Season calendar module** — One `src/lib/seasons.ts` owning `MONTH_TO_SEASON`, `getCurrentSeason`, `getNextSeason`. Both `scripts/utils.ts` and `src/data/scholarships.ts` import from it.
2. **Eligibility classifier completion** — One `src/lib/eligibility.ts` owning the `Tag` taxonomy, `classify(text)`, and `matches(scholarship, selectedTags)`. The build script becomes a thin file-I/O adapter; the runtime filter and UI consume the same taxonomy. The `eligibilityTags` field is added to the type and persisted in JSON.
3. **`useScholarshipFilters` hook** — One `src/hooks/use-scholarship-filters.ts` owning URL hydration, filter state, derived counts, and reset rules. The grid and both filter UIs become thin consumers.
4. **`ExpandedScholarship` overlay** — One `src/components/scholarships/expanded-scholarship.tsx` owning AnimatePresence, focus trap, scroll lock, escape handling, and exit animation. The grid renders it and forgets about the modal's lifecycle.

## User Stories

These are developer-facing; the user-visible behaviour does not change.

1. As a developer, I want season boundary rules in one file so that updating "winter starts in December" requires one edit, not two.
2. As a developer, I want the eligibility tag taxonomy in one module so that adding a tag is one signature change, not edits across script + runtime + UI.
3. As a developer, I want `scholarship-grid.tsx` under 400 lines so that I can read its top-level concerns without scrolling past a modal.
4. As a developer, I want one place to test "what does the dialog do on Escape" — the overlay module — instead of having to mount the entire grid.
5. As a developer, I want one hook returning the full filter state object so that adding a new filter does not change nine prop signatures in two components.
6. As an AI assistant, I want each module's interface to describe its full behaviour so that I can find logic by reading the seam, not by tracing through call sites.

User-visible behaviour after all four PRs:

7. As a student, I want eligibility tag filters to actually work (the half-built feature ships) so that I can narrow scholarships by criteria like "Need-Based" or "Race/Ethnicity: African American/Black".
8. As a student, I want my bookmarked filtered URL to round-trip exactly (`?level=Undergraduate&q=engineering&sort=amount&tags=Merit-Based&page=2` reload restores state).

## Implementation Decisions

### Sequencing

- **Phase 1: Season calendar.** Smallest, isolated, lowest risk. Unblocks nothing but easy first win and validates the pattern.
- **Phase 2: Eligibility classifier completion.** Defines the `Tag` type and the `matches()` predicate that Phase 3 consumes.
- **Phase 3: Filters hook.** Absorbs the new `selectedTags` state from Phase 2.
- **Phase 4: Overlay extraction.** Independent of all the others; can land in parallel with Phase 1 or 2 if a second contributor picks it up.

Each phase is a separate PR. Do not bundle.

### Architectural Pattern

Each refactor follows the **deepening pattern** described in `LANGUAGE.md`: turn a module with a wide interface into one with a small interface that hides more behaviour. Specifically:

- A **module** has one **interface** and one **implementation**.
- A module is **deep** when callers (and tests) cross a small interface to reach a large amount of behaviour.
- The **deletion test**: imagine deleting the module; if complexity reappears across N callers, the module is earning its keep. Each of the four modules below passes this test by construction.

### Affected Modules

Across the four parts, the following existing modules are touched:

- `src/data/scholarships.ts` — `Scholarship` type extended with `eligibilityTags`; season helpers re-exported from new module.
- `src/lib/scholarship-utils.ts` — `filterAndSort` extended with `selectedTags` parameter.
- `src/components/scholarships/scholarship-grid.tsx` — major reduction (overlay extracted, filter state moved to hook).
- `src/components/scholarships/scholarship-filters.tsx` and `scholarship-filters-mobile.tsx` — prop interfaces collapse from 9–10 props to 3.
- `scripts/utils.ts` and `scripts/scrape-scholarships.ts` — share season helpers and call `classify()` inline.
- `scripts/tag-eligibilities.ts` — restored as a thin adapter.
- `src/data/scholarships-enriched.json` — regenerated with `eligibilityTags`.

### New Modules

- `src/lib/seasons.ts`
- `src/lib/eligibility.ts`
- `src/hooks/use-scholarship-filters.ts`
- `src/components/scholarships/expanded-scholarship.tsx`

## Testing Decisions

### Modules to Test

All four new modules. Their interfaces are the test surfaces.

- `src/lib/seasons.ts` — index- and name-keyed lookups, December→winter wrap, `getNextSeason` rollover.
- `src/lib/eligibility.ts` — `classify` for representative inputs, `matches` for selection semantics (any-of within taxonomy, no-selection passthrough), round-trip integrity (every classified tag is in `ALL_TAGS`).
- `src/hooks/use-scholarship-filters.ts` — URL hydration, page reset on filter change, level counts, `hasActiveFilters` toggle.
- `src/components/scholarships/expanded-scholarship.tsx` — null props render nothing; with a scholarship, renders dialog with correct ARIA, traps focus, restores on close, closes on Escape and backdrop click.

### Prior Art

- `src/data/__tests__/scholarships.test.ts` — pattern for season helper tests; cases will move into the new module's test file.
- `src/components/scholarships/__tests__/sort-by-filter.test.ts` — pattern for `filterAndSort` extension tests.
- `src/hooks/__tests__/use-focus-trap.component.test.tsx` — pattern for hook tests; the new overlay reuses this hook rather than re-implementing its inline Tab handler.

## Out of Scope

- **Settings module consolidation** (Zustand `cursorEnabled` + `next-themes`). Considered and explicitly deferred. Pain is too small today; `next-themes` carries its own SSR/hydration concerns. Revisit when a third setting appears.
- **Card / Dialog / Sheet UI primitives.** Shallow by strict definition but their semantic naming earns its keep.
- **`AnimatedSection`.** Borderline shallow; not the highest-leverage refactor.
- **CSS / design token changes.** No visual changes intended; behaviour preserved.
- **New filter dimensions beyond eligibility tags.** Award range slider was a separate prior PRD (`04_29_2026/eligibility-tag-filters.md`) and is not added here.

## Further Notes

- The existing PRD `Brain/PRDs/04_29_2026/eligibility-tag-filters.md` describes the user-visible UX for eligibility filtering. Phase 2 of this overview implements its data + classifier substrate, which the prior PRD assumed already existed. The two PRDs are complementary; this one fixes the foundation, the prior one specifies the UX.
- After Phase 2 lands, run `npm run scrape-scholarships` (re-scrapes and tags inline) **or** `npm run tag-eligibilities` (tags existing JSON in place); commit the regenerated `scholarships-enriched.json`.
- No new runtime dependencies introduced. The classifier is pure TypeScript; the filter hook is plain React + nuqs (already a dependency).

# Season Calendar Module

> Part 1 of the Architecture Deepening series. See `architecture-deepening-overview.md`.

## Problem Statement

The mapping from month to season and the helper that returns the current season are duplicated in two files:

- `scripts/utils.ts` lines 72–85 (`MONTH_TO_SEASON` keyed by lowercase month name) and lines 224–231 (`getCurrentSeason`).
- `src/data/scholarships.ts` lines 56–69 (`MONTH_TO_SEASON` keyed by month index 0–11) and lines 71–73 (`getCurrentSeason`).

The two implementations cover the same calendar but use different key types because the build script reads month names out of CSV strings while the runtime works from `Date` objects. A change to a season boundary — for example, moving "winter" to start in December instead of January (which today's number-keyed map already does, but the string-keyed one in scripts does too, by listing "december" first) — has to land in both files. Nothing in the codebase guarantees they stay in sync, and the pair has already drifted in storage shape.

The duplicated helpers also imply duplicated tests: `src/data/__tests__/scholarships.test.ts` covers only the runtime copy; the build-script copy is untested.

## Location

`Brain/PRDs/05_02_2026/season-calendar-module.md`

## Solution

Extract one season calendar module at `src/lib/seasons.ts` that owns both lookup forms behind a single internal data structure. Both call sites become thin importers; `src/data/scholarships.ts` re-exports `Season`, `SEASONS`, `getCurrentSeason`, and `getNextSeason` so existing imports across the app continue to compile without churn.

## User Stories

1. As a developer, I want to update a season boundary in one file and have both the build script and runtime app reflect the change.
2. As a developer, I want one place to find the calendar definition when reading the codebase for the first time.
3. As a developer, I want to look up the season for either a `Date.getMonth()` index or a lowercase month name through the same module.
4. As a developer running tests, I want a single test file that exercises both lookup forms and the season rollover helper.
5. As a developer, I want existing imports of `getCurrentSeason`, `getNextSeason`, `Season`, and `SEASONS` from `@/data/scholarships` to keep working without edits.

## Implementation Decisions

### New module: `src/lib/seasons.ts`

The module exposes a single internal calendar plus four functions and two type/value exports.

**Interface:**

- `type Season` — string-literal union of "winter" | "spring" | "summer" | "fall".
- `const SEASONS` — readonly tuple of all four seasons in calendar order.
- `seasonForMonthIndex(monthIndex: number): Season` — used by runtime code working from `Date` objects.
- `seasonForMonthName(name: string): Season | undefined` — used by build scripts parsing CSV month strings; case-insensitive; returns `undefined` for unrecognised input.
- `getCurrentSeason(referenceDate?: Date): Season` — convenience wrapper over `seasonForMonthIndex` defaulting to `new Date()`.
- `getNextSeason(season: Season): Season` — calendar rollover helper.

**Internal structure:** A single object mapping month indices 0–11 to seasons; `seasonForMonthName` is implemented in terms of the same data plus a name-to-index lookup. There is no separate string-keyed table to drift.

### Re-exports from `src/data/scholarships.ts`

To avoid touching every caller in the app, the runtime data module continues to export `Season`, `SEASONS`, `getCurrentSeason`, and `getNextSeason` — but as re-exports from `src/lib/seasons.ts`. The local definitions are deleted.

### Build script call sites

- `scripts/utils.ts` deletes the local `MONTH_TO_SEASON` and `getCurrentSeason`. `extractMonth` (line 124) and `deriveSeason` (line 133) call `seasonForMonthName` from the new module.
- `scripts/scrape-scholarships.ts` (currently imports `getCurrentSeason` from `src/data/scholarships`) continues to work via the re-export but should be migrated to import directly from `src/lib/seasons.ts` for clarity.

### Scope of behaviour preservation

- The current calendar mapping (December → winter, March–May → spring, June–August → summer, September–November → fall, January–February → winter) is preserved exactly.
- `getNextSeason` order: `winter → spring → summer → fall → winter`.
- Default reference date for `getCurrentSeason` remains `new Date()`.

## Testing Decisions

### Modules to Test

- `src/lib/seasons.ts` — full coverage. Cases:
  - `seasonForMonthIndex(0)` through `seasonForMonthIndex(11)` returns the right season for every month, including the December→winter wrap and January/February as winter.
  - `seasonForMonthName("january")` and `seasonForMonthName("DECEMBER")` (case-insensitive) return correct seasons.
  - `seasonForMonthName("not-a-month")` returns `undefined`.
  - `getCurrentSeason(new Date(2026, 0, 15))` returns `"winter"` (sanity wrap of `seasonForMonthIndex`).
  - `getNextSeason("fall")` returns `"winter"`.

### Prior Art

The existing `getCurrentSeason` test suite in `src/data/__tests__/scholarships.test.ts` (lines 15–33) covers the same cases for the runtime copy; the new test file absorbs those cases and adds the name-keyed variant. The old test cases for `getCurrentSeason` in `scholarships.test.ts` are deleted (the function still re-exports from the new module, but the coverage moves with the implementation).

## Out of Scope

- New season-derivation logic (e.g., for hemispheres, fiscal seasons, academic semesters).
- Caching or memoization. Pure synchronous lookups; no benefit.
- Localized season names. The codebase uses English-only labels.
- Changes to the calendar mapping itself.

## Further Notes

- This is a pure in-process refactor (DEEPENING.md Category 1). No adapter, no port, no external dependency.
- Lowest-risk of the four parts; suitable as a first commit to validate the extraction pattern before tackling the eligibility classifier.
- After landing, `npm run lint` and `npx vitest run` should pass with zero edits to consumer call sites apart from the two scripts.

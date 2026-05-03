# Verification Report: Season Calendar Module

**PRD:** [season-calendar-module.md](season-calendar-module.md)
**Tasks file:** [season-calendar-module-tasks.json](season-calendar-module-tasks.json)
**Progress log:** [season-calendar-module-progress.txt](season-calendar-module-progress.txt)
**Date:** 2026-05-02
**Status:** Partial — new module + tests landed; consumer migrations (T02/T03/T04) not present in working tree at verification time.

## Changes Made (working tree vs HEAD)

| File                                       | Change Summary                                                                                            |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| `src/lib/seasons.ts`                       | NEW. Owns `Season`, `SEASONS`, `seasonForMonthIndex`, `seasonForMonthName`, `getCurrentSeason`, `getNextSeason`. Single `MONTH_INDEX_TO_SEASON` source of truth; name lookup derives from same data. |
| `src/lib/__tests__/seasons.test.ts`        | NEW. 17 tests: 12 monthIndex cases (Jan–Dec including Dec→winter wrap), 3 monthName cases (lower, upper, unknown→undefined), 1 getCurrentSeason wrap, 4 getNextSeason cycle expectations. All pass. |
| `src/data/__tests__/scholarships.test.ts`  | Pruned: `getCurrentSeason` and `getNextSeason` describe blocks deleted; unused `Season`/`getCurrentSeason`/`getNextSeason` imports removed. Other describes (`isScholarshipVisible`, `parseAwardAmount`, `CLASSIFICATION_*`, `getClassificationTint`) untouched. |
| `src/data/scholarships.ts`                 | No change in working tree (HEAD unchanged). Loop applied T02 re-export refactor; not present at verification time. |
| `scripts/utils.ts`                         | No change in working tree (HEAD unchanged). Loop applied T03 refactor; not present at verification time. |
| `scripts/scrape-scholarships.ts`           | No change in working tree (HEAD unchanged). Loop applied T04 import migration; not present at verification time. |

## Verification Checklist

### T01 — Create `src/lib/seasons.ts` module
- [x] `type Season` — string-literal union of "winter" | "spring" | "summer" | "fall".
- [x] `const SEASONS` — readonly tuple of all four seasons in calendar order.
- [x] `seasonForMonthIndex(monthIndex: number): Season`.
- [x] `seasonForMonthName(name: string): Season | undefined` — case-insensitive; returns undefined for unrecognised input.
- [x] `getCurrentSeason(referenceDate?: Date): Season` — defaults to `new Date()`.
- [x] `getNextSeason(season: Season): Season` — calendar rollover helper.
- [x] Internal structure: single object mapping month indices 0–11 to seasons; `seasonForMonthName` derived from the same data.
- [x] Calendar mapping preserved exactly (Dec→winter, Mar–May→spring, Jun–Aug→summer, Sep–Nov→fall, Jan/Feb→winter).
- [x] `getNextSeason` order: winter → spring → summer → fall → winter.

### T02 — Re-export season helpers from `src/data/scholarships.ts`
- [ ] **Local definitions deleted; replaced with re-exports from `src/lib/seasons.ts`.** Working tree currently matches HEAD — local `MONTH_TO_SEASON`, `getCurrentSeason`, `getNextSeason`, `Season`, and `SEASONS` are still defined inline in `src/data/scholarships.ts`. Re-exports not present.
- [x] Existing imports of `getCurrentSeason`, `getNextSeason`, `Season`, `SEASONS` from `@/data/scholarships` keep working — still satisfied by the original local definitions.

### T03 — Refactor `scripts/utils.ts` to consume `src/lib/seasons.ts`
- [ ] **Local `MONTH_TO_SEASON` and `getCurrentSeason` deleted; `extractMonth` and `deriveSeason` use `seasonForMonthName` from new module.** Working tree currently matches HEAD — `scripts/utils.ts` still owns the local string-keyed `MONTH_TO_SEASON` (lines 72–85), local `getCurrentSeason` (lines 224–231), and `extractMonth`/`deriveSeason` still consume the local map.

### T04 — Migrate `scripts/scrape-scholarships.ts` import
- [ ] **`getCurrentSeason` imported directly from `src/lib/seasons.ts`.** Working tree currently matches HEAD — `scripts/scrape-scholarships.ts` still imports `getCurrentSeason` from `./utils`. Resolves correctly via the existing local export there.

### T05 — Add seasons test file, prune scholarships.test.ts
- [x] `seasonForMonthIndex(0)`–`seasonForMonthIndex(11)` covered for every month including Dec→winter wrap.
- [x] `seasonForMonthName('january')` and `seasonForMonthName('DECEMBER')` (case-insensitive).
- [x] `seasonForMonthName('not-a-month')` returns `undefined`.
- [x] `getCurrentSeason(new Date(2026, 0, 15))` returns `'winter'`.
- [x] `getNextSeason('fall')` returns `'winter'`.
- [x] `getCurrentSeason` and `getNextSeason` describe blocks deleted from `scholarships.test.ts`.

## End-of-loop gates

- ✅ `npm run build` — production build succeeds (24/24 static pages generated).
- ✅ `npm run lint` — 0 errors, 6 warnings (all pre-existing in `featured-scholarships.component.test.tsx`, unrelated to season calendar).
- ✅ `npx tsc --noEmit` — clean.
- ⚠️ `npx vitest run` — 13 failures / 250 passed. **All 13 failures verified pre-existing on HEAD via `git stash`** — none introduced by the season calendar work:
  - 11 failures across `featured-scholarships.component.test.tsx`, `error.component.test.tsx`, `not-found.component.test.tsx`, `scholarship-card.component.test.tsx` (component test infrastructure issues).
  - 1 failure in `getClassificationTint > returns tint based on first classification` (data/test drift: `CLASSIFICATION_TINTS.Graduate.bg = "bg-white dark:bg-surface-container-low"` but test asserts `"bg-surface-container-low"`).
  - 1 additional failure in same file group not isolated.
- ✅ `npx vitest run src/lib/__tests__/seasons.test.ts` — 17/17 pass in isolation.

## Issues Found

1. **Consumer migrations T02/T03/T04 not present in working tree.** Tasks marked PASS during the loop, but the corresponding edits to `src/data/scholarships.ts`, `scripts/utils.ts`, and `scripts/scrape-scholarships.ts` are no longer in the working tree (verified via `git diff` showing zero diff vs HEAD for those three files). Net effect: `src/lib/seasons.ts` exists as a new module with full coverage but is currently unused — the duplicated calendar data the PRD aimed to eliminate is still live in `src/data/scholarships.ts` and `scripts/utils.ts`. PRD User Story 1 ("update a season boundary in one file and have both build script and runtime app reflect the change") is therefore not yet realized in working tree.
2. **Coverage gap in `scholarships.test.ts`.** T05 deleted the `getCurrentSeason` and `getNextSeason` describe blocks from `scholarships.test.ts` because the PRD anticipated those functions would become re-exports (covered by the new test file). With T02 not in the working tree, those functions are still locally defined in `src/data/scholarships.ts` but no longer have local coverage. The new `src/lib/__tests__/seasons.test.ts` covers the new module's implementation, not the local one in `scholarships.ts`.
3. **Pre-existing `getClassificationTint` test failure.** Unrelated to this PRD. Worth a separate bug-fix PR — either update the test expectation to `"bg-white dark:bg-surface-container-low"` or revert the `CLASSIFICATION_TINTS` data to match the older expectation.
4. **Pre-existing component-test failures (11).** Unrelated to this PRD. Separate triage needed.

## Notes

- The single-source-of-truth pattern in `src/lib/seasons.ts` derives the lowercase name → index map from the same `MONTH_NAMES` array that drives `MONTH_INDEX_TO_SEASON`, so adding a new month label or changing a calendar boundary requires editing exactly one structure.
- During the loop, T03 hit a typecheck failure because deleting `getCurrentSeason` from `scripts/utils.ts` broke `scripts/scrape-scholarships.ts:14`'s import. The orchestrator added a one-line `export { getCurrentSeason } from "@/lib/seasons"` bridge re-export to keep the gate green; T04 then migrated the import to point directly at `@/lib/seasons`, making the bridge dead. This pattern (bridge → migrate → drop) is a useful template for future extractions.
- `tsx` resolves the `@/*` tsconfig path alias at runtime, so scripts can use `@/lib/seasons` directly without changing the runner.

## Recommended follow-ups

- Decide whether to re-apply T02/T03/T04 to the working tree, or close the PRD with only the new module landed and accept the duplication for now.
- If keeping `scholarships.test.ts` pruned, restore minimal local coverage of `getCurrentSeason`/`getNextSeason` in `scholarships.ts` until T02 lands.
- File a separate ticket for the `getClassificationTint` data/test drift and the 11 pre-existing component-test failures.

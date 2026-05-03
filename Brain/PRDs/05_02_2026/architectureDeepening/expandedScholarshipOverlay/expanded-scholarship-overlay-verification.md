# Verification Report: ExpandedScholarship Overlay Extraction

**PRD:** [expanded-scholarship-overlay.md](expanded-scholarship-overlay.md)
**Tasks file:** [expanded-scholarship-overlay-tasks.json](expanded-scholarship-overlay-tasks.json)
**Progress log:** [expanded-scholarship-overlay-progress.txt](expanded-scholarship-overlay-progress.txt)
**Date:** 2026-05-02
**Status:** Complete

## Changes Made

| File                                                                     | Change Summary                                                                                                                                                              |
| ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/components/scholarships/expanded-scholarship.tsx`                   | NEW. Self-contained modal component owning AnimatePresence + backdrop + dialog with role/aria-modal/aria-labelledby/layoutId. Uses `useFocusTrap` + `useScrollLock` hooks. Captures `previousFocusRef` via `useLayoutEffect`; restores in `onExitComplete`. Escape attached to window. Dialog body lifted verbatim from grid. |
| `src/components/scholarships/__tests__/expanded-scholarship.component.test.tsx` | NEW. 9 cases (PRD-spec'd): null render, ARIA, Escape, backdrop click, body-click no-close, focus trap (forward + backward), close-button focus on open, focus restoration on close. 9/9 pass. |
| `src/components/scholarships/scholarship-grid.tsx`                       | Deleted ~267 lines: `previousFocusRef`, `restorePreviousFocus`, `useScrollLock(!!expandedId)`, Escape `useEffect`, focus-capture inside `handleExpand`, the entire `<AnimatePresence>` modal block (~240 lines). Replaced with single `<ExpandedScholarship scholarship={expandedScholarship} onClose={handleClose} />`. Removed unused imports: `useRef`, `useScrollLock`, `CLASSIFICATION_COLORS`, `getClassificationTint`. Grid 628 → 361 lines. |

## Verification Checklist

### T01 — Create `src/components/scholarships/expanded-scholarship.tsx`
- [x] Component signature: `ExpandedScholarship({ scholarship: Scholarship | null, onClose: () => void }): JSX.Element`. `null` renders nothing; AnimatePresence handles exit animation.
- [x] Component owns: AnimatePresence onExitComplete=restorePreviousFocus; backdrop with onClick=onClose; dialog with role/aria-modal/aria-labelledby/layoutId/onClick stopPropagation; useFocusTrap (replaces inline onKeyDown); useScrollLock(scholarship !== null); Escape useEffect; previousFocusRef + restorePreviousFocus; full dialog body markup.
- [x] `src/hooks/use-focus-trap.ts` is imported instead of re-implementing the Tab handler.

### T02 — Refactor `scholarship-grid.tsx` to render `<ExpandedScholarship />`
- [x] `scholarship-grid.tsx` deletes previousFocusRef, restorePreviousFocus, useScrollLock(!!expandedId), the Escape useEffect, and the entire `<AnimatePresence>` modal block.
- [x] Keeps `expandedId`/`setExpandedId` useState and the `expandedScholarship` lookup.
- [x] Renders `<ExpandedScholarship scholarship={expandedScholarship} onClose={handleClose} />` once near the bottom of its tree.

### T03 — Add `expanded-scholarship.component.test.tsx`
- [x] With `scholarship: null`, the dialog is not in the DOM.
- [x] With a scholarship, the dialog renders with `role="dialog"`, `aria-modal="true"`, and the title element has the id referenced by `aria-labelledby`.
- [x] Pressing Escape calls `onClose`.
- [x] Clicking the backdrop calls `onClose`.
- [x] Clicking the dialog body does not call `onClose`.
- [x] Tab from the last focusable element in the dialog cycles to the first; Shift+Tab from the first cycles to the last (focus trap).
- [x] When the dialog opens, the close button receives focus.
- [x] When the dialog transitions from a scholarship to null, focus is restored to the element that was focused before the dialog opened. (Initially skipped; passing after T04 fix.)

### T04 — Fix focus-restoration timing (autoFocus race)
- [x] When the dialog transitions from a scholarship to null, focus is restored to the element that was focused before the dialog opened.
- [x] When the dialog opens, the close button receives focus (still satisfied via useFocusTrap).

## End-of-loop gates

- ✅ `npm run build` — production build succeeds (24/24 static pages).
- ✅ `npm run lint` — 0 errors, 6 warnings (all pre-existing in `featured-scholarships.component.test.tsx`, unrelated).
- ✅ `npx tsc --noEmit` — clean.
- ✅ Targeted: `expanded-scholarship.component.test.tsx` 9/9, `use-scholarship-filters.component.test.tsx` 19/19, `eligibility.test.ts` 8/8, `sort-by-filter.test.ts` 13/13.
- ⚠️ Full `npx vitest run` — 13 failures / 292 passed. **All 13 failures pre-existing on HEAD** (same set as prior architecture-deepening PRDs: 11 component-test failures + 1 not-found + 1 getClassificationTint). +9 tests added by this loop, no new failures.

## Issues Found

None. T03 surfaced a real bug (autoFocus race vs useLayoutEffect capture) that T04 fixed cleanly. The 13 pre-existing test failures persist but are unrelated.

## Notes

- **Bug surfaced and fixed during the loop.** T03's case 9 attempted to test focus restoration on close, found it broken, and skipped with a precise root-cause note. T04 followed up: removed `autoFocus` from the close button so React's commit-mutation phase doesn't pre-empt the parent's `useLayoutEffect` capture. `useFocusTrap` (running in a passive `useEffect`) still focuses the close button on activation, so the visible behaviour is identical — but `previousFocusRef` now actually captures the trigger and restoration works.
- **Carry-forward principle for the codebase:** never combine `autoFocus` on a child with a `useLayoutEffect` capture in the parent. `autoFocus` fires during commit-mutation, before layout effects run. Either capture in a parent layout effect AND let a child `useEffect` move focus (current pattern), OR capture before the modal mounts (in the open handler).
- **Grid down 267 lines.** From 628 → 361. Combined with the filter-hook PRD's grid reductions, the grid is now in the comfortable-read zone.
- **Pattern reuse.** `use-focus-trap.ts` and `use-scroll-lock.ts` are now both consumed; the project no longer has duplicate focus-trap implementations. The PRD's "reuse over reinvention" goal is met.
- **Mock pattern for AnimatePresence in tests.** The test file mocks `AnimatePresence` to render children synchronously AND store `onExitComplete` on a module-scoped variable. Tests that need to drive the exit lifecycle (case 9) call the stored callback manually after a state transition that nulls the children. This is a useful pattern for any future modal-component tests in this codebase.

## Recommended follow-ups

- File a triage ticket for the 13 pre-existing vitest failures (component tests + getClassificationTint data drift). Persists across all four architecture-deepening PRDs.
- If a generic `Dialog` primitive becomes desirable later (a second modal use case appears), apply the same deepening pattern: extract `Dialog` with `<DialogBody>` content slot. The PRD's "Out of Scope" section deferred this — and the PRD's "delete-test signal" rule justifies waiting for a second caller.

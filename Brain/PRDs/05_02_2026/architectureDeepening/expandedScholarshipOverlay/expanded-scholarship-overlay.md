# `ExpandedScholarship` Overlay Extraction

> Part 4 of the Architecture Deepening series. See `architecture-deepening-overview.md`. Independent of the other parts.

## Problem Statement

`src/components/scholarships/scholarship-grid.tsx` is 651 lines and mixes the entire lifecycle of an expanded-card modal — `AnimatePresence`, backdrop, focus trap, `Tab` key wrapping, `autoFocus`, Escape handling, scroll lock, `restorePreviousFocus`, `layoutId` shared-element animation, plus the dialog's content layout — with grid pagination, layout switching, and filter wiring.

Specifically, the modal's lifecycle is interleaved across the file:

- Lines 53 and 187–195: `previousFocusRef` and `restorePreviousFocus` callback for focus restoration.
- Lines 178: `useScrollLock(!!expandedId)`.
- Lines 181–188: `useEffect` adding/removing the document-level Escape key handler.
- Lines 390–628: the `<AnimatePresence>` block — backdrop, modal wrapper, dialog content, inline focus-trap `onKeyDown` handler (lines 417–432), and the dialog body.

To answer the question "what happens when a card is expanded?" requires reading roughly 240 non-contiguous lines mixed with grid concerns. The dialog cannot be tested without mounting the entire grid, which in turn requires URL state, seasonal data, and Lenis. The codebase already has a reusable `useFocusTrap` hook at `src/hooks/use-focus-trap.ts` (with its own component test) but the grid does not use it — the focus-trap logic is reimplemented inline.

The grid also cannot reuse this overlay on any other page (e.g., a future "saved scholarships" page or an admin preview) because the modal is not a component.

## Location

`Brain/PRDs/05_02_2026/expanded-scholarship-overlay.md`

## Solution

Extract one component at `src/components/scholarships/expanded-scholarship.tsx` that owns the modal's full lifecycle. The grid keeps `expandedId` as state (which scholarship is expanded is grid-level concern) but renders `<ExpandedScholarship scholarship={…} onClose={…} />` once and forgets about focus, scroll lock, escape keys, and exit animation. The new component delegates focus trapping to the existing `src/hooks/use-focus-trap.ts` hook and scroll locking to `src/hooks/use-scroll-lock.ts` rather than re-implementing either.

User-visible behaviour is preserved exactly — same animation, same ARIA, same keyboard interactions, same backdrop click semantics.

## User Stories

Developer-facing:

1. As a developer, I want the dialog's full lifecycle in one file so that I can read it without scrolling past pagination or filter code.
2. As a developer, I want to test the dialog's behaviour (focus trap, escape, backdrop click, focus restoration) without mounting the grid.
3. As a developer, I want the existing `useFocusTrap` hook to be the only focus-trap implementation in the codebase.
4. As a developer, I want to reuse this dialog from other pages without lifting it out a second time.
5. As a developer, I want `scholarship-grid.tsx` to drop below 400 lines so that its top-level concerns are scannable.

User-facing (preserved exactly):

6. As a student, I want clicking a scholarship card to open a detailed dialog with the scholarship's full info.
7. As a student, I want pressing Escape, clicking the backdrop, or clicking the close button to close the dialog.
8. As a student using a keyboard, I want Tab to cycle within the dialog while it is open.
9. As a student, I want focus to return to the scholarship card I had focused before opening the dialog.
10. As a student, I want the page behind the dialog to not scroll while the dialog is open.
11. As a student, I want the dialog's open and close to animate smoothly via the existing shared-element transition.

## Implementation Decisions

### New module: `src/components/scholarships/expanded-scholarship.tsx`

The component is a deep module: a small interface (a scholarship and a close callback) with the entire dialog lifecycle hidden behind it.

**Component signature:**

```
"use client"
interface ExpandedScholarshipProps {
  scholarship: Scholarship | null
  onClose: () => void
}
function ExpandedScholarship(props: ExpandedScholarshipProps): JSX.Element
```

`null` renders nothing (no animation, no DOM); `AnimatePresence` lives inside the component and handles the exit animation when `scholarship` transitions back to `null`.

### Behaviour absorbed

The component owns:

- The `<AnimatePresence onExitComplete={restorePreviousFocus}>` wrapper.
- The backdrop `motion.div` with `onClick={onClose}` and the dimming animation.
- The dialog `motion.div` with `role="dialog"`, `aria-modal="true"`, `aria-labelledby="expanded-dialog-title"`, the `layoutId` shared-element animation, and `onClick={(e) => e.stopPropagation()}` to prevent backdrop pass-through.
- A `useFocusTrap` invocation that wraps Tab navigation. **Replaces** the inline `onKeyDown` handler from grid lines 417–432.
- `useScrollLock(scholarship !== null)`.
- A `useEffect` that listens for the Escape key and calls `onClose`.
- `previousFocusRef` and `restorePreviousFocus` — captured on mount when `scholarship` becomes non-null, restored from `onExitComplete`.
- `autoFocus` on the close button (existing behaviour from line 461).
- The full dialog body markup from grid lines 461–615 (tinted header, classification badges, title, gradient underline, provider, amount/deadline/openDate row, description, eligibility, CTA row).

### Grid changes

`scholarship-grid.tsx`:

- Deletes `previousFocusRef` (line 53), `restorePreviousFocus` (lines 187–195), `useScrollLock(!!expandedId)` (line 178), the Escape `useEffect` (lines 181–188), and the entire `<AnimatePresence>` block (lines 390–628).
- Keeps `expandedId` and `setExpandedId` `useState`.
- Keeps `expandedScholarship = expandedId ? seasonalScholarships.find((s) => s.id === expandedId) ?? null : null` (the lookup is grid data, not modal data).
- Renders `<ExpandedScholarship scholarship={expandedScholarship} onClose={() => setExpandedId(null)} />` once near the bottom of its tree.

### Reuse over reinvention

- `src/hooks/use-focus-trap.ts` already exists and is component-tested. The new module imports it instead of re-implementing the Tab handler. Confirms the project's existing pattern.
- `src/hooks/use-scroll-lock.ts` already exists. Same.
- `motion/react` (already a dependency) provides `AnimatePresence` and `motion.div`. No new dependency.

### Animation and ARIA preservation

`layoutId={`card-${scholarship.id}`}` on the dialog content matches the `layoutId` already set on the source `ScholarshipCard` (`src/components/scholarships/scholarship-card.tsx`), preserving the shared-element fly-out animation. ARIA attributes mirror the existing dialog exactly — `role="dialog"`, `aria-modal="true"`, `aria-labelledby="expanded-dialog-title"`.

### State boundaries

The component is stateless internally (apart from refs for focus restoration). It does not own which scholarship is selected; the grid owns that. This preserves the existing pattern where filter changes can clear the selection externally (the `onFilterChangeWhileExpanded` callback from the filter hook PRD continues to call `setExpandedId(null)` in the grid).

## Testing Decisions

### Modules to Test

- `src/components/scholarships/expanded-scholarship.component.test.tsx` — primary surface. Cases:
  - With `scholarship: null`, the dialog is not in the DOM.
  - With a scholarship, the dialog renders with `role="dialog"`, `aria-modal="true"`, and the title element has the id referenced by `aria-labelledby`.
  - Pressing Escape calls `onClose`.
  - Clicking the backdrop calls `onClose`.
  - Clicking the dialog body does **not** call `onClose`.
  - Tab from the last focusable element in the dialog cycles to the first; Shift+Tab from the first cycles to the last (focus trap).
  - When the dialog opens, the close button receives focus.
  - When the dialog transitions from a scholarship to `null`, focus is restored to the element that was focused before the dialog opened.

### Prior Art

- `src/hooks/__tests__/use-focus-trap.component.test.tsx` — pattern for testing focus-trapped components.
- `src/components/scholarships/__tests__/scholarship-card.component.test.tsx` — pattern for component tests in this project.

## Out of Scope

- New dialog content. The dialog body is moved verbatim; layout, copy, and styling are unchanged.
- Replacing `motion/react` `AnimatePresence` with another mechanism. Existing animation is preserved.
- Generalising into a `Dialog` primitive that other features could use. This PR extracts the scholarship-specific dialog only; if a generic dialog primitive is wanted later, that becomes a separate refactor with the same deepening pattern applied to multiple call sites.
- Changes to the source `ScholarshipCard`'s `layoutId`. The shared-element seam is preserved as-is.
- The expand-from-list-card behaviour (`scholarship-list-card.tsx`). Already produces an `onClick` that sets `expandedId`; unchanged.

## Further Notes

- The grid's line count after this extraction drops from 651 to roughly 410 lines (accounting for the deleted modal block, removed effects, and the new component import); combined with the filter hook PRD's reductions the grid lands near 350 lines, which is a comfortable read.
- This extraction is independent of the other three parts: it does not depend on the eligibility classifier, the filter hook, or the season calendar. Suitable as a parallelisable PR if a second contributor picks it up.
- Open question: should the new component be split further into a `Dialog` primitive plus a content-specific `<ScholarshipDialogBody>`? Probably yes if a second dialog is ever needed; for now keeping them together preserves the deletion-test signal (deleting the module concentrates dialog complexity in one place; further splitting would re-fragment it without a second caller to justify the seam — `LANGUAGE.md`'s "one adapter means a hypothetical seam" rule).

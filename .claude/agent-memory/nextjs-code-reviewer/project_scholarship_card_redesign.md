---
name: Scholarship Card Immersive Redesign — Architectural Patterns
description: Key patterns, bugs, and conventions established during the immersive card redesign branch (feature/scholarship-card-immersive-redesign)
type: project
---

Architecture decisions confirmed in this feature branch:

1. **Modal-in-grid pattern**: Expanded card overlay is rendered inside `ScholarshipGrid` (same component as the grid), NOT a separate route or Next.js parallel route. Layout animation (Motion layoutId) connects the card to the modal.
2. **`disableLayoutAnimation` prop**: Cards in `BentoBlock`'s mobile fallback pass `disableLayoutAnimation={true}` to skip the `layoutId` so they don't conflict with desktop Motion layout animations.
3. **`filterAndSort` is a named export** from `scholarship-grid.tsx` — tests import it directly, so it must stay exported.
4. **`CLASSIFICATION_TINTS` all use the same neutral bg** (`bg-white dark:bg-surface-container-low`) — the differentiation between classifications is solely via the top border stripe. The commented-out lines show alternatives were considered.
5. **Comparison feature** uses Zustand store (`src/stores/comparison.ts`) with a 3-item max. FAB + Sheet pattern: `ComparisonFab` floats over the page, `ComparisonSheet` is a right/bottom sheet.
6. **`BentoBlock` uses a `distribute()` function** to fill 4 columns with varying capacities depending on item count — outer cols are fixed-width, inner cols are flex-1.
7. **`useMediaQuery` returns `null` during SSR** — components guard this with `if (isDesktop === null) return <skeleton>`.

Bugs found in this branch:
- Two unused `tint` variable assignments in `comparison-sheet.tsx` (lines 85 and 180) — computed but never referenced.
- `chunkIdx` used as React `key` for `BentoBlock` — index-based key is fragile but acceptable since the array order is stable (derived from page slice).
- `filterAndSort` sorts education-level matching items AFTER the search filter but BEFORE the level split — this is correct and intentional: all items survive search first, then matching ones float to top.

**Why:** Feature branch adds immersive expanded card overlay, comparison sheet, bento layout, coverflow carousel improvements.
**How to apply:** When reviewing future scholarship-page changes, check that `filterAndSort` remains exported and that layoutId conventions are respected.

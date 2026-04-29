---
name: Scholarship List-View Code Review Findings
description: Key patterns and bugs found during review of the scholarship list-view component set (comparison FAB, sheet, filters, grid, list card, audit ledger)
type: project
---

Key non-obvious issues found in the April 2026 review of the scholarships component batch:

1. **tab-pattern ARIA broken** — `role="tab"` buttons inside `role="tablist"` do not have a corresponding `role="tabpanel"` with matching `aria-controls`. The `aria-controls="scholarship-grid-panel"` on desktop filter tabs points at a non-existent `id`. Mobile filter buttons close the sheet on selection, making the tab role semantically wrong.

2. **`useMemo(() => new Date(), [])` anti-pattern in ScholarshipGrid** — `now` is memoized with an empty dep array so it only evaluates once on mount. This is intentionally used as a stable reference for the session, but any session open across midnight will show stale seasonal data. Should be documented or use a stable module-scope constant.

3. **Inline modal focus-trap is manual and incomplete** — `ScholarshipGrid` implements a hand-rolled Tab key focus trap at line 476. It does not handle `aria-disabled` elements or `display:none` children. The `autoFocus` on the close button is correct but the trap will break if the focusable query returns any hidden elements.

4. **`filterAndSort` is exported from a Client Component file** — The function is a pure utility but lives inside `scholarship-grid.tsx` which has `"use client"` at the top. It cannot be tree-shaken from the server bundle. Move to a separate utility file (e.g. `lib/scholarships.ts`).

5. **120-line dead commented-out code block** — `scholarship-filters.tsx` lines 303–373 contain the entire commented-out tag filters `<DropdownMenu>` block. These should be deleted and tracked in a ticket instead.

6. **`urgencyPill` uses hardcoded Tailwind colour classes** — `comparison-sheet-audit-ledger.tsx` uses `bg-red-100`, `bg-amber-100`, `bg-green-100` which are not OKLCH design-system tokens. Should map to `bg-error-container`, `bg-warning-container`, etc. if those tokens exist, or at minimum use semantic class names.

7. **`ScholarshipListCardSpread` article element misuse** — The entire `<motion.article>` is clickable and has `onClick` calling `onExpand`. The `aria-label` duplicates the `<h3>` title. Screen readers will read the full article label redundantly. Consider `aria-labelledby` pointing at the `<h3>` id instead.

**Why:** These were found in the first major pass after the list-view feature landed in the scholarship discovery page.
**How to apply:** Reference these when the author asks for fixes or when future changes touch this component family.

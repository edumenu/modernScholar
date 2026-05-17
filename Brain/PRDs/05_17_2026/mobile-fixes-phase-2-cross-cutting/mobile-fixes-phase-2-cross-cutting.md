# PRD — Mobile Fixes Phase 2: Cross-Cutting (P1)

> Apply system-wide fixes that resolve multiple per-page findings at once: touch targets, sheet close, footer, and legal-page TOC. Source: `Brain/audits/mobile-audit-2026-05-17.md` (Cross-Cutting Fixes section).

## Problem Statement

- Sub-44px touch targets recur across `/scholarships`, `/blog`, `/contact`, mobile menu, and footer — every site uses the same `button.tsx` `sm` / `icon-sm` variants (32px) and the same Sheet close component, so one fix can unlock many findings.
- The three legal pages (`/cookies`, `/privacy`, `/terms`) ship with heading IDs but no jump navigation. `/terms` is ~16 screens tall; users cannot navigate.
- Footer links are ~20px tall — primary site navigation fails WCAG 2.5.5 across every page.

## Location

`Brain/PRDs/05_17_2026/mobile-fixes-phase-2-cross-cutting/mobile-fixes-phase-2-cross-cutting.md`

## Solution

- Coarse-pointer touch-target floor on small button variants so chips/icon-sm/sm meet 44px on touch devices without distorting desktop visuals.
- SheetClose enlarged to `size-11` (or coarse-pointer override) — fixes filter sheets across `/scholarships` and `/blog`.
- Footer links gain vertical padding to clear 44px row height.
- `LegalLayout` accepts a `sections` prop and renders a collapsible `<nav>` TOC. All three legal pages pass their section arrays.

## User Stories

1. As a touch-device user, I want every interactive control to be at least 44×44 so I can tap reliably without zooming.
2. As a `/terms` reader on mobile, I want a Contents disclosure I can tap to jump to any section so I don't have to scroll 16 screens.
3. As a footer user, I want links sized so I can tap them without hitting the wrong row.

## Implementation Decisions

**Modules**
- `Button` (existing, `src/components/ui/button/button.tsx`): bump `icon-sm` and `sm` to `min-h-11` under `@media (pointer: coarse)`, OR apply a `before:absolute before:inset-0 before:min-h-11` pseudo hit-area pattern that preserves visual size. One source of truth for every callsite.
- `Sheet` / `SheetClose` (existing, `src/components/ui/sheet/sheet.tsx`): ensure close button is `size-11`, or inherits the coarse-pointer rule.
- `Footer` (existing, `src/components/ui/footer/footer.tsx:57-65, 79-87`): add `py-3` to link className (or pseudo hit-area).
- `LegalLayout` (existing, `src/components/legal/legal-layout.tsx`): accept optional `sections: Array<{ id: string; title: string }>` prop. Render between header and `<aside>` as `<nav aria-label="Page contents">` containing `<details>` / `<summary>` ("Contents — tap to expand"), collapsed by default. Add a "Back to top" link in layout footer.

**Key decisions**
- Coarse-pointer media-query (not unconditional resize) — keeps desktop densities intact.
- `<details>` for TOC, not bespoke disclosure — native a11y, no JS, persistent open state per tap.
- TOC styled with tonal surface (`bg-surface-container-low`), not glass — TOC is inline content, not a floating element per the design system.
- Single LegalLayout change fixes 3 pages; each page passes its own section array.

**Dependencies**: none new.

## Testing Decisions

- **Test**: Playwright @ 375 — assert filter chips, SheetClose, footer links, and icon-sm buttons all measure ≥ 44px on a touch emulation profile.
- **Test**: TOC anchor jump — open `/terms`, tap a TOC entry, assert scroll lands on the matching `id`.
- **Test**: TOC default-collapsed — assert `<details>` lacks `open` on mount across all three legal pages.
- **Skip**: Snapshot tests on visual padding — covered by viewport assertions.
- **Prior art**: existing Playwright suite under `tests/` mirrors viewport probing patterns.

## Out of Scope

- Per-page touch-target fixes (filter accordion `py-2`, blog search pill `py-2`, etc.) — handled in Phase 3 once cross-cutting Button/Sheet changes land.
- Sticky "Back to top" floating button — only inline link in this phase.
- Redesigning Sheet visual styling.
- Animating TOC disclosure beyond native `<details>` behavior.

## Open Questions

- None — the audit specifies file:line and exact class changes.

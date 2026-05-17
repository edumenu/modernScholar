# PRD — Mobile Fixes Out of Scope (Decisions Log)

> Items the QA mobile audit (`Brain/audits/mobile-audit-2026-05-17.md`) explicitly classified as Out of Scope. This PRD records the decision and rationale so future audits don't re-flag them.

## Problem Statement

- Mobile audits will keep surfacing these patterns. Without a written decision, each new audit re-debates them and risks an unwanted refactor.
- Some items look like bugs at a glance (overflow, 0×0 elements) but are intentional design or framework artifacts.

## Location

`Brain/PRDs/05_17_2026/mobile-fixes-out-of-scope/mobile-fixes-out-of-scope.md`

## Solution

- Record each Out-of-Scope item with: what was observed, why it is not a bug, and the trigger that would reopen it.
- No code changes ship from this PRD. Engineers reference it when triaging future mobile findings.

## User Stories

1. As a future auditor, I want a written list of "intentional non-bugs" so I don't spend cycles re-litigating them.
2. As a reviewer, I want a documented re-open trigger for each item so we know when to revisit.

## Implementation Decisions

**Items**

- **Carousel intentional viewport overflow** (`/`, `/scholarships`, related-posts).
  - Observation: carousels extend past the right viewport edge.
  - Why kept: design choice — cards "peek" off-screen to hint scrollability. Body `overflow-x: hidden` clamps document scroll.
  - Re-open if: body horizontal scroll appears at any breakpoint, or a peek card becomes Tab-focusable without `inert`.

- **Next.js Dev Tools button** (visible during `npm run dev`).
  - Observation: floating overlay button on every page during local dev.
  - Why kept: injected by Next.js dev runtime; not present in `next build` output.
  - Re-open if: the button appears in a production build.

- **Callout visible "Tip" / "Warning" labels** (`src/components/blog/callout.tsx`).
  - Observation: a visible `<p>Tip</p>` (or `Warning`) inside the callout.
  - Why kept: design system requirement; the `<aside aria-label="…">` handles SR labelling correctly.
  - Re-open if: a11y audit flags duplicate announcement or visible label becomes redundant with surrounding copy.

- **`<aside>` sidebar 0×0 on mobile** (`/blog/[slug]`).
  - Observation: complementary sidebar measures 0×0 below `md`.
  - Why kept: `hidden md:flex lg:hidden` is the correct tablet-only pattern; the element should not render on mobile.
  - Re-open if: the sidebar starts rendering on mobile or becomes Tab-focusable while hidden.

- **`/scholarships` search input 327×42** (`scholarship-filters-mobile.tsx`).
  - Observation: 2px under the 44px WCAG 2.5.5 floor.
  - Why kept: full-width target; no adjacent control to mis-tap. Functional risk is zero.
  - Re-open if: a sibling control is added next to or below it within 24px, or design tokens push the height even smaller.

**Key decisions**
- Triage rule: any item recurring in two audits without a behavior change can be removed from this list and closed as "by design, permanent."
- This document is not a backlog — items here are explicitly not work. Link to it from future audit findings to short-circuit re-debate.

**Dependencies**: none.

## Testing Decisions

- **Test**: none — no code changes.
- **Skip**: regression coverage; the Phase 1–4 PRDs handle that.
- **Prior art**: `Brain/audits/mobile-audit-2026-05-17.md` Out of Scope section is the source.

## Out of Scope

- Adding items not already in the audit.
- Re-litigating any item without a concrete behavior change.

## Open Questions

- None.

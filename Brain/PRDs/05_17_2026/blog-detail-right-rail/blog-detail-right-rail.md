# PRD — Blog Detail Right Rail

> Add a sticky right-side rail to `/blog/[slug]` so reading-progress and share affordances fill the desktop dead-space that surfaced after capping body width at `max-w-prose`.

## Problem Statement

- Desktop `/blog/[slug]` shows ~266px of empty space to the right of the prose column at `max-w-7xl` viewports.
- `max-w-prose` was the right call for measure, but the asymmetric whitespace reads as a layout bug instead of intentional design.
- Reading progress already exists in the left sidebar — TOC + scroll tracking — but the right gutter contributes nothing.

## Location

`Brain/PRDs/05_17_2026/blog-detail-right-rail/blog-detail-right-rail.md`

## Solution

- Convert BlogDetail's 2-column grid (`[260px_1fr]`) into a 3-column grid at `lg+` (`[260px_minmax(0,1fr)_240px]`).
- Left sidebar keeps the meta card + series nav.
- New right rail hosts the relocated `ReadingProgress` widget plus a new `ShareDock`.
- Below `lg`, both rails collapse into the existing stacked layout — no mobile change.

## User Stories

1. As a desktop reader, I want the layout to feel balanced left-to-right instead of leaving a dead gutter on the right.
2. As a desktop reader, I want a persistent table of contents and progress indicator anchored opposite the meta card.
3. As a reader who wants to share an article, I want native share (X / LinkedIn / copy link) without scrolling back to the header.
4. As a tablet/mobile reader, I want the existing layout untouched — no new horizontal density.
5. As a keyboard / screen-reader user, I want the rail labelled and navigable without trapping focus.

## Implementation Decisions

**Modules**
- `BlogDetail` (existing, `src/components/blog/blog-detail.tsx`): grid becomes `lg:grid-cols-[260px_minmax(0,1fr)_240px]`. Order: meta sidebar → content → rail. `ReadingProgress` moves out of the left sidebar.
- `BlogDetailRail` (new, `src/components/blog/blog-detail-rail.tsx`): client component that sticky-positions `ReadingProgress` + `ShareDock` in a `top-32` column. Hidden below `lg`.
- `ShareDock` (new, `src/components/blog/share-dock.tsx`): icon-button column for native share + X + LinkedIn + copy-link. Mirrors `expanded-scholarship.tsx` share pattern (navigator.share → clipboard → sonner toast).
- `ReadingProgress` (existing, `src/components/blog/reading-progress.tsx`): no changes; receives `articleRef` + `sections` from the rail instead of the left sidebar.

**Key decisions**
- 3-col grid over flex — predictable widths let each cell sticky-position independently.
- Rail width 240px — leaves room for progress bar + 4 icon buttons without crowding prose at 1280px.
- ShareDock reuses the existing share pattern from `expanded-scholarship.tsx` — no new dependency, no new toast strategy.
- TOC is not duplicated; `ReadingProgress` already renders the section list, so it relocates rather than forking.
- `lg+` only — at `md` and below, current stacked layout already balances visually, and a second rail would compete with the horizontal meta strip.
- Share targets: X, LinkedIn, Copy. Facebook/email deferred — analytics on existing share usage doesn't justify the icon real estate yet.

**Dependencies**: none new. `sonner` and `@iconify/react` already in use.

## Testing Decisions

- **Test**: `BlogDetail` at `lg` — 3-col grid renders; left sidebar contains meta + series only; right rail contains progress + share.
- **Test**: `ShareDock` — native share called when available, clipboard fallback otherwise; sonner toast fires on success.
- **Test**: `BlogDetail` at `md` and below — rail hidden, existing horizontal meta strip unchanged.
- **Skip**: visual snapshot of progress scrubbing — covered by existing `ReadingProgress` behavior.
- **Prior art**: `expanded-scholarship.tsx` for share UX; existing `ReadingProgress` for sticky scroll patterns.

## Out of Scope

- Tablet (`md`) rail — defer; current horizontal meta strip already balances.
- Floating margin annotations or pull-quote breakouts into the rail.
- Reading-time recomputation or TOC-extraction changes.
- Adding Facebook / email / Reddit share targets.
- Persisting reader scroll position across visits.

## Open Questions

- None — design references locked, share targets agreed, rail width chosen.

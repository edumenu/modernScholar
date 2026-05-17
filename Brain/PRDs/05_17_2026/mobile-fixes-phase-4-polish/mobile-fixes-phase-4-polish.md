# PRD — Mobile Fixes Phase 4: Polish (P2)

> P2 polish items from `Brain/audits/mobile-audit-2026-05-17.md`. Quality-of-life and small a11y/perf wins that don't block the release.

## Problem Statement

- Several non-blocking issues degrade polish on mobile: design-system drift (Hero font), an unused Spline canvas mounting 0×0 on mobile, an oversized contact illustration served as a bare `<img>`, a cramped 3-column grid at 320px, off-canvas carousel slides remaining Tab-focusable, and missing `max-w-prose` on blog post bodies.
- None of these block the experience, but they erode quality and add unnecessary mobile payload (Spline, large illustrations).

## Location

`Brain/PRDs/05_17_2026/mobile-fixes-phase-4-polish/mobile-fixes-phase-4-polish.md`

## Solution

- Apply each item as a targeted, one-line className or markup change.
- Conditionally unmount mobile-irrelevant heavy components (Spline) to drop payload.
- Replace bare `<img>` with `next/image` + appropriate `sizes`.

## User Stories

1. As a mobile user, I don't want my browser downloading a desktop-only Spline scene or an oversized illustration.
2. As a keyboard user on `/blog/[slug]`, I don't want focus tabbing into off-canvas carousel slides.
3. As a `/contact` visitor at 320px, I want the topic-card grid to stack instead of cramping into 3 ~61px cells.
4. As a desktop reader of a blog post, I want a comfortable measure (`max-w-prose`) instead of full-width prose.

## Implementation Decisions

**Modules**
- `MobileMenu` (existing): wrap theme toggle in `flex items-center min-h-11` container; visual track stays `h-8`.
- `HeroSection` (existing, `:111`): add `font-heading` class; consider size bump after font swap.
- `ContactFormSection` (existing):
  - Topic grid (`:133`): `grid-cols-3` → `grid-cols-1 min-[360px]:grid-cols-3`.
  - Illustration (`:173`): `<img>` → `next/image` with `sizes="(max-width: 1023px) 100vw, …"`.
  - Spline (`:216-229`): gate `<Suspense>` with `{mounted && !isMobile && …}` via `useMediaQuery`.
- `BlogFilters` (existing, `:100-108`): filters trigger gains `min-h-11` or `size="default"`.
- `BlogDetail` (existing, `:63`): content wrapper gains `max-w-prose` (desktop measure only — no mobile impact).
- `RelatedPosts` (existing): non-active CarouselItems gain `inert` (or `aria-hidden="true" tabIndex={-1}`) driven by Embla's `selectedScrollSnap`.
- Cookies table (existing, `app/cookies/page.tsx`): Category column `<th>` + `<td>` gain `hidden md:table-cell` (column is constant, removable on mobile).
- Terms numbered headings (existing, `app/terms/page.tsx`): introduce CSS `counter-reset` on article + `::before` on H2 so SR announces only the title. Defer if it touches more than one file.
- `NotFoundClient` Spline (existing, `:178-193`): verify outer `aria-hidden` propagates to `<canvas>`; pass `aria-hidden` directly to `<SplineScene>` if not.

**Key decisions**
- Conditional Spline mount uses `useMediaQuery` + `mounted` guard to avoid hydration mismatch; the existing `useMediaQuery` hook is the convention.
- Cookies Category column is hidden, not redesigned — full card-layout rework is deferred indefinitely.
- Off-canvas carousel uses `inert` when supported, fallback to `aria-hidden + tabIndex={-1}`. Embla's `selectedScrollSnap()` drives which slide is active.

**Dependencies**: none new.

## Testing Decisions

- **Test**: `/contact` mobile network — assert no Spline asset request below `lg`.
- **Test**: `/blog/[slug]` keyboard — Tab from last hero element should not enter off-canvas carousel slides.
- **Test**: `/contact` at 320 — topic grid stacks to a single column.
- **Skip**: Visual snapshot of `max-w-prose` width — covered by the existing breakpoint snapshots.
- **Prior art**: `useMediaQuery` usage in `src/components/*` for client-only conditional renders.

## Out of Scope

- Replacing Spline entirely with a static asset.
- Cookies table card-layout redesign.
- New animation work on Hero beyond the font/size swap.
- Re-numbering Terms via CSS counters if it requires touching > 1 file (defer to a dedicated PRD).

## Open Questions

- None — items are mechanical and independent.

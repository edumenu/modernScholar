# Verification Report: Mobile Fixes Phase 4: Polish (P2)

**PRD:** [mobile-fixes-phase-4-polish.md](./mobile-fixes-phase-4-polish.md)
**Date:** 2026-05-17
**Status:** Complete
**Branch:** fix/mobile-320px-overflow (uncommitted)

## What Shipped

- [x] MobileMenu theme toggle wrapped in `min-h-11` touch target
- [x] HeroSection H1 gains `font-heading`
- [x] ContactFormSection topic grid `grid-cols-1 min-[360px]:grid-cols-3`
- [x] ContactFormSection illustration migrated to `next/image` with `sizes`
- [x] ContactFormSection Spline gated by `mounted && !isMobile` via `useMediaQuery`
- [x] BlogFilters mobile trigger gains `min-h-11`
- [x] BlogDetail content wrapper gains `lg:max-w-prose`
- [x] RelatedPosts inactive CarouselItems gain `inert` driven by Embla snap
- [x] Cookies Category column `hidden md:table-cell`
- [x] Terms numbered headings via CSS counter on `<article>` + `::before` on H2 + TOC parallel counter
- [x] All three 404/error Spline backdrops replaced with paired `next/image` static art
- [x] `spline-scenes.ts` purged of `notFoundLight/Dark` entries
- [x] `media-dark` Tailwind variant registered in `globals.css` for global-error
- [x] `not-found.component.test.tsx` updated — asserts static images render, canvas does not
- [x] Grep guard: `splineScenes.notFound|notFoundLight|notFoundDark` returns zero matches

## Files Touched

| File | Change |
| --- | --- |
| src/components/home/hero-section.tsx | `font-heading` on H1 |
| src/components/ui/header/mobile-menu.tsx | `min-h-11` wrapper on toggle |
| src/components/contact/contact-form-section.tsx | Grid, `next/image`, Spline mobile gate |
| src/components/blog/blog-filters.tsx | `min-h-11` on mobile filter trigger |
| src/components/blog/blog-detail.tsx | `lg:max-w-prose` |
| src/components/blog/related-posts.tsx | `inert={!isActive}` on slides |
| src/app/cookies/page.tsx | Category column hidden < md |
| src/app/terms/page.tsx | `terms-numbered` class, prefix-free titles |
| src/app/globals.css | `media-dark` variant + `.terms-numbered` counters |
| src/components/ui/four-oh-four/not-found-client.tsx | Spline → next/image (dark:) + dead-code purge |
| src/app/error.tsx | Spline → next/image (dark:) + dead-code purge |
| src/components/ui/global-error/global-error-client.tsx | Spline → next/image (media-dark:) + dead-code purge |
| src/config/spline-scenes.ts | Removed `notFoundLight/Dark` |
| src/app/__tests__/not-found.component.test.tsx | New assertions for static images |

## Issues

None.

## Next

Manual visual QA at 320 / 360 / mobile / desktop and dark/light. Commit pending user review of `git diff`.

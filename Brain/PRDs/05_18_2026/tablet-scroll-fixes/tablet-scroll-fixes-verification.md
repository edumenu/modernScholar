# Verification Report: Tablet Scroll & Modal Interaction Fixes

**PRD:** [tablet-scroll-fixes.md](./tablet-scroll-fixes.md)
**Date:** 2026-05-18
**Status:** Complete
**Branch:** `fix/tablet-scroll-fixes` (uncommitted)

## What Shipped

- [x] Hero finger-scrolls on tablet — Spline gated to `lg:` and above, theme-aware `<HeroStaticImage>` below, calls `setSplineReady(true)` on mount so the loader doesn't stall.
- [x] Header rides Lenis bus — replaced Motion `useScroll` + `useMotionValueEvent` with `useLenis((lenis) => …)`; dropped redundant `fixed inset-x-0 top-0 z-50` from inner `<header>`.
- [x] Modal body scrolls — `data-lenis-prevent` on the body `motion.div` and the eligibility `<p>` scroller.
- [x] Modal exit symmetric from list view — list card now carries `layoutId={card-${id}}` + `animate={{ opacity: isExpanded ? 0 : idleOpacity }}` mirroring the grid card; grid passes `isExpanded={expandedId === scholarship.id}`.
- [x] Privacy TOC keeps scroll-to-bottom alive — new `LegalTOC` client component subscribes to the native `toggle` event and calls `lenis.resize()`; `LegalLayout` swaps the inline `<details>` for it.

## Files Touched

| File | Change |
| --- | --- |
| src/components/home/hero-section.tsx | Added `HeroStaticImage`; gated render via `useMediaQuery("(max-width: 1023px)")` |
| src/components/ui/header/header.tsx | Swapped scroll source to `useLenis`; removed double-fixed nesting |
| src/components/scholarships/expanded-scholarship.tsx | `data-lenis-prevent` on modal body + eligibility scroller |
| src/components/scholarships/scholarship-list-card.tsx | New `isExpanded` prop; `layoutId` + animated opacity mirroring grid card |
| src/components/scholarships/scholarship-grid.tsx | Pass `isExpanded` to list card |
| src/components/legal/legal-toc.tsx (new) | Client TOC wrapping `<details>`; toggle → `lenis.resize()` |
| src/components/legal/legal-layout.tsx | Render `<LegalTOC>` in place of inline `<nav>`/`<details>` |
| src/components/legal/__tests__/legal-toc.component.test.tsx (new) | Resize-on-toggle + anchor rendering |
| src/components/scholarships/__tests__/scholarship-list-card.component.test.tsx (new) | `layoutId`, `isExpanded` opacity, dim/idle paths |
| src/components/home/__tests__/hero-section.component.test.tsx (new) | Static-vs-Spline gating + `setSplineReady` on mount |

## Issues

- Agent strayed and edited `Brain/future/Todos.md` — reverted, no functional impact.
- 3 pre-existing failures in `src/app/__tests__/error.component.test.tsx` confirmed on `main`, unrelated to this PRD.

## Next

Manual tablet QA on hero scroll, header smoothness, modal scroll/exit, and privacy-TOC scroll. Commit pending user review.

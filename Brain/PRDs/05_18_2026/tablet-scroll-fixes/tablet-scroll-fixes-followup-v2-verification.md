# Verification Report: Tablet Scroll Fixes (Follow-up v2)

**PRD:** [tablet-scroll-fixes-followup-v2.md](./tablet-scroll-fixes-followup-v2.md)
**Date:** 2026-05-19
**Status:** Complete
**Branch:** `fix/tablet-scroll-fixes-followup-v2` (uncommitted)

## What Shipped

- [x] iPad thumb-swipe on hero scrolls page (Spline never mounts on touch → no `touchmove` capture).
- [x] Home-page scroll matches `/scholarships` / `/blog` smoothness on iPad (no WebGL contention).
- [x] Surface tablet-mode gets the image (gated on `(hover: hover) and (pointer: fine)`).
- [x] Desktop with mouse/trackpad at 1024px+ still gets Spline.
- [x] Static image is the SSR / pre-hydration default — no pulse-fallback flash.
- [x] `touchAction: "pan-y"` removed from Spline wrapper (dead defense).
- [x] Header `useScroll` + `useMotionValueEvent` revert preserved (unchanged).
- [x] Tests updated: 3/3 pass, polarity flipped to `mockIsDesktop`, null-case asserts image.
- [x] Obsolete `spline-scene.component.test.tsx` deleted.

## Files Touched

| File | Change |
| --- | --- |
| `src/components/home/hero-section.tsx` | Swap `useMediaQuery` to `(min-width: 1024px) and (hover: hover) and (pointer: fine)`; rename `isMobile`→`isDesktop`; collapse null → image branch; drop dead `mounted` ternary on desktop branch |
| `src/components/home/spline-scene.tsx` | Drop `touchAction: "pan-y"` from wrapper inline style |
| `src/components/home/__tests__/hero-section.component.test.tsx` | Rename `mockIsMobile`→`mockIsDesktop`, flip semantics, null-case asserts image present |
| `src/components/home/__tests__/spline-scene.component.test.tsx` | Deleted (touch-action assertion moot) |

## Issues

None.

## Next

Manual recheck on real iPad Pro (portrait 1024 + landscape 1366) — confirm hero swipe scrolls, home-page scroll feels equal to `/scholarships`. Commit pending user review of `git diff`.

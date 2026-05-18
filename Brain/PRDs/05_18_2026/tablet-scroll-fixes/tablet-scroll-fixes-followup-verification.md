# Verification Report: Tablet Scroll Fixes (Follow-up)

**PRD:** [tablet-scroll-fixes-followup.md](./tablet-scroll-fixes-followup.md)
**Date:** 2026-05-18
**Status:** Complete
**Branch:** fix/tablet-scroll-fixes-followup (uncommitted)

## What Shipped

- [x] Hero Spline wrapper carries `touch-action: pan-y` so vertical pans reach the page on ≥1024px touch devices (iPad Pro portrait, iPad landscape).
- [x] `ScrollAnimatedHeader` reverted to Motion `useScroll()` + `useMotionValueEvent(scrollY, "change", …)` — byte-identical to `f77c9fe`. Per-RAF Lenis writes removed; home-page tick contention eliminated.
- [x] Existing Spline interactions preserved (horizontal/click/hover still owned by Spline; only vertical pan released to the compositor).
- [x] `(max-width: 1023px)` Spline gate untouched. No breakpoint change.
- [x] Unit test asserts wrapper `style.touchAction === "pan-y"` (Vitest + JSDOM, Spline stubbed).

## Files Touched

| File | Change |
| ---- | ------ |
| src/components/home/spline-scene.tsx | Added `touchAction: "pan-y"` to wrapper `<div>` inline style. |
| src/components/ui/header/header.tsx | Swapped `useLenis` callback for `useScroll` + `useMotionValueEvent`; dropped `useLenis` import. |
| src/components/home/__tests__/spline-scene.component.test.tsx | New — stubs Spline + Lenis, asserts wrapper touch-action contract. |

## Issues

None.

## Next

Manual QA on iPad Pro portrait + iPad landscape to confirm thumb-scroll over hero and smooth header behavior on home page. `mcp__playwright__browser_drag` cannot verify touch-action (emits mouse events). Commit pending user review.

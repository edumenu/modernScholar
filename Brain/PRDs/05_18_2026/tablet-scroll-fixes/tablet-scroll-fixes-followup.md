# PRD — Tablet Scroll Fixes (Follow-up)

> Two regressions remain after `tablet-scroll-fixes.md` shipped (commit `91900de`): touch-scroll over the hero still fails on touch-enabled viewports ≥1024px, and home-page scroll became janky when the desktop nav is visible. Follow-up to `tablet-scroll-fixes.md`.

## Problem Statement

- Users on tablets ≥1024px (iPad Pro 12.9" portrait, any iPad in landscape) still cannot finger-scroll the home hero. The previous fix swapped Spline for a static image below `lg:` only, leaving the WebGL touch-capture issue intact on the touch-tablet sizes where the desktop nav is visible.
- Home-page scroll feels wonky on mid-to-large viewports where the top bar is visible. `/scholarships` and `/blog` are smooth on the same device. Switching the header from Motion's `useScroll` to a Lenis-tick callback in the prior round introduced per-RAF DOM writes that compete with the home page's multiple Motion `useScroll()` observers.
- These bugs continue to block thumb-scroll discovery on the device class students use most.

## Location

`Brain/PRDs/05_18_2026/tablet-scroll-fixes/tablet-scroll-fixes-followup.md`

## Solution

- Route vertical touch on the hero Spline canvas to the page, not to WebGL: set `touch-action: pan-y` on the immediate wrapper `<div>` inside `SplineScene`. Spline keeps horizontal/click/hover interactions; the compositor claims the vertical pan before Spline's `preventDefault` can stop it.
- Revert `ScrollAnimatedHeader` to Motion's `useScroll()` + `useMotionValueEvent(scrollY, "change", …)` — the implementation that shipped in `f77c9fe`. Value-change semantics replace per-RAF writes, eliminating the home-page tick contention.
- No breakpoint change. Spline still renders at `lg:` and above, exactly as today.

## User Stories

1. As a user on iPad Pro portrait, I want a thumb-swipe on the hero to scroll the home page, so the hero is not a dead zone.
2. As a user on iPad landscape, I want the same thumb-swipe behavior as portrait, so device orientation doesn't change scroll behavior.
3. As a user on a small laptop or large tablet (≥1024px), I want home-page scroll to feel as smooth as `/scholarships` and `/blog`, so the home page isn't the broken one.
4. As a desktop user, I want existing Spline interactions (hover, click, horizontal drag) preserved, so the 3D scene is still inviting.

## Implementation Decisions

**Modules:**

- `SplineScene` (existing, `src/components/home/spline-scene.tsx`) — add `touchAction: "pan-y"` to the wrapper `<div>` inline style at line 27. No other change. `useLenis` import stays (load-bearing for `lenis?.resize()` on Spline load).
- `ScrollAnimatedHeader` (existing, `src/components/ui/header/header.tsx`) — restore `useScroll()` + `useMotionValueEvent` (imports + hook swap, ~6 lines). Drop the `useLenis` import. JSX unchanged; the wrapping fixed `<div>` and `<header>` markup stay as-is.

**Key decisions:**

- `touch-action: pan-y` lives on the wrapper, not the canvas — Spline's runtime owns the canvas style and calls `preventDefault` on every `touchmove`. The compositor must claim the vertical pan before Spline sees the event; hit-testing for `touch-action` walks ancestors, so the wrapper-level value wins.
- Keep the existing `(max-width: 1023px)` Spline gate — the prior PRD's viewport-based decision stands. The touch-action fix is orthogonal and complements it for ≥1024px touch devices.
- Revert header to Motion `useScroll`, not a Lenis bus hybrid — Motion's `useScroll` reads `window.scrollY`, which Lenis in `root` mode drives, so the "single scroll source" intent of the prior PRD is preserved. `useMotionValueEvent` only fires on value-change, not every RAF tick, which eliminates contention with the home page's other Motion observers.

**Schema / API / dependencies:** none.

## Testing Decisions

- **Test**: `SplineScene` — render the component (with Spline stub) and assert the wrapper `<div>` carries `style="touch-action: pan-y"` (Vitest + JSDOM; mirror the Spline stub pattern from `hero-section.component.test.tsx`).
- **Skip**: Header `useScroll` revert — restoring known-good code from `f77c9fe`; manual QA on tablet plus the RAF-sampled transform probe captured during this round's verification are higher-signal than a unit test of scroll-bus plumbing.
- **Prior art**: `src/components/home/__tests__/hero-section.component.test.tsx` for the Spline-stubbed component test pattern.

## Out of Scope

- Changing the `lg:` breakpoint or the `(max-width: 1023px)` Spline gate.
- Lenis configuration changes (`smooth-scroll-provider.tsx` untouched).
- The other three fixes already shipped in `tablet-scroll-fixes.md` (modal scroll, modal exit, legal TOC).
- Replacing Spline or rethinking the hero composition.
- Automated touch-input verification — `mcp__playwright__browser_drag` emits mouse events that bypass `touch-action`; real-device check on iPad recommended as a manual step.

# PRD — Tablet Scroll Fixes (Follow-up v2)

> The v1 follow-up shipped `touch-action: pan-y` on the Spline wrapper and reverted the header to Motion `useScroll`. Real-iPad QA shows both regressions persist. Recording confirms the bug repros at 1024–1280px on iPad Pro 12.9" — exactly where Spline still renders. Root cause for both bugs is the same: Spline's WebGL canvas competes for the GPU/main-thread budget on tablet-class hardware, and its `touchmove preventDefault` continues to capture vertical pans regardless of the wrapper's `touch-action`. Solution: stop rendering Spline on touch-capable devices entirely. Follow-up to `tablet-scroll-fixes-followup.md`.

## Problem Statement

- v1's `touch-action: pan-y` on the Spline wrapper did not release vertical touch on iPad. Spline's runtime still captures `touchmove` on the canvas (a descendant of the wrapper), and per the CSS Touch Action spec, `touch-action` on an ancestor does NOT override a descendant's `preventDefault` once the hit target is inside the canvas. The premise of the prior fix was wrong.
- v1's header revert to `useScroll`/`useMotionValueEvent` did not eliminate the home-page jank because Spline itself — not the header's scroll handler — is the cost driver. Removing per-RAF DOM writes from the header was harmless but insufficient.
- Both bugs collapse into one root cause on tablet-class GPUs (iPad Pro 12.9" landscape ~1366px). Killing Spline on the device class that lacks a fine pointer eliminates the canvas (no `touchmove` to capture) and the WebGL cost (no frame-budget contention).

## Location

`Brain/PRDs/05_18_2026/tablet-scroll-fixes/tablet-scroll-fixes-followup-v2.md`

## Solution

- Replace the hero's viewport-only gate with a viewport-AND-input-capability gate. Render Spline only when `(min-width: 1024px) and (hover: hover) and (pointer: fine)` matches. Image renders otherwise — including iPad at any size, Surface in tablet mode, and all narrow viewports.
- Revert the `touchAction: "pan-y"` line from `spline-scene.tsx`. With Spline never rendering on touch, the wrapper change is dead code and removing it eliminates a misleading defense.
- Keep the v1 header revert (`useScroll` + `useMotionValueEvent`). It restores the f77c9fe known-good code and is unrelated to the new fix; rolling it back would introduce regression risk for no gain.
- Reuse the existing `lightHomeHero.jpg` / `darkHomeHero.jpg` assets. No new image work.
- During SSR / pre-hydration when `useMediaQuery` returns `null`, render the static image (not the pulse fallback). The image is the safer default — it shows on every device class except the narrowing set that strictly qualifies for Spline, so guessing "image" minimizes flicker and improves perceived LCP on the iPad path.

## User Stories

1. As a user on iPad Pro portrait (1024px) or landscape (1366px), I want a thumb-swipe on the hero to scroll the page, so the hero is not a dead zone.
2. As a user on iPad in any orientation, I want home-page scroll to feel as smooth as `/scholarships` and `/blog`, so the home page isn't the broken one.
3. As a user on a Surface in tablet mode (keyboard detached), I want the same image treatment as iPad, so my touch experience is consistent.
4. As a desktop user with a mouse or trackpad — including 13" MacBooks at 1024–1280px — I want the Spline 3D scene preserved, so the brand's signature hero is intact.
5. As any user during page load, I want a real hero image to render immediately, not a pulse spinner, so the first paint is meaningful.

## Implementation Decisions

**Modules:**

- `HeroSection` (existing, `src/components/home/hero-section.tsx`) — replace `useMediaQuery("(max-width: 1023px)")` with `useMediaQuery("(min-width: 1024px) and (hover: hover) and (pointer: fine)")` and rename the binding to `isDesktop`. Rewire the three-way conditional so `null` and `false` both render `<HeroStaticImage />`, and only `true` renders `<SplineScene />`. Remove the `SplineFallback` branch for the null case — image is the SSR fallback.
- `SplineScene` (existing, `src/components/home/spline-scene.tsx`) — remove `touchAction: "pan-y"` from the wrapper `<div>` inline style. Wrapper goes back to `style={{ position: "relative" }}`. No other change. `useLenis` import stays.
- `ScrollAnimatedHeader` (existing, `src/components/ui/header/header.tsx`) — unchanged. v1's revert to Motion `useScroll` stays.

**Key decisions:**

- Strict `(hover: hover) and (pointer: fine)` rather than `(any-hover: hover)`. Hybrid devices (Surface, iPad with Magic Keyboard trackpad on iPadOS) report `any-hover: hover` even when the primary input is touch. The PRIMARY-input form gives users the experience that matches how they're currently holding the device. iPadOS still reports `(hover: none) and (pointer: coarse)` even with Magic Keyboard, so iPad always gets the image — matching observed behavior.
- Combined into a single media query rather than three. One `useMediaQuery` call, one boolean. Cleaner, fewer hook calls, easier to reason about during SSR.
- Invert the polarity from `isMobile` to `isDesktop`. The new test asks "should we render Spline?", which collapses the null state to image without an explicit `null` branch. Simpler conditional, identical SSR behavior.
- SSR default is image, not pulse. The image is the safer default for every device class except the strictly-qualified Spline set. On qualifying desktops there will be a one-frame swap from image → Spline after hydration; the image is already on disk so this is invisible. On non-qualifying devices the image is the final state — zero swap.
- Keep the `lg:` breakpoint untouched elsewhere. This PRD only changes the hero gate. CSS-side `lg:` Tailwind classes (header layout, etc.) remain at 1024px.

**Schema / API / dependencies:** none.

## Testing Decisions

- **Update**: `src/components/home/__tests__/hero-section.component.test.tsx` — three existing test cases assert behavior keyed on `mockIsMobile`. Rename to `mockIsDesktop`, flip semantics (`true` = Spline, `false`/`null` = image), and update the null case to assert `HeroStaticImage` renders instead of nothing. The third test currently asserts "neither image nor Spline before media query resolves" — change to "renders image before media query resolves."
- **Delete**: `src/components/home/__tests__/spline-scene.component.test.tsx` — added in v1 to assert `touch-action: pan-y` on the wrapper. With the inline style reverted, the assertion is moot. Removing the test file is cleaner than leaving a placeholder.
- **Skip**: a unit test for the exact media query string. Asserting the query literal is brittle (any rewording of the query breaks the test without behavior changing). Behavior is covered by the hero-section test cases via mocked hook return values.
- **Manual**: real-iPad recheck on production. Confirm (a) thumb-swipe on hero scrolls the page, (b) home-page scroll matches `/scholarships`/`/blog` smoothness, (c) image displays in place of Spline. `mcp__playwright__browser_drag` still cannot exercise this — it emits mouse events, which strictly pass the hover/pointer query.
- **Prior art**: `src/components/home/__tests__/hero-section.component.test.tsx` for the existing mocking pattern.

## Out of Scope

- Changing the `lg:` Tailwind breakpoint anywhere outside the hero gate.
- New or higher-resolution hero image assets. Existing `lightHomeHero.jpg` / `darkHomeHero.jpg` are reused as-is.
- Header / `ScrollAnimatedHeader` changes. v1's revert stands.
- Lenis configuration (`smooth-scroll-provider.tsx`).
- The other three fixes already shipped in `tablet-scroll-fixes.md` (modal scroll, modal exit, legal TOC).
- Replacing Spline platform-wide or rethinking the hero composition for desktop.
- Detecting hybrid device mode changes at runtime (e.g., Surface keyboard detach/attach without refresh). Users get the experience that matches the input state at page load; mode changes require refresh.
- Automated touch-input verification. Recheck is manual on real iPad hardware.

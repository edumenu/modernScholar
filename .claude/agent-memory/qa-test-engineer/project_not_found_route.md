---
name: 404 / not-found.tsx rendering states
description: The three distinct ways the root not-found page can render, and the env signal that controls each
type: project
---

`src/app/not-found.tsx` wraps `src/components/ui/four-oh-four/not-found-client.tsx` in `PageTransition`. The client component picks ONE of three rendering paths depending on `useReducedMotion()` and Spline-load timing:

1. **Reduced-motion path** (when `prefers-reduced-motion: reduce`): Renders the static `ZeroRing` SVG ellipse fallback (red 4-0-4) in the middle, no Spline canvas, no floating icons. This is the intended accessibility behavior — fast, fully accessible, no `<canvas>` element exists.
2. **Spline-loaded path** (motion enabled, Spline scene resolved): The absolute-positioned Spline backdrop renders the dark or light 3D 404 (`splineScenes.notFoundDark()` / `notFoundLight()`, keyed off `useTheme().resolvedTheme`). Floating Iconify icons fade in over ~1.2 s. Decorative rule + headline + body + 3 CTAs fade in over ~600 ms.
3. **Spline-loading path** (motion enabled, Spline NOT yet resolved): Suspense fallback `<div className="size-12 animate-pulse rounded-full bg-surface-container" />` shows a small pulsing dark dot in the middle. The other content fades in around it. From a user POV the page looks broken for the duration of the Spline fetch — there's no "404" marker until Spline resolves.

**Theme + Spline coupling**: The Spline URL is computed from `resolvedTheme`, not from the `<html>` class directly. If next-themes ever leaves those out of sync (e.g. during `disableTransitionOnChange` toggle, or during a synthetic test that mutates the class without going through `setTheme()`), the Spline backdrop and the page surface can briefly disagree — producing a visible seam between the 3D 404 and the page surface. Not user-reproducible under normal use; can show up in automated tests.

**Footer**: `RootLayout` always renders `<Header>` + `<PageShell>{children}</PageShell>` + `<Footer>`, including on the 404 route. The 404 `<main>` uses `min-h-screen`, so the visible page is one viewport tall (just the 404 hero) followed by the global footer below — the page is effectively 2× viewport on tablet, and the big "Modern Scholar" wordmark sits at the bottom. May or may not be intentional.

**How to apply when QA'ing the 404 route**:
- Check what `window.matchMedia('(prefers-reduced-motion: reduce)').matches` returns BEFORE asserting the page is broken — if true, no `<canvas>` is expected.
- Always check `document.querySelectorAll('canvas').length` in the same eval as the screenshot, so you can correlate visual state with motion preference.
- For the Spline-loading-stuck case, wait for the Spline canvas to actually paint (poll for `canvas.getBoundingClientRect().width > 0` AND non-empty render) before screenshotting, or accept the indeterminate state and flag it.

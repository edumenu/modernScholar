---
name: Hero Spline Loader Architecture
description: Hero section loader refactor: route group, Zustand store design, ReactDOM.preload in Server Component, aria-hidden gap, reactStrictMode tradeoff
type: project
---

Route group `(home)/` created to scope the hero overlay:
- `(home)/layout.tsx` (Server Component) renders `<HomeSplineLoader>` outside the page Suspense boundary so the loader is in the initial SSR paint.
- `(home)/loading.tsx` returns `null` deliberately to suppress the root `app/loading.tsx` FullScreenLogoLoader from double-firing.
- `(home)/page.tsx` calls `ReactDOM.preload()` directly inside the Server Component render — this is the correct documented pattern in Next.js 16 (documented in generate-metadata.md); the component does NOT need "use client" for this.

Known issues found in this review:
- `hero-section.tsx:62` — `aria-labelledby="hero-heading"` references an ID that never exists in the rendered JSX (the `<h2>` has no `id` attribute). Dangling ARIA reference.
- `hero-section.tsx:88` — heading text "Your scholarship Journey starts Here" has inconsistent capitalisation (lowercase 's' on "scholarship", uppercase 'J' on "Journey") — likely a copy bug.
- `hero-section.tsx:103` — `<AnimatedLines aria-hidden="true">` hides the "Modern Scholar" brand name from screen readers with no visible accessible alternative carrying the same text (the h2 above it says something else).
- `home-spline-loader.tsx:67` — wrapper div uses `aria-hidden={!show}` but not `inert` — when the loader is visible and covering the page, focus can still tab into the content underneath.
- `hero-loader-store.ts` — Zustand store is intentionally minimal (2 fields). The "reset on mount" pattern (setSplineReady(false) in useEffect) means any consumer that subscribes before mount sees stale `true` from a prior visit; the reset is correct but creates a brief flash window.
- `next.config.ts` — `reactStrictMode: false` intentionally disabled to prevent LogoLoader animation restart in dev. The comment is accurate and the tradeoff is documented. Flag for future: the real fix is to make the animation restart-tolerant rather than disable Strict Mode globally.
- `spline-scenes.ts` — `CACHE_BUST_TOKEN` equals `SPLINE_VERSION` which is a string literal "1" — bumping it requires a code change; a `Date.now()` or env var approach would be safer, but the current approach works for a static export.

**Why:** New home route group was introduced to prevent double-loader animation (root loading.tsx fires, then hero overlay mounts and restarts).
**How to apply:** When reviewing hero or loader changes, check that the aria-labelledby ID exists, that aria-hidden on overlays is paired with inert, and that the AnimatedLines has an accessible text equivalent.

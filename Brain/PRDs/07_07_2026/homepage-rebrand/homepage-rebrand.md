# PRD — Homepage Rebrand ("Bold Skin, Same Bones")

> Make the homepage read as bold and editorial without changing the Academic Curator design system. Full design + rationale: `../../2026-07-07/homepage-rebrand-design.md`.

## Problem Statement
- Homepage looks restrained; it doesn't land the confident, premium first impression the brand wants.
- Hero relies on a Spline 3D scene that is heavy to author/optimize and hard to make feel "bold."
- Section headings below the hero are small and uniform, so the page reads flat.

## Location
`Brain/PRDs/07_07_2026/homepage-rebrand/homepage-rebrand.md`
Companion design doc: `Brain/PRDs/2026-07-07/homepage-rebrand-design.md`

## Solution
- Replace the hero Spline scene with a **full-bleed AI-generated (Higgsfield) admin-building loop video**, warm-graded to the palette, under a warm legibility scrim.
- Oversized Noto Serif wordmark on top; tiny tracked-caps kicker above it (invoko-style scale contrast).
- Carry boldness down-page via one shared **heading recipe** applied to Expires Soon, What's Next, FAQ.
- Homepage only. Keep all tokens, fonts, glass tiers, and the responsive rich-media / poster split. Contact-page Spline untouched.

## User Stories
1. As a visitor, I want a striking animated hero, so that the site feels premium at first glance.
2. As a mobile/tablet user, I want a fast poster image instead of video, so that the page loads quickly.
3. As a reduced-motion user, I want a still poster, so that motion doesn't trigger discomfort.
4. As a returning visitor toggling theme, I want the hero to match light/dark, so that it stays cohesive.
5. As a visitor scrolling down, I want each section to feel part of one bold design, so that it reads intentional.

## Implementation Decisions
**Modules**
- `HeroVideo` (new, `src/components/home/hero-video.tsx`): renders `<video autoplay muted loop playsinline poster>` (webm+mp4) on desktop, poster image otherwise; emits ready on `loadeddata` / poster `onLoad`.
- `hero-media.ts` (new, `src/config/hero-media.ts`): day/night clip + poster URLs + cache-bust; mirrors `spline-scenes.ts`.
- `hero-section.tsx` (existing): swap Spline slot → `HeroVideo`; apply bold wordmark + kicker; keep `ParallaxLayer`, `AnimatedLines`, `CTAButton`, `sr-only` fallback, desktop-media query.
- `hero-loader-store.ts` (existing): generalize `splineReady`/`setSplineReady` → `mediaReady`/`setMediaReady`; keep 8s safety timeout.
- `page.tsx` (existing): preload poster + video `metadata` instead of `.splinecode`.
- Section headings (existing): `expires-soon-scholarships.tsx`, `whats-next/*`, `faq-section.tsx` — apply shared heading recipe (`font-heading 700`, `clamp(2.5rem,5vw,4rem)`, tracking-tighter) + standardized tertiary tracked-caps kicker.

**Key decisions**
- Video, not Spline, for hero — cinematic loop is lighter to author and reads bolder than 3D.
- Building as full-bleed background, type as star — reconciles literal-building instinct with invoko type-dominance.
- Warm scrim is a section gradient, not glass — respects "glass only for floating Z-2+".
- All failure paths (reduced-motion, autoplay-blocked, decode error, theme swap) resolve to the poster — one fallback to reason about.
- Don't remount `<video>` on theme flip — avoids re-download (same lesson as the Spline scene memo).
- Retire homepage Spline scenes from `spline-scenes.ts`; keep contact scenes.

**Dependencies** — none added. Asset pipeline is offline (Higgsfield + ffmpeg), outputs static files in `public/`.

## Testing Decisions
- **Test**: `HeroVideo` (component/jsdom) — poster-fallback branch renders for non-desktop + reduced-motion; `sr-only` wordmark present. Assert branching/attributes, not playback.
- **Test**: `hero-media.ts` (unit) — URL + cache-bust pure function.
- **Test**: hero (e2e/Playwright) — desktop `<video>` has `autoplay/muted/playsinline`; splash dismisses; `window.__lenis` resizes; reduced-motion emulation → poster.
- **Skip**: video playback correctness — jsdom can't decode; visual left to manual/QA.
- **Prior art**: mirror `e2e/scholarships-layout-toggle.spec.ts` for `window.__lenis`; existing `src/app/__tests__/` for component render.

## Out of Scope
- Any page other than the homepage.
- Design-system token, font, or `SystemDesign.md` changes.
- Contact-page Spline scene.
- Redesigned cards, new carousel, or per-section 3D.
- Producing the Higgsfield clips themselves (asset-authoring task, not code).

## Open Questions
- One warm-graded clip that works in both themes under the scrim, or two separate day/night clips? (Two is the honest default; confirm before asset production.)

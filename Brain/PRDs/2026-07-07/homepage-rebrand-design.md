# Homepage Rebrand — Design Doc

**Date:** 2026-07-07
**Scope decision:** Bold skin, same bones — homepage only. Keep the entire "Academic Curator" design system (OKLCH tokens, Noto Serif / Poppins, cream surface, glass tiers). Only the homepage changes; the rest of the site and `SystemDesign.md` are untouched.

**Inspiration:** invoko.ai (#1 — type-led, abstract, bold), crav / voldog / copula (bold, product-forward). Synthesis chosen: invoko-style type dominance applied to a literal admin building rendered as AI-generated motion.

---

## 1. Hero architecture

Evolves the current hero (`src/components/home/hero-section.tsx`) rather than replacing it.

**Stays as-is:**
- `<section>` shell (`min-h-dvh`), `ParallaxLayer` wrapping the media, `AnimatedLines` per-char reveal of "Modern Scholar", `CTAButton`, `sr-only` a11y fallback.
- Desktop / mobile split via `useMediaQuery("(min-width: 1024px) and (hover: hover) and (pointer: fine)")`.

**Swaps:** the Spline slot → new `HeroVideo` client component.
- Desktop → `<video autoPlay muted loop playsInline poster={…}>` with `webm` + `mp4` sources.
- Mobile / tablet / SSR → poster image (existing `HeroStaticImage` pattern, repointed to the video poster).

**New pieces (small):**
- **Warm scrim** — gradient `<div>` over the video (`cream→transparent` bottom-up in light; warm near-black in dark) for headline legibility. Section-level gradient, **not glass** — respects "glass only for floating Z-2+".
- **`hero-media.ts` config** — day/night clip + poster URLs + cache-bust, mirroring `src/config/spline-scenes.ts`.

**Rewired, not rebuilt:**
- `hero-loader-store` release moves from `splineReady` → video `loadeddata` (desktop) / poster `onLoad` (mobile). Same splash. Existing 8s safety timeout stays.
- `page.tsx` `ReactDOM.preload` swaps `.splinecode` fetch → poster-image preload + video `preload="metadata"`.
- `prefers-reduced-motion` → render poster, never the video.
- Homepage Spline scenes retired; **contact-page Spline untouched**.

## 2. Layout & bold type

Keeps the bottom-anchored grid: wordmark bottom-left, CTA bottom-right (desktop); stacked + centered CTA (mobile).

- **Wordmark** → `Noto Serif 700` (`--font-heading`), `clamp(3rem, 11vw, 9rem)`, `leading-[0.92]`, `tracking-tighter`. Should feel like it barely fits the viewport. Keeps `AnimatedLines` `revealUp`, `staggerDelay ~0.05`.
- **Kicker** → repurpose "Your scholarship journey starts here" as an eyebrow above the wordmark: `Poppins 600`, uppercase, `tracking-[0.2em]`, `text-xs/sm`. Scale contrast (tiny tracked caps over giant serif) = the bold move.
- **Color** → `text-primary` / `dark:text-primary-100` over scrim (unchanged tokens).
- **Motion** (per `animation.md`): wordmark `AnimatedLines revealUp`; kicker + CTA `AnimatedSection fadeUp` delayed ~0.4–0.5s. Reduced-motion handled globally by `MotionConfigProvider`.
- **CTA** → keep `CTAButton`, no new variant.

**Deliberate cut (YAGNI):** no scroll-scrubbed hero timeline, no split-flap, no cursor-follow 3D.

## 3. Carrying "bold" through lower sections

No rebuilds — apply one shared **bold heading recipe** so the page reads as one rebrand.

- **Kicker** (already exists twice: "Curated for you", "FAQ") → standardize: `Poppins 600`, uppercase, `tracking-widest`, `text-tertiary`.
- **Section h2** → `font-medium` → `font-heading 700`, `clamp(2.5rem, 5vw, 4rem)`, `tracking-tighter`.

Per section:
- **Expires Soon** (`expires-soon-scholarships.tsx`) — keep coverflow carousel + mask fade; heading only.
- **What's Next** (`whats-next/`) — keep orbiting/pulsing icon cluster (reduced-motion-aware). Uses `bg-white/20` → sits on a tinted band; confirm it reads against cream (a colored band mid-page is a good bold contrast beat). Align heading.
- **FAQ** (`faq-section.tsx`) — keep two-column accordion + `bg-surface-container-low` cards (solid, no glass). Bold heading; optionally bump question `text-sm` → `text-base`.

**YAGNI cuts:** no redesigned cards, no new carousel, no per-section 3D.

## 4. Video asset pipeline, edge cases, testing

**Higgsfield → web-ready:**
1. Two graded clips — warm-day + warm-night (prompt warm stone / golden light for palette fit).
2. Trim to seamless ~8–12s loop (or crossfade ends); slow subtle camera motion.
3. `ffmpeg` → `mp4` (H.264) + `webm` (VP9), ~1080p, audio stripped, few MB each (protect LCP).
4. Extract poster frame per theme → optimized `webp` (doubles as mobile / reduced-motion / failure image).
5. `public/` + register in `hero-media.ts`.

**Edge cases (all → show poster):** reduced-motion; autoplay blocked (iOS low-power) / slow net / decode error (`poster` + `onError`); theme flip mid-view (don't remount `<video>` — re-download lesson from the Spline memo; show poster during source swap); loader release on `loadeddata` with 8s safety backstop.

**Testing (per `testing.md`):**
- **component (jsdom):** poster-fallback branch for non-desktop + reduced-motion; `sr-only` wordmark present. Test branching/attributes, not playback.
- **e2e (Playwright):** desktop `<video>` with `autoplay/muted/playsinline`; splash dismisses; `window.__lenis` resizes; reduced-motion emulation → poster.
- **unit:** `hero-media.ts` URL/cache-bust pure function.

---

## Affected files

| File | Change |
|------|--------|
| `src/components/home/hero-section.tsx` | Swap Spline slot → `HeroVideo`; bold type/kicker |
| `src/components/home/hero-video.tsx` | **New** — video + poster fallback component |
| `src/config/hero-media.ts` | **New** — day/night clip + poster config |
| `src/app/(home)/page.tsx` | Preload poster/video instead of `.splinecode` |
| `src/stores/hero-loader-store.ts` | Release on `loadeddata` |
| `src/components/home/expires-soon-scholarships.tsx` | Bold heading recipe |
| `src/components/home/whats-next/*` | Bold heading; verify tinted band |
| `src/components/home/faq-section.tsx` | Bold heading recipe |
| `public/` | Two clips (mp4+webm) + two posters |

Homepage Spline scenes in `spline-scenes.ts` retired; contact scenes kept.

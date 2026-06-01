# PRD — Scholarships Page Tutorial Reel

> 20-second portrait Remotion video that teaches new Instagram visitors how to use the `/scholarships` filter UI. Shipped as a second composition inside the existing `modern-scholar-intro/` project.

## Problem Statement

- New visitors miss most of the `/scholarships` filter UI — level pill tabs, eligibility tags, search, comparison FAB — because there is no onboarding.
- "View Details" / Save clicks from first-time visitors are low; the page reads as a static list.
- The org has Remotion tooling running in `modern-scholar-intro/` and an upcoming Instagram push, so the cost of producing one tutorial reel is at its lowest right now.

## Location

`Brain/PRDs/05_31_2026/scholarships-tutorial-reel/scholarships-tutorial-reel.md`
No companion `*-decisions.md`. All rationale stays inline.

## Solution

- **Extend the existing `modern-scholar-intro/` Remotion project** with a second composition rather than scaffolding a sibling repo. Direct reuse of brand tokens, fonts, `PageReveal`, `CROSSFADE`, and `/public/` assets — no npm init, no dep install.
- One 20 s composition at **1080×1350 (4:5)** — Instagram's recommended feed video size; gives room for a 2-column card grid.
- Recreate the `/scholarships` UI inside Remotion (not screenshots) so filter state changes animate frame-accurately and look pixel-correct against the live site.
- 5 walkthrough beats wired with a deterministic SVG cursor, a radial spotlight that dims the rest of the page, caption pills, and a `ZoomLayer` for focus pushes.
- Silent track for ship; per-scene `script` constants and a placeholder mp3 scaffold a VO drop-in later.

## User Stories

1. As an Instagram visitor, I want to see the scholarship filters in action in 20 seconds so I can decide if the site is worth opening.
2. As a first-time site visitor referred from the reel, I want a refresher on what the filters do so I can find scholarships matching my situation.
3. As the site owner, I want a reusable tutorial template (`Cursor`, `Spotlight`, `Callout`, `ZoomLayer`) so future per-page reels (blog, contact, home) cost less to produce.
4. As an editor, I want every onscreen state derived from `useCurrentFrame()` so re-timing a beat or re-recording requires no React state changes.

## Implementation Decisions

**Modules** (all paths relative to `modern-scholar-intro/`)

- `Root.tsx` (edit) — register a second `<Composition id="ScholarshipsTutorial" />` next to the existing `Intro` one. 1080×1350, 600 frames, 30 fps, schema `{ brandUrl, logo }`.
- `src/tutorials/scholarships/ScholarshipsTutorial.tsx` (new) — root composition. Sequences BrandIntro → 5 beats → Outro with 15-frame crossfades.
- `src/tutorials/scholarships/components/Cursor.tsx` (new) — SVG arrow positioned by waypoint interpolation; click-pulse ring on flagged waypoints.
- `src/tutorials/scholarships/components/Spotlight.tsx` (new) — full-screen radial-gradient dim mask; center / radius / dim frame-interpolated.
- `src/tutorials/scholarships/components/Callout.tsx` (new) — caption pill with arrow tail; spring entrance, fade exit; Poppins.
- `src/tutorials/scholarships/components/ZoomLayer.tsx` (new) — scale + translate wrapper with frame-driven `transform-origin`.
- `src/tutorials/scholarships/ui/` (new) — `ScholarshipPageLayout`, `FilterStrip`, `ScholarshipCard`, `FilterSheet`, `ComparisonFab`, `ExpandedScholarshipModal`. "State" (active level, search text, checked cards, sheet open) passed as props derived from frame.
- `src/tutorials/scholarships/scenes/` (new) — `BrandIntro`, `Overview`, `LevelFilter`, `FilterSheet`, `Search`, `SaveAndOpen`, `Outro` (one per beat).
- `src/tutorials/scholarships/data/scholarships.ts` (new) — ~12 mock scholarships for the recreated grid; hand-authored.
- **Reused via import** (do not duplicate): `PageReveal` from `src/Intro.tsx:242-318` (extract to `src/shared/PageReveal.tsx` first), brand color constants from `src/Intro.tsx:24-37` (extract to `src/shared/brand.ts`), `CROSSFADE` constant.

**Key decisions**

- Reuse `modern-scholar-intro/`, don't scaffold sibling — saves npm init + ~7 dep installs and lets the tutorial import `PageReveal` / brand tokens directly. Extract to a sibling later only if a second tutorial actually ships.
- One small refactor first — lift `PageReveal`, color constants, and `CROSSFADE` out of `Intro.tsx` into `src/shared/` so both compositions import them. Keeps `Intro.tsx` from being a hidden dependency.
- Canvas 1080×1350 / 30 fps / 600 frames — Instagram feed-video target; 5 beats at ~90 frames each plus intro and outro.
- Recreated UI, not screenshots — filter state changes need to animate per frame; screenshots can't show interactivity.
- Mock data, not live import — `modern-scholar/src/data/scholarships.ts` is a Next.js client module and won't load under Remotion's esbuild context.
- Animation deterministic on frame only — Motion / GSAP / CSS animations / `setTimeout` banned; matches existing `modern-scholar-intro/` convention.
- Standalone primitives (`Cursor`, `Spotlight`, `Callout`, `ZoomLayer`) — reusable for future tutorials without per-scene rewrites.
- Captions ship as primary watch-rate driver — VO scaffolded as `<Audio>` (commented out) and per-scene `script` constants; can be added later without restructuring.

**Schema / API / dependencies**

- Composition zod schema: `{ brandUrl: string, logo: string }` (mirrors the `Intro` composition).
- **No new dependencies.** Existing `modern-scholar-intro/package.json` already has `remotion`, `@remotion/cli`, `@remotion/tailwind-v4`, `@remotion/zod-types`, `react`, `tailwindcss`, `zod`.

## Testing Decisions

- **Test**: `npx remotion still src/index.ts ScholarshipsTutorial out/tut-frame-N.png --frame=N` at each beat boundary (frames 60, 150, 240, 345, 435, 550, 590) — catches clipping, cursor drift, callout overlap.
- **Test**: side-by-side spot check against `localhost:3000/scholarships` at a 540×960 viewport — filter strip, card grid, FAB, and modal must look indistinguishable.
- **Skip**: no Vitest / Playwright suite — creative deliverable; visual verification is the test.
- **Prior art**: mirror the still-render cadence from the `Intro` build (frame PNGs under `modern-scholar-intro/out/`).

## Out of Scope

- Live data import from `modern-scholar/src/data/scholarships.ts`.
- Voiceover recording — placeholder mp3 only; VO scaffolded, not produced.
- Cross-format variants (9:16 Reel, 1:1 Square) — single 4:5 deliverable.
- nuqs URL-state recreation — if a URL bar is shown, it's a static `<div>` with interpolated text.
- Live-site copy or UX changes to `/scholarships`.
- Asset re-optimization for existing `modern-scholar-intro/` covers.
- Renaming `modern-scholar-intro/` — name stays; extract to a sibling only if/when a second tutorial ships.

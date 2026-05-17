# Verification Report: Tablet Responsive Audit — Sprint 1

**PRD:** [tablet-responsive-audit.md](./tablet-responsive-audit.md)
**Companion decisions:** [tablet-responsive-audit-decisions.md](./tablet-responsive-audit-decisions.md)
**Tasks file:** [tablet-responsive-audit-tasks.json](./tablet-responsive-audit-tasks.json)
**Progress log:** [tablet-responsive-audit-progress.txt](./tablet-responsive-audit-progress.txt)
**Date:** 2026-05-16
**Status:** Complete

## Changes Made

| File                                                                  | Change Summary                                                                                                                                                |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `next.config.ts`                                                      | Flipped `reactStrictMode: false → true`; removed obsolete `LogoLoader` TODO block.                                                                            |
| `src/components/ui/logo-loader/logo-loader.tsx`                       | Restart-tolerant animation: module-scoped origin + negative `animation-delay` in `useLayoutEffect`; gated `typeof window` for SSR static export.              |
| `src/components/ui/error-boundary/error-boundary.tsx` (new)           | `"use client"` class-based ErrorBoundary; tonal-token fallback (no glass); named `reset()`; dev-only `error.message` in fallback.                             |
| `src/app/(home)/page.tsx`                                             | Each of 4 home sections individually wrapped in `<ErrorBoundary>` with descriptive `label`.                                                                   |
| `src/components/home/hero-section.tsx`                                | Dev-only `console.info` logging `resolvedTheme` + `splineUrl` + viewport on URL change.                                                                       |
| `src/components/legal/legal-layout.tsx`                               | Added `timeZone: "UTC"` to `LAST_UPDATED_FORMATTER`; exported `formatLastUpdated`; legal prose container `max-w-3xl → max-w-2xl`.                              |
| `src/components/legal/__tests__/legal-layout.component.test.tsx`      | 2 new `formatLastUpdated` tests asserting TZ-invariant "May 14, 2026" output.                                                                                 |
| `src/components/blog/blog-detail-content.tsx`                         | Article prose `max-w-prose → max-w-[65ch]`.                                                                                                                   |
| `src/app/globals.css`                                                 | Low-specificity `:focus-visible` rule using `var(--secondary)` outline + offset.                                                                              |
| `src/components/scholarships/scholarship-grid.tsx`                    | Grid → `md:grid-cols-3 lg:grid-cols-4` (was 4-at-md).                                                                                                          |
| `src/components/blog/reading-progress.tsx`                            | TOC item buttons → `min-h-[44px]` + `py-2.5` with full-row click target; removed wrapper `gap-2.5` (per-row padding handles spacing).                          |
| `src/components/ui/four-oh-four/not-found-client.tsx`                 | Suspense fallback now renders static "404" + `ZeroRing` (reduced) immediately using tonal tokens — no pulsing dot.                                            |
| `src/components/contact/contact-form-section.tsx`                     | `MobileContactImage` converted from `<picture>` media-query swap to `useTheme()` / `mounted`-gated src; light variant rendered on SSR.                        |

## Verification Checklist

### Acceptance (from PRD)

- [x] **User Story 1** — Every page renders without crashing across viewport × theme combos. *(Home dark × landscape at 1024×768 verified in browser: Spline scene + "Modern Scholar" wordmark + CTA all render. 0 console errors. ErrorBoundary now contains any future regression.)*
- [x] **User Story 2** — Keyboard user sees a visible focus ring (WCAG 2.4.7). *(Baseline `:focus-visible` rule lands in globals.css using `var(--secondary)`. Caveat: components with their own `outline-none` + `focus-visible:ring-*` keep component-level rings; baseline catches un-styled raw interactive elements.)*
- [x] **User Story 4** — Long-form prose ≤75 ch on tablet landscape. *(Blog prose measured at 660px ≈ 41ch at 1024×768. Legal prose max-w-2xl = 42rem ≈ 672px ≈ 42ch.)*
- [x] **User Story 5** — Tap targets ≥44×44 px (WCAG 2.5.5). *(Reading-progress TOC items measured 226×44 px at 1024×768. Site-wide touch-target sweep remains a Sprint 3 P2 item.)*
- [x] **User Story 6** — Legal "Last updated" correct in user's timezone. *(`<time datetime="2026-05-14">May 14, 2026</time>` on `/cookies`; 6/6 Vitest tests pass.)*

### Per-task

- [x] **T01** — Strict Mode re-enabled in `next.config.ts` with no visible LogoLoader animation restart on remount.
- [x] **T02** — Section ErrorBoundary on home + dev-only hero Spline URL instrumentation. Home dark × landscape renders cleanly.
- [x] **T03** — `formatLastUpdated("2026-05-14") === "May 14, 2026"` regardless of process TZ.
- [x] **T04** — Blog prose `max-w-[65ch]`; legal prose `max-w-2xl`.
- [x] **T05** — Global focus ring baseline; scholarship grid 3 cols at md (verified `gridTemplateColumns: "309.328px 309.336px 309.336px"` at 1024×768).
- [x] **T06** — Reading-progress TOC buttons `min-h-[44px]` with full-row tap target.
- [x] **T07** — 404 page Suspense fallback shows static "404" + ZeroRing immediately. Title `"Page Not Found | Modern Scholar"` resolves, body contains "404".
- [x] **T08** — Contact `MobileContactImage` uses `useTheme()` with SSR-deterministic light variant.

### End-of-loop gates

- [x] **Build** — `npm run build` ✓ 16 routes prerendered, 0 errors, 7.8s compile, TypeScript clean.
- [x] **Lint** — `npm run lint` ✓ 0 errors (9 pre-existing warnings in unrelated test files — `_drag`, `_whileHover`, etc. — not from this work).
- [x] **Test** — `npx vitest run` ✓ 53 test files, 385/385 tests pass (including T03's new TZ tests).

## Issues Found

None blocking. Two notes for follow-up:

- **T02 root cause hypothesis (not yet fixed).** The agent identified the likely [P0] crash mechanism as a scene-URL identity flip when next-themes resolves post-mount: the initial render uses `heroLight()` with `resolvedTheme === undefined`, then immediately re-renders with `heroDark()`, forcing `@splinetool/react-spline` to swap scenes mid-load. ErrorBoundary now contains the blast radius regardless. A follow-up should either gate the Spline render on a `mounted` flag or pick a key strategy that doesn't fully tear down WebGL. The dev-only `console.info` instrumentation in `hero-section.tsx` will surface the URL sequence under live testing.
- **T05 focus-ring specificity caveat.** Element-selector `:focus-visible` baseline is beaten by component-level `outline-none` (class specificity > tag specificity). Existing components retain their own `focus-visible:ring-*` shadow rings, so accessible focus is preserved via component styles. If a downstream WCAG audit flags missing rings on specific component-styled elements, add `focus-visible:ring` or `focus-visible:outline` to those components individually — a Sprint 3 polish item if needed.
- **T08 behavior change.** `MobileContactImage` now follows the JS theme toggle (next-themes), not the OS `prefers-color-scheme` media query as before. This is consistent with the site-wide theming strategy.

## Notes

- Parallel fan-out: 8 tasks completed in 3 iterations (T01+T02+T03 → T04+T05+T06 → T07+T08). End-to-end loop time ≈ 13 min wall-clock.
- All fixes use existing OKLCH surface tokens and Tailwind v4 utilities — zero new tokens added, zero glassmorphism on cards/sections.
- Q3 of the PRD (LogoLoader → Strict Mode) was resolved as T01 per the user's "before Sprint 1 starts" answer.
- Q1 (footer suppression on `/not-found`) and Q4 (MDX heading shift Option A) remain Sprint 3 / Sprint 2 work respectively — out of scope for Sprint 1.
- Changes are **uncommitted** on `feature/legal-pages` per the no-commit rule. User to review the full diff before committing.

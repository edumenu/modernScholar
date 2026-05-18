# PRD — Tablet Scroll & Modal Interaction Fixes

> Resolve five scroll-and-modal interaction bugs on tablet (and adjacent viewports) caused by Lenis smooth-scroll mediation and an asymmetric `layoutId` source between scholarship card layouts.

## Problem Statement

- Tablet users cannot finger-scroll over the home Spline scene; touch is captured by the WebGL canvas.
- Home header animation flickers during scroll; the page judders as the header enters/exits.
- Scholarship modal body cannot be scrolled on web; Lenis intercepts touch/wheel before the inner scrollable receives them.
- Scholarship modal exit is choppy at every viewport when opened from the list view (entrance is fine).
- Privacy page loses access to its lower content after the TOC `<details>` is expanded.

These regressions block the core discovery flow on the device class students most often use.

## Location

`Brain/PRDs/05_18_2026/tablet-scroll-fixes/tablet-scroll-fixes.md`

## Solution

- Swap the hero Spline for a theme-aware static image below `lg:` (mirrors the contact page pattern); keep Spline on desktop only.
- Drive the header's hide/show from the Lenis scroll bus and collapse the double-fixed nesting.
- Opt the modal body and the eligibility scroller out of Lenis touch interception.
- Mirror the grid card's `layoutId` + `isExpanded` contract on the list card so the modal has a symmetric morph source on entrance and exit.
- Trigger `lenis.resize()` whenever the legal TOC `<details>` toggles, so Lenis's max-scroll stays current after the page grows.

## User Stories

1. As a tablet user, I want to scroll the home page by dragging anywhere in the hero, so the hero is not a dead zone.
2. As a visitor scrolling the home page, I want the header to enter and exit smoothly, so the page does not flicker.
3. As a student reading a long scholarship modal on phone or tablet, I want to scroll its body with my finger, so I can see the full eligibility text.
4. As a student closing a scholarship modal opened from the list view, I want the exit animation to match the entrance, so the close feels deliberate, not broken.
5. As a privacy-conscious visitor, I want to expand the TOC and still scroll to the bottom of the page, so I can finish reading the policy.

## Implementation Decisions

**Modules:**

- `HeroSection` (existing, `src/components/home/hero-section.tsx`) — gate rendering with `useMediaQuery("(max-width: 1023px)")`; render `<HeroStaticImage>` below `lg:` and the existing Spline path at `lg:` and above. Keep `ParallaxLayer` wrapper for both so the scroll-driven parallax is preserved.
- `HeroStaticImage` (new, co-located in `src/components/home/hero-section.tsx` or a sibling file) — theme-aware `next/image` using `/lightHomeHero.jpg` and `/darkHomeHero.jpg` (assets already in `public/`). Calls `setSplineReady(true)` on mount so `HomeSplineLoader` does not stall waiting for a Spline `onLoad` that will never fire on the static path.
- `Header` (existing, `src/components/ui/header/header.tsx`) — replace Motion `useScroll`/`useMotionValueEvent` with a `useLenis` callback; drop the redundant `fixed inset-x-0 top-0` on the inner `<header>` (wrapper is already fixed and handles positioning).
- `ExpandedScholarship` (existing, `src/components/scholarships/expanded-scholarship.tsx`) — add `data-lenis-prevent` to the modal body `<motion.div>` and to the nested eligibility scroller.
- `ScholarshipListCardSpread` (existing, `src/components/scholarships/scholarship-list-card.tsx`) — add `isExpanded` prop and `layoutId={card-${id}}` on the `motion.article`; replace the static `opacity-40` dim with `animate={{ opacity: isExpanded ? 0 : idleOpacity }}` mirroring `ScholarshipCard`.
- `ScholarshipGrid` (existing, `src/components/scholarships/scholarship-grid.tsx`) — pass `isExpanded={expandedId === scholarship.id}` to the list card.
- `LegalTOC` (new, `src/components/legal/legal-toc.tsx`) — small client component wrapping the `<details>` TOC; on the native `toggle` event, calls `lenis.resize()`. Replaces the inline `<details>` block currently in `LegalLayout`.
- `LegalLayout` (existing, `src/components/legal/legal-layout.tsx`) — swap the inline `<details>` for `<LegalTOC sections={…} />`. Remains a server component.

**Key decisions:**

- Hero Spline gated to `lg:` and above, static image below — mirrors the proven contact-page pattern; eliminates the WebGL canvas's touch capture on tablet, and avoids the Spline runtime download on devices where the 3D drag is awkward anyway. `setSplineReady(true)` on the static path keeps `HomeSplineLoader` from falling through to its 8s safety timeout.
- Header reads from Lenis bus, not Motion `useScroll` — single scroll source eliminates lerp-induced micro-deltas; matches the pattern already used in `LenisRouteResizer`.
- Modal opt-out via `data-lenis-prevent` — official Lenis hook for nested scrollables; surgical, no global config change.
- List card adopts grid card's morph contract — symmetric `layoutId` source on both layouts gives the modal a real exit target. Corner radius mismatch (`rounded-lg` vs `rounded-3xl`) accepted as a minor pop; do not unify.
- TOC fix via `<details>` `toggle` event, not a generic ResizeObserver — the only dynamic-height element on the page; matching the trigger to the source keeps the fix local. Side benefit: terms and cookies pages, which share `LegalLayout`, inherit the fix.

**Schema / API / dependencies:** none.

## Testing Decisions

- **Test**: `LegalTOC` — assert `lenis.resize()` is called when the `<details>` `toggle` event fires (Vitest, mock `useLenis`).
- **Test**: `ScholarshipListCardSpread` — assert `layoutId` is present on the article and `opacity` animates to 0 when `isExpanded` is true.
- **Test**: `HeroSection` — assert the static image renders below `lg:` and the Spline path renders at `lg:` and above; assert `setSplineReady(true)` is called on the static path mount (mock `useMediaQuery` + `useHeroLoaderStore`).
- **Skip**: Header Lenis subscription — covered by visual QA on tablet; unit-testing scroll bus interplay has poor ROI.
- **Prior art**: `src/components/legal/__tests__/legal-layout.component.test.tsx` for the legal test pattern; `src/components/scholarships/__tests__/` for card test conventions.

## Out of Scope

- Replacing Lenis or rethinking smooth scroll globally.
- Authoring new hero static assets — existing `lightHomeHero.jpg` / `darkHomeHero.jpg` in `public/` are reused as-is.
- 3D interaction on the hero below `lg:` — explicitly traded for reliable scroll and faster initial load.
- Reconciling `rounded-lg` vs `rounded-3xl` between list card and modal.
- Refactoring `ScholarshipCard` / `ScholarshipListCardSpread` toward a shared base.
- Mobile-menu, footer, and other tablet bugs not enumerated in the Problem Statement.

## Open Questions

None.

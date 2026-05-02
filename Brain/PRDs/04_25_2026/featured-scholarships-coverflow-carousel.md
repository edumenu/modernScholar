## Problem Statement

The Featured Scholarships marquee section, while functional, feels visually flat and passive. Cards scroll horizontally with no depth or interactivity beyond hover-pause. Users cannot engage with individual scholarships directly from the home page — every card links to the same generic scholarships listing. The section needs a more premium, interactive presentation that matches the editorial "Academic Curator" aesthetic and gives users a sense of curated discovery.

## Solution

Replace the CSS marquee animation with a 3D coverflow carousel powered by Motion (already installed). The center card is visually emphasized (scaled up), while flanking cards recede into perspective with rotation and depth transforms. Users can browse scholarships via autoplay, drag/swipe, arrow buttons, or keyboard navigation. Clicking a side card rotates it to center; clicking the center card navigates to the scholarships page pre-filtered to that scholarship. The existing card visual design (image overlays, gradient, category badges, warm palette) is preserved.

## User Stories

1. As a user viewing the home page, I want to see scholarships displayed in a 3D carousel with depth perspective, so that the featured section feels premium and curated.
2. As a user, I want the carousel to auto-rotate through scholarships every ~4 seconds, so that I can passively discover options without interaction.
3. As a user hovering over the carousel, I want autoplay to pause, so that I can browse at my own pace without cards moving unexpectedly.
4. As a user, I want to see 5 cards at once (1 center + 2 per side), so that I have context for what's coming next while focusing on the active scholarship.
5. As a user, I want the center card to appear larger and more prominent than the side cards, so that I know which scholarship is currently featured.
6. As a user, I want to click a side card and have it rotate to center, so that I can quickly jump to a scholarship that catches my eye.
7. As a user, I want to click the center card and be taken to the scholarships page filtered to that specific scholarship, so that I can learn more and apply.
8. As a user on mobile or tablet, I want to swipe left/right to browse scholarships, so that the interaction feels native to touch devices.
9. As a desktop user, I want subtle arrow buttons to appear on hover for navigation, so that I have a clear affordance for browsing without cluttering the default view.
10. As a keyboard user, I want to navigate the carousel with ArrowLeft/ArrowRight keys after focusing it, so that the feature is fully accessible without a mouse.
11. As a user with reduced motion preferences, I want the carousel to render as a simple horizontal scrollable list with no 3D transforms or autoplay, so that the content is accessible without triggering motion sensitivity.
12. As a user, I want the carousel to loop infinitely through all 10 scholarships, so that browsing feels seamless without hitting a dead end.
13. As a screen reader user, I want the carousel to announce the currently active scholarship when it changes, so that I can follow the rotation without visual cues.

## Implementation Decisions

### Architecture

- **Animation engine**: Motion library (`motion/react`) — already a project dependency. Chosen over CSS keyframes because the coverflow requires per-card spring-animated transforms driven by state (active index), which CSS alone cannot express. The previous marquee used CSS keyframes for continuous linear scroll; the coverflow needs discrete, state-driven transitions with spring physics.

- **Component structure**: New `CoverflowCarousel` component in `src/components/home/coverflow-carousel.tsx`. The existing `FeaturedScholarships` component orchestrates the section layout (heading, parallax layers) and delegates carousel rendering to this new component. `ScholarshipCard` stays in `featured-scholarships.tsx` but is modified to accept click handler props instead of wrapping in a `<Link>`.

- **State model**: Single `activeIndex` integer (0-9) drives all card positions. Each card computes its offset from center using modular arithmetic for infinite wrapping. A lookup function maps offset to transform values (`translateX`, `rotateY`, `translateZ`, `scale`, `opacity`, `zIndex`).

### 3D Transform Design

- **Perspective**: 1200px on the carousel stage container.
- **Center card (offset 0)**: scale 1.1, full opacity, no rotation — visually prominent.
- **Offset +/-1**: +/-280px translateX, +/-35deg rotateY, -120px translateZ, scale 0.85, opacity 0.85.
- **Offset +/-2**: +/-480px translateX, +/-45deg rotateY, -220px translateZ, scale 0.7, opacity 0.6.
- **Beyond offset +/-2**: Progressive fade to opacity 0 — invisible but still in DOM for smooth transitions.
- **Spring transition**: stiffness 260, damping 26, mass 1 — snappy but not jarring.

### Interaction Model

- **Autoplay**: `setInterval` at ~4000ms, cleared and reset on index change. Paused on hover (`onMouseEnter`/`onMouseLeave`) and during drag.
- **Drag/swipe**: Motion's `drag="x"` with `dragConstraints={{ left: 0, right: 0 }}` and `dragElastic: 0.15` for rubber-band snap-back. `onDragEnd` checks offset threshold (50px) or velocity (500px/s) to advance index.
- **Arrow buttons**: Absolutely positioned on carousel edges, hidden by default, revealed on parent hover (`opacity-0 group-hover:opacity-100`). Use Iconify solar arrow icons matching existing codebase patterns.
- **Keyboard**: `onKeyDown` on the carousel container (which has `tabIndex={0}`) handles ArrowLeft/ArrowRight.
- **Click routing**: Side cards fire `goTo(cardIndex)`. Center card fires `router.push(/scholarships?q={scholarship.id})`.

### Infinite Loop

All 10 cards are always rendered. Position is computed via modular arithmetic wrapping the offset to the range `[-total/2, total/2)`. No DOM manipulation needed — only transform values change on state update. This avoids the duplicate-array approach used by the old marquee.

### Dead Code Removal

The following code is fully replaced and must be removed:
- `MarqueeRow` component and `MarqueeRowProps` interface from `featured-scholarships.tsx`
- `row1Items`, `row2Items` constants
- `isClone` prop on `ScholarshipCard`
- `@keyframes marquee-left`, `@keyframes marquee-right`, and associated `prefers-reduced-motion` rule from `globals.css`
- `useRef` import (only used by MarqueeRow)

### Accessibility

- `aria-roledescription="carousel"` on container, `aria-roledescription="slide"` on each card.
- `aria-live="polite"` visually-hidden region announces active card name on change.
- Reduced motion fallback: horizontal `overflow-x-auto` flex with `snap-x snap-mandatory`, no 3D, no autoplay. Arrow buttons use `scrollIntoView` instead of animation.
- Arrow buttons have descriptive `aria-label` attributes.

### Responsive Behavior

- Transform `translateX` values scale down ~40% on screens below 640px to prevent card overflow.
- Container measured via ref; transform values proportional to container width.
- Touch/swipe works natively via Motion's drag gesture system.

## Testing Decisions

- **Modules to test**: `CoverflowCarousel` — keyboard navigation (ArrowLeft/ArrowRight advances index), click routing (side card vs center card), aria attributes, reduced motion fallback rendering.
- **Prior art**: Existing test file `featured-scholarships.component.test.tsx` tests the marquee version — must be fully rewritten. Mocking patterns for `motion/react`, `next/image`, `next/link`, `@iconify/react`, `AnimatedSection`, `ParallaxLayer` are already established there and should be reused. Add mock for `next/navigation` (`useRouter`).

## Out of Scope

- Individual scholarship detail pages (cards navigate to the listing page with a search filter, not a dedicated detail view).
- Touch gesture refinements like momentum scrolling or multi-card swipe — single card advance per gesture is sufficient for v1.
- Swiper or any new carousel library — this is Motion-only.
- Changes to the scholarship data model or the scholarships listing page filter logic (already handles `q` param via Nuqs).

## Further Notes

- This replaces the implementation from PRD `04_03_2026/featured-scholarships-marquee.md`. That marquee served well as v1 but the coverflow is a strict visual upgrade.
- Performance: 10 cards with `transform-style: preserve-3d` and spring animations is well within budget. `will-change: transform` on animated wrappers. Next.js `<Image>` with `fill` and `sizes="320px"` already optimized.
- The edge fade mask on the carousel container should be tightened from 10%/90% to 5%/95% since the coverflow already fades side cards via opacity.

---
applies_to: ["src/**/*.tsx"]
load_when: "adding scroll, entrance, hover, or transition animations"
deep_ref: ".context/architecture/overview.md"
---

# Animation Rules

## Critical rules (read first)

1. **Default to `AnimatedSection` / `AnimatedLines`** for scroll-triggered entrances. Don't reimplement viewport-aware animation per component.
2. **Use Motion (`motion/react`), not Framer Motion**. The package is `motion` (v12). `framer-motion` is not installed.
3. **Respect `prefers-reduced-motion`.** `MotionConfigProvider` in the root layout already sets `reducedMotion="user"` — but never animate transform/opacity below 200ms or stagger >150ms when reduced-motion is on.
4. **Lenis smooth scrolling is global.** Do not call `window.scrollTo` directly — it fights Lenis. Use Lenis's scroll API via the `SmoothScrollProvider` if you need programmatic scroll.
5. **When `AnimatePresence` wraps content that changes page height** (layout swaps, conditional sections), call `lenis.resize()` from the entering `motion.div`'s `onAnimationComplete` — not from a `setTimeout`. A timer races the exit animation and snapshots stale dimensions; `onAnimationComplete` fires once the new DOM is settled. Lenis's `autoResize` does not reliably observe these swaps.

## Standard primitives

| Primitive | Where | Use for |
|-----------|-------|---------|
| `AnimatedSection` | `src/components/ui/animatedSection/` | Section entrance: `fadeUp`, `fadeDown`, `scaleIn`. Wrap a section root. |
| `AnimatedLines` | `src/components/ui/animatedLines/` | Per-line stagger on a heading. Splits text into lines and animates each. |
| `useRipple` | `src/hooks/use-ripple.ts` | Click ripple effect (already used by `Button`). |
| `useParallax` | `src/hooks/use-parallax.ts` | Parallax y-offset bound to scroll. |
| `PageTransition` | `src/components/ui/page-transition.tsx` | Route-change transition. |

## Patterns

- **Entrance**: `useInView({ once: true, margin: "-10% 0px" })` for viewport detection. `once: true` avoids re-firing on re-entry.
- **Marquee**: continuous `x` translation via Motion, `whileHover` pause via state. See `coverflow-carousel.tsx` if extending.
- **Spring physics**: use Motion's `transition={{ type: "spring", stiffness, damping }}` over named easings when the motion is interactive (drag, layout).

## Bundle size

If a route only needs a handful of animations and bundle pressure matters, import from `motion/react` (lazy-by-default in v12). Don't add `framer-motion`, `react-spring`, or `gsap`.

## Spline 3D

- Embed via `@splinetool/react-spline` inside `<Suspense>`. Configure scene URLs in `src/config/spline-scenes.ts`.
- Programmatic control (events, variables, camera) goes through `@splinetool/runtime` — see the `spline` skill for patterns.

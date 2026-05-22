# ADR 0003 — Motion (formerly Framer Motion) for all animation

**Status:** Accepted
**Date:** 2026-03

## Context

The site relies heavily on motion: scroll-triggered entrances, stagger reveals, marquees, parallax, page transitions, 3D-tilted carousels. The mainstream options:

- **Motion** (`motion`) — the renamed, current version of Framer Motion.
- **GSAP** — imperative, very capable, but Greensock license is heavier and the API is non-React-idiomatic.
- **React Spring** — declarative, lighter for simple cases, but weaker for layout animations and gestures.

## Decision

Standardize on **Motion v12** as the only animation library. Import from `motion/react`.

## Why

- Declarative API matches React's component model.
- Built-in `useReducedMotion` and `MotionConfig` make accessibility opt-out trivial.
- Layout animations, gestures, and spring physics in one package.
- Bundle is lazy-by-default in v12 — pay for what you use.
- We already had institutional knowledge in Framer Motion; the rename was a no-op.

## Consequences

- Reject any PR that adds `framer-motion`, `gsap`, or `react-spring`.
- The standard scroll entrance primitive is `AnimatedSection` — extend it rather than reaching for `motion` directly in every section.
- See `.claude/rules/animation.md` for working rules.

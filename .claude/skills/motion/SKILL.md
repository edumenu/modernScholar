---
name: motion
description: |
  Build sophisticated React animations with Motion (formerly Framer Motion) - declarative animations, gestures (drag, hover, tap), scroll effects, spring physics, layout animations, and SVG manipulation. Optimize bundle size with LazyMotion (4.6 KB) or useAnimate mini (2.3 KB).

  Use when: adding drag-and-drop interactions, creating scroll-triggered animations, implementing modal dialogs with transitions, building carousels with momentum, animating page/route transitions, creating parallax hero sections, implementing accordions with smooth expand/collapse, or optimizing animation bundle sizes. For simple list animations, use auto-animate skill instead (3.28 KB vs 34 KB).

  Troubleshoot: AnimatePresence exit not working, large list performance issues, Tailwind transition conflicts, Next.js "use client" errors, scrollable container layout issues, or Cloudflare Workers build errors (resolved Dec 2024).
---

# Motion Animation Library

Motion (`motion` package, formerly `framer-motion`) is the standard React animation library. It provides a declarative API for gestures, scroll animations, layout transitions, spring physics, SVG animation, and exit animations.

**Import**: `import { motion } from "motion/react"`
**Install**: `pnpm add motion` (or npm/yarn)
**Requirements**: React 18+ or 19+, TypeScript included

## When to Use Motion vs Alternatives

**Use Motion for:**
- Gestures: drag, hover, tap, pan (e.g., sortable lists, kanban boards, sliders)
- Scroll animations: parallax, scroll-linked progress, viewport-triggered reveals
- Layout transitions: shared elements between routes, expand/collapse, grid/list switching
- SVG: path morphing, line drawing
- Exit animations: components that animate on unmount

**Don't use Motion for:**
- Simple list add/remove → use `auto-animate` (3.28 KB vs 34 KB)
- Static server-rendered content with no interactivity
- 3D animations → use Three.js / React Three Fiber

## Core API

### Basic Animation

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>
```

### AnimatePresence (Exit Animations)

Enables animations when components unmount. The most common source of bugs — follow these rules strictly:

```tsx
// AnimatePresence MUST stay mounted. Children MUST have unique keys.
<AnimatePresence>
  {isVisible && (
    <motion.div
      key="modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      Modal content
    </motion.div>
  )}
</AnimatePresence>
```

**The #1 mistake** — wrapping AnimatePresence in a conditional kills exit animations:
```tsx
// WRONG: exit animation won't play
{isVisible && (
  <AnimatePresence>
    <motion.div>Content</motion.div>
  </AnimatePresence>
)}
```

### Layout Animations

```tsx
<motion.div layout>
  {isExpanded ? <FullContent /> : <Summary />}
</motion.div>
```

Key props:
- `layout` — enables FLIP layout animations (hardware-accelerated)
- `layoutId` — connects separate elements for shared transitions
- `layoutScroll` — required for animations inside scrollable containers
- `layoutRoot` — required for animations inside fixed-position elements

### Scroll Animations

**Viewport-triggered:**
```tsx
<motion.div
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
/>
```

**Scroll-linked:**
```tsx
import { useScroll, useTransform } from "motion/react"

const { scrollYProgress } = useScroll()
const y = useTransform(scrollYProgress, [0, 1], [0, -300])

<motion.div style={{ y }}>Parallax element</motion.div>
```

### Gestures

```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  drag="x"
  dragConstraints={{ left: -100, right: 100 }}
/>
```

## Framework Integration

### Next.js App Router

Motion requires client components. Use a wrapper pattern:

```tsx
// src/components/motion-client.tsx
"use client"
import * as motion from "motion/react-client"
export { motion }
```

Then import from the wrapper in server components:
```tsx
import { motion } from "@/components/motion-client"
```

Or mark components using Motion as client components directly with `"use client"`.

### Tailwind CSS

Let each library handle its domain — Tailwind for static styles, Motion for animations.

**Remove Tailwind transition classes** when using Motion — they conflict and cause stuttering:
```tsx
// WRONG: causes stuttering
<motion.div className="transition-all duration-300" animate={{ x: 100 }} />

// CORRECT
<motion.div animate={{ x: 100 }} />
```

## Bundle Size Optimization

| Approach | Size |
|----------|------|
| Full `motion` component | ~34 KB |
| `LazyMotion` + `m` component | ~4.6 KB |
| `useAnimate` mini | ~2.3 KB |

### LazyMotion (recommended for production)

```tsx
import { LazyMotion, domAnimation, m } from "motion/react"

function App() {
  return (
    <LazyMotion features={domAnimation}>
      <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        4.6 KB instead of 34 KB
      </m.div>
    </LazyMotion>
  )
}
```

### Large Lists

Animating 50+ items causes severe slowdown. Use virtualization:
```bash
pnpm add react-window  # or react-virtuoso, @tanstack/react-virtual
```

## Accessibility

```tsx
import { MotionConfig } from "motion/react"

<MotionConfig reducedMotion="user">
  <App />
</MotionConfig>
```

Options: `"user"` (respects OS setting, recommended), `"always"` (force instant), `"never"` (ignore preference).

## Common Patterns

Five production-ready patterns — see `references/common-patterns.md` for full code:

1. **Modal Dialog** — AnimatePresence + backdrop + dialog exit animations
2. **Accordion** — animate height with `height: "auto"`
3. **Drag Carousel** — `drag="x"` with `dragConstraints`
4. **Scroll Reveal** — `whileInView` with viewport margin
5. **Parallax Hero** — `useScroll` + `useTransform` for layered effects

## Known Issues

See `references/known-issues.md` for detailed solutions. Quick summary:

| Issue | Fix |
|-------|-----|
| AnimatePresence exit not working | Keep AnimatePresence mounted, add unique `key` props |
| Large list slowdown (50+ items) | Use react-window or virtualization |
| Tailwind transition conflicts | Remove `transition-*` classes |
| Next.js SSR errors | Add `"use client"` directive |
| Scrollable container layout bugs | Add `layoutScroll` prop |
| Fixed-position layout bugs | Add `layoutRoot` prop |
| `layoutId` + AnimatePresence unmounting | Wrap in `LayoutGroup` |
| Reorder in Next.js | Avoid Reorder component with Next.js routing |

## References

- `references/common-patterns.md` — 5 production patterns with full code
- `references/known-issues.md` — Detailed troubleshooting for all known issues
- `references/performance.md` — Bundle optimization, hardware acceleration, virtualization

## Official Docs

- https://motion.dev/docs/react
- https://motion.dev/examples (300+ examples)

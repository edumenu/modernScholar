# Motion — Performance Optimization

## Bundle Size

| Approach | Size | Use When |
|----------|------|----------|
| Full `motion` component | ~34 KB | Prototyping, small apps |
| `LazyMotion` + `m` | ~4.6 KB | Production apps |
| `useAnimate` mini | ~2.3 KB | Minimal animation needs |

### LazyMotion Setup

```tsx
import { LazyMotion, domAnimation, m } from "motion/react"

// Wrap your app or a subtree
function App() {
  return (
    <LazyMotion features={domAnimation}>
      {/* Use 'm' instead of 'motion' everywhere inside */}
      <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        Loads animation features on-demand
      </m.div>
    </LazyMotion>
  )
}
```

### useAnimate Mini (Smallest)

```tsx
import { useAnimate } from "motion/react"

function Component() {
  const [scope, animate] = useAnimate()

  const handleClick = () => {
    animate(scope.current, { x: 100 }, { duration: 0.5 })
  }

  return <div ref={scope} onClick={handleClick}>Click me</div>
}
```

## Hardware Acceleration

Add `willChange` for frequently animated properties:

```tsx
<motion.div
  style={{ willChange: "transform" }}
  animate={{ x: 100, rotate: 45 }}
/>
```

Apply to: `transform`, `opacity`, `backgroundColor`, `clipPath`, `filter`.

This tells the browser to optimize for these properties using GPU compositing.

## Virtualization for Large Lists

Animating 50+ items causes severe performance degradation. Render only visible items:

```bash
pnpm add react-window  # or react-virtuoso, @tanstack/react-virtual
```

```tsx
import { FixedSizeList } from 'react-window'
import { motion } from 'motion/react'

function AnimatedList({ items }) {
  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {({ index, style }) => (
        <motion.div style={style} layout whileHover={{ scale: 1.02 }}>
          {items[index].label}
        </motion.div>
      )}
    </FixedSizeList>
  )
}
```

## Scroll Animation Performance

Motion uses the native ScrollTimeline API when available, which runs on the compositor thread (no main-thread JavaScript). This provides hardware-accelerated scroll-linked animations.

For browsers without ScrollTimeline support, Motion falls back to a polyfill that uses requestAnimationFrame.

## Tips

- Prefer animating `transform` and `opacity` — these don't trigger layout/paint
- Avoid animating `width`, `height`, `top`, `left` — use `transform` equivalents (`scaleX`, `scaleY`, `x`, `y`)
- Use `layout` prop for size/position changes — it uses FLIP technique (transforms only)
- Set `viewport={{ once: true }}` for scroll reveals that don't need to replay

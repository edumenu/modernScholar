# Motion — Known Issues & Solutions

## 1. AnimatePresence Exit Not Working

**Symptom**: Components disappear instantly without exit animation.

**Cause**: AnimatePresence is wrapped in a conditional, or children are missing `key` props.

**Solution**:
```tsx
// WRONG — AnimatePresence unmounts with condition, exit never plays
{isVisible && (
  <AnimatePresence>
    <motion.div>Content</motion.div>
  </AnimatePresence>
)}

// CORRECT — AnimatePresence stays mounted, conditional is inside
<AnimatePresence>
  {isVisible && <motion.div key="unique">Content</motion.div>}
</AnimatePresence>
```

Rules:
- AnimatePresence **must stay mounted** at all times
- All direct children **must have unique `key` props**
- The conditional goes **inside** AnimatePresence, not outside

---

## 2. Large List Performance (50+ items)

**Symptom**: Animating 50-100+ items causes severe slowdown or browser freeze.

**Solution**: Use virtualization — only render visible items:

```bash
pnpm add react-window  # or react-virtuoso, @tanstack/react-virtual
```

```tsx
import { FixedSizeList } from 'react-window'
import { motion } from 'motion/react'

<FixedSizeList height={600} itemCount={1000} itemSize={50}>
  {({ index, style }) => (
    <motion.div style={style} layout>
      Item {index}
    </motion.div>
  )}
</FixedSizeList>
```

---

## 3. Tailwind Transition Conflicts

**Symptom**: Animations stutter, jump, or don't play correctly.

**Cause**: Tailwind's CSS `transition-*` classes compete with Motion's inline style animations.

**Solution**: Remove all Tailwind transition classes from Motion-animated elements:
```tsx
// WRONG
<motion.div className="transition-all duration-300" animate={{ x: 100 }} />

// CORRECT
<motion.div animate={{ x: 100 }} />
```

---

## 4. Next.js "use client" Missing

**Symptom**: Build fails with "motion is not defined" or SSR hydration errors.

**Cause**: Motion requires browser APIs and must run as a client component in Next.js App Router.

**Solution**: Either mark the component file with `"use client"`:
```tsx
"use client"
import { motion } from "motion/react"
```

Or create a reusable wrapper:
```tsx
// src/components/motion-client.tsx
"use client"
import * as motion from "motion/react-client"
export { motion }
```

---

## 5. Scrollable Container Layout Animations

**Symptom**: Incomplete or broken transitions when removing items from a scrolled container.

**Solution**: Add `layoutScroll` to the scrollable parent:
```tsx
<motion.div layoutScroll className="overflow-auto">
  {items.map(item => (
    <motion.div key={item.id} layout>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

---

## 6. Fixed-Position Layout Animations

**Symptom**: Layout animations in fixed-position elements have incorrect positioning.

**Solution**: Add `layoutRoot` to the fixed container:
```tsx
<motion.div layoutRoot className="fixed top-0 left-0">
  <motion.div layout>Content</motion.div>
</motion.div>
```

---

## 7. layoutId + AnimatePresence Unmounting

**Symptom**: Elements with `layoutId` inside AnimatePresence fail to unmount properly.

**Solution**: Wrap in `LayoutGroup`:
```tsx
import { LayoutGroup } from "motion/react"

<LayoutGroup>
  <AnimatePresence>
    {items.map(item => (
      <motion.div key={item.id} layoutId={item.id}>
        {item.content}
      </motion.div>
    ))}
  </AnimatePresence>
</LayoutGroup>
```

---

## 8. Reorder Component in Next.js

**Symptom**: Reorder component doesn't work with Next.js routing; random stuck states.

**Status**: Known issue (GitHub #2183, #2101). No fix available.

**Workaround**: Implement drag-to-reorder manually using `drag` + `onDragEnd` instead of the Reorder component when using Next.js.

---

## 9. Cloudflare Workers Build Errors (RESOLVED)

**Status**: Fixed as of December 2024 (GitHub #2918).

Motion now works directly with Cloudflare Workers and Wrangler. No workaround needed. Both `motion` and `framer-motion` packages work correctly.

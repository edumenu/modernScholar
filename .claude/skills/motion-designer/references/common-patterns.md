# Motion — Common Patterns

## 1. Modal Dialog

```tsx
import { AnimatePresence, motion } from "motion/react"

function Modal({ isOpen, onClose, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          {/* Dialog */}
          <motion.div
            key="dialog"
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="pointer-events-auto bg-white rounded-xl p-6 shadow-2xl max-w-md w-full">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
```

## 2. Accordion

```tsx
import { AnimatePresence, motion } from "motion/react"

function Accordion({ items }) {
  const [openId, setOpenId] = useState(null)

  return (
    <div>
      {items.map(item => (
        <div key={item.id}>
          <button onClick={() => setOpenId(openId === item.id ? null : item.id)}>
            {item.title}
          </button>
          <AnimatePresence>
            {openId === item.id && (
              <motion.div
                key={item.id}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ overflow: "hidden" }}
              >
                <div className="p-4">{item.content}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}
```

## 3. Drag Carousel

```tsx
import { motion, useMotionValue, useTransform } from "motion/react"

function Carousel({ items, itemWidth = 300, gap = 16 }) {
  const x = useMotionValue(0)
  const totalWidth = items.length * (itemWidth + gap)

  return (
    <div className="overflow-hidden">
      <motion.div
        className="flex"
        style={{ x, gap }}
        drag="x"
        dragConstraints={{ left: -(totalWidth - window.innerWidth), right: 0 }}
        dragElastic={0.1}
        dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
      >
        {items.map((item, i) => (
          <motion.div
            key={i}
            className="shrink-0"
            style={{ width: itemWidth }}
          >
            {item}
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
```

## 4. Scroll Reveal (Staggered)

```tsx
import { motion } from "motion/react"

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } }
}

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 }
}

function StaggeredList({ items }) {
  return (
    <motion.ul
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
    >
      {items.map((text, i) => (
        <motion.li key={i} variants={item}>
          {text}
        </motion.li>
      ))}
    </motion.ul>
  )
}
```

## 5. Parallax Hero

```tsx
import { motion, useScroll, useTransform } from "motion/react"
import { useRef } from "react"

function ParallaxHero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  })

  const bgY = useTransform(scrollYProgress, [0, 1], [0, -200])
  const textY = useTransform(scrollYProgress, [0, 1], [0, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <div ref={ref} className="relative h-screen overflow-hidden">
      {/* Background layer — moves slower */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          y: bgY,
          backgroundImage: "url('/hero-bg.jpg')"
        }}
      />
      {/* Text layer — moves faster */}
      <motion.div
        className="relative z-10 flex items-center justify-center h-full"
        style={{ y: textY, opacity }}
      >
        <h1 className="text-6xl font-bold text-white">
          Parallax Hero
        </h1>
      </motion.div>
    </div>
  )
}
```

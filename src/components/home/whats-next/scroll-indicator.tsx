"use client"

import { useState } from "react"
import {
  type MotionValue,
  motion,
  AnimatePresence,
  useSpring,
  useTransform,
  useMotionValueEvent,
} from "motion/react"
import { panels } from "./types"

interface ScrollIndicatorProps {
  scrollYProgress: MotionValue<number>
  prefersReduced?: boolean
}

export function ScrollIndicator({
  scrollYProgress,
  prefersReduced,
}: ScrollIndicatorProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  const scaleY = useTransform(smoothProgress, [0, 1], [0, 1])

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const index = Math.round(latest * (panels.length - 1))
    setActiveIndex(index)
  })

  const total = String(panels.length).padStart(2, "0")

  if (prefersReduced) {
    return (
      <div className="absolute bottom-8 right-8 z-10 flex items-end gap-3 md:bottom-8 md:right-8">
        <div className="flex flex-col items-center font-heading text-white">
          <span className="text-lg leading-none">
            {String(activeIndex + 1).padStart(2, "0")}
          </span>
          <span className="my-1 h-px w-4 bg-white/40" />
          <span className="text-xs leading-none text-white/50">{total}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="absolute bottom-6 right-6 z-10 flex items-end gap-3 md:bottom-8 md:right-8">
      {/* Vertical progress line */}
      <div className="relative h-12 w-px bg-white/20 overflow-hidden">
        <motion.div
          className="h-full w-full origin-bottom bg-white/80"
          style={{ scaleY }}
        />
      </div>

      {/* Number display */}
      <div className="flex flex-col items-center font-heading text-white">
        <div className="relative h-6 w-8 overflow-hidden">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={activeIndex}
              className="absolute inset-0 flex items-center justify-center text-lg leading-none"
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              {String(activeIndex + 1).padStart(2, "0")}
            </motion.span>
          </AnimatePresence>
        </div>
        <span className="my-1 h-px w-4 bg-white/40" />
        <span className="text-xs leading-none text-white/50">{total}</span>
      </div>
    </div>
  )
}

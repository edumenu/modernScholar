"use client"

import { useState, type RefObject } from "react"
import {
  motion,
  useScroll,
  useMotionValueEvent,
} from "motion/react"

interface Section {
  id: string
  title: string
}

interface ReadingProgressProps {
  articleRef: RefObject<HTMLElement | null>
  sections: Section[]
}

export function ReadingProgress({
  articleRef,
  sections,
}: ReadingProgressProps) {
  const [percentage, setPercentage] = useState(0)
  const [activeIndex, setActiveIndex] = useState(-1)

  const { scrollYProgress } = useScroll({
    target: articleRef,
    offset: ["start start", "end end"],
  })

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setPercentage(Math.round(latest * 100))

    // Determine active section based on element positions
    const viewportCenter = window.innerHeight / 2
    let currentIndex = -1
    for (let i = sections.length - 1; i >= 0; i--) {
      const el = document.getElementById(sections[i].id)
      if (el) {
        const rect = el.getBoundingClientRect()
        if (rect.top <= viewportCenter) {
          currentIndex = i
          break
        }
      }
    }
    setActiveIndex(currentIndex)
  })

  return (
    <div className="overflow-hidden rounded-2xl flex flex-col gap-4 border border-white/40 bg-white/25 p-4 shadow-md backdrop-blur-2xl dark:border-white/10 dark:bg-white/10">
      {/* Section breadcrumb dots */}
      <div className="flex flex-col gap-2.5">
        {sections.map((section, i) => {
          const isActive = i === activeIndex
          return (
            <button
              key={section.id}
              className="flex items-center gap-2.5 text-left"
            >
              <motion.div
                className="shrink-0 rounded-full bg-primary"
                animate={{
                  width: isActive ? 10 : 6,
                  height: isActive ? 10 : 6,
                  opacity: isActive ? 1 : 0.3,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              />
              <span
                className={`truncate text-xs transition-colors duration-200 ${
                  isActive
                    ? "font-medium text-on-surface"
                    : "text-on-surface-variant"
                }`}
              >
                {section.title}
              </span>
            </button>
          )
        })}
      </div>

      {/* Percentage */}
      <div className="mt-4 flex items-center justify-between">
        <span className="font-heading text-xs tracking-wider text-on-surface-variant">
          Reading Progress
        </span>
        <motion.span
          key={Math.floor(percentage / 10)}
          initial={{ scale: 1.3 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="font-heading text-sm font-medium text-on-surface"
        >
          {percentage}%
        </motion.span>
      </div>
    </div>
  )
}

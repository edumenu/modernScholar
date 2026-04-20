"use client"

import { useState, type RefObject } from "react"
import {
  motion,
  useScroll,
  useMotionValueEvent,
  useSpring,
  useTransform,
} from "motion/react"
import { useLenis } from "lenis/react"

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
  const [isComplete, setIsComplete] = useState(false)
  const lenis = useLenis()

  const { scrollYProgress } = useScroll({
    target: articleRef,
    offset: ["start start", "end end"],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  const scaleX = useTransform(smoothProgress, [0, 1], [0, 1])

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const pct = Math.round(latest * 100)
    setPercentage(pct)

    if (pct >= 100 && !isComplete) {
      setIsComplete(true)
    }

    // Active section detection using reading-zone offset (30% from top)
    const readingZone = window.innerHeight * 0.3
    let currentIndex = -1
    for (let i = sections.length - 1; i >= 0; i--) {
      const el = document.getElementById(sections[i].id)
      if (el) {
        const rect = el.getBoundingClientRect()
        if (rect.top <= readingZone) {
          currentIndex = i
          break
        }
      }
    }
    setActiveIndex(currentIndex)
  })

  const handleSectionClick = (sectionId: string) => {
    const el = document.getElementById(sectionId)
    if (el && lenis) {
      lenis.scrollTo(el, { offset: -100 })
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl flex flex-col gap-4 border border-outline-variant/40 bg-surface-container-low p-4 shadow-md dark:bg-surface-container-low dark:border-outline-variant/20">
      {/* Section breadcrumb dots */}
      <div className="flex flex-col gap-2.5">
        {sections.map((section, i) => {
          const isActive = i === activeIndex
          return (
            <button
              key={section.id}
              onClick={() => handleSectionClick(section.id)}
              className="flex items-center gap-2.5 text-left cursor-pointer hover:opacity-80 transition-opacity"
            >
              <motion.div
                className={`shrink-0 rounded-full ${isComplete ? "bg-secondary" : "bg-primary"}`}
                animate={{
                  width: isActive ? 10 : 6,
                  height: isActive ? 10 : 6,
                  opacity: isComplete ? 1 : isActive ? 1 : 0.3,
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

      {/* Visual progress bar */}
      <div className="h-1 w-full overflow-hidden rounded-full bg-outline-variant/20">
        <motion.div
          className={`h-full origin-left rounded-full ${isComplete ? "bg-secondary" : "bg-primary"}`}
          style={{ scaleX }}
        />
      </div>

      {/* Percentage + completion label */}
      <div className="flex items-center justify-between">
        <span className="font-heading text-xs tracking-wider text-on-surface-variant">
          {isComplete ? "Article Complete" : "Reading Progress"}
        </span>
        <motion.span
          className={`font-heading text-sm font-medium tabular-nums ${isComplete ? "text-secondary" : "text-on-surface"}`}
          animate={isComplete ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {percentage}%
        </motion.span>
      </div>
    </div>
  )
}

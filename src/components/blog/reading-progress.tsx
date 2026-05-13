"use client"

import { useEffect, useMemo, useRef, useState, type RefObject } from "react"
import {
  motion,
  useScroll,
  useMotionValueEvent,
  useReducedMotion,
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
  const reduce = useReducedMotion()

  // ["start start", "end start"]: 100% fires when the article *bottom* hits
  // the viewport top — i.e. the user has actually scrolled past the
  // conclusion. The previous "end end" reached 100% as soon as the bottom
  // edge entered the viewport, which can be ~2 viewports too early on long
  // articles.
  const { scrollYProgress } = useScroll({
    target: articleRef,
    offset: ["start start", "end start"],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  const scaleX = useTransform(smoothProgress, [0, 1], [0, 1])

  // Resolve heading elements once per `sections` change instead of calling
  // getElementById for every heading on every scroll frame.
  const sectionElements = useMemo(() => {
    if (typeof document === "undefined") return [] as (HTMLElement | null)[]
    return sections.map((s) => document.getElementById(s.id))
    // sections is stable from the loader; re-resolve when it changes.
  }, [sections])

  // rAF-throttle the scroll handler so we don't run getBoundingClientRect
  // and React state updates on every scroll tick.
  const rafIdRef = useRef<number | null>(null)
  const latestProgressRef = useRef(0)

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    latestProgressRef.current = latest
    if (rafIdRef.current !== null) return
    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null
      const v = latestProgressRef.current
      const pct = Math.round(v * 100)
      setPercentage(pct)
      // Threshold avoids floating-point jitter near 100%.
      setIsComplete(pct >= 99)

      // Active-section detection using a 30%-from-top reading zone.
      const readingZone = window.innerHeight * 0.3
      let currentIndex = -1
      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const el = sectionElements[i]
        if (!el) continue
        const rect = el.getBoundingClientRect()
        if (rect.top <= readingZone) {
          currentIndex = i
          break
        }
      }
      setActiveIndex(currentIndex)
    })
  })

  useEffect(
    () => () => {
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current)
    },
    [],
  )

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
                transition={
                  reduce
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 300, damping: 25 }
                }
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
          {isComplete ? "Blog Complete" : "Reading Progress"}
        </span>
        <motion.span
          className={`font-heading text-sm font-medium tabular-nums ${isComplete ? "text-secondary" : "text-on-surface"}`}
          animate={isComplete && !reduce ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {percentage}%
        </motion.span>
      </div>
    </div>
  )
}

"use client"

import { useRef, useCallback } from "react"
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react"
import { panels } from "./types"
import { SlideContent } from "./slide-content"

interface WhatsNextProps {
  enableColorTransition?: boolean
}

export function WhatsNext({ enableColorTransition = true }: WhatsNextProps) {
  const prefersReduced = useReducedMotion()
  const targetRef = useRef<HTMLElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  })

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", `${-(panels.length - 1) * 100}%`],
  )

  const breakpoints = panels.map((_, i) => i / (panels.length - 1))
  const colors = panels.map((p) => p.bgColor)
  const backgroundColor = useTransform(scrollYProgress, breakpoints, colors)

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return
      if (!targetRef.current) return

      const rect = targetRef.current.getBoundingClientRect()
      const sectionTop = window.scrollY + rect.top
      const sectionHeight = rect.height

      const currentProgress = scrollYProgress.get()
      const currentIndex = Math.round(currentProgress * (panels.length - 1))

      let nextIndex = currentIndex
      if (e.key === "ArrowRight") {
        nextIndex = Math.min(currentIndex + 1, panels.length - 1)
      } else {
        nextIndex = Math.max(currentIndex - 1, 0)
      }

      if (nextIndex !== currentIndex) {
        const targetY =
          sectionTop +
          (nextIndex / (panels.length - 1)) *
            (sectionHeight - window.innerHeight)
        window.scrollTo({ top: targetY, behavior: "smooth" })
      }
    },
    [scrollYProgress],
  )

  // Reduced motion fallback
  if (prefersReduced) {
    return (
      <section
        aria-label="What's Next"
        className="relative left-1/2 w-dvw -translate-x-1/2"
      >
        {panels.map((panel) => (
          <div
            key={panel.id}
            className="px-6 py-20 md:px-8"
            style={{ backgroundColor: panel.bgColor }}
          >
            <div className="mx-auto w-full max-w-7xl">
              <SlideContent panel={panel} />
            </div>
          </div>
        ))}
      </section>
    )
  }

  // Horizontal scroll
  return (
    <section
      ref={targetRef}
      aria-label="What's Next"
      aria-roledescription="carousel"
      className="relative left-1/2 w-dvw -translate-x-1/2"
      style={{ height: `${panels.length * 80}vh` }}
    >
      <motion.div
        ref={stickyRef}
        className="sticky top-0 h-dvh overflow-hidden"
        style={{
          backgroundColor: enableColorTransition
            ? backgroundColor
            : panels[0].bgColor,
        }}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <motion.div className="flex h-full will-change-transform" style={{ x }}>
          {panels.map((panel, index) => (
            <div
              key={panel.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${panels.length}: ${panel.label}`}
              className="flex h-full min-w-screen items-center px-6 md:px-8"
            >
              <div className="mx-auto w-full max-w-7xl">
                <SlideContent panel={panel} />
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}

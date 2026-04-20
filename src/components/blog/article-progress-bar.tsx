"use client"

import { type RefObject } from "react"
import { motion, useScroll, useSpring, useTransform } from "motion/react"

interface ArticleProgressBarProps {
  articleRef: RefObject<HTMLElement | null>
}

export function ArticleProgressBar({ articleRef }: ArticleProgressBarProps) {
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

  return (
    <motion.div
      className="fixed left-0 right-0 top-0 z-50 h-0.5 origin-left bg-primary"
      style={{ scaleX }}
    />
  )
}

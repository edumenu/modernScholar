"use client"

import { useRef } from "react"
import { motion, useInView, type TargetAndTransition, type Transition } from "motion/react"
import { cn } from "@/lib/utils"

type AnimationVariant =
  | "fadeUp"
  | "fadeDown"
  | "fadeLeft"
  | "fadeRight"
  | "scaleIn"
  | "blurIn"
  | "slideUp"
  | "none"

interface AnimationPreset {
  initial: TargetAndTransition
  animate: TargetAndTransition
  transition: Transition
}

const presets: Record<AnimationVariant, AnimationPreset> = {
  fadeUp: {
    initial: { opacity: 0, y: 32 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  },
  fadeDown: {
    initial: { opacity: 0, y: -32 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  },
  fadeLeft: {
    initial: { opacity: 0, x: -40 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  },
  fadeRight: {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.92 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] },
  },
  blurIn: {
    initial: { opacity: 0, filter: "blur(8px)" },
    animate: { opacity: 1, filter: "blur(0px)" },
    transition: { duration: 0.7, ease: "easeOut" },
  },
  slideUp: {
    initial: { opacity: 0, y: 64 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
  none: {
    initial: {},
    animate: {},
    transition: { duration: 0 },
  },
}

interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  delay?: number
  variant?: AnimationVariant
  initial?: TargetAndTransition
  animate?: TargetAndTransition
  transition?: Transition
}

export function AnimatedSection({
  children,
  className,
  delay = 0,
  variant = "fadeUp",
  initial: customInitial,
  animate: customAnimate,
  transition: customTransition,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  const preset = presets[variant]

  const initialValues = customInitial ?? preset.initial
  const animateValues = customAnimate ?? preset.animate
  const transitionValues = customTransition
    ? { ...customTransition, ...(delay ? { delay } : {}) }
    : { ...preset.transition, delay }

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      initial={initialValues}
      animate={isInView ? animateValues : initialValues}
      transition={transitionValues}
    >
      {children}
    </motion.div>
  )
}

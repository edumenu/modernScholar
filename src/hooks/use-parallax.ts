"use client"

import { useRef } from "react"
import {
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
  type UseScrollOptions,
} from "motion/react"

export interface UseParallaxOptions {
  /** Vertical translate range in px, e.g. [-40, 40] */
  yRange?: [number, number]
  /** Scale range, e.g. [1, 1.05] */
  scaleRange?: [number, number]
  /** Opacity range, e.g. [0.6, 1] */
  opacityRange?: [number, number]
  /** Scroll offset pair for useScroll, e.g. ["start end", "end start"] */
  offset?: UseScrollOptions["offset"]
}

interface ParallaxStyle {
  y?: MotionValue<number>
  scale?: MotionValue<number>
  opacity?: MotionValue<number>
  willChange: string
}

export function useParallax({
  yRange,
  scaleRange,
  opacityRange,
  offset = ["start end", "end start"] as const,
}: UseParallaxOptions = {}) {
  const ref = useRef<HTMLDivElement>(null!)
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset,
  })

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : (yRange ?? [0, 0])
  )

  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [1, 1] : (scaleRange ?? [1, 1])
  )

  const opacity = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [1, 1] : (opacityRange ?? [1, 1])
  )

  const style: ParallaxStyle = { willChange: "transform" }

  if (yRange) style.y = y
  if (scaleRange) style.scale = scale
  if (opacityRange) style.opacity = opacity

  return { ref, style }
}

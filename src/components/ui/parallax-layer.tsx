"use client"

import { motion } from "motion/react"
import { useParallax, type UseParallaxOptions } from "@/hooks/use-parallax"
import { cn } from "@/lib/utils"

interface ParallaxLayerProps extends UseParallaxOptions {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export function ParallaxLayer({
  children,
  className,
  style: styleProp,
  ...parallaxOptions
}: ParallaxLayerProps) {
  const { ref, style: parallaxStyle } = useParallax(parallaxOptions)

  return (
    <motion.div ref={ref} style={{ ...parallaxStyle, ...styleProp }} className={cn(className)}>
      {children}
    </motion.div>
  )
}

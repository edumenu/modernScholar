"use client"

import { useRef } from "react"
import { motion, useInView, useReducedMotion } from "motion/react"
import { Icon } from "@iconify/react"

export function PulsingIcon() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  const prefersReduced = useReducedMotion()

  return (
    <motion.div
      ref={ref}
      className="relative flex size-45 items-center justify-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : undefined}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Glow ring */}
      <motion.div
        className="absolute size-40 rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.65 0.12 31 / 0.35) 0%, transparent 70%)",
        }}
        animate={
          isInView && !prefersReduced
            ? {
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.55, 0.3],
              }
            : { scale: 1, opacity: 0.4 }
        }
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Icon container */}
      <motion.div
        className="relative z-10 flex size-40 items-center justify-center rounded-full bg-white/20 shadow-lg"
        animate={
          isInView && !prefersReduced
            ? {
                scale: [1, 1.08, 1],
              }
            : undefined
        }
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <Icon
          icon="solar:cup-star-bold-duotone"
          className="size-24 text-white"
        />
      </motion.div>
    </motion.div>
  );
}

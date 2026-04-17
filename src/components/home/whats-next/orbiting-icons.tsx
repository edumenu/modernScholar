"use client"

import { useRef } from "react"
import { motion, useInView, useReducedMotion } from "motion/react"
import { Icon } from "@iconify/react"

const orbitIcons = [
  { icon: "solar:square-academic-cap-bold-duotone", radius: 120, duration: 12, delay: 0 },
  { icon: "solar:book-bold-duotone", radius: 120, duration: 12, delay: -2.4 },
  { icon: "solar:cup-star-bold-duotone", radius: 120, duration: 12, delay: -4.8 },
  { icon: "solar:dollar-minimalistic-bold-duotone", radius: 120, duration: 12, delay: -7.2 },
  { icon: "solar:pen-new-round-bold-duotone", radius: 120, duration: 12, delay: -9.6 },
]

export function OrbitingIcons() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  const prefersReduced = useReducedMotion()

  return (
    <motion.div
      ref={ref}
      className="relative flex size-85 items-center justify-center md:size-105"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : undefined}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Central icon */}
      <div className="relative z-10 flex size-16 items-center justify-center rounded-full bg-white/20 shadow-lg">
        <Icon icon="solar:magnifer-bold-duotone" className="size-8 text-white" />
      </div>

      {/* Orbit ring (decorative) */}
      <div className="absolute inset-5 rounded-full border border-white/15 md:inset-9.5" />

      {/* Orbiting icons */}
      {orbitIcons.map((item, i) => (
        <div
          key={i}
          className="absolute left-1/2 top-1/2"
          style={{
            width: 0,
            height: 0,
            animation: prefersReduced
              ? "none"
              : `orbit ${item.duration}s linear infinite`,
            animationDelay: `${item.delay}s`,
            ...(prefersReduced
              ? {
                  transform: `rotate(${i * 72}deg) translateX(${item.radius}px) rotate(-${i * 72}deg)`,
                }
              : {}),
          }}
        >
          <div
            className="flex size-20 -translate-x-[10%] -translate-y-1/2 items-center justify-center rounded-full bg-white/20 shadow-md"
            style={{
              animation: prefersReduced
                ? "none"
                : `counter-rotate ${item.duration}s linear infinite`,
              animationDelay: `${item.delay}s`,
            }}
          >
            <Icon icon={item.icon} className="size-14 text-white" />
          </div>
        </div>
      ))}

      {/* Inline keyframes for orbit */}
      <style>{`
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(90px); }
          to   { transform: rotate(360deg) translateX(90px); }
        }
        @keyframes counter-rotate {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(-360deg); }
        }
      `}</style>
    </motion.div>
  )
}

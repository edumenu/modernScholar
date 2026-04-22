"use client"

import { useEffect } from "react"
import Link from "next/link"
import { motion, useReducedMotion } from "motion/react"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"

const ease = [0.22, 1, 0.36, 1] as const

interface FloatingIcon {
  icon: string
  top?: string
  bottom?: string
  left?: string
  right?: string
  size: number
  duration: number
  y: number[]
  rotate: number[]
  delay: number
  hideMobile?: boolean
}

const floatingIcons: FloatingIcon[] = [
  { icon: "solar:book-2-line-duotone", top: "10%", left: "7%", size: 36, duration: 11, y: [-12, 10], rotate: [-4, 4], delay: 0 },
  { icon: "solar:pen-new-square-line-duotone", top: "16%", right: "9%", size: 28, duration: 13, y: [-10, 14], rotate: [-5, 3], delay: 0.15 },
  { icon: "solar:diploma-line-duotone", bottom: "16%", left: "10%", size: 44, duration: 10, y: [-14, 8], rotate: [-3, 6], delay: 0.3 },
  { icon: "solar:star-shine-line-duotone", bottom: "14%", right: "8%", size: 32, duration: 12, y: [-10, 12], rotate: [-6, 5], delay: 0.45 },
  { icon: "solar:graduation-cap-line-duotone", top: "50%", right: "5%", size: 40, duration: 9, y: [-16, 6], rotate: [-2, 6], delay: 0.6, hideMobile: true },
]

function FloatingElements() {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) return null

  return (
    <div aria-hidden="true" className="pointer-events-none select-none absolute inset-0 overflow-hidden">
      {floatingIcons.map((item, i) => (
        <motion.div
          key={i}
          className={cn("absolute text-on-surface", item.hideMobile && "hidden md:block")}
          style={{
            top: "top" in item ? item.top : undefined,
            bottom: "bottom" in item ? item.bottom : undefined,
            left: "left" in item ? item.left : undefined,
            right: "right" in item ? item.right : undefined,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.06 }}
          transition={{ duration: 1, delay: 0.8 + item.delay }}
        >
          <motion.div
            animate={{ y: item.y, rotate: item.rotate }}
            transition={{
              duration: item.duration,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
          >
            <Icon icon={item.icon} width={item.size} height={item.size} />
          </motion.div>
        </motion.div>
      ))}
    </div>
  )
}

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const prefersReducedMotion = useReducedMotion()
  const reduced = !!prefersReducedMotion

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="relative flex min-h-[calc(100vh-7rem)] flex-col items-center justify-center px-6 py-16 overflow-hidden">
      <FloatingElements />

      {/* Giant background text */}
      <motion.span
        aria-hidden="true"
        className="absolute font-heading text-[20vw] font-bold leading-none text-primary/20 sm:text-[16vw] lg:text-[12vw]"
        initial={reduced ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.1, ease }}
      >
        Oops
      </motion.span>

      {/* Foreground content */}
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Eyebrow */}
        <motion.p
          className="text-xs font-medium uppercase tracking-[0.2em] text-tertiary"
          initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease }}
        >
          Something went wrong
        </motion.p>

        {/* Decorative rule */}
        <motion.div
          className="mx-auto mt-6 h-px w-24 bg-secondary"
          initial={reduced ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease }}
          style={{ transformOrigin: "left" }}
        />

        {/* Headline */}
        <motion.h1
          className="mt-6 font-heading text-2xl font-medium tracking-tight text-on-surface md:text-3xl"
          initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease }}
        >
          We hit an unexpected hiccup
        </motion.h1>

        {/* Body */}
        <motion.p
          className="mx-auto mt-3 max-w-md text-base text-on-surface-variant"
          initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease }}
        >
          This is on us, not you. The page encountered an error it couldn&apos;t
          recover from. Try again, or head back to familiar ground.
        </motion.p>

        {/* Actions */}
        <motion.div
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row"
          initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6, ease }}
        >
          <button
            onClick={reset}
            className="group/button relative overflow-hidden inline-flex shrink-0 items-center justify-center rounded-full border border-transparent bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-neu-primary transition-all hover:text-white cursor-pointer outline-none select-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 active:translate-y-px"
          >
            <span className="relative z-2 inline-flex items-center gap-2">
              <Icon icon="solar:refresh-linear" width={16} height={16} />
              Try Again
            </span>
          </button>

          <Link
            href="/"
            className="group/button relative overflow-hidden inline-flex shrink-0 items-center justify-center rounded-full border-2 border-border bg-input/30 px-5 py-2.5 text-sm font-medium text-on-surface shadow-neu-outline transition-all hover:text-primary cursor-pointer outline-none select-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 active:translate-y-px"
          >
            <span className="relative z-2 inline-flex items-center gap-2">
              Go Home
            </span>
          </Link>
        </motion.div>
      </div>
    </main>
  )
}

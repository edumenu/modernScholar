"use client"

import { motion, useReducedMotion } from "motion/react"
import { Icon } from "@iconify/react"
import { ButtonLink } from "@/components/ui/button/button-link"

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
  { icon: "solar:book-2-line-duotone", top: "8%", left: "6%", size: 40, duration: 10, y: [-16, 10], rotate: [-4, 4], delay: 0 },
  { icon: "solar:pen-new-square-line-duotone", top: "14%", right: "10%", size: 32, duration: 12, y: [-10, 14], rotate: [-6, 3], delay: 0.15 },
  { icon: "solar:diploma-line-duotone", bottom: "18%", left: "8%", size: 48, duration: 9, y: [-12, 8], rotate: [-3, 6], delay: 0.3 },
  { icon: "solar:magnifer-line-duotone", bottom: "12%", right: "7%", size: 36, duration: 11, y: [-14, 12], rotate: [-5, 5], delay: 0.45 },
  { icon: "solar:star-shine-line-duotone", top: "40%", left: "3%", size: 28, duration: 14, y: [-10, 16], rotate: [-6, 2], delay: 0.6 },
  { icon: "solar:document-text-line-duotone", top: "35%", right: "4%", size: 44, duration: 8, y: [-16, 6], rotate: [-2, 6], delay: 0.75 },
  { icon: "solar:bookmark-line-duotone", top: "65%", left: "12%", size: 20, duration: 13, y: [-8, 14], rotate: [-4, 4], delay: 0.9, hideMobile: true },
  { icon: "solar:graduation-cap-line-duotone", top: "60%", right: "14%", size: 56, duration: 10, y: [-12, 10], rotate: [-3, 5], delay: 1.05, hideMobile: true },
]

function FloatingElements() {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) return null

  return (
    <div aria-hidden="true" className="pointer-events-none select-none absolute inset-0 overflow-hidden">
      {floatingIcons.map((item, i) => (
        <motion.div
          key={i}
          className={`absolute text-on-surface ${item.hideMobile ? "hidden md:block" : ""}`}
          style={{
            top: "top" in item ? item.top : undefined,
            bottom: "bottom" in item ? item.bottom : undefined,
            left: "left" in item ? item.left : undefined,
            right: "right" in item ? item.right : undefined,
            opacity: 0,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.06 }}
          transition={{ duration: 1.2, delay: 1.2 + item.delay }}
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

function ZeroRing({ reduced }: { reduced: boolean }) {
  if (reduced) {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 62 100"
        fill="none"
        style={{ fontSize: "inherit" }}
        width="0.62em"
        height="1em"
        className="inline-block align-baseline"
      >
        <ellipse
          cx="31"
          cy="50"
          rx="27"
          ry="46"
          stroke="currentColor"
          strokeWidth="4.5"
          fill="none"
          pathLength={1}
        />
      </svg>
    )
  }

  return (
    <motion.svg
      aria-hidden="true"
      viewBox="0 0 62 100"
      fill="none"
      style={{ fontSize: "inherit" }}
      width="0.62em"
      height="1em"
      className="inline-block align-baseline"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.2, ease }}
    >
      <motion.ellipse
        cx="31"
        cy="50"
        rx="27"
        ry="46"
        stroke="currentColor"
        strokeWidth="4.5"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.9, delay: 0.2, ease }}
      />
      <motion.ellipse
        cx="31"
        cy="50"
        rx="27"
        ry="46"
        stroke="currentColor"
        strokeWidth="4.5"
        fill="none"
        pathLength={1}
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "center" }}
      />
    </motion.svg>
  )
}

export function NotFoundClient() {
  const prefersReducedMotion = useReducedMotion()
  const reduced = !!prefersReducedMotion

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-6 py-16 overflow-hidden">
      <FloatingElements />

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Eyebrow */}
        <motion.p
          className="text-xs font-medium uppercase tracking-[0.2em] text-tertiary"
          initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0, ease }}
        >
          Error 404
        </motion.p>

        {/* Giant 404 */}
        <div className="mt-4 flex items-baseline justify-center text-[25vw] font-heading font-bold leading-none text-primary sm:text-[22vw] lg:text-[18vw]">
          <motion.span
            initial={reduced ? { opacity: 1, x: 0 } : { opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease }}
          >
            4
          </motion.span>

          <ZeroRing reduced={reduced} />

          <motion.span
            initial={reduced ? { opacity: 1, x: 0 } : { opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease }}
          >
            4
          </motion.span>
        </div>

        {/* Decorative rule */}
        <motion.div
          className="mx-auto mt-8 h-px w-24 bg-secondary"
          initial={reduced ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5, ease }}
          style={{ transformOrigin: "left" }}
        />

        {/* Headline */}
        <motion.h1
          className="mt-6 font-heading text-2xl font-medium tracking-tight text-on-surface md:text-3xl"
          initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55, ease }}
        >
          The page you sought has turned the page.
        </motion.h1>

        {/* Body */}
        <motion.p
          className="mx-auto mt-3 max-w-md text-base text-on-surface-variant"
          initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65, ease }}
        >
          It seems this chapter is missing from our archive. Perhaps you mistyped
          the address, or this page has been moved to a new shelf entirely.
        </motion.p>

        {/* Navigation links */}
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <motion.div
            initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.75, ease }}
          >
            <ButtonLink href="/" variant="default" size="default">
              Return Home
            </ButtonLink>
          </motion.div>

          <motion.div
            initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.83, ease }}
          >
            <ButtonLink href="/scholarships" variant="outline" size="default">
              Browse Scholarships
            </ButtonLink>
          </motion.div>

          <motion.div
            initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.91, ease }}
          >
            <ButtonLink href="/blog" variant="link" size="default">
              Read the Blog
              <Icon icon="solar:arrow-right-linear" data-icon="inline-end" />
            </ButtonLink>
          </motion.div>
        </div>
      </div>
    </main>
  )
}

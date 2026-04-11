"use client"

import * as React from "react"
import { useCallback, useRef, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"
import { Icon } from "@iconify/react"

/* ─── Number Link with Ink-Spread hover ─── */

type InkSpreadLinkProps = {
  isActive?: boolean
} & React.ComponentProps<"a">

function PaginationLinkInkSpread({
  className,
  isActive,
  children,
  ...props
}: InkSpreadLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null)
  const [ink, setInk] = useState<{ x: number; y: number; key: number } | null>(null)

  const handleEnter = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (isActive || !ref.current) return
      const rect = ref.current.getBoundingClientRect()
      setInk({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        key: Date.now(),
      })
    },
    [isActive],
  )

  const handleLeave = useCallback(() => {
    setInk(null)
  }, [])

  return (
    <a
      ref={ref}
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      data-cursor="fade"
      className={cn(
        "relative inline-flex size-11 items-center justify-center rounded-full text-sm font-medium cursor-pointer select-none outline-none overflow-hidden",
        isActive
          ? "border-2 border-border bg-input/30 shadow-neu-outline text-foreground"
          : "text-surface-tint hover:text-primary-400",
        className,
      )}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      {...props}
    >
      <span className="relative z-2">{children}</span>

      {/* Ink-spread circle from cursor position */}
      {!isActive && (
        <AnimatePresence>
          {ink && (
            <motion.span
              key={ink.key}
              className="absolute rounded-full pointer-events-none z-1"
              style={{
                width: 88,
                height: 88,
                left: ink.x,
                top: ink.y,
                x: "-50%",
                y: "-50%",
                backgroundColor: "var(--primary-100)",
              }}
              initial={{ scale: 0, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: "circOut" }}
            />
          )}
        </AnimatePresence>
      )}
    </a>
  )
}

/* ─── Previous with Arrow Nudge ─── */

function PaginationPreviousInkSpread({
  className,
  text = "Previous",
  ...props
}: React.ComponentProps<"a"> & { text?: string }) {
  const [hovered, setHovered] = useState(false)

  return (
    <a
      aria-label="Go to previous page"
      data-slot="pagination-link"
      data-cursor="fade"
      className={cn(
        "relative inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 pl-4 text-sm font-medium cursor-pointer select-none outline-none text-surface-tint hover:text-primary-400",
        className,
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...props}
    >
      <motion.span
        className="inline-flex"
        animate={{ x: hovered ? -4 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        <Icon icon="tabler:chevron-left" className="size-4" />
      </motion.span>
      <span className="hidden sm:block">{text}</span>
    </a>
  )
}

/* ─── Next with Arrow Nudge ─── */

function PaginationNextInkSpread({
  className,
  text = "Next",
  ...props
}: React.ComponentProps<"a"> & { text?: string }) {
  const [hovered, setHovered] = useState(false)

  return (
    <a
      aria-label="Go to next page"
      data-slot="pagination-link"
      data-cursor="fade"
      className={cn(
        "relative inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 pr-4 text-sm font-medium cursor-pointer select-none outline-none text-surface-tint hover:text-primary-400",
        className,
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...props}
    >
      <span className="hidden sm:block">{text}</span>
      <motion.span
        className="inline-flex"
        animate={{ x: hovered ? 4 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        <Icon icon="tabler:chevron-right" className="size-4" />
      </motion.span>
    </a>
  )
}

/* ─── Ellipsis (unchanged) ─── */

function PaginationEllipsisInkSpread({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn(
        "flex size-9 items-center justify-center [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <Icon icon="tabler:dots" />
      <span className="sr-only">More pages</span>
    </span>
  )
}

export {
  PaginationLinkInkSpread,
  PaginationPreviousInkSpread,
  PaginationNextInkSpread,
  PaginationEllipsisInkSpread,
}

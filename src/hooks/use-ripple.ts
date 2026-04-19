"use client"

import { useCallback, useRef, useState, type RefObject } from "react"
import { motion, AnimatePresence } from "motion/react"

interface RippleState {
  x: number
  y: number
  size: number
  key: number
  isLeaving?: boolean
  snap?: boolean
}

interface UseRippleOptions {
  color: string
  disabled?: boolean
}

interface RippleHandlers {
  onMouseEnter: (e: React.MouseEvent) => void
  onMouseLeave: (e: React.MouseEvent) => void
  onMouseMove: (e: React.MouseEvent) => void
  onMouseDown: () => void
  onClick: () => void
}

export function useRipple<T extends HTMLElement>(
  ref: RefObject<T | null>,
  { color, disabled = false }: UseRippleOptions,
) {
  const [ripple, setRipple] = useState<RippleState | null>(null)
  const isHoveredRef = useRef(false)

  const createRipple = useCallback(
    (e: React.MouseEvent) => {
      if (isHoveredRef.current || !ref.current) return
      isHoveredRef.current = true

      const rect = ref.current.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height) * 2
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      setRipple({ x, y, size, key: Date.now() })
    },
    [ref],
  )

  const removeRipple = useCallback(
    (e: React.MouseEvent) => {
      isHoveredRef.current = false

      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      setRipple({ x, y, size, key: Date.now(), isLeaving: true })
    },
    [ref],
  )

  const snapRipple = useCallback(() => {
    setRipple((prev) => (prev ? { ...prev, snap: true } : null))
  }, [])

  const clearRipple = useCallback(() => {
    setRipple(null)
    isHoveredRef.current = false
  }, [])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current || !isHoveredRef.current || !ripple) return

      const rect = ref.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      setRipple((prev) => (prev ? { ...prev, x, y } : null))
    },
    [ref, ripple],
  )

  const handlers: RippleHandlers = {
    onMouseEnter: createRipple,
    onMouseLeave: removeRipple,
    onMouseMove: handleMouseMove,
    onMouseDown: snapRipple,
    onClick: clearRipple,
  }

  const rippleStyle = ripple
    ? {
        width: ripple.size,
        height: ripple.size,
        left: ripple.x,
        top: ripple.y,
        x: "-50%",
        y: "-50%",
        backgroundColor: color,
      }
    : undefined

  const rippleMotionProps = ripple
    ? {
        initial: { scale: 0, opacity: 0.6 } as const,
        animate: {
          scale: ripple.isLeaving ? 0 : 1,
          opacity: ripple.isLeaving ? 0 : 1,
          x: "-50%",
          y: "-50%",
        },
        exit: { scale: 0, opacity: 0 } as const,
        transition: {
          duration: ripple.snap ? 0 : 0.4,
          ease: "circOut" as const,
        },
      }
    : undefined

  return {
    ripple,
    rippleStyle,
    rippleMotionProps,
    handlers: disabled ? ({} as Partial<RippleHandlers>) : handlers,
    clearRipple,
    onAnimationComplete: () => {
      if (ripple?.isLeaving) setRipple(null)
    },
  }
}

export { AnimatePresence, motion }
export type { RippleState }

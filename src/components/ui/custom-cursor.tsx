"use client"

import { useEffect, useState, useCallback, useSyncExternalStore } from "react"
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "motion/react"
import { usePathname } from "next/navigation"
import { useSettingsStore } from "@/stores/settings-store"

type CursorVariant = "default" | "fade" | "text"

const SPRING_CONFIG = { stiffness: 500, damping: 28, mass: 0.5 }
const SNAP_CONFIG = { stiffness: 10000, damping: 500, mass: 0.1 }

const variantStyles = {
  default: { width: 10, height: 10, opacity: 1 },
  fade: { width: 10, height: 10, opacity: 0 },
  text: { width: 60, height: 30, opacity: 0.9 },
}

function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (callback) => {
      const mql = window.matchMedia(query)
      mql.addEventListener("change", callback)
      return () => mql.removeEventListener("change", callback)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

export function CustomCursor() {
  const cursorEnabled = useSettingsStore((s) => s.cursorEnabled)
  const hasPointer = useMediaQuery("(pointer: fine)")
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)")
  const pathname = usePathname()
  const [variant, setVariant] = useState<CursorVariant>("default")
  const [cursorText, setCursorText] = useState<string | null>(null)

  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  const springConfig = prefersReducedMotion ? SNAP_CONFIG : SPRING_CONFIG
  const x = useSpring(mouseX, springConfig)
  const y = useSpring(mouseY, springConfig)

  // Toggle native cursor hiding
  useEffect(() => {
    const active = cursorEnabled && hasPointer
    document.documentElement.classList.toggle("custom-cursor-active", active)
    return () => {
      document.documentElement.classList.remove("custom-cursor-active")
    }
  }, [cursorEnabled, hasPointer, pathname])

  // Mouse tracking
  useEffect(() => {
    if (!cursorEnabled || !hasPointer) return

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [cursorEnabled, hasPointer, mouseX, mouseY])

  // Hover detection via event delegation
  const handleMouseOver = useCallback((e: MouseEvent) => {
    const target = (e.target as HTMLElement).closest?.(
      "[data-cursor]",
    ) as HTMLElement | null
    if (target) {
      const cursorType = target.dataset.cursor as CursorVariant
      setVariant(cursorType || "default")
      setCursorText(target.dataset.cursorText || null)
    } else {
      setVariant("default")
      setCursorText(null)
    }
  }, [])

  const handleMouseOut = useCallback((e: MouseEvent) => {
    const target = (e.target as HTMLElement).closest?.(
      "[data-cursor]",
    ) as HTMLElement | null
    if (!target) return

    const related = e.relatedTarget as HTMLElement | null
    if (related && target.contains(related)) return

    setVariant("default")
    setCursorText(null)
  }, [])

  useEffect(() => {
    if (!cursorEnabled || !hasPointer) return

    document.addEventListener("mouseover", handleMouseOver)
    document.addEventListener("mouseout", handleMouseOut)
    return () => {
      document.removeEventListener("mouseover", handleMouseOver)
      document.removeEventListener("mouseout", handleMouseOut)
    }
  }, [cursorEnabled, hasPointer, handleMouseOver, handleMouseOut])

  const isActive = cursorEnabled && hasPointer

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-9999 flex items-center justify-center rounded-full"
      style={{
        x,
        y,
        translateX: "-50%",
        translateY: "-50%",
        backgroundColor: "var(--primary-400)",
        boxShadow:
          "0 0 0 1px rgba(255,255,255,0.15), 0 2px 8px rgba(0,0,0,0.15)",
        display: isActive ? "flex" : "none",
      }}
      animate={variantStyles[variant]}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <AnimatePresence>
        {variant === "text" && cursorText && (
          <motion.span
            key={cursorText}
            className="select-none text-xs font-medium text-white"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.15 }}
          >
            {cursorText}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

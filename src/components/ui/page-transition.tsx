"use client"

import { usePathname } from "next/navigation"
import { motion, useReducedMotion } from "motion/react"

// Opacity-only transition: avoids reflowing the page tree (no `y` translate)
// and so doesn't shift `position: sticky` children or break Lenis's scroll
// restoration. Reduced-motion users get an instant swap.
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const reduce = useReducedMotion()

  if (reduce) {
    return <>{children}</>
  }

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

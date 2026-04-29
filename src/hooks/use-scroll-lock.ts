"use client"

import { useEffect } from "react"
import { useLenis } from "lenis/react"

let lockCount = 0

/** Ref-counted Lenis scroll lock — multiple consumers can lock simultaneously. */
export function useScrollLock(active: boolean) {
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis || !active) return
    lockCount++
    lenis.stop()
    return () => {
      lockCount--
      if (lockCount === 0) lenis.start()
    }
  }, [active, lenis])
}

"use client"

import { useEffect, useRef } from "react"
import { useLenis } from "lenis/react"

let lockCount = 0

/**
 * Ref-counted Lenis scroll lock — multiple consumers can lock simultaneously.
 *
 * Lenis may be undefined on the very first render (mounted asynchronously by
 * the SmoothScrollProvider). The internal `acquired` ref tracks whether *this*
 * consumer successfully incremented the count, so a remount-after-late-mount
 * doesn't double-decrement and leak `lockCount` negative.
 */
export function useScrollLock(active: boolean) {
  const lenis = useLenis()
  const acquired = useRef(false)

  useEffect(() => {
    if (!active || !lenis) return
    lockCount++
    acquired.current = true
    lenis.stop()
    return () => {
      if (!acquired.current) return
      acquired.current = false
      lockCount--
      if (lockCount === 0) lenis.start()
    }
  }, [active, lenis])
}

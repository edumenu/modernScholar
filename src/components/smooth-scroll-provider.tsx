"use client"

import { ReactLenis, useLenis } from "lenis/react"
import { useEffect } from "react"

function LenisResizeObserver() {
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis) return
    const ro = new ResizeObserver(() => {
      lenis.resize()
    })
    ro.observe(document.body)
    return () => ro.disconnect()
  }, [lenis])

  return null
}

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.3,
        duration: 1.3,
        smoothWheel: true,
        touchMultiplier: 2,
      }}
    >
      <LenisResizeObserver />
      {children}
    </ReactLenis>
  );
}

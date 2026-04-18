"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { ReactLenis, useLenis } from "lenis/react"

function LenisRouteResizer() {
  const lenis = useLenis()
  const pathname = usePathname()

  useEffect(() => {
    if (!lenis) return
    lenis.resize()
  }, [lenis, pathname])

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
        lerp: 0.1,
        smoothWheel: true,
        touchMultiplier: 2,
        autoResize: true,
      }}
    >
      <LenisRouteResizer />
      {children}
    </ReactLenis>
  );
}

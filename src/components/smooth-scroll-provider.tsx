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

    // Secondary resize after a short delay for lazy/async content (e.g. Spline 3D scenes)
    const timer = setTimeout(() => lenis.resize(), 500)

    return () => clearTimeout(timer)
  }, [lenis, pathname])

  // Expose the Lenis instance on `window.__lenis` in non-production builds so
  // e2e tests can assert on `lenis.limit` / `lenis.dimensions.scrollHeight`
  // without walking the React fiber.
  useEffect(() => {
    if (!lenis || process.env.NODE_ENV === "production") return
    ;(window as Window & { __lenis?: typeof lenis }).__lenis = lenis
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
        lerp: 0.1,
        smoothWheel: true,
        touchMultiplier: 2,
        autoResize: true,
        anchors: true,
      }}
    >
      <LenisRouteResizer />
      {children}
    </ReactLenis>
  );
}

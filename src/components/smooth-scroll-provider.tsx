"use client"

import { ReactLenis } from "lenis/react"

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
        autoResize: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}

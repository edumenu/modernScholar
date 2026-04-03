"use client"

import { Suspense, lazy } from "react"
import { useRouter } from "next/navigation"
import { CTAButton } from "@/components/ui/button/cta-button"
import { AnimatedSection } from "./animated-section"

// const SplineScene = lazy(() =>
//   import("./spline-scene").then((m) => ({ default: m.SplineScene }))
// )

export function HeroSection() {
  const router = useRouter()

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative flex min-h-dvh flex-col items-center justify-end gap-8 pb-20 md:pb-28"
    >
      {/* Spline 3D Model — full viewport width, breaks out of PageShell */}
      <div className="pointer-events-none absolute inset-y-0 left-1/2 w-dvw -translate-x-1/2">
        <Suspense
          fallback={
            <div className="flex size-full items-center justify-center">
              <div className="size-12 animate-pulse rounded-full bg-surface-container" />
            </div>
          }
        >
          {/* <SplineScene className="size-full" /> */}
        </Suspense>
      </div>

      {/* Headline + CTA — overlaid at bottom */}
      <AnimatedSection className="relative z-10 flex flex-col items-center gap-8 px-6 text-center md:px-8">
        <h1
          id="hero-heading"
          className="max-w-4xl font-heading text-4xl font-bold leading-[1.15] tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] sm:text-5xl md:text-[3.5rem]"
        >
          Your scholarship journey starts here
        </h1>

        <CTAButton
          label="Explore"
          onClick={() => router.push("/scholarships")}
        />
      </AnimatedSection>
    </section>
  )
}

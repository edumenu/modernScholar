"use client"

import { Suspense, lazy } from "react"
import { useRouter } from "next/navigation"
import { CTAButton } from "@/components/ui/button/cta-button"
import { AnimatedSection } from "./animated-section"
import { AnimatedLines } from "./animated-lines"
import { PRETEXT_FONTS, PRETEXT_FALLBACK_FONTS } from "@/lib/pretext/fonts"
import Image from "next/image";
import { cn } from "@/lib/utils";

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

      {/* Company name*/}
      <AnimatedSection
        delay={0.5}
        className="relative z-10 flex flex-col items-center gap-6 px-6 text-center md:px-8"
      >
        <div className="flex justify-center items-center">
          <Image
            src="/iconWhite.png"
            alt="Modern Scholar"
            width={36}
            height={36}
            className={cn("size-14 object-contain hidden dark:block")}
          />
          <Image
            src="/iconBurgundy.png"
            alt="Modern Scholar"
            width={36}
            height={36}
            className={cn("size-14 object-contain block dark:hidden")}
          />
          <h4
            id="hero-heading"
            className="max-w-4xl font-heading text-xl font-medium leading-[1.15] tracking-tight text-primary dark:text-primary-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] sm:text-5xl md:text-[1.5rem]"
          >
            Modern Scholar
          </h4>
        </div>
      </AnimatedSection>
      {/* Headline — line-by-line reveal via pretext measurement */}
      <div className="relative z-10 flex w-full flex-col items-center gap-6 px-6 text-center md:px-8">
        <AnimatedLines
          text="Your scholarship journey starts here"
          font={PRETEXT_FONTS.heroHeadline}
          fallbackFont={PRETEXT_FALLBACK_FONTS.heroHeadline}
          lineHeight={48}
          as="h1"
          wrapperClassName="max-w-3xl mx-auto"
          className="font-heading text-4xl font-bold leading-none tracking-tight text-primary dark:text-primary-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] sm:text-5xl md:text-[3rem]"
          staggerDelay={0.12}
          initialDelay={0.1}
          variant="fadeUp"
        />
      </div>
      {/* Headline + CTA — overlaid at bottom */}
      <AnimatedSection
        delay={0.7}
        className="relative z-10 flex flex-col items-center gap-6 px-6 text-center md:px-8"
      >
        <CTAButton
          label="Explore"
          onClick={() => router.push("/scholarships")}
        />
      </AnimatedSection>
    </section>
  );
}

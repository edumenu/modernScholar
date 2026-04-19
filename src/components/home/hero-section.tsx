"use client"

import { Suspense, lazy, useState, useEffect, startTransition } from "react";
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { CTAButton } from "@/components/ui/button/cta-button"
import { AnimatedSection } from "../ui/animatedSection/animated-section";
import { AnimatedLines } from "@/components/ui/animatedLines/animated-lines";
import { PRETEXT_FONTS, PRETEXT_FALLBACK_FONTS } from "@/lib/pretext/fonts"
import { ParallaxLayer } from "@/components/ui/parallax-layer"

const SplineScene = lazy(() =>
  import("./spline-scene").then((m) => ({ default: m.SplineScene })),
);

const HERO_SPLINE_URL_LIGHT =
  "https://prod.spline.design/JY2cfwfllYa7FSve/scene.splinecode";
const HERO_SPLINE_URL_DARK =
  "https://prod.spline.design/X5b6ec1AfF1VBtXh/scene.splinecode";

export function HeroSection() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()

  useEffect(() => { startTransition(() => setMounted(true)) }, [])

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative flex min-h-dvh flex-col justify-between pt-20 pb-16 md:pb-28"
    >
      {/* Spline 3D Model — full viewport width, breaks out of PageShell */}
      <ParallaxLayer
        yRange={[0, 80]}
        className="absolute inset-y-0 left-1/2 w-dvw -translate-x-1/2"
      >
        {(() => {
          const fallback = (
            <div className="flex size-full items-center justify-center">
              <div className="size-12 animate-pulse rounded-full bg-surface-container" />
            </div>
          );
          const splineUrl =
            mounted && resolvedTheme === "dark"
              ? HERO_SPLINE_URL_DARK
              : HERO_SPLINE_URL_LIGHT;
          return (
            <Suspense fallback={fallback}>
              {mounted ? (
                <SplineScene
                  key={resolvedTheme}
                  scene={splineUrl}
                  className="size-full"
                />
              ) : (
                fallback
              )}
            </Suspense>
          );
        })()}
      </ParallaxLayer>

      {/* Mobile hero content — brand identity above the fold */}
      <div className="relative z-10 flex flex-col gap-4 md:hidden">
        <AnimatedSection delay={0.2} className="flex flex-col gap-2">
          <p className="font-heading text-lg font-medium tracking-tight text-primary dark:text-primary-100">
            Modern Scholar
          </p>
          <p className="max-w-xs text-sm text-on-surface-variant">
            Discover and secure scholarships through a curated, design-forward experience.
          </p>
        </AnimatedSection>
      </div>
      {/* Spacer for desktop — keeps bottom row pushed down */}
      <div className="hidden md:block" />

      {/* Bottom row — headline left, CTA right */}
      <ParallaxLayer
        yRange={[0, -30]}
        opacityRange={[1, 0.7]}
        className="relative z-10 flex w-full flex-col items-start gap-6 md:flex-row md:items-end md:justify-between"
      >
        <div className="flex flex-col">
          {/* Headline — bottom left */}
          {/* <AnimatedSection
            delay={0.4}
            className="w-full min-w-0 flex-col text-left md:flex-1"
          > */}
          <AnimatedLines
            text="Modern Scholar"
            font={PRETEXT_FONTS.heroHeadline}
            fallbackFont={PRETEXT_FALLBACK_FONTS.heroHeadline}
            lineHeight={32}
            as="span"
            mode="chars"
            className="font-heading text-xl font-medium leading-[1.15] tracking-tight text-primary dark:text-primary-100 md:text-[1.5rem]"
            staggerDelay={0.05}
            variant="revealUp"
            aria-hidden="true"
          />
          {/* </AnimatedSection> */}
          {/* Headline — bottom left */}
          <AnimatedSection
            delay={0.4}
            className="w-full min-w-0 flex-col text-left md:flex-1"
          >
            <h1 className="max-w-3xl font-heading text-3xl font-bold leading-tight tracking-tight text-primary dark:text-primary-100 sm:text-4xl md:text-5xl md:leading-none">
              Your scholarship journey starts here
            </h1>
          </AnimatedSection>
        </div>

        {/* CTA — bottom right */}
        <AnimatedSection delay={0.7} className="shrink-0">
          <CTAButton
            label="Explore"
            onClick={() => router.push("/scholarships")}
          />
        </AnimatedSection>
      </ParallaxLayer>
    </section>
  );
}

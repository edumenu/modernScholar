"use client"

import { Suspense, lazy } from "react";
import { useRouter } from "next/navigation"
import { CTAButton } from "@/components/ui/button/cta-button"
import { AnimatedSection } from "../ui/animatedSection/animated-section";
import { AnimatedLines } from "@/components/ui/animatedLines/animated-lines";
import { PRETEXT_FONTS, PRETEXT_FALLBACK_FONTS } from "@/lib/pretext/fonts"
import Image from "next/image";
import { cn } from "@/lib/utils";

const SplineScene = lazy(() =>
  import("./spline-scene").then((m) => ({ default: m.SplineScene })),
);

export function HeroSection() {
  const router = useRouter()

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative flex min-h-dvh flex-col justify-between pt-20 pb-16 md:pb-28"
    >
      {/* Spline 3D Model — full viewport width, breaks out of PageShell */}
      <div className="absolute inset-y-0 left-1/2 w-dvw -translate-x-1/2">
        <Suspense
          fallback={
            <div className="flex size-full items-center justify-center">
              <div className="size-12 animate-pulse rounded-full bg-surface-container" />
            </div>
          }
        >
          <SplineScene className="size-full" />
        </Suspense>
      </div>

      {/* Company name — top left */}
      <AnimatedSection delay={0.5} className="relative z-10">
        <div className="flex items-center">
          <Image
            src="/iconWhite.png"
            alt="Modern Scholar"
            width={36}
            height={36}
            className={cn("size-14 object-contain hidden dark:block")}
          />
          {/* <Image
            src="/iconBurgundy.png"
            alt="Modern Scholar"
            width={36}
            height={36}
            className={cn("size-14 object-contain block dark:hidden")}
          /> */}
          <h3
            id="hero-heading"
            className="font-heading text-xl font-medium leading-[1.15] tracking-tight text-primary dark:text-primary-100 md:text-[2rem]"
          >
            Modern Scholar
          </h3>
        </div>
      </AnimatedSection>

      {/* Bottom row — headline left, CTA right */}
      <div className="relative z-10 flex w-full flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
        {/* Headline — bottom left */}
        <div className="w-full min-w-0 flex-col text-left md:flex-1">
          <AnimatedLines
            text="Your scholarship journey starts here"
            font={PRETEXT_FONTS.heroHeadline}
            fallbackFont={PRETEXT_FALLBACK_FONTS.heroHeadline}
            lineHeight={48}
            as="h1"
            wrapperClassName="max-w-3xl"
            className="font-heading text-3xl font-bold leading-tight tracking-tight text-primary dark:text-primary-100 sm:text-4xl md:text-5xl md:leading-none"
            staggerDelay={0.12}
            initialDelay={0.1}
            variant="fadeUp"
          />
        </div>

        {/* CTA — bottom right */}
        <AnimatedSection delay={0.7} className="shrink-0">
          <CTAButton
            label="Explore"
            onClick={() => router.push("/scholarships")}
          />
        </AnimatedSection>
      </div>
    </section>
  );
}

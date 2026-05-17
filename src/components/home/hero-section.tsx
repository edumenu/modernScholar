"use client";

import { Suspense, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { CTAButton } from "@/components/ui/button/cta-button";
import { AnimatedSection } from "../ui/animatedSection/animated-section";
import { AnimatedLines } from "@/components/ui/animatedLines/animated-lines";
import { PRETEXT_FONTS, PRETEXT_FALLBACK_FONTS } from "@/lib/pretext/fonts";
import { ParallaxLayer } from "@/components/ui/parallax-layer";
import { splineScenes } from "@/config/spline-scenes";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { useHeroLoaderStore } from "@/stores/hero-loader-store";

// next/dynamic with ssr: false keeps the heavy Spline runtime out of the
// initial server bundle and out of the parent client chunk until it's
// actually rendered.
const SplineScene = dynamic(
  () => import("./spline-scene").then((m) => m.SplineScene),
  { ssr: false },
);

const SplineFallback = () => (
  <div className="flex size-full items-center justify-center">
    <div className="size-12 animate-pulse rounded-full bg-surface-container" />
  </div>
);

export function HeroSection() {
  const router = useRouter();
  const mounted = useHasMounted();
  const { resolvedTheme } = useTheme();
  const setSplineReady = useHeroLoaderStore((s) => s.setSplineReady);

  // Memoize the scene URL so a re-render with the same theme reuses the same
  // string identity — `<SplineScene>` swaps scenes via the runtime API
  // without tearing down the WebGL context. The previous `key={resolvedTheme}`
  // forced a full remount + fresh `.splinecode` download on every theme flip.
  //
  // Defensive: `resolvedTheme` is `undefined` until next-themes resolves on
  // the client. Treat anything that isn't an explicit "dark" as light so a
  // momentarily-undefined value can't fall through to a `heroDark()` call
  // gated by a falsy check elsewhere.
  const splineUrl = useMemo(
    () =>
      resolvedTheme === "dark"
        ? splineScenes.heroDark()
        : splineScenes.heroLight(),
    [resolvedTheme],
  );

  // Dev-only instrumentation for the [P0] home dark-landscape crash. Logs the
  // selected scene URL each time the resolved theme changes so we can confirm
  // which `.splinecode` is requested at 1024×768 dark.
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    if (!mounted) return;
    console.info("[HeroSection] spline scene", {
      resolvedTheme,
      splineUrl,
      viewport:
        typeof window !== "undefined"
          ? `${window.innerWidth}x${window.innerHeight}`
          : "ssr",
    });
  }, [mounted, resolvedTheme, splineUrl]);

  const splineNode = mounted ? (
    <Suspense fallback={<SplineFallback />}>
      <SplineScene
        scene={splineUrl}
        className="size-full"
        onLoad={() => setSplineReady(true)}
      />
    </Suspense>
  ) : (
    <SplineFallback />
  );

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
        {splineNode}
      </ParallaxLayer>

      {/* Spacer — keeps bottom row pushed down */}
      <div />

      {/* Bottom row — headline left, CTA right */}
      <ParallaxLayer
        yRange={[0, -30]}
        opacityRange={[1, 0.7]}
        className="relative z-10 flex w-full flex-col items-start gap-6 md:flex-row md:items-end md:justify-between"
      >
        <div className="flex flex-col">
          {/* Headline — top */}
          <AnimatedSection
            delay={0.4}
            className="w-full min-w-0 flex-col text-left md:flex-1"
          >
            <h1
              id="hero-heading"
              className="font-heading max-w-3xl text-xl leading-[1.05] tracking-tighter text-primary dark:text-primary-100"
            >
              Your scholarship journey starts here
            </h1>
          </AnimatedSection>
          {/* Headline — bottom. AnimatedLines splits the brand name into per-
              character spans for the reveal animation; that markup is unreadable
              to assistive tech, so we hide it from AT and expose a plain
              equivalent via sr-only. */}
          <span className="sr-only">Modern Scholar</span>
          <AnimatedLines
            text="Modern Scholar"
            font={PRETEXT_FONTS.heroHeadline}
            fallbackFont={PRETEXT_FALLBACK_FONTS.heroHeadline}
            lineHeight={62}
            as="span"
            mode="chars"
            className="font-heading max-w-4xl text-[clamp(2.5rem,6vw+1rem,5.5rem)] font-bold leading-[1.05] tracking-tighter text-primary dark:text-primary-100"
            staggerDelay={0.05}
            variant="revealUp"
            aria-hidden="true"
          />
        </div>

        {/* CTA — bottom right */}
        <AnimatedSection delay={0.45} className="shrink-0">
          <CTAButton
            label="Explore"
            onClick={() => router.push("/scholarships")}
          />
        </AnimatedSection>
      </ParallaxLayer>
    </section>
  );
}

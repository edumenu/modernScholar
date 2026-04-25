"use client";

import { Icon } from "@iconify/react";
import { AnimatedSection } from "../ui/animatedSection/animated-section";
import { ParallaxLayer } from "@/components/ui/parallax-layer";
import { ButtonLink } from "@/components/ui/button/button-link";
import { CoverflowCarousel } from "./coverflow-carousel";
import { scholarships as allScholarships } from "@/data/scholarships";

/** First 10 scholarships for the coverflow */
const carouselItems = allScholarships.slice(0, 10);

export function FeaturedScholarships() {
  return (
    <section
      aria-labelledby="featured-heading"
      className="flex h-dvh flex-col justify-center"
    >
      <ParallaxLayer yRange={[-20, 20]}>
        <AnimatedSection>
          {/* Header */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium uppercase tracking-widest text-tertiary">
                Curated for you
              </p>
              <h2
                id="featured-heading"
                className="font-heading text-3xl font-medium tracking-tight text-on-surface md:text-[3rem] md:leading-none"
              >
                Featured Scholarships
              </h2>
              <p className="mt-2 text-lg text-on-surface-variant md:text-xl">
                Discover a world of educational possibilities and scholarship
                programs.
              </p>
            </div>
            <ButtonLink href="/scholarships" variant="tertiary" animateIcon>
              View All Scholarships{" "}
              <Icon
                icon="solar:arrow-right-line-duotone"
                data-icon="inline-end"
              />
            </ButtonLink>
          </div>
        </AnimatedSection>
      </ParallaxLayer>

      {/* Coverflow Carousel — break out of PageShell to full viewport width */}
      <ParallaxLayer
        yRange={[30, -30]}
        className="relative left-1/2 mt-16 w-dvw -translate-x-1/2 py-16"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
        }}
      >
        <AnimatedSection delay={0.1}>
          <CoverflowCarousel scholarships={carouselItems} />
        </AnimatedSection>
      </ParallaxLayer>
    </section>
  );
}

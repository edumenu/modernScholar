"use client"

import { AnimatedSection } from "@/components/ui/animatedSection/animated-section"
import {AnimatedLines} from "@/components/ui/animatedLines/animated-lines"
import { PRETEXT_FONTS } from "@/lib/pretext/fonts";

export function ScholarshipHero() {
  return (
    <>
      <div className="flex flex-col gap-4 pt-2 pb-2">
        <AnimatedLines
          text="Explore Scholarships"
          font={PRETEXT_FONTS.heroHeadline}
          lineHeight={56}
          as="h1"
          mode="chars"
          className="font-heading text-7xl font-normal leading-none tracking-tight"
          staggerDelay={0.05}
          variant="fadeUp"
        />
        <AnimatedSection delay={0.4}>
          <p className="max-w-2xl text-lg text-on-surface-variant md:text-xl">
            Discover opportunities tailored to your goals. Filter by category
            and find the perfect scholarship for your academic journey.
          </p>
        </AnimatedSection>
      </div>
    </>
  );
}

"use client"

import { AnimatedSection } from "@/components/ui/animatedSection/animated-section"
import { AnimatedLines } from "@/components/ui/animatedLines/animated-lines"
import { PRETEXT_FONTS } from "@/lib/pretext/fonts"
import { useMediaQuery } from "@/hooks/use-media-query"

export function BlogHero() {
  const isMd = useMediaQuery("(min-width: 768px)");

  return (
    <div className="flex flex-col gap-4 pt-2 pb-2">
      <AnimatedLines
        text="Blogs"
        font={isMd ? PRETEXT_FONTS.heroHeadline : PRETEXT_FONTS.heroHeadlineSm}
        lineHeight={isMd ? 56 : 44}
        as="h1"
        mode="chars"
        className="font-heading text-4xl md:text-5xl lg:text-7xl font-normal leading-none tracking-tight"
        staggerDelay={0.05}
        variant="revealUp"
      />
      <AnimatedSection delay={0.4}>
        <p className="max-w-2xl text-base text-on-surface-variant md:text-lg lg:text-xl">
          Expert advice, success stories, and practical tips to help you
          navigate your scholarship journey and achieve your educational goals.
        </p>
      </AnimatedSection>
    </div>
  );
}

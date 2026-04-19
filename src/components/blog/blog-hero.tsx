import { AnimatedSection } from "@/components/ui/animatedSection/animated-section"
import { AnimatedLines } from "@/components/ui/animatedLines/animated-lines"
import { PRETEXT_FONTS } from "@/lib/pretext/fonts"

export function BlogHero() {
  return (
    <div className="flex flex-col gap-4 pt-2 pb-2">
      <AnimatedLines
        text="Blogs"
        font={PRETEXT_FONTS.heroHeadline}
        lineHeight={56}
        as="h1"
        mode="chars"
        className="font-heading text-[clamp(3rem,8vw+1rem,7rem)] font-normal leading-none tracking-tight"
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
  )
}

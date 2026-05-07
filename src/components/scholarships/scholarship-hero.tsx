import { AnimatedSection } from "@/components/ui/animatedSection/animated-section"
import { AnimatedLines } from "@/components/ui/animatedLines/animated-lines"
import { PRETEXT_FONTS } from "@/lib/pretext/fonts"
import {
  scholarships,
  isScholarshipActive,
  parseAwardAmount,
} from "@/data/scholarships"
import { SESSION_DATE } from "@/lib/session-date"
import { ScholarshipHeroStats } from "./scholarship-hero-stats"

const activeScholarships = scholarships.filter((s) =>
  isScholarshipActive(s, SESSION_DATE),
)

const totalScholarships = activeScholarships.length

const educationLevelsCount = new Set(
  activeScholarships.flatMap((s) => s.classification),
).size

const maxAmount = (() => {
  let max = 0
  for (const s of activeScholarships) {
    const val = parseAwardAmount(s.awardAmount)
    if (val > max) max = val
  }
  return max > 0 ? `$${max.toLocaleString()}` : null
})()

const closingSoon = (() => {
  const nowMs = SESSION_DATE.getTime()
  const horizonMs = nowMs + 30 * 24 * 60 * 60 * 1000
  return activeScholarships.filter((s) => {
    const deadlineMs = new Date(`${s.deadline}, ${s.deadlineYear}`).getTime()
    if (Number.isNaN(deadlineMs)) return false
    return deadlineMs >= nowMs && deadlineMs <= horizonMs
  }).length
})()

export function ScholarshipHero() {
  return (
    <>
      <div className="flex flex-col gap-4 pt-2 pb-2">
        <AnimatedLines
          text="Scholarships"
          font={PRETEXT_FONTS.heroHeadline}
          lineHeight={56}
          as="h1"
          mode="chars"
          className="font-heading text-4xl md:text-5xl lg:text-7xl font-bold leading-none tracking-tighter"
          staggerDelay={0.05}
          variant="revealUp"
        />
        <AnimatedSection delay={0.4}>
          <p className="max-w-2xl text-base text-on-surface-variant md:text-lg lg:text-xl">
            Browse our full catalog of scholarships. Filter by education level,
            eligibility, and award amount to find what fits your journey.
          </p>
        </AnimatedSection>
        <ScholarshipHeroStats
          totalScholarships={totalScholarships}
          educationLevelsCount={educationLevelsCount}
          maxAmount={maxAmount}
          closingSoon={closingSoon}
        />
      </div>
    </>
  )
}

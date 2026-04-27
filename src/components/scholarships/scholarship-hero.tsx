import { AnimatedSection } from "@/components/ui/animatedSection/animated-section"
import { AnimatedLines } from "@/components/ui/animatedLines/animated-lines"
import { PRETEXT_FONTS } from "@/lib/pretext/fonts"
import {
  scholarships,
  getCurrentSeason,
  getNextSeason,
  isScholarshipVisible,
  parseAwardAmount,
} from "@/data/scholarships"

const now = new Date()
const currentSeason = getCurrentSeason(now)
const nextSeason = getNextSeason(currentSeason)

const seasonalScholarships = scholarships.filter((s) =>
  isScholarshipVisible(s, currentSeason, now),
)

const totalScholarships = seasonalScholarships.length

const educationLevelsCount = new Set(
  seasonalScholarships.flatMap((s) => s.classification),
).size

const maxAmount = (() => {
  let max = 0
  for (const s of seasonalScholarships) {
    const val = parseAwardAmount(s.awardAmount)
    if (val > max) max = val
  }
  return max > 0 ? `$${max.toLocaleString()}` : null
})()

const deadlinesThisMonth = (() => {
  const currentMonth = now.getMonth()
  const monthNames = [
    "january", "february", "march", "april", "may", "june",
    "july", "august", "september", "october", "november", "december",
  ]
  return seasonalScholarships.filter((s) => {
    const deadlineMonth = s.deadline.toLowerCase().split(" ")[0]
    return deadlineMonth === monthNames[currentMonth]
  }).length
})()

const seasonLabel = currentSeason.charAt(0).toUpperCase() + currentSeason.slice(1)

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
            {totalScholarships > 0
              ? `Explore ${seasonLabel} scholarships you can apply to right now. Filter by education level to find opportunities that match your stage.`
              : `No scholarships available this ${seasonLabel.toLowerCase()}. New scholarships are coming in ${nextSeason}!`}
          </p>
        </AnimatedSection>
        {totalScholarships > 0 && (
          <AnimatedSection delay={0.1}>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-on-surface-variant md:text-sm">
              <span>{totalScholarships} scholarships</span>
              <span>{educationLevelsCount} education levels</span>
              {maxAmount && <span>Up to {maxAmount}</span>}
              {deadlinesThisMonth > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-tertiary/15 px-3 py-0.5 text-xs font-medium text-tertiary md:text-sm">
                  {deadlinesThisMonth} deadline
                  {deadlinesThisMonth !== 1 ? "s" : ""} this month
                </span>
              )}
            </div>
          </AnimatedSection>
        )}
      </div>
    </>
  )
}

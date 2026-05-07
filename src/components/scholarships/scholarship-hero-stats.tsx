"use client"

import {
  useQueryState,
  parseAsInteger,
  parseAsString,
  parseAsArrayOf,
} from "nuqs"
import { AnimatedSection } from "@/components/ui/animatedSection/animated-section"
import { AWARD_MIN, AWARD_MAX } from "@/data/scholarships"

interface ScholarshipHeroStatsProps {
  totalScholarships: number
  educationLevelsCount: number
  maxAmount: string | null
  closingSoon: number
}

export function ScholarshipHeroStats({
  totalScholarships,
  educationLevelsCount,
  maxAmount,
  closingSoon,
}: ScholarshipHeroStatsProps) {
  // Stats describe the unfiltered active corpus. Hide whenever a filter is
  // active so the numbers don't lie about what the user can see. Sort is
  // intentionally excluded — it reorders the corpus but doesn't shrink it.
  const [q] = useQueryState("q", parseAsString.withDefault(""))
  const [level] = useQueryState("level", parseAsString.withDefault("All"))
  const [tags] = useQueryState(
    "tags",
    parseAsArrayOf(parseAsString).withDefault([]),
  )
  const [min] = useQueryState("min", parseAsInteger.withDefault(AWARD_MIN))
  const [max] = useQueryState("max", parseAsInteger.withDefault(AWARD_MAX))
  const [month] = useQueryState("month", parseAsString.withDefault("all"))

  const anyFilterActive =
    q !== "" ||
    level !== "All" ||
    tags.length > 0 ||
    min !== AWARD_MIN ||
    max !== AWARD_MAX ||
    month !== "all"

  if (anyFilterActive) return null

  return (
    <AnimatedSection delay={0.1}>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-on-surface-variant md:text-sm">
        <span>{totalScholarships} scholarships</span>
        <span>{educationLevelsCount} education levels</span>
        {maxAmount && <span>Up to {maxAmount}</span>}
        {closingSoon > 0 && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-tertiary/15 px-3 py-0.5 text-xs font-medium text-tertiary md:text-sm">
            {closingSoon} closing soon
          </span>
        )}
      </div>
    </AnimatedSection>
  )
}

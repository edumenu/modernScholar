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
  deadlinesThisMonth: number
}

export function ScholarshipHeroStats({
  totalScholarships,
  educationLevelsCount,
  maxAmount,
  deadlinesThisMonth,
}: ScholarshipHeroStatsProps) {
  // The stat strip describes the unfiltered seasonal corpus. When any filter is
  // active, the per-result counts in the filter footer/sheet take over and this
  // strip would become misleading — so hide it.
  const [q] = useQueryState("q", parseAsString.withDefault(""))
  const [level] = useQueryState("level", parseAsString.withDefault("All"))
  const [sort] = useQueryState("sort", parseAsString.withDefault("deadline"))
  const [tags] = useQueryState(
    "tags",
    parseAsArrayOf(parseAsString).withDefault([]),
  )
  const [min] = useQueryState("min", parseAsInteger.withDefault(AWARD_MIN))
  const [max] = useQueryState("max", parseAsInteger.withDefault(AWARD_MAX))

  const anyFilterActive =
    q !== "" ||
    level !== "All" ||
    sort !== "deadline" ||
    tags.length > 0 ||
    min !== AWARD_MIN ||
    max !== AWARD_MAX

  if (anyFilterActive) return null

  return (
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
  )
}

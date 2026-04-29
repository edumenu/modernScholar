"use client"

import { motion } from "motion/react"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import type { Scholarship, EducationLevel } from "@/data/scholarships"
import { CLASSIFICATION_COLORS } from "@/data/scholarships"
import { Button } from "@/components/ui/button/button"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip/tooltip"
import { useComparisonStore } from "@/stores/comparison"

interface ScholarshipListCardSpreadProps {
  scholarship: Scholarship
  dimmed?: boolean
  onExpand: (id: string) => void
}

const CLASSIFICATION_TINT_MAP: Record<EducationLevel, { idle: string; hover: string }> = {
  "High School": { idle: "bg-primary/8", hover: "group-hover/row:bg-primary/12" },
  Undergraduate: { idle: "bg-secondary/8", hover: "group-hover/row:bg-secondary/12" },
  Graduate: { idle: "bg-tertiary/8", hover: "group-hover/row:bg-tertiary/12" },
  "K-8": { idle: "bg-primary/6", hover: "group-hover/row:bg-primary/10" },
  "K-12": { idle: "bg-secondary/6", hover: "group-hover/row:bg-secondary/10" },
}

function formatDeadlineShort(deadline: string): string {
  const parts = deadline.split(" ")
  if (parts.length >= 2) {
    const month = parts[0].slice(0, 3)
    return `${month} ${parts[1]}`
  }
  return deadline
}

export function ScholarshipListCardSpread({
  scholarship,
  dimmed = false,
  onExpand,
}: ScholarshipListCardSpreadProps) {
  const { toggle, isSelected } = useComparisonStore()
  const compared = isSelected(scholarship.id)
  const primaryLevel = scholarship.classification[0]
  const tint = CLASSIFICATION_TINT_MAP[primaryLevel] ?? CLASSIFICATION_TINT_MAP["High School"]

  return (
    <motion.article
      className={cn(
        "group/row relative flex min-h-38 w-full items-stretch",
        "rounded-lg bg-white dark:bg-surface-container-low overflow-hidden",
        "transition-colors duration-200",
        dimmed ? "opacity-40 saturate-50" : "cursor-pointer",
      )}
      onClick={(e) => {
        e.stopPropagation();
        if (!dimmed) onExpand(scholarship.id);
      }}
      aria-labelledby={`list-card-title-${scholarship.id}`}
      {...(dimmed ? { inert: "" as unknown as boolean } : {})}
    >
      {/* Left zone — tinted panel with classification + amount */}
      <div
        className={cn(
          "flex w-40 shrink-0 flex-col items-start justify-center gap-2 px-4 py-3 transition-colors duration-200 sm:w-56 sm:px-6",
          tint.idle,
          tint.hover,
        )}
      >
        <div className="flex flex-wrap gap-1">
          {scholarship.classification.map((level) => {
            const colors = CLASSIFICATION_COLORS[level];
            return (
              <span
                key={level}
                className={cn(
                  "inline-flex items-center rounded-full px-2 py-0.5",
                  "text-[9px] font-semibold tracking-wider uppercase",
                  colors.bg,
                  colors.text,
                )}
              >
                {level}
              </span>
            );
          })}
        </div>

        <motion.div
          className="flex items-center gap-1.5"
          whileHover={dimmed ? undefined : { scale: 1.04, y: -1 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          <Icon
            icon="solar:wallet-money-linear"
            className="size-5 shrink-0 text-on-surface-variant"
          />
          <span className="font-heading text-xl font-bold leading-none tracking-tight text-on-surface sm:text-2xl">
            {scholarship.awardAmount}
          </span>
        </motion.div>
      </div>

      {/* Vertical divider */}
      <div
        className="w-px self-stretch bg-outline-variant/15"
        aria-hidden="true"
      />

      {/* Right zone — name, provider + deadline, description */}
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 px-4 py-3 sm:px-6">
        <h3
          id={`list-card-title-${scholarship.id}`}
          className="font-heading text-base font-bold leading-snug text-on-surface line-clamp-1 sm:text-lg"
        >
          {scholarship.name}
        </h3>

        <div className="flex items-center gap-2 text-xs text-on-surface-variant">
          <span className="font-medium uppercase tracking-wider">
            {scholarship.provider}
          </span>
          <span className="text-outline-variant/40" aria-hidden="true">
            ·
          </span>
          <span className="flex items-center gap-1">
            <Icon icon="solar:calendar-linear" className="size-3.5 shrink-0" />
            {formatDeadlineShort(scholarship.deadline)}
          </span>
        </div>

        {scholarship.description && (
          <p className="text-xs leading-relaxed text-on-surface-variant/70 line-clamp-1">
            {scholarship.description}
          </p>
        )}
      </div>

      {/* Actions — compare toggle + arrow CTA */}
      <div className="flex shrink-0 items-center gap-1.5 pr-4 sm:gap-2 sm:pr-6">
        <Tooltip>
          <TooltipTrigger
            render={
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggle(scholarship.id);
                }}
                className={cn(
                  "flex size-8 items-center justify-center rounded-full transition-all duration-200",
                  compared
                    ? "bg-on-surface text-surface shadow-sm"
                    : "bg-on-surface/10 text-on-surface hover:bg-on-surface/18",
                )}
                aria-label={
                  compared ? "Remove from comparison" : "Add to comparison"
                }
              />
            }
          >
            <Icon
              icon={
                compared ? "solar:check-circle-bold" : "solar:add-circle-linear"
              }
              className="size-4.5"
            />
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={8} className="*:last:hidden">
            {compared ? "Remove from compare" : "Add to compare"}
          </TooltipContent>
        </Tooltip>

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={(e) => {
            e.stopPropagation();
            onExpand(scholarship.id);
          }}
          aria-label={`View details for ${scholarship.name}`}
        >
          <motion.span
            className="inline-flex"
            whileHover={{ x: 3 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <Icon icon="solar:arrow-right-linear" className="size-4.5" />
          </motion.span>
        </Button>
      </div>
    </motion.article>
  );
}

"use client"

import { motion } from "motion/react"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import type { Scholarship, EducationLevel } from "@/data/scholarships"
import { CLASSIFICATION_COLORS } from "@/data/scholarships"
import { Button } from "@/components/ui/button/button"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip/tooltip"
import { useComparisonStore } from "@/stores/comparison"
import { useHasMounted } from "@/hooks/use-has-mounted"
import { isExpired } from "@/lib/expired-status";
import { SESSION_DATE } from "@/lib/session-date";
import { ExpiredStamp } from "./expired-stamp";

interface ScholarshipListCardSpreadProps {
  scholarship: Scholarship
  dimmed?: boolean
  isExpanded?: boolean
  onExpand: (id: string) => void
}

const CLASSIFICATION_TINT_MAP: Record<
  EducationLevel,
  { idle: string; hover: string }
> = {
  "High School": {
    idle: "bg-primary-50 dark:bg-primary/12",
    hover: "group-hover/row:bg-primary/12 dark:group-hover/row:bg-primary/18",
  },
  Undergraduate: {
    idle: "bg-secondary-50 dark:bg-secondary/12",
    hover:
      "group-hover/row:bg-secondary/12 dark:group-hover/row:bg-secondary/18",
  },
  Graduate: {
    idle: "bg-tertiary-50 dark:bg-tertiary/12",
    hover: "group-hover/row:bg-tertiary/12 dark:group-hover/row:bg-tertiary/18",
  },
  "K-12": { idle: "bg-secondary/8", hover: "group-hover/row:bg-secondary/10" },
};

function formatDeadlineShort(deadline: string, year: number): string {
  const parts = deadline.split(" ")
  if (parts.length >= 2) {
    return `${parts[0].slice(0, 3)} ${parts[1]}, ${year}`
  }
  return `${deadline}, ${year}`
}

export function ScholarshipListCardSpread({
  scholarship,
  dimmed = false,
  isExpanded = false,
  onExpand,
}: ScholarshipListCardSpreadProps) {
  // Selector form: subscribe only to the slices this row reads.
  const toggle = useComparisonStore((s) => s.toggle);
  const isInComparison = useComparisonStore((s) =>
    s.selectedIds.includes(scholarship.id),
  );
  // Same hydration gate as the grid card — see scholarship-card.tsx.
  const hasMounted = useHasMounted();
  const compared = hasMounted && isInComparison;
  const primaryLevel = scholarship.classification[0];
  // Defensive fallback: scraped JSON is cast `as unknown as Scholarship[]` at the
  // boundary, so a malformed record could carry a level outside the union.
  const tint =
    CLASSIFICATION_TINT_MAP[primaryLevel] ??
    CLASSIFICATION_TINT_MAP["High School"];
  const expired = isExpired(scholarship, SESSION_DATE);
  const idleOpacity = dimmed ? 0.4 : 1;

  return (
    <motion.article
      layoutId={`card-${scholarship.id}`}
      animate={{ opacity: isExpanded ? 0 : idleOpacity }}
      transition={{ opacity: { duration: isExpanded ? 0 : 0.15 } }}
      className={cn(
        "group/row relative flex min-h-38 w-full items-stretch",
        "rounded-lg bg-white dark:bg-surface-container-low overflow-hidden",
        "transition-colors duration-200",
        "outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
        dimmed ? "saturate-50" : "cursor-pointer",
      )}
      onClick={(e) => {
        e.stopPropagation();
        if (!dimmed) onExpand(scholarship.id);
      }}
      onKeyDown={(e) => {
        if (dimmed) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onExpand(scholarship.id);
        }
      }}
      role="button"
      tabIndex={dimmed ? -1 : 0}
      aria-labelledby={`list-card-title-${scholarship.id}`}
      inert={dimmed}
    >
      {expired && <ExpiredStamp size="sm" />}
      <div
        className={cn(
          "flex w-full items-stretch",
          expired && !dimmed && "opacity-60 saturate-75",
        )}
      >
        {/* Left zone — tinted panel with classification + amount */}
        <div
          className={cn(
            "flex w-32 shrink-0 flex-col items-start justify-center gap-2 px-3 py-3 transition-colors duration-200 sm:w-56 sm:px-6",
            tint.idle,
            tint.hover,
          )}
        >
          <div className="flex flex-wrap items-center gap-1">
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
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 px-3 py-3 sm:px-6">
          <h3
            id={`list-card-title-${scholarship.id}`}
            className="font-heading text-base font-bold leading-snug text-on-surface line-clamp-1 sm:text-lg"
          >
            {scholarship.name}
          </h3>

          <div className="flex flex-col gap-0.5 text-xs text-on-surface-variant sm:flex-row sm:items-center sm:gap-2">
            <span className="line-clamp-1 font-medium uppercase tracking-wider">
              {scholarship.provider}
            </span>
            <span
              className="hidden text-outline-variant/40 sm:inline"
              aria-hidden="true"
            >
              ·
            </span>
            <span className="flex items-center gap-1">
              <Icon
                icon="solar:calendar-linear"
                className="size-3.5 shrink-0"
              />
              {formatDeadlineShort(
                scholarship.deadline,
                scholarship.deadlineYear,
              )}
            </span>
          </div>

          {scholarship.eligibility && (
            <p className="text-xs leading-relaxed text-on-surface-variant/70 line-clamp-1">
              {scholarship.eligibility}
            </p>
          )}
        </div>

        {/* Actions — compare toggle + arrow CTA.
          The compare toggle is hidden when expired since the ExpiredStamp tag
          already communicates that comparison isn't available. */}
        <div className="flex shrink-0 items-center gap-1 pr-2 sm:gap-2 sm:pr-6">
          {!expired && (
            <Tooltip>
              <TooltipTrigger
                render={
                  <button
                    data-cursor="fade"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggle(scholarship.id);
                    }}
                    className={cn(
                      "flex size-8 items-center justify-center rounded-full transition-all duration-200 cursor-pointer",
                      compared
                        ? "bg-on-surface text-surface shadow-sm"
                        : "bg-on-surface/10 text-on-surface hover:bg-on-surface/18",
                    )}
                    aria-label={
                      compared ? "Remove from comparison" : "Add to comparison"
                    }
                  >
                    <Icon
                      icon={
                        compared
                          ? "solar:check-circle-bold"
                          : "solar:add-circle-linear"
                      }
                      className="size-4.5"
                    />
                  </button>
                }
              />
              <TooltipContent
                side="top"
                sideOffset={8}
                className="*:last:hidden"
              >
                {compared ? "Remove from compare" : "Add to compare"}
              </TooltipContent>
            </Tooltip>
          )}

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
      </div>
    </motion.article>
  );
}

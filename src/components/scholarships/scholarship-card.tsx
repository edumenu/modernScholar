"use client"

import { motion } from "motion/react"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip/tooltip";
import type { Scholarship } from "@/data/scholarships"
import {
  CLASSIFICATION_COLORS,
  getClassificationTint,
} from "@/data/scholarships";
import { Button } from "@/components/ui/button/button"
import { useComparisonStore } from "@/stores/comparison"
import { useHasMounted } from "@/hooks/use-has-mounted"
import { isExpired } from "@/lib/expired-status";
import { SESSION_DATE } from "@/lib/session-date";
import { ExpiredStamp } from "./expired-stamp";

interface ScholarshipCardProps {
  scholarship: Scholarship
  dimmed?: boolean
  isExpanded?: boolean
  disableLayoutAnimation?: boolean
  onExpand: (id: string) => void
}

export function ScholarshipCard({
  scholarship,
  dimmed = false,
  isExpanded = false,
  disableLayoutAnimation = false,
  onExpand,
}: ScholarshipCardProps) {
  const { toggle, isSelected } = useComparisonStore()
  // Gate the persisted-state read so SSR HTML (empty store) matches the first
  // client render. After mount, the real selection state takes over.
  const hasMounted = useHasMounted()
  const compared = hasMounted && isSelected(scholarship.id)
  const tint = getClassificationTint(scholarship.classification);
  const expired = isExpired(scholarship, SESSION_DATE);

  // Article opacity carries only the filter-mismatch dim. The expired dim moves
  // to an inner wrapper so the ExpiredStamp (sibling of the wrapper) renders at
  // full opacity / saturation instead of inheriting the cascade.
  const idleOpacity = dimmed ? 0.4 : 1;

  return (
    <motion.article
      {...(!disableLayoutAnimation && {
        layoutId: `card-${scholarship.id}`,
      })}
      whileHover={dimmed ? undefined : { scale: 1.015, y: -3 }}
      animate={{ opacity: isExpanded ? 0 : idleOpacity }}
      transition={{
        opacity: { duration: isExpanded ? 0 : 0.15 },
        layout: { type: "tween", stiffness: 340, damping: 28 },
      }}
      className={cn(
        "group relative flex h-full w-full flex-col overflow-hidden rounded-2xl",
        tint.bg,
        "shadow-[0_6px_32px_rgba(32,26,25,0.07)] hover:shadow-[0_12px_48px_rgba(32,26,25,0.12)]",
        "transition-shadow duration-300",
        "outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
        dimmed ? "pointer-events-none saturate-50" : "cursor-pointer",
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
      aria-label={scholarship.name}
      inert={dimmed}
    >
      {expired && <ExpiredStamp size="lg" />}

      <div
        className={cn(
          "flex h-full w-full flex-col",
          expired && !dimmed && "opacity-60 saturate-75",
        )}
      >
      {/* Top row: classification pills + compare toggle.
          When expired the ExpiredStamp tag occupies the top-right corner, so
          we push chips down (pt-10) and drop the redundant compare toggle. */}
      <div
        className={cn(
          "flex items-start gap-2 px-6",
          expired ? "pt-10" : "justify-between pt-6",
        )}
      >
        <div className="flex flex-wrap items-center gap-1.5">
          {scholarship.classification.map((level) => {
            const colors = CLASSIFICATION_COLORS[level];
            return (
              <span
                key={level}
                className={cn(
                  "inline-flex items-center rounded-full px-2.5 py-0.5",
                  "text-[10px] font-semibold tracking-wider uppercase",
                  colors.bg,
                  colors.text,
                )}
              >
                {level}
              </span>
            );
          })}
        </div>

        {!expired && (
          <Tooltip>
            <TooltipTrigger
              render={
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggle(scholarship.id);
                  }}
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full",
                    "transition-all duration-200",
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
              side="bottom"
              sideOffset={8}
              className="*:last:hidden"
            >
              {compared ? "Remove from compare" : "Add to compare"}
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      {/* Title + gradient-fade underline */}
      <div className="flex flex-col gap-3 px-6 pt-5">
        <h3
          className={cn(
            "font-heading text-xl font-bold leading-tight",
            tint.text,
            "line-clamp-2",
          )}
        >
          {scholarship.name}
        </h3>

        <div
          className={cn(
            "h-px w-2/3 bg-linear-to-r to-transparent transition-all duration-300 group-hover:w-full",
            tint.accent,
          )}
          aria-hidden="true"
        />
      </div>

      {/* Provider */}
      <p className={cn("px-6 pt-3 text-xs font-medium", tint.muted)}>
        {scholarship.provider}
      </p>

      {/* Display amount */}
      <div className="flex items-end gap-1.5 px-6 pt-4">
        <Icon
          icon="solar:money-bag-linear"
          className={cn("mb-0.5 size-4 shrink-0", tint.muted)}
        />
        <span
          className={cn(
            "font-heading text-2xl font-bold leading-none tracking-tight",
            tint.text,
          )}
        >
          {scholarship.awardAmount}
        </span>
      </div>

      {/* Deadline */}
      <div
        className={cn(
          "flex items-center gap-1.5 px-6 pt-2 text-xs",
          tint.muted,
        )}
      >
        <Icon icon="solar:calendar-linear" className="size-3.5 shrink-0" />
        <span>
          Deadline {scholarship.deadline}, {scholarship.deadlineYear}
        </span>
      </div>

      {/* Description */}
      {scholarship.description && (
        <p
          className={cn(
            "line-clamp-2 px-6 pt-4 text-xs leading-relaxed",
            tint.muted,
          )}
        >
          {scholarship.description}
        </p>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* CTA row */}
      <div className="flex items-center justify-between px-6 pb-6 pt-5">
        <span
          className={cn(
            "text-[10px] font-semibold uppercase tracking-widest",
            tint.muted,
          )}
        >
          View Details
        </span>

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={(e) => {
            e.stopPropagation();
            onExpand(scholarship.id);
          }}
          aria-label={`View details for ${scholarship.name}`}
        >
          <Icon icon="solar:arrow-right-linear" />
        </Button>
      </div>
      </div>
    </motion.article>
  );
}

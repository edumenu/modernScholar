"use client"

import { motion } from "motion/react"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import type { Scholarship } from "@/data/scholarships"
import {
  CLASSIFICATION_COLORS,
  getClassificationTint,
} from "@/data/scholarships";
import { Button } from "@/components/ui/button/button"
import { useComparisonStore } from "@/stores/comparison"

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
  const compared = isSelected(scholarship.id)
  const tint = getClassificationTint(scholarship.classification);

  return (
    <motion.article
      {...(!disableLayoutAnimation && {
        layoutId: `card-${scholarship.id}`,
      })}
      whileHover={dimmed ? undefined : { scale: 1.015, y: -3 }}
      animate={{ opacity: isExpanded ? 0 : dimmed ? 0.4 : 1 }}
      transition={
        isExpanded
          ? { opacity: { duration: 0 } }
          : { type: "spring", stiffness: 340, damping: 24 }
      }
      className={cn(
        "group relative flex h-full w-full flex-col overflow-hidden rounded-2xl",
        tint.bg,
        tint.border,
        "shadow-[0_6px_32px_rgba(32,26,25,0.07)] hover:shadow-[0_12px_48px_rgba(32,26,25,0.12)]",
        "transition-shadow duration-300",
        dimmed ? "pointer-events-none saturate-50" : "cursor-pointer",
        isExpanded && "invisible",
      )}
      onClick={(e) => {
        e.stopPropagation();
        if (!dimmed) onExpand(scholarship.id);
      }}
      aria-label={scholarship.name}
    >
      {/* Top row: classification pills + compare toggle */}
      <div className="flex items-start justify-between gap-2 px-6 pt-6">
        <div className="flex flex-wrap gap-1.5">
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

        <button
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
          aria-label={compared ? "Remove from comparison" : "Add to comparison"}
        >
          <Icon
            icon={
              compared ? "solar:check-circle-bold" : "solar:add-circle-linear"
            }
            className="size-4.5"
          />
        </button>
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
          icon="solar:wallet-money-linear"
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
        <span>Deadline {scholarship.deadline}</span>
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
    </motion.article>
  );
}

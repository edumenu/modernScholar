"use client"

import { cn } from "@/lib/utils"

interface MatchBadgeProps {
  score: number
}

export function MatchBadge({ score }: MatchBadgeProps) {
  if (score <= 0) return null

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums shadow-sm",
        score >= 80
          ? "bg-secondary text-white"
          : score >= 50
            ? "bg-secondary/20 text-secondary"
            : "bg-outline-variant/30 text-on-surface-variant",
      )}
    >
      {score}% match
    </span>
  )
}

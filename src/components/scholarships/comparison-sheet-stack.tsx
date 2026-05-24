"use client"

import { motion } from "motion/react"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import type { Scholarship } from "@/data/scholarships"
import {
  parseAwardAmount,
  CLASSIFICATION_COLORS,
} from "@/data/scholarships"
import { Button } from "@/components/ui/button/button"
import { parseDeadlineDays, urgencyPill } from "./comparison-sheet-audit-ledger"

interface StackProps {
  items: Scholarship[]
  onRemove: (id: string) => void
}

export function ComparisonSheetStack({ items, onRemove }: StackProps) {
  const amounts = items.map((s) => parseAwardAmount(s.awardAmount))
  const highestAmount = Math.max(...amounts)

  return (
    <div className="flex flex-col gap-4">
      {items.map((scholarship, index) => (
        <ScholarshipCompareCard
          key={scholarship.id}
          scholarship={scholarship}
          isWinner={
            parseAwardAmount(scholarship.awardAmount) === highestAmount &&
            highestAmount > 0
          }
          index={index}
          onRemove={onRemove}
        />
      ))}
    </div>
  )
}

function ScholarshipCompareCard({
  scholarship,
  isWinner,
  index,
  onRemove,
}: {
  scholarship: Scholarship
  isWinner: boolean
  index: number
  onRemove: (id: string) => void
}) {
  const color = CLASSIFICATION_COLORS[scholarship.classification[0]]
  const days = parseDeadlineDays(scholarship.deadline, scholarship.deadlineYear)
  const pill = urgencyPill(days)

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.25 }}
      className={cn(
        "relative overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container-low shadow-sm",
        isWinner && "ring-1 ring-secondary-400/60",
      )}
    >
      <div className={cn("h-1.5 w-full", color?.bg ?? "bg-surface-container")} />

      <button
        type="button"
        onClick={() => onRemove(scholarship.id)}
        className="absolute right-3 top-3 flex size-7 items-center justify-center rounded-full bg-on-surface/5 text-on-surface-variant transition-colors hover:bg-on-surface/10 hover:text-on-surface focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        aria-label={`Remove ${scholarship.name} from comparison`}
      >
        <Icon icon="solar:close-circle-bold" className="size-4" />
      </button>

      <div className="px-4 pb-4 pt-3">
        {isWinner && (
          <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-secondary-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-secondary-700 dark:bg-secondary-950/40 dark:text-secondary-300">
            <Icon icon="solar:crown-bold" className="size-3" />
            Highest Amount
          </span>
        )}

        <h3 className="pr-10 font-heading text-base font-medium leading-snug text-on-surface">
          {scholarship.name}
        </h3>
        <p className="mt-0.5 text-xs text-on-surface-variant">
          {scholarship.provider}
        </p>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <StatTile
            icon="solar:money-bag-linear"
            label="Amount"
            value={
              <span className="font-heading text-sm font-bold text-on-surface">
                {scholarship.awardAmount}
              </span>
            }
          />
          <StatTile
            icon="solar:clock-circle-linear"
            label="Days Left"
            value={
              <span
                className={cn(
                  "inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium",
                  pill.className,
                )}
              >
                {pill.label}
              </span>
            }
          />
          <StatTile
            icon="solar:calendar-linear"
            label="Deadline"
            value={
              <span className="text-xs text-on-surface">
                {scholarship.deadline}, {scholarship.deadlineYear}
              </span>
            }
          />
        </div>

        <div className="mt-4">
          <Label icon="solar:square-academic-cap-linear">Education</Label>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {scholarship.classification.map((level) => {
              const colors = CLASSIFICATION_COLORS[level]
              return (
                <span
                  key={level}
                  className={cn(
                    "inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium",
                    colors.bg,
                    colors.text,
                  )}
                >
                  {level}
                </span>
              )
            })}
          </div>
        </div>

        <div className="mt-4">
          <Label icon="solar:checklist-minimalistic-linear">Eligibility</Label>
          <p className="mt-1.5 text-xs leading-relaxed text-on-surface/75">
            {scholarship.eligibility || "—"}
          </p>
        </div>

        <div className="mt-5 flex justify-end">
          <Button
            variant="default"
            size="sm"
            nativeButton={false}
            render={
              <a href={scholarship.link} target="_blank" rel="noopener noreferrer" />
            }
            animateIcon
          >
            Apply
            <Icon
              icon="solar:arrow-right-up-linear"
              data-icon="inline-end"
              className="size-3.5"
            />
          </Button>
        </div>
      </div>
    </motion.article>
  )
}

function StatTile({
  icon,
  label,
  value,
}: {
  icon: string
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-1.5 rounded-lg bg-surface-container-lowest/60 px-2 py-3 text-center">
      <div className="flex items-center gap-1 text-on-surface-variant">
        <Icon icon={icon} className="size-3" />
        <span className="text-[10px] font-medium uppercase tracking-wider">
          {label}
        </span>
      </div>
      <div className="flex min-h-5 items-center justify-center">{value}</div>
    </div>
  )
}

function Label({
  icon,
  children,
}: {
  icon: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-1.5 text-on-surface-variant">
      <Icon icon={icon} className="size-3.5" />
      <span className="text-[11px] font-medium uppercase tracking-wider">
        {children}
      </span>
    </div>
  )
}

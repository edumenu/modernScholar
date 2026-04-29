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

function parseDeadlineDays(deadline: string, deadlineYear: number): number {
  const target = new Date(`${deadline}, ${deadlineYear}`).getTime()
  const now = Date.now()
  return Math.max(0, Math.ceil((target - now) / (1000 * 60 * 60 * 24)))
}

function urgencyPill(days: number): { label: string; className: string } {
  if (days === 0) return { label: "Expired", className: "bg-urgency-danger-bg text-urgency-danger-text" }
  if (days <= 30) return { label: `${days}d left`, className: "bg-urgency-danger-bg text-urgency-danger-text" }
  if (days <= 60) return { label: `${days}d left`, className: "bg-urgency-warning-bg text-urgency-warning-text" }
  return { label: `${days}d left`, className: "bg-urgency-safe-bg text-urgency-safe-text" }
}

interface AuditLedgerProps {
  items: Scholarship[]
  onRemove: (id: string) => void
}

interface AttributeRow {
  label: string
  icon: string
  key: string
}

const ATTRIBUTE_ROWS: AttributeRow[] = [
  { label: "Amount", icon: "solar:money-bag-linear", key: "amount" },
  { label: "Days Left", icon: "solar:clock-circle-linear", key: "daysLeft" },
  { label: "Deadline", icon: "solar:calendar-linear", key: "deadline" },
  { label: "Education Level", icon: "solar:square-academic-cap-linear", key: "classification" },
  { label: "Eligibility", icon: "solar:checklist-minimalistic-linear", key: "eligibility" },
  { label: "Description", icon: "solar:document-text-linear", key: "description" },
]

export function ComparisonSheetAuditLedger({ items, onRemove }: AuditLedgerProps) {
  const amounts = items.map((s) => parseAwardAmount(s.awardAmount))
  const highestAmount = Math.max(...amounts)

  return (
    <div
      className="grid w-full gap-0"
      style={{ gridTemplateColumns: `100px repeat(${items.length}, 1fr)` }}
    >
      {/* Column headers */}
      <div className="sticky top-0 z-10 bg-background" />
      {items.map((s) => {
        const color = CLASSIFICATION_COLORS[s.classification[0]];
        return (
          <div
            key={s.id}
            className="sticky top-0 z-10 flex flex-col items-center gap-2 bg-background pb-3"
          >
            {/* Color bar with remove on hover */}
            <div className="group/header relative w-full">
              <div
                className={cn(
                  "h-1.5 w-full rounded-t-sm",
                  color?.bg ?? "bg-surface-container",
                )}
              />
              <button
                onClick={() => onRemove(s.id)}
                className="absolute -top-1 right-1 flex size-5 items-center justify-center rounded-full bg-on-surface/80 text-white opacity-0 transition-opacity group-hover/header:opacity-100"
                aria-label={`Remove ${s.name} from comparison`}
              >
                <Icon icon="solar:close-circle-bold" className="size-3.5" />
              </button>
            </div>
            <span className="font-heading text-sm font-medium leading-snug text-on-surface line-clamp-2 text-center px-2">
              {s.name}
            </span>
            <span className="text-[11px] text-on-surface-variant">
              {s.provider}
            </span>
          </div>
        );
      })}

      {/* Attribute rows */}
      {ATTRIBUTE_ROWS.map((row, rowIdx) => {
        const isOdd = rowIdx % 2 === 0;
        return (
          <RowGroup
            key={row.key}
            isOdd={isOdd}
            row={row}
            items={items}
            rowIdx={rowIdx}
            highestAmount={highestAmount}
          />
        );
      })}

      {/* Footer: Apply buttons */}
      <div className="pt-4" />
      {items.map((s) => (
        <div
          key={`apply-${s.id}`}
          className="flex items-start justify-center pt-4"
        >
          <Button
            variant="default"
            size="sm"
            nativeButton={false}
            render={
              <a href={s.link} target="_blank" rel="noopener noreferrer" />
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
      ))}
    </div>
  );
}

function RowGroup({
  isOdd,
  row,
  items,
  rowIdx,
  highestAmount,
}: {
  isOdd: boolean
  row: AttributeRow
  items: Scholarship[]
  rowIdx: number
  highestAmount: number
}) {
  return (
    <>
      {/* Label cell */}
      <div
        className={cn(
          "flex items-center gap-2 py-3 pr-3",
          isOdd && "bg-surface-container-lowest/40",
        )}
      >
        <Icon icon={row.icon} className="size-3.5 shrink-0 text-on-surface-variant" />
        <span className="text-xs font-medium text-on-surface-variant">{row.label}</span>
      </div>

      {/* Value cells */}
      {items.map((s, colIdx) => (
        <CellContent
          key={s.id}
          scholarship={s}
          rowKey={row.key}
          isOdd={isOdd}
          rowIdx={rowIdx}
          colIdx={colIdx}
          highestAmount={highestAmount}
        />
      ))}
    </>
  )
}

function CellContent({
  scholarship,
  rowKey,
  isOdd,
  rowIdx,
  colIdx,
  highestAmount,
}: {
  scholarship: Scholarship
  rowKey: string
  isOdd: boolean
  rowIdx: number
  colIdx: number
  highestAmount: number
}) {
  const isAmountWinner = rowKey === "amount" && parseAwardAmount(scholarship.awardAmount) === highestAmount
  const days = parseDeadlineDays(scholarship.deadline, scholarship.deadlineYear)
  const isUrgent = rowKey === "daysLeft" && days <= 30

  const highlightClass = isAmountWinner
    ? "bg-secondary-50 border-l-2 border-secondary-400 dark:bg-secondary-950/30"
    : isUrgent
      ? "bg-red-50 border-l-2 border-red-400 dark:bg-red-950/30"
      : ""

  return (
    <motion.div
      initial={isAmountWinner || isUrgent ? { opacity: 0, x: -4 } : false}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: (rowIdx * 60 + colIdx * 30) / 1000, duration: 0.3 }}
      className={cn(
        "flex items-center justify-center px-3 py-3 text-center",
        isOdd && "bg-surface-container-lowest/40",
        highlightClass,
      )}
    >
      {renderCellValue(scholarship, rowKey, days)}
    </motion.div>
  )
}

function renderCellValue(s: Scholarship, key: string, days: number) {
  switch (key) {
    case "amount":
      return (
        <span className="font-heading text-lg font-bold text-on-surface">
          {s.awardAmount}
        </span>
      )
    case "daysLeft": {
      const pill = urgencyPill(days)
      return (
        <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium", pill.className)}>
          {pill.label}
        </span>
      )
    }
    case "deadline":
      return (
        <span className="text-sm text-on-surface">
          {s.deadline}, {s.deadlineYear}
        </span>
      )
    case "classification":
      return (
        <div className="flex flex-wrap justify-center gap-1">
          {s.classification.map((level) => {
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
      )
    case "eligibility":
      return (
        <span className="text-xs leading-relaxed text-on-surface/70 line-clamp-3">
          {s.eligibility || "—"}
        </span>
      )
    case "description":
      return (
        <span className="text-xs leading-relaxed text-on-surface/70 line-clamp-4">
          {s.description || "—"}
        </span>
      )
    default:
      return <span className="text-sm text-on-surface">—</span>
  }
}

"use client"

import { motion, AnimatePresence } from "motion/react"
import { Slider } from "@/components/ui/slider/slider"
import { AWARD_MIN, AWARD_MAX } from "@/data/scholarships"

const STEP = 500

function formatCurrency(value: number): string {
  return `$${value.toLocaleString("en-US")}`
}

interface AwardRangeFilterProps {
  value: [number, number]
  onValueChange: (value: [number, number]) => void
}

function AnimatedPrice({ value }: { value: number }) {
  const formatted = formatCurrency(value)
  return (
    <span className="relative inline-flex overflow-hidden font-medium tabular-nums text-on-surface">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={formatted}
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -12, opacity: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 35, mass: 0.5 }}
        >
          {formatted}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

export function AwardRangeFilter({ value, onValueChange }: AwardRangeFilterProps) {
  const isDefault = value[0] === AWARD_MIN && value[1] === AWARD_MAX

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-on-surface/70">
          Award Amount
        </h3>
        {isDefault && (
          <span className="text-xs text-on-surface/40">Any amount</span>
        )}
      </div>

      <Slider
        value={value}
        onValueChange={(v) => onValueChange(v as [number, number])}
        min={AWARD_MIN}
        max={AWARD_MAX}
        step={STEP}
        thumbLabels={["Minimum award amount", "Maximum award amount"]}
      />

      <div className="flex items-center justify-between text-sm">
        <AnimatedPrice value={value[0]} />
        <span className="text-on-surface/30">—</span>
        <AnimatedPrice value={value[1]} />
      </div>
    </div>
  )
}

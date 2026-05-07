"use client"

import { useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu/dropdown-menu"
import {
  MONTHS,
  MONTH_LABELS,
  type Month,
  type MonthFilter,
} from "@/hooks/use-scholarship-filters"

const VISIBLE_COUNT = 6

interface MonthDropdownProps {
  month: MonthFilter
  onMonthChange: (next: MonthFilter) => void
  monthCounts: Record<Month, number>
  totalCount: number
  variant?: "outline" | "ghost"
  triggerClassName?: string
}

export function MonthDropdown({
  month,
  onMonthChange,
  monthCounts,
  totalCount,
  variant = "outline",
  triggerClassName,
}: MonthDropdownProps) {
  const { visibleMonths, hiddenMonths } = useMemo(() => {
    const todayIdx = new Date().getMonth()
    const visible: Month[] = []
    const hidden: Month[] = []
    for (let i = 0; i < 12; i++) {
      const m = MONTHS[(todayIdx + i) % 12]
      ;(i < VISIBLE_COUNT ? visible : hidden).push(m)
    }
    return { visibleMonths: visible, hiddenMonths: hidden }
  }, [])

  const isSelectedHidden =
    month !== "all" && hiddenMonths.includes(month as Month)

  const [expanded, setExpanded] = useState(isSelectedHidden)

  // Keep `expanded` in sync when the selected month changes from outside this
  // dropdown (e.g. picked in the mobile filter sheet) so the user lands on a
  // view that already reveals the active month.
  useEffect(() => {
    setExpanded(isSelectedHidden)
  }, [isSelectedHidden])

  const handleOpenChange = (open: boolean) => {
    if (open) setExpanded(isSelectedHidden)
  }

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger
        render={
          <Button
            variant={variant}
            size="sm"
            className={triggerClassName}
            aria-label={`Filter by deadline month, currently ${MONTH_LABELS[month]}`}
          >
            {month === "all" ? "Month" : MONTH_LABELS[month]}
            <Icon
              data-icon="inline-end"
              icon="solar:calendar-linear"
              className="size-4"
            />
          </Button>
        }
      />
      <DropdownMenuContent
        align="end"
        sideOffset={6}
        className="max-h-[60vh] overflow-y-auto"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>Deadline Month</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={month}
            onValueChange={(v) => onMonthChange(v as MonthFilter)}
          >
            <DropdownMenuRadioItem value="all">
              <span className="flex-1">All months</span>
              <span className="ml-3 text-xs tabular-nums text-on-surface/40">
                {totalCount}
              </span>
            </DropdownMenuRadioItem>

            {visibleMonths.map((m) => (
              <DropdownMenuRadioItem key={m} value={m}>
                <span className="flex-1">{MONTH_LABELS[m]}</span>
                <span className="ml-3 text-xs tabular-nums text-on-surface/40">
                  {monthCounts[m]}
                </span>
              </DropdownMenuRadioItem>
            ))}

            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  {hiddenMonths.map((m) => (
                    <DropdownMenuRadioItem key={m} value={m}>
                      <span className="flex-1">{MONTH_LABELS[m]}</span>
                      <span className="ml-3 text-xs tabular-nums text-on-surface/40">
                        {monthCounts[m]}
                      </span>
                    </DropdownMenuRadioItem>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </DropdownMenuRadioGroup>

          <div className="-mx-1 my-1 h-px bg-outline-variant/10" aria-hidden />

          <DropdownMenuItem
            closeOnClick={false}
            onClick={(e) => {
              e.preventDefault()
              setExpanded((prev) => !prev)
            }}
            aria-expanded={expanded}
            className="justify-center gap-1.5 py-2 text-xs text-on-surface/60 hover:text-on-surface"
          >
            <span>
              {expanded ? "Show fewer" : `Show ${hiddenMonths.length} more`}
            </span>
            <Icon
              icon="solar:alt-arrow-down-line-duotone"
              className={cn(
                "size-3.5 transition-transform duration-200",
                expanded && "rotate-180",
              )}
            />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

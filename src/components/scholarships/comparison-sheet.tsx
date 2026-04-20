"use client"

import { useEffect } from "react"
import Image from "next/image"
import { Icon } from "@iconify/react"
import { useLenis } from "lenis/react"
import { useComparisonStore } from "@/stores/comparison"
import { scholarships, type Scholarship } from "@/data/scholarships"
import { Button } from "@/components/ui/button/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet/sheet"

function parseDeadlineDays(deadline: string): number {
  const target = new Date(deadline).getTime()
  const now = Date.now()
  return Math.max(0, Math.ceil((target - now) / (1000 * 60 * 60 * 24)))
}

const COMPARISON_ROWS: { label: string; icon: string; key: string }[] = [
  { label: "Amount", icon: "solar:wallet-money-linear", key: "amount" },
  { label: "Deadline", icon: "solar:calendar-linear", key: "deadline" },
  { label: "Days Left", icon: "solar:clock-circle-linear", key: "daysLeft" },
  { label: "Rating", icon: "solar:star-linear", key: "rating" },
  { label: "Category", icon: "solar:tag-linear", key: "category" },
  { label: "Tag", icon: "solar:bookmark-linear", key: "tag" },
  { label: "Description", icon: "solar:document-text-linear", key: "description" },
]

function getCellValue(
  s: Scholarship,
  key: string,
): { value: string; highlight?: boolean; highestAmount?: number; highestRating?: number } {
  switch (key) {
    case "amount":
      return { value: s.amount }
    case "deadline":
      return { value: s.deadline }
    case "daysLeft": {
      const days = parseDeadlineDays(s.deadline)
      return { value: days === 0 ? "Expired" : `${days} days`, highlight: days <= 30 }
    }
    case "rating":
      return { value: `${s.rating} / 5.0` }
    case "category":
      return { value: s.category }
    case "tag":
      return { value: s.tag ?? "—" }
    case "description":
      return { value: s.description ?? "No description available." }
    default:
      return { value: "—" }
  }
}

function ComparisonTable({ items }: { items: Scholarship[] }) {
  const highestAmount = Math.max(
    ...items.map((s) => Number(s.amount.replace(/[^0-9.]/g, "")) || 0),
  )
  const highestRating = Math.max(...items.map((s) => s.rating))

  function isHighlighted(s: Scholarship, key: string): boolean {
    if (key === "amount") {
      return (Number(s.amount.replace(/[^0-9.]/g, "")) || 0) === highestAmount
    }
    if (key === "rating") return s.rating === highestRating
    if (key === "daysLeft") return parseDeadlineDays(s.deadline) <= 30
    return false
  }

  return (
    <Table className="table-fixed border-separate border-spacing-0">
      <TableHeader>
        <TableRow className="border-b border-outline-variant/20 hover:bg-transparent">
          <TableHead className="w-30 text-xs text-on-surface-variant" />
          {items.map((s) => (
            <TableHead key={s.id} className="text-center align-bottom">
              <div className="flex flex-col items-center gap-2 pb-1">
                <div className="relative size-18 overflow-hidden rounded-xl shadow-sm">
                  <Image src={s.image} alt={s.title} fill className="object-cover" sizes="76px" />
                </div>
                <h4 className="font-heading text-xs font-medium leading-snug text-on-surface line-clamp-2 max-w-35">
                  {s.title}
                </h4>
                <span className="text-[11px] text-on-surface-variant">{s.provider}</span>
              </div>
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {COMPARISON_ROWS.map((row) => (
          <TableRow
            key={row.key}
            className="border-b border-outline-variant/15 hover:bg-surface-container-lowest/50"
          >
            <TableCell className="py-3 pr-4">
              <div className="flex items-center gap-2 text-xs font-medium text-on-surface-variant">
                <Icon icon={row.icon} className="size-3.5 shrink-0" />
                <span>{row.label}</span>
              </div>
            </TableCell>
            {items.map((s) => {
              const cell = getCellValue(s, row.key)
              const highlighted = isHighlighted(s, row.key) || cell.highlight
              const isDescription = row.key === "description"
              return (
                <TableCell
                  key={s.id}
                  className={`py-3 text-center ${
                    highlighted ? "font-medium text-secondary" : "text-on-surface"
                  }`}
                >
                  <span className={`text-sm ${isDescription ? "text-xs leading-relaxed line-clamp-4" : ""}`}>
                    {cell.value}
                  </span>
                </TableCell>
              )
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export function ComparisonSheet() {
  const { selectedIds, remove, clear, isSheetOpen, closeSheet } =
    useComparisonStore()
  const lenis = useLenis()

  const selected = selectedIds
    .map((id) => scholarships.find((s) => s.id === id))
    .filter(Boolean) as Scholarship[]

  useEffect(() => {
    if (!lenis || !isSheetOpen) return
    lenis.stop()
    return () => {
      lenis.start()
    }
  }, [isSheetOpen, lenis])

  return (
    <Sheet
      open={isSheetOpen}
      onOpenChange={(open) => {
        if (!open) closeSheet()
      }}
    >
      <SheetContent
        side="right"
        className="data-[side=right]:sm:max-w-xl data-[side=right]:lg:max-w-4xl"
      >
        <SheetHeader>
          <SheetTitle className="font-heading text-lg">
            Compare Scholarships
          </SheetTitle>
          <SheetDescription className="text-on-surface-variant">
            {selected.length}/3 selected &mdash;{" "}
            {selected.length < 2
              ? "select at least 2 to compare"
              : "side-by-side comparison below"}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {/* Selected scholarships row */}
          <div className="flex items-center gap-3 pb-6">
            {selected.map((s) => (
              <div
                key={s.id}
                className="group relative size-10 shrink-0 overflow-hidden rounded-xl border border-outline-variant/30 shadow-sm"
              >
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  className="object-cover"
                  sizes="36px"
                />
                <button
                  onClick={() => remove(s.id)}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label={`Remove ${s.title} from comparison`}
                >
                  <Icon
                    icon="solar:close-circle-bold"
                    className="size-5 text-white"
                  />
                </button>
              </div>
            ))}
            {Array.from({ length: 3 - selected.length }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="size-14 shrink-0 rounded-xl border-2 border-dashed border-outline-variant/30"
              />
            ))}
          </div>

          {/* Comparison table or empty state */}
          {selected.length >= 2 ? (
            <ComparisonTable items={selected} />
          ) : (
            <div className="flex flex-col items-center gap-4 py-12 text-center">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-surface-container">
                <Icon
                  icon="solar:sort-horizontal-linear"
                  className="size-8 text-on-surface-variant/40"
                />
              </div>
              <p className="text-sm text-on-surface-variant max-w-xs">
                Select at least 2 scholarships from the grid to see a
                side-by-side comparison here.
              </p>
            </div>
          )}
        </div>

        <SheetFooter className="flex-row justify-end gap-2 border-t border-outline-variant/20">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              clear()
            }}
          >
            Clear All
          </Button>
          <SheetClose
            render={<Button size="sm" />}
          >
            Done
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

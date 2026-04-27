"use client"

import Image from "next/image"
import { motion } from "motion/react"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import type { Scholarship } from "@/data/scholarships"
import { generateGradient } from "@/data/scholarships"
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
  const isGradient = scholarship.image === "gradient"

  return (
    <motion.div
      {...(!disableLayoutAnimation && {
        layoutId: `card-${scholarship.id}`,
      })}
      whileHover={dimmed ? undefined : { scale: 1.025, y: -4 }}
      animate={{ opacity: isExpanded ? 0 : dimmed ? 0.4 : 1 }}
      transition={
        isExpanded
          ? { opacity: { duration: 0 } }
          : { type: "spring", stiffness: 400, damping: 28 }
      }
      className={cn(
        "group relative h-full w-full overflow-hidden rounded-2xl",
        "shadow-md dark:shadow-lg",
        "transition-filter duration-400 ease-in-out",
        dimmed
          ? "pointer-events-none saturate-50"
          : "cursor-pointer hover:shadow-lg",
        isExpanded && "invisible",
      )}
      onClick={(e) => {
        e.stopPropagation()
        if (!dimmed) {
          onExpand(scholarship.id)
        }
      }}
    >
      {isGradient ? (
        <div
          className="absolute inset-0"
          style={{ background: generateGradient(scholarship.id) }}
        />
      ) : (
        <Image
          src={scholarship.image}
          alt={scholarship.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 25vw, 325px"
        />
      )}

      {/* Gradient overlay – only for image cards (gradient cards use light backgrounds with dark text) */}
      {!isGradient && (
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/50 to-black/70" />
      )}

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-between p-6">
        {/* Top: Education level pills + Compare toggle */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {scholarship.classification.map((level) => (
              <span
                key={level}
                className={cn(
                  "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                  isGradient
                    ? "bg-on-surface/10 text-on-surface shadow-[2px_2px_4px_rgba(0,0,0,0.05)]"
                    : "bg-white/20 text-white shadow-[2px_2px_4px_rgba(0,0,0,0.1),-1px_-1px_3px_rgba(255,255,255,0.1)]",
                )}
              >
                {level}
              </span>
            ))}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggle(scholarship.id)
            }}
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-full transition-colors",
              isGradient
                ? compared
                  ? "bg-on-surface text-surface"
                  : "bg-on-surface/10 text-on-surface hover:bg-on-surface/20"
                : compared
                  ? "bg-white text-primary"
                  : "bg-white/20 text-white hover:bg-white/30",
            )}
            aria-label={
              compared ? "Remove from comparison" : "Add to comparison"
            }
          >
            <Icon
              icon={
                compared ? "solar:check-circle-bold" : "solar:add-circle-linear"
              }
              className="size-5"
            />
          </button>
        </div>

        {/* Bottom: Info + CTA */}
        <div className="flex flex-col group items-start gap-3">
          <div className="flex flex-col gap-2">
            <h3 className={cn(
              "font-heading text-base font-medium leading-tight md:text-xl",
              isGradient ? "text-on-surface" : "text-white",
            )}>
              {scholarship.name}
            </h3>
            <p className={cn(
              "text-xs md:text-sm",
              isGradient ? "text-on-surface-variant" : "text-white/80",
            )}>
              {scholarship.awardAmount}
              <span className="mx-3">&middot;</span>
              Deadline: {scholarship.deadline}
            </p>
          </div>
          <Button
            animateIcon
            variant="outline"
            size="xs"
            className={cn(
              "shadow-none",
              isGradient
                ? "border-on-surface/20 text-on-surface hover:text-primary"
                : "text-primary-50 hover:text-primary",
            )}
            hoverTrigger="parent"
          >
            View Details
            <Icon icon="solar:arrow-right-linear" data-icon="inline-end" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

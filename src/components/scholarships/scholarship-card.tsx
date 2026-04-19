"use client"

import Image from "next/image"
import { motion } from "motion/react"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import type { Scholarship } from "@/data/scholarships"
import { Button } from "@/components/ui/button/button"

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
  return (
    <motion.div
      {...(!disableLayoutAnimation && {
        layoutId: `card-${scholarship.id}`,
      })}
      whileHover={{ scale: 1.025, y: -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className={cn(
        "group relative h-full w-full cursor-pointer overflow-hidden rounded-2xl",
        "shadow-md hover:shadow-lg",
        "dark:shadow-lg",
        "transition-[opacity,filter] duration-400 ease-in-out",
        dimmed && "pointer-events-none opacity-40 saturate-50",
        isExpanded && "invisible",
      )}
      onClick={(e) => {
        e.stopPropagation()
        if (!dimmed) {
          onExpand(scholarship.id)
        }
      }}
    >
      <Image
        src={scholarship.image}
        alt={scholarship.title}
        fill
        className="object-cover"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 25vw, 325px"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/50 to-black/70" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-between p-6">
        {/* Top: Badges */}
        <div className="flex items-center gap-2">
          {scholarship.tag && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white shadow-[2px_2px_4px_rgba(0,0,0,0.1),-1px_-1px_3px_rgba(255,255,255,0.1)]">
              <Icon icon="solar:star-bold" className="size-3.5" />
              {scholarship.tag}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-sm font-medium text-white shadow-[2px_2px_4px_rgba(0,0,0,0.1),-1px_-1px_3px_rgba(255,255,255,0.1)]">
            {scholarship.rating}
            <Icon icon="solar:star-bold" className="size-3 text-amber-300" />
          </span>
        </div>

        {/* Bottom: Info + CTA */}
        <div className="flex flex-col group items-start gap-3">
          <div className="flex flex-col gap-2">
            <h3 className="font-heading text-base font-medium leading-tight text-white md:text-xl">
              {scholarship.title}
            </h3>
            <p className="text-xs text-white/80 md:text-sm">
              {scholarship.amount}
              <span className="mx-3">&middot;</span>
              Deadline: {scholarship.deadline}
            </p>
          </div>
          <Button
            animateIcon
            variant="outline"
            size="xs"
            className="text-primary-50 hover:text-primary shadow-none"
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

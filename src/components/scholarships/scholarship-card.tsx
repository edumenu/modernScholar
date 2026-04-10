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
        layout: true,
        layoutId: `card-${scholarship.id}`,
      })}
      className={cn(
        "group relative h-full cursor-pointer overflow-hidden rounded-2xl",
        "shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.9)]",
        "dark:shadow-lg",
        "transition-[opacity,filter] duration-400 ease-in-out",
        dimmed && "pointer-events-none grayscale opacity-30",
        isExpanded && "invisible",
      )}
    >
      <Image
        src={scholarship.image}
        alt={scholarship.title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 33vw"
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
            {/* <p className="text-sm text-white/90">{scholarship.provider}</p> */}
            <p className="text-sm text-white/80">
              {scholarship.amount}
              <span className="mx-3">&middot;</span>
              Deadline: {scholarship.deadline}
            </p>
          </div>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onExpand(scholarship.id);
            }}
            animateIcon
            variant="outline"
            size="xs"
            className="text-primary-50 hover:text-primary shadow-none"
            hoverTrigger="parent"
          >
            View Details
            <Icon
              icon="solar:arrow-right-linear"
              data-icon="inline-end"
            />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

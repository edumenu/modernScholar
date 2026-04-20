"use client"

import Image from "next/image"
import { motion } from "motion/react"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import type { Scholarship } from "@/data/scholarships"
import { Button } from "@/components/ui/button/button"
import { useComparisonStore } from "@/stores/comparison";
import { useProfileStore, computeMatchScore } from "@/stores/profile";
import { MatchBadge } from "./match-badge";

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
  const { toggle, isSelected } = useComparisonStore();
  const { profile, isSetup } = useProfileStore();
  const compared = isSelected(scholarship.id);
  const matchScore = isSetup
    ? computeMatchScore(profile, scholarship.category)
    : 0;

  return (
    <motion.div
      {...(!disableLayoutAnimation && {
        layoutId: `card-${scholarship.id}`,
      })}
      whileHover={{ scale: 1.025, y: -4 }}
      transition={{ type: "tween", stiffness: 400, damping: 28 }}
      className={cn(
        "group relative h-full w-full cursor-pointer overflow-hidden rounded-2xl",
        "shadow-md hover:shadow-lg",
        "dark:shadow-lg",
        "transition-[opacity,filter] duration-400 ease-in-out",
        dimmed && "pointer-events-none opacity-40 saturate-50",
        isExpanded && "invisible",
      )}
      onClick={(e) => {
        e.stopPropagation();
        if (!dimmed) {
          onExpand(scholarship.id);
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
        {/* Top: Badges + Compare toggle */}
        <div className="flex items-center justify-between">
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
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggle(scholarship.id);
            }}
            className={cn(
              "flex size-8 items-center justify-center rounded-full transition-colors",
              compared
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
          {matchScore > 0 && <MatchBadge score={matchScore} />}
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
  );
}

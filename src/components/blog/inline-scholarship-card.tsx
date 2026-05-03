import Link from "next/link"
import { Icon } from "@iconify/react"

import enrichedData from "@/data/scholarships-enriched.json"
import {
  CLASSIFICATION_COLORS,
  type Scholarship,
} from "@/data/scholarships"
import { cn } from "@/lib/utils"

// Note: scholarships-enriched.json keys items by `id`. We expose the prop as
// `slug` for caller ergonomics (matches PRD blog frontmatter), but match by id.
const scholarships = enrichedData as unknown as Scholarship[]

export interface InlineScholarshipCardProps {
  slug: string
  className?: string
}

export function InlineScholarshipCard({
  slug,
  className,
}: InlineScholarshipCardProps) {
  const scholarship = scholarships.find((s) => s.id === slug)

  if (!scholarship) {
    const message = `InlineScholarshipCard: scholarship "${slug}" not found in scholarships-enriched.json`
    if (process.env.NODE_ENV !== "production") {
      return (
        <aside
          data-slot="inline-scholarship-card-missing"
          role="alert"
          className={cn(
            "not-prose my-8 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive",
            className,
          )}
        >
          <strong className="font-semibold">Missing scholarship:</strong>{" "}
          <code className="font-mono">{slug}</code> — add it to{" "}
          <code className="font-mono">scholarships-enriched.json</code> or fix
          the slug in the MDX source.
        </aside>
      )
    }
    console.error(message)
    return null
  }

  const primaryLevel = scholarship.classification[0]
  const pillColors = primaryLevel ? CLASSIFICATION_COLORS[primaryLevel] : null

  return (
    <aside
      data-slot="inline-scholarship-card"
      data-scholarship-id={scholarship.id}
      aria-label={`Featured scholarship: ${scholarship.name}`}
      className={cn(
        "not-prose my-8 flex flex-col gap-4 overflow-hidden rounded-xl border border-outline-variant/40 bg-surface-container-low p-5 shadow-[0_4px_24px_rgba(32,26,25,0.05)] sm:flex-row sm:items-stretch sm:gap-5 sm:p-6",
        className,
      )}
    >
      {/* Left rail: classification + amount */}
      <div className="flex shrink-0 flex-col items-start justify-center gap-3 sm:w-44 sm:border-r sm:border-outline-variant/30 sm:pr-5">
        {scholarship.classification.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {scholarship.classification.map((level) => {
              const colors = CLASSIFICATION_COLORS[level] ?? pillColors
              if (!colors) return null
              return (
                <span
                  key={level}
                  className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5",
                    "text-[10px] font-semibold uppercase tracking-wider",
                    colors.bg,
                    colors.text,
                  )}
                >
                  {level}
                </span>
              )
            })}
          </div>
        )}

        <div className="flex items-end gap-1.5">
          <Icon
            icon="solar:money-bag-linear"
            className="mb-0.5 size-4 shrink-0 text-on-surface-variant"
            aria-hidden="true"
          />
          <span className="font-heading text-2xl font-bold leading-none tracking-tight text-on-surface">
            {scholarship.awardAmount}
          </span>
        </div>
      </div>

      {/* Right body: title, provider, deadline, CTA */}
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <p className="font-sans text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant/80">
          Featured Scholarship
        </p>

        <h3 className="font-heading text-lg font-bold leading-snug text-on-surface line-clamp-2 sm:text-xl">
          {scholarship.name}
        </h3>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-on-surface-variant">
          <span className="font-medium uppercase tracking-wider">
            {scholarship.provider}
          </span>
          <span className="text-outline-variant/40" aria-hidden="true">
            ·
          </span>
          <span className="inline-flex items-center gap-1">
            <Icon
              icon="solar:calendar-linear"
              className="size-3.5 shrink-0"
              aria-hidden="true"
            />
            Deadline {scholarship.deadline}
          </span>
        </div>

        <div className="mt-auto pt-2">
          <Link
            href={`/scholarships/${scholarship.id}`}
            className={cn(
              "inline-flex items-center gap-1.5 text-sm font-semibold text-primary",
              "underline-offset-4 hover:underline focus-visible:underline",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container-low rounded-sm",
            )}
            aria-label={`View details for ${scholarship.name}`}
          >
            View scholarship
            <Icon
              icon="solar:arrow-right-linear"
              className="size-4"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </aside>
  )
}

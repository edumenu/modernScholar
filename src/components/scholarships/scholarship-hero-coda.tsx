"use client"

import { Icon } from "@iconify/react"
import { AnimatedSection } from "@/components/ui/animatedSection/animated-section"

const PERSONALIZED_LIST_URL =
  "https://beacons.ai/dearmodernscholar?utm_source=website&utm_medium=cta&utm_campaign=scholarship_hero&utm_content=hero_coda"

export function ScholarshipHeroCoda() {
  return (
    <AnimatedSection delay={0.5} className="mt-1">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span aria-hidden="true" className="h-px w-8 bg-secondary" />
        <span className="text-sm text-on-surface-variant">
          Or skip the search:
        </span>
        <a
          href={PERSONALIZED_LIST_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1.5 text-base px-2 font-medium text-primary underline-offset-4 hover:underline"
        >
          Request a personalized list
          <Icon
            icon="solar:arrow-right-linear"
            className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </a>
      </div>
    </AnimatedSection>
  )
}

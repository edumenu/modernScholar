import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

interface LegalSectionProps {
  /** Stable anchor id for the section (used for in-page links / scroll targets). */
  id: string
  /** Section heading rendered as an H2. */
  title: string
  /** Section body — typically one or more paragraphs / lists. */
  children: ReactNode
  className?: string
}

/**
 * A top-level section within a legal policy page. Renders an H2 with the
 * supplied `id` and a body that inherits the page's reading typography.
 *
 * `scroll-mt-24` offsets the anchor target below the fixed header should
 * in-page links ever be wired up.
 */
export function LegalSection({
  id,
  title,
  children,
  className,
}: LegalSectionProps) {
  return (
    <section id={id} className={cn("scroll-mt-24", className)}>
      <h2
        id={`${id}-heading`}
        className="font-heading text-2xl font-bold tracking-tight text-on-surface"
      >
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-base leading-relaxed text-on-surface-variant">
        {children}
      </div>
    </section>
  )
}

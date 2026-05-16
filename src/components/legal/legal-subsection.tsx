import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

interface LegalSubsectionProps {
  /** Optional anchor id (subsections rarely need their own anchor). */
  id?: string
  /** Subsection heading rendered as an H3. */
  title: string
  /** Subsection body. */
  children: ReactNode
  className?: string
}

/**
 * A nested heading within a `LegalSection` (e.g. "Your Rights → GDPR").
 * Renders an H3 in Noto Serif and preserves the parent section's body
 * typography for the children.
 */
export function LegalSubsection({
  id,
  title,
  children,
  className,
}: LegalSubsectionProps) {
  return (
    <div id={id} className={cn(id && "scroll-mt-24", className)}>
      <h3 className="font-heading text-xl font-bold tracking-tight text-on-surface">
        {title}
      </h3>
      <div className="mt-3 space-y-4 text-base leading-relaxed text-on-surface-variant">
        {children}
      </div>
    </div>
  )
}

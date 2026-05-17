import type { ReactNode } from "react"

import { PageTransition } from "@/components/ui/page-transition"
import { CONTACT_EMAIL } from "@/lib/legal-constants"
import { cn } from "@/lib/utils"

interface LegalLayoutProps {
  /** Page title rendered as the H1. */
  title: string
  /** ISO date string (`YYYY-MM-DD`) — typically `LAST_UPDATED.<policy>`. */
  lastUpdated: string
  /** Optional TL;DR summary rendered in a tinted card above the body. */
  tldr?: ReactNode
  /**
   * Optional table-of-contents entries. When non-empty, renders a
   * collapsed `<details>` disclosure between the header and the TL;DR
   * with anchor links to each section. The `id` values must match the
   * `id` props on the corresponding `<LegalSection>` elements.
   */
  sections?: ReadonlyArray<{ id: string; title: string }>
  /** Composed `<LegalSection>` (and any other) content. */
  children: ReactNode
  className?: string
}

const LAST_UPDATED_FORMATTER = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  // Pin the formatter to UTC so the rendered day matches the ISO date
  // regardless of the runtime's local timezone. Without this, a build or
  // request handler running west of UTC (e.g. EST = UTC-5) would render
  // `2026-05-14` as "May 13, 2026".
  timeZone: "UTC",
})

/**
 * Format a `YYYY-MM-DD` ISO date string as a human-readable label
 * (e.g. `"May 14, 2026"`). Returns the input verbatim if it cannot be parsed.
 *
 * Exported for unit testing — see `__tests__/legal-layout.component.test.tsx`.
 */
export function formatLastUpdated(iso: string): string {
  // Parse as a UTC date so the rendered day matches the ISO date regardless of
  // server / build-time timezone. Falls back to the raw string if invalid.
  const parsed = new Date(`${iso}T00:00:00Z`)
  if (Number.isNaN(parsed.getTime())) {
    return iso
  }
  return LAST_UPDATED_FORMATTER.format(parsed)
}

/**
 * Shared chrome for every legal policy page: scoped page transition,
 * vertical rhythm, a narrow readable column, the "Last Updated" label,
 * the H1, an optional TL;DR card, the composed body, and a uniform
 * contact footer.
 *
 * Pure server component — no client-side state. `PageTransition` is the
 * only client boundary in the tree (already site-wide).
 */
export function LegalLayout({
  title,
  lastUpdated,
  tldr,
  sections,
  children,
  className,
}: LegalLayoutProps) {
  const formattedDate = formatLastUpdated(lastUpdated)

  return (
    <PageTransition>
      <div className={cn("page-padding-y", className)}>
        <article id="top" className="mx-auto flex max-w-2xl flex-col gap-10">
          <header className="flex flex-col gap-3">
            <p
              className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary"
              aria-label={`Last updated ${formattedDate}`}
            >
              Last updated{" "}
              <time dateTime={lastUpdated}>{formattedDate}</time>
            </p>
            <h1 className="font-heading text-3xl font-bold tracking-tight text-on-surface md:text-4xl">
              {title}
            </h1>
          </header>

          {sections && sections.length > 0 && (
            <nav aria-label="Page contents">
              <details className="rounded-lg bg-surface-container-low p-4 md:p-5">
                <summary className="cursor-pointer text-sm font-semibold text-on-surface">
                  Contents — tap to expand
                </summary>
                <ul className="mt-2 flex flex-col">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="block py-3 text-sm text-on-surface-variant transition-colors hover:text-on-surface"
                      >
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </details>
            </nav>
          )}

          {tldr ? (
            <aside
              aria-label="Summary"
              className="rounded-lg border-l-4 border-primary bg-surface-container p-5 text-base leading-relaxed text-on-surface md:p-6"
            >
              {tldr}
            </aside>
          ) : null}

          <div className="flex flex-col gap-10">{children}</div>

          <footer className="flex flex-col gap-3 border-t border-on-surface/10 pt-6 text-sm leading-relaxed text-on-surface-variant">
            <p>
              Have a question? Contact us at{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-primary underline underline-offset-2"
              >
                {CONTACT_EMAIL}
              </a>
              .
            </p>
            <p>
              <a
                href="#top"
                className="inline-block py-1 pointer-coarse:py-3 text-primary underline underline-offset-2"
              >
                Back to top
              </a>
            </p>
          </footer>
        </article>
      </div>
    </PageTransition>
  )
}

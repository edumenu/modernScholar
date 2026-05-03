import type { ReactNode } from "react"
import { Icon } from "@iconify/react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const calloutVariants = cva(
  "my-6 flex gap-4 rounded-lg border border-l-4 px-5 py-4 text-base leading-relaxed",
  {
    variants: {
      type: {
        tip: "border-secondary/25 border-l-secondary bg-secondary-container/40 text-on-secondary-container dark:bg-secondary-container/30",
        warning:
          "border-tertiary/30 border-l-tertiary bg-tertiary-50/70 text-tertiary-900 dark:bg-tertiary-950/40 dark:text-tertiary-100",
        note: "border-outline-variant border-l-primary/70 bg-surface-container text-on-surface",
      },
    },
    defaultVariants: {
      type: "note",
    },
  },
)

const iconStyles = cva("mt-0.5 size-5 shrink-0", {
  variants: {
    type: {
      tip: "text-secondary dark:text-secondary-300",
      warning: "text-tertiary dark:text-tertiary-300",
      note: "text-primary dark:text-primary-300",
    },
  },
  defaultVariants: {
    type: "note",
  },
})

const iconMap: Record<NonNullable<VariantProps<typeof calloutVariants>["type"]>, string> = {
  tip: "solar:lightbulb-bold-duotone",
  warning: "solar:danger-triangle-bold-duotone",
  note: "solar:info-circle-bold-duotone",
}

const labelMap: Record<NonNullable<VariantProps<typeof calloutVariants>["type"]>, string> = {
  tip: "Tip",
  warning: "Warning",
  note: "Note",
}

export interface CalloutProps extends VariantProps<typeof calloutVariants> {
  type?: "tip" | "warning" | "note"
  children: ReactNode
  className?: string
}

export function Callout({ type = "note", children, className }: CalloutProps) {
  const variant = type ?? "note"
  const label = labelMap[variant]

  return (
    <aside
      role="note"
      aria-label={label}
      data-slot="callout"
      data-callout-type={variant}
      className={cn(calloutVariants({ type: variant }), className)}
    >
      <Icon
        icon={iconMap[variant]}
        className={iconStyles({ type: variant })}
        aria-hidden="true"
      />
      <div data-slot="callout-content" className="flex-1 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
        <p className="mb-1 font-heading text-sm font-bold uppercase tracking-wider text-current/80">
          {label}
        </p>
        <div className="text-on-surface/90 [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_p]:my-2 [&_strong]:font-semibold">
          {children}
        </div>
      </div>
    </aside>
  )
}

import { cn } from "@/lib/utils"

interface ExpiredStampProps {
  /** `lg` pins to the card's top-right (grid). `sm` pins to the top-left (list). */
  size?: "lg" | "sm"
  className?: string
}

export function ExpiredStamp({ size = "lg", className }: ExpiredStampProps) {
  const isGrid = size === "lg"

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute z-10 select-none",
        isGrid ? "right-0 top-0" : "left-0 top-0",
        className,
      )}
    >
      <div
        className={cn(
          "px-3 py-1",
          "bg-tertiary text-tertiary-foreground",
          "text-[9px] font-semibold uppercase tracking-[0.18em] whitespace-nowrap",
          "shadow-[0_2px_8px_rgba(148,62,48,0.2)]",
        )}
        style={{
          // Grid (top-right): bottom-LEFT corner angled inward → flag-tail flare
          //   on the free end. Bottom-left starts 10px to the right of the edge.
          // List (top-left): bottom-RIGHT corner angled inward — mirror.
          clipPath: isGrid
            ? "polygon(0 0, 100% 0, 100% 100%, 10px 100%)"
            : "polygon(0 0, 100% 0, calc(100% - 10px) 100%, 0 100%)",
        }}
      >
        Deadline has passed
      </div>
    </div>
  )
}

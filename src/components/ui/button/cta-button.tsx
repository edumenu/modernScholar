"use client"

import { type ComponentProps, type FC } from "react"
import { IconArrowRight } from "@tabler/icons-react"

import { cn } from "@/lib/utils"

interface CTAButtonProps extends ComponentProps<"button"> {
  label: string
  variant?: "primary" | "secondary" | "tertiary"
}

const variantStyles = {
  primary: {
    wrapper: "bg-primary-50 dark:bg-primary-900",
    circle: "bg-primary dark:bg-primary-400",
    arrow: "text-primary-foreground dark:text-primary-900",
    text: "text-primary dark:text-primary-100 group-hover:text-primary-foreground dark:group-hover:text-primary-900",
  },
  secondary: {
    wrapper: "bg-secondary-50 dark:bg-secondary-900",
    circle: "bg-secondary dark:bg-secondary-400",
    arrow: "text-secondary-foreground dark:text-secondary-900",
    text: "text-secondary dark:text-secondary-100 group-hover:text-secondary-foreground dark:group-hover:text-secondary-900",
  },
  tertiary: {
    wrapper: "bg-tertiary-50 dark:bg-tertiary-900",
    circle: "bg-tertiary dark:bg-tertiary-400",
    arrow: "text-tertiary-foreground dark:text-tertiary-900",
    text: "text-tertiary dark:text-tertiary-100 group-hover:text-tertiary-foreground dark:group-hover:text-tertiary-900",
  },
}

const CTAButton: FC<CTAButtonProps> = ({
  label,
  variant = "primary",
  className,
  ...props
}) => {
  const styles = variantStyles[variant]

  return (
    <button
      className={cn(
        "group relative h-auto w-50 cursor-pointer rounded-full border-none p-1 outline-none shadow-[1px_1px_4px_rgba(32,26,25,0.1),-5px_-5px_10px_rgba(255,255,255,0.8)] transition-shadow duration-300 focus-visible:ring-[3px] focus-visible:ring-ring/50",
        styles.wrapper,
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "m-0 block h-12 w-12 overflow-hidden rounded-full duration-500 group-hover:w-full",
          styles.circle,
        )}
        aria-hidden="true"
      />
      <div className="absolute top-1/2 left-4 -translate-y-1/2 translate-x-0 duration-500 group-hover:translate-x-[0.4rem]">
        <IconArrowRight className={cn("size-6", styles.arrow)} />
      </div>
      <span
        className={cn(
          "absolute top-1/2 left-1/2 ml-4 -translate-x-1/2 -translate-y-1/2 text-center font-medium tracking-tight whitespace-nowrap duration-500",
          styles.text,
        )}
      >
        {label}
      </span>
    </button>
  );
}

export { CTAButton }

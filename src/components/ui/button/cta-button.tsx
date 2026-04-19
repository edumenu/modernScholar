"use client"

import {
  useRef,
  type ComponentProps,
  type FC,
} from "react";
import { Icon } from "@iconify/react"
import { motion, AnimatePresence } from "motion/react";
import { useRipple } from "@/hooks/use-ripple";

import { cn } from "@/lib/utils"

interface CTAButtonProps extends ComponentProps<"button"> {
  label: string
  variant?: "primary" | "secondary" | "tertiary"
}

const variantStyles = {
  primary: {
    wrapper: "bg-primary-50 dark:bg-surface",
    circle:
      "bg-primary dark:bg-primary-400 aria-expanded:bg-primary shadow-neu-primary",
    arrow: "text-primary-foreground dark:text-primary-100",
    text: "text-primary dark:text-primary-100 group-hover:text-primary-foreground dark:group-hover:text-primary-100",
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
};

const rippleColorMap: Record<string, string> = {
  primary: "var(--primary-600)",
  secondary: "var(--secondary-950)",
  tertiary: "var(--tertiary-600)",
};

const CTAButton: FC<CTAButtonProps> = ({
  label,
  variant = "primary",
  className,
  ...props
}) => {
  const styles = variantStyles[variant]
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { ripple, rippleStyle, rippleMotionProps, handlers, onAnimationComplete } = useRipple(
    buttonRef,
    { color: rippleColorMap[variant] },
  );

  return (
    <button
      ref={buttonRef}
      data-cursor="fade"
      className={cn(
        "group relative h-auto w-50 cursor-pointer overflow-hidden rounded-full border-none p-1 shadow-md outline-none transition-shadow duration-300 focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
        styles.wrapper,
        className,
      )}
      onMouseEnter={handlers.onMouseEnter}
      onMouseLeave={handlers.onMouseLeave}
      onMouseMove={handlers.onMouseMove}
      onMouseDown={handlers.onMouseDown}
      {...props}
    >
      <span className="relative z-3 flex items-center h-12 pointer-events-none">
        <span
          className={cn(
            "flex shrink-0 items-center justify-center size-12 rounded-full",
            styles.circle,
          )}
          aria-hidden="true"
        >
          <Icon
            icon="solar:arrow-right-line-duotone"
            className={cn(
              "size-6 duration-500 group-hover:translate-x-[0.15rem]",
              styles.arrow,
            )}
          />
        </span>
        <span
          className={cn(
            "flex-1 text-center font-medium tracking-tight whitespace-nowrap duration-500",
            styles.text,
          )}
        >
          {label}
        </span>
      </span>

      <AnimatePresence>
        {ripple && rippleStyle && rippleMotionProps && (
          <motion.span
            key={ripple.key}
            className="absolute rounded-full pointer-events-none z-1"
            style={rippleStyle}
            {...rippleMotionProps}
            onAnimationComplete={onAnimationComplete}
          />
        )}
      </AnimatePresence>
    </button>
  );
}

export { CTAButton }

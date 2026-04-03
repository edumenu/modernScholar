"use client"

import { useCallback, useRef, useState } from "react";
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { motion, AnimatePresence } from "motion/react";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button relative overflow-hidden transition-all inline-flex shrink-0 items-center justify-center rounded-md border border-transparent text-sm cursor-pointer font-medium whitespace-nowrap outline-none select-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:text-white shadow-neu-primary aria-expanded:bg-primary aria-expanded:text-primary-foreground",
        outline:
          "border bg-input/30 border-border hover:text-white border-2 shadow-neu-outline aria-expanded:bg-muted aria-expanded:text-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:text-white shadow-neu-secondary aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "font-heading text-surface-tint hover:text-white shadow-none aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:text-white shadow-neu-outline focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40",
        link: "shadow-none text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-9 gap-1.5 px-3 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5",
        xs: "h-6 gap-1 px-2.5 text-xs has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1 px-3 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        lg: "h-10 gap-1.5 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        icon: "size-9",
        "icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

/**
 * Ripple fill color per variant, using design system tokens.
 * Maps to CSS custom properties defined in globals.css.
 */
const rippleColorMap: Record<string, string> = {
  default: "var(--primary-600)",
  outline: "var(--primary-100)",
  secondary: "var(--secondary-950)",
  ghost: "var(--primary-100)",
  destructive: "var(--destructive)",
  link: "transparent",
};

interface RippleState {
  x: number;
  y: number;
  size: number;
  key: number;
  isLeaving?: boolean;
}

type ButtonProps = ButtonPrimitive.Props & VariantProps<typeof buttonVariants>;

function Button({
  className,
  variant = "default",
  size = "default",
  children,
  ...props
}: ButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [ripple, setRipple] = useState<RippleState | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const hasRipple = variant !== "link";

  const createRipple = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (isHovered || !buttonRef.current) return;
      setIsHovered(true);

      const rect = buttonRef.current.getBoundingClientRect();
      const rippleSize = Math.max(rect.width, rect.height) * 2;
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      setRipple({ x, y, size: rippleSize, key: Date.now() });
    },
    [isHovered],
  );

  const removeRipple = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (event.target !== event.currentTarget) return;
      setIsHovered(false);

      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      const rippleSize = Math.max(rect.width, rect.height) * 2;
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      setRipple({ x, y, size: rippleSize, key: Date.now(), isLeaving: true });
    },
    [],
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!buttonRef.current || !isHovered || !ripple) return;

      const rect = buttonRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      setRipple((prev) => (prev ? { ...prev, x, y } : null));
    },
    [isHovered, ripple],
  );

  return (
    <ButtonPrimitive
      ref={buttonRef}
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      onMouseEnter={
        hasRipple
          ? (e: React.MouseEvent<HTMLButtonElement>) => {
              if (e.target === e.currentTarget) createRipple(e);
            }
          : undefined
      }
      onMouseLeave={
        hasRipple
          ? (e: React.MouseEvent<HTMLButtonElement>) => {
              if (e.target === e.currentTarget) removeRipple(e);
            }
          : undefined
      }
      onMouseMove={hasRipple ? handleMouseMove : undefined}
      {...props}
    >
      <span className="relative z-2 inline-flex items-center gap-inherit">
        {children}
      </span>

      {hasRipple && (
        <AnimatePresence>
          {ripple && (
            <motion.span
              key={ripple.key}
              className="absolute rounded-full pointer-events-none z-1"
              style={{
                width: ripple.size,
                height: ripple.size,
                left: ripple.x,
                top: ripple.y,
                x: "-50%",
                y: "-50%",
                backgroundColor: rippleColorMap[variant ?? "default"],
              }}
              initial={{ scale: 0, opacity: 0.6 }}
              animate={{
                scale: ripple.isLeaving ? 0 : 1,
                opacity: ripple.isLeaving ? 0 : 1,
                x: "-50%",
                y: "-50%",
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
              }}
              onAnimationComplete={() => {
                if (ripple.isLeaving) {
                  setRipple(null);
                }
              }}
            />
          )}
        </AnimatePresence>
      )}
    </ButtonPrimitive>
  );
}

export { Button, buttonVariants }

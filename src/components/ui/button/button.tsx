"use client"

import { useCallback, useRef, useState } from "react";
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { motion, AnimatePresence } from "motion/react";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button relative overflow-hidden transition-all inline-flex shrink-0 items-center justify-center rounded-full border border-transparent text-sm cursor-pointer font-medium whitespace-nowrap outline-none select-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:text-white shadow-neu-primary aria-expanded:bg-primary aria-expanded:text-primary-foreground",
        outline:
          "border bg-input/30 border-border hover:text-white border-2 shadow-neu-outline aria-expanded:bg-muted aria-expanded:text-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:text-white shadow-neu-secondary aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        tertiary:
          "bg-tertiary text-tertiary-foreground text-white shadow-neu-tertiary aria-expanded:bg-tertiary aria-expanded:text-tertiary-foreground",
        ghost:
          "text-surface-tint hover:text-primary-400 shadow-none aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:text-white shadow-neu-outline focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40",
        link: "shadow-none text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-11 [--btn-h:2.75rem] [--btn-gap:0.75rem] px-5 has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        xs: "h-7 [--btn-h:1.75rem] [--btn-gap:0.5rem] px-2.5 text-xs has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3.5",
        sm: "h-8.5 [--btn-h:2.125rem] [--btn-gap:0.625rem] px-3.5 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5",
        lg: "h-13 [--btn-h:3.25rem] [--btn-gap:0.75rem] px-7 text-base has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5 [&_svg:not([class*='size-'])]:size-5",
        xl: "h-15 [--btn-h:3.75rem] [--btn-gap:0.875rem] px-8 text-lg has-data-[icon=inline-end]:pr-6 has-data-[icon=inline-start]:pl-6 [&_svg:not([class*='size-'])]:size-5",
        icon: "size-11",
        "icon-xs": "size-7 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-sm": "size-8.5",
        "icon-lg": "size-13 [&_svg:not([class*='size-'])]:size-5",
        "icon-xl": "size-15 [&_svg:not([class*='size-'])]:size-5",
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
  tertiary: "var(--tertiary-900)",
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
  snap?: boolean;
}

type ButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    animateIcon?: boolean;
    animateText?: boolean;
    hoverTrigger?: "self" | "parent";
  };

function Button({
  className,
  variant = "default",
  size = "default",
  animateIcon = false,
  animateText = false,
  hoverTrigger = "self",
  children,
  ...props
}: ButtonProps) {
  const isParent = hoverTrigger === "parent";

  const buttonRef = useRef<HTMLButtonElement>(null);
  const [ripple, setRipple] = useState<RippleState | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const hasRipple = variant !== "link";

  const createRipple = useCallback(
    (event: Pick<React.MouseEvent<HTMLButtonElement>, "clientX" | "clientY">) => {
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
    (event: Pick<React.MouseEvent<HTMLButtonElement>, "clientX" | "clientY">) => {
      setIsHovered(false);

      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      const rippleSize = Math.max(rect.width, rect.height) * 1;
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      setRipple({ x, y, size: rippleSize, key: Date.now(), isLeaving: true });
    },
    [],
  );

  const snapRipple = useCallback(() => {
    setRipple((prev) => (prev ? { ...prev, snap: true } : null));
  }, []);

  const clearRipple = useCallback(() => {
    setRipple(null);
    setIsHovered(false);
  }, []);

  const handleMouseMove = useCallback(
    (event: Pick<React.MouseEvent<HTMLButtonElement>, "clientX" | "clientY">) => {
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
      data-cursor="fade"
      className={cn(
        buttonVariants({ variant, size, className }),
        animateIcon &&
          (isParent
            ? "**:data-icon:max-w-0 **:data-icon:overflow-hidden **:data-icon:opacity-0 **:data-[icon=inline-start]:-translate-x-2 **:data-[icon=inline-end]:translate-x-2 group-hover:**:data-icon:max-w-6 group-hover:**:data-icon:opacity-100 group-hover:**:data-icon:translate-x-0 **:data-icon:transition-all **:data-icon:duration-300"
            : "**:data-icon:max-w-0 **:data-icon:overflow-hidden **:data-icon:opacity-0 **:data-[icon=inline-start]:-translate-x-2 **:data-[icon=inline-end]:translate-x-2 hover:**:data-icon:max-w-6 hover:**:data-icon:opacity-100 hover:**:data-icon:translate-x-0 **:data-icon:transition-all **:data-icon:duration-300"),
        animateText &&
          (isParent
            ? "max-w-(--btn-h) group-hover:max-w-64 duration-300 **:data-label:max-w-0 **:data-label:overflow-hidden **:data-label:opacity-0 group-hover:**:data-label:max-w-48 group-hover:**:data-label:opacity-100 **:data-label:transition-all **:data-label:duration-300"
            : "max-w-(--btn-h) hover:max-w-64 duration-300 **:data-label:max-w-0 **:data-label:overflow-hidden **:data-label:opacity-0 hover:**:data-label:max-w-48 hover:**:data-label:opacity-100 **:data-label:transition-all **:data-label:duration-300"),
      )}
      {...props}
      onMouseEnter={
        hasRipple
          ? (e) => {
              props.onMouseEnter?.(e);
              if (e.target === e.currentTarget) createRipple(e);
            }
          : props.onMouseEnter
      }
      onMouseLeave={
        hasRipple
          ? (e) => {
              props.onMouseLeave?.(e);
              if (e.target === e.currentTarget) removeRipple(e);
            }
          : props.onMouseLeave
      }
      onClick={
        hasRipple
          ? (e) => {
              props.onClick?.(e);
              clearRipple();
            }
          : props.onClick
      }
      onMouseDown={
        hasRipple
          ? (e) => {
              props.onMouseDown?.(e);
              snapRipple();
            }
          : props.onMouseDown
      }
      onMouseMove={
        hasRipple
          ? (e) => {
              props.onMouseMove?.(e);
              handleMouseMove(e);
            }
          : props.onMouseMove
      }
    >
      <span
        className={cn(
          "relative z-2 inline-flex items-center gap-(--btn-gap)",
          (animateIcon || animateText) &&
            (isParent
              ? "gap-0 group-hover:gap-(--btn-gap) transition-[gap] duration-300"
              : "gap-0 group-hover/button:gap-(--btn-gap) transition-[gap] duration-300"),
        )}
      >
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
                duration: ripple.snap ? 0 : 0.3,
                ease: "circOut",
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

export { Button, buttonVariants, rippleColorMap };

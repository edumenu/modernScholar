"use client"

import { useRef, type ComponentProps } from "react";
import Link from "next/link";
import { type VariantProps } from "class-variance-authority"
import { motion, AnimatePresence } from "motion/react";
import { useRipple } from "@/hooks/use-ripple";

import { cn } from "@/lib/utils"
import { buttonVariants, rippleColorMap } from "./button"

type ButtonLinkProps = ComponentProps<typeof Link> &
  VariantProps<typeof buttonVariants> & {
    animateIcon?: boolean;
    animateText?: boolean;
    hoverTrigger?: "self" | "parent";
  };

function ButtonLink({
  className,
  variant = "default",
  size = "default",
  animateIcon = false,
  animateText = false,
  hoverTrigger = "self",
  children,
  ...props
}: ButtonLinkProps) {
  const isParent = hoverTrigger === "parent";

  const linkRef = useRef<HTMLAnchorElement>(null);
  const hasRipple = variant !== "link";

  const { ripple, rippleStyle, rippleMotionProps, handlers, onAnimationComplete } = useRipple(
    linkRef,
    { color: rippleColorMap[variant ?? "default"], disabled: !hasRipple },
  );

  return (
    <Link
      ref={linkRef}
      data-slot="button-link"
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
      onMouseEnter={
        hasRipple
          ? (e: React.MouseEvent<HTMLAnchorElement>) => {
              if (e.target === e.currentTarget) handlers.onMouseEnter?.(e);
            }
          : undefined
      }
      onMouseLeave={
        hasRipple
          ? (e: React.MouseEvent<HTMLAnchorElement>) => {
              if (e.target === e.currentTarget) handlers.onMouseLeave?.(e);
            }
          : undefined
      }
      onMouseDown={hasRipple ? () => handlers.onMouseDown?.() : undefined}
      onMouseMove={hasRipple ? (e: React.MouseEvent<HTMLAnchorElement>) => handlers.onMouseMove?.(e) : undefined}
      {...props}
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
      )}
    </Link>
  );
}

export { ButtonLink }

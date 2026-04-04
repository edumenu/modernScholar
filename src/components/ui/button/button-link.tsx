"use client"

import { useCallback, useRef, useState, type ComponentProps } from "react";
import Link from "next/link";
import { type VariantProps } from "class-variance-authority"
import { motion, AnimatePresence } from "motion/react";

import { cn } from "@/lib/utils"
import { buttonVariants, rippleColorMap } from "./button"

interface RippleState {
  x: number;
  y: number;
  size: number;
  key: number;
  isLeaving?: boolean;
}

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
  const [ripple, setRipple] = useState<RippleState | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const hasRipple = variant !== "link";

  const createRipple = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (isHovered || !linkRef.current) return;
      setIsHovered(true);

      const rect = linkRef.current.getBoundingClientRect();
      const rippleSize = Math.max(rect.width, rect.height) * 2;
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      setRipple({ x, y, size: rippleSize, key: Date.now() });
    },
    [isHovered],
  );

  const removeRipple = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (event.target !== event.currentTarget) return;
      setIsHovered(false);

      if (!linkRef.current) return;
      const rect = linkRef.current.getBoundingClientRect();
      const rippleSize = Math.max(rect.width, rect.height) * 2;
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      setRipple({ x, y, size: rippleSize, key: Date.now(), isLeaving: true });
    },
    [],
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (!linkRef.current || !isHovered || !ripple) return;

      const rect = linkRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      setRipple((prev) => (prev ? { ...prev, x, y } : null));
    },
    [isHovered, ripple],
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
              if (e.target === e.currentTarget) createRipple(e);
            }
          : undefined
      }
      onMouseLeave={
        hasRipple
          ? (e: React.MouseEvent<HTMLAnchorElement>) => {
              if (e.target === e.currentTarget) removeRipple(e);
            }
          : undefined
      }
      onMouseMove={hasRipple ? handleMouseMove : undefined}
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
    </Link>
  );
}

export { ButtonLink }

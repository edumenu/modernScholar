"use client"

import {
  useCallback,
  useRef,
  useState,
  type ComponentProps,
  type FC,
} from "react";
import { Icon } from "@iconify/react"
import { motion, AnimatePresence } from "motion/react";

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

interface RippleState {
  x: number;
  y: number;
  size: number;
  key: number;
  isLeaving?: boolean;
}

const CTAButton: FC<CTAButtonProps> = ({
  label,
  variant = "primary",
  className,
  ...props
}) => {
  const styles = variantStyles[variant]
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [ripple, setRipple] = useState<RippleState | null>(null);
  const [isHovered, setIsHovered] = useState(false);

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
    <button
      ref={buttonRef}
      data-cursor="fade"
      className={cn(
        "group relative h-auto w-50 cursor-pointer overflow-hidden rounded-full border-none p-1 shadow-md outline-none transition-shadow duration-300 focus-visible:ring-[3px] focus-visible:ring-ring/50",
        styles.wrapper,
        className,
      )}
      onMouseEnter={createRipple}
      onMouseLeave={removeRipple}
      onMouseMove={handleMouseMove}
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
              backgroundColor: rippleColorMap[variant],
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
                setRipple((prev) =>
                  prev && prev.key === ripple.key ? null : prev,
                );
              }
            }}
          />
        )}
      </AnimatePresence>
    </button>
  );
}

export { CTAButton }

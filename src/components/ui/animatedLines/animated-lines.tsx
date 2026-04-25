"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion, type TargetAndTransition } from "motion/react";
import { cn } from "@/lib/utils";
import { useContainerWidth } from "@/lib/pretext/use-container-width";
import { useTextLines } from "@/lib/pretext/use-text-lines";

type AnimationVariant = "fadeUp" | "blurIn" | "slideUp" | "revealUp";

const lineVariants: Record<
  AnimationVariant,
  { initial: TargetAndTransition; animate: TargetAndTransition }
> = {
  fadeUp: {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
  },
  blurIn: {
    initial: { opacity: 0, filter: "blur(6px)" },
    animate: { opacity: 1, filter: "blur(0px)" },
  },
  slideUp: {
    initial: { opacity: 0, y: 48 },
    animate: { opacity: 1, y: 0 },
  },
  revealUp: {
    initial: { opacity: 1, y: "120%" },
    animate: { opacity: 1, y: 0 },
  },
};

interface AnimatedLinesProps {
  text: string;
  font: string;
  /** System fallback font for CLS prevention (e.g. "700 48px serif") */
  fallbackFont?: string;
  lineHeight: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  /** Classes for the outer wrapper that controls width measurement (e.g. "max-w-3xl mx-auto") */
  wrapperClassName?: string;
  staggerDelay?: number;
  initialDelay?: number;
  variant?: AnimationVariant;
  /** "lines" animates per rendered line (default), "chars" animates per character */
  mode?: "lines" | "chars";
}

/**
 * Splits text into its actual rendered lines (via pretext measurement)
 * and animates each line in with a staggered Motion animation.
 *
 * In "chars" mode, each character is animated individually — useful for
 * large display headings like page titles.
 */
export function AnimatedLines({
  text,
  font,
  fallbackFont,
  lineHeight,
  as: Tag = "p",
  className,
  wrapperClassName,
  staggerDelay = 0.1,
  initialDelay = 0,
  variant = "fadeUp",
  mode = "lines",
}: AnimatedLinesProps) {
  const measureRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const width = useContainerWidth(measureRef);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const prefersReducedMotion = useReducedMotion();

  const { lines, isReady } = useTextLines({
    text,
    font,
    fallbackFont,
    maxWidth: width,
    lineHeight,
  });

  const { initial, animate } = lineVariants[variant];

  if (prefersReducedMotion) {
    return (
      <div ref={sectionRef} className="w-full">
        <div ref={measureRef} className={cn("w-full", wrapperClassName)}>
          <Tag className={cn(className)}>{text}</Tag>
        </div>
      </div>
    );
  }

  if (mode === "chars") {
    const chars = text.split("");

    return (
      <div ref={sectionRef} className="w-full">
        <div className={cn("w-full", wrapperClassName)}>
          <Tag className={cn(className)}>
            <span className="sr-only">{text}</span>
            {chars.map((char, i) => (
              <span
                key={`${i}-${char}`}
                className="inline-block overflow-hidden pt-[0.1em] pb-[0.2em]"
                aria-hidden="true"
              >
                <motion.span
                  className="inline-block"
                  initial={initial}
                  animate={isInView ? animate : initial}
                  transition={
                    variant === "revealUp"
                      ? {
                          duration: 1.2,
                          ease: [0.4, 0, 0, 1],
                          delay: initialDelay + i * staggerDelay,
                        }
                      : {
                          duration: 0.6,
                          ease: [0.22, 1, 0.36, 1],
                          delay: initialDelay + i * staggerDelay,
                        }
                  }
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              </span>
            ))}
          </Tag>
        </div>
      </div>
    );
  }

  return (
    <div ref={sectionRef} className="w-full">
      <div ref={measureRef} className={cn("w-full", wrapperClassName)}>
        <Tag className={cn(className)}>
          {!isReady && (
            <span className="invisible" aria-hidden="true">
              {text}
            </span>
          )}

          {isReady && (
            <span className="sr-only">{text}</span>
          )}
          {isReady &&
            lines.map((line, i) => (
              <motion.span
                key={`${i}-${line}`}
                className="block"
                aria-hidden="true"
                initial={initial}
                animate={isInView ? animate : initial}
                transition={{
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                  delay: initialDelay + i * staggerDelay,
                }}
              >
                {line}
              </motion.span>
            ))}
        </Tag>
      </div>
    </div>
  );
}

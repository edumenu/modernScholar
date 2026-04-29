"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  motion,
  useReducedMotion,
  type PanInfo,
} from "motion/react";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button/button";
import type { Scholarship } from "@/data/scholarships";
import { CLASSIFICATION_COLORS, getClassificationTint } from "@/data/scholarships";

/* ------------------------------------------------------------------ */
/*  Transform config                                                   */
/* ------------------------------------------------------------------ */

const SPRING = { stiffness: 260, damping: 26, mass: 1 };

/** Compute wrapped offset in range [-total/2, total/2) */
function wrapOffset(raw: number, total: number): number {
  const half = total / 2;
  let o = ((raw % total) + total) % total;
  if (o >= half) o -= total;
  return o;
}

interface TransformValues {
  x: number;
  rotateY: number;
  z: number;
  scale: number;
  opacity: number;
  zIndex: number;
}

function getTransformValues(
  offset: number,
  containerWidth: number,
): TransformValues {
  const isMobile = containerWidth < 640;
  const xScale = isMobile ? 0.6 : 1;

  const abs = Math.abs(offset);
  if (abs === 0) {
    return { x: 0, rotateY: 0, z: 0, scale: 1.1, opacity: 1, zIndex: 5 };
  }
  if (abs === 1) {
    const sign = offset > 0 ? 1 : -1;
    return {
      x: sign * 280 * xScale,
      rotateY: sign * -35,
      z: -120,
      scale: 0.85,
      opacity: 0.85,
      zIndex: 4,
    };
  }
  if (abs === 2) {
    const sign = offset > 0 ? 1 : -1;
    return {
      x: sign * 480 * xScale,
      rotateY: sign * -45,
      z: -220,
      scale: 0.7,
      opacity: 0.6,
      zIndex: 3,
    };
  }
  // Beyond visible range — hide but keep in DOM
  const sign = offset > 0 ? 1 : -1;
  return {
    x: sign * 600 * xScale,
    rotateY: sign * -50,
    z: -300,
    scale: 0.5,
    opacity: 0,
    zIndex: 1,
  };
}

/* ------------------------------------------------------------------ */
/*  CoverflowCard — Immersive Tonal (tall variant)                     */
/* ------------------------------------------------------------------ */

function CoverflowCard({
  scholarship,
  isCenter,
  onClick,
}: {
  scholarship: Scholarship;
  isCenter: boolean;
  onClick: () => void;
}) {
  const tint = getClassificationTint(scholarship.classification);

  return (
    <button
      type="button"
      onClick={onClick}
      data-cursor="text"
      data-cursor-text={isCenter ? "View" : "Focus"}
      className={cn(
        "relative flex h-full w-80 shrink-0 flex-col cursor-pointer overflow-hidden rounded-2xl outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "shadow-[0_6px_32px_rgba(32,26,25,0.07)]",
        "group",
        tint.bg,
        tint.border,
      )}
    >
      {/* Top: Education level pills */}
      <div className="flex flex-wrap items-center gap-1.5 px-6 pt-6">
        {scholarship.classification.slice(0, 2).map((level) => {
          const colors = CLASSIFICATION_COLORS[level];
          return (
            <span
              key={level}
              className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5",
                "text-[10px] font-semibold tracking-wider uppercase",
                colors.bg,
                colors.text,
              )}
            >
              {level}
            </span>
          );
        })}
      </div>

      {/* Spacer for generous whitespace */}
      <div className="flex-1" />

      {/* Title + gradient-fade underline */}
      <div className="flex flex-col gap-3 px-6">
        <h3
          className={cn(
            "text-left font-heading text-xl font-bold leading-tight",
            tint.text,
            "line-clamp-2",
          )}
        >
          {scholarship.name}
        </h3>
        <div
          className={cn(
            "h-px w-2/3 bg-linear-to-r to-transparent transition-all duration-300 group-hover:w-full",
            tint.accent,
          )}
          aria-hidden="true"
        />
      </div>

      {/* Provider */}
      <p className={cn("px-6 pt-3 text-left text-xs font-medium", tint.muted)}>
        {scholarship.provider}
      </p>

      {/* Display amount */}
      <div className="flex items-end gap-1.5 px-6 pt-4">
        <Icon
          icon="solar:wallet-money-linear"
          className={cn("mb-0.5 size-4 shrink-0", tint.muted)}
        />
        <span
          className={cn(
            "font-heading text-2xl font-bold leading-none tracking-tight",
            tint.text,
          )}
        >
          {scholarship.awardAmount}
        </span>
      </div>

      {/* Deadline */}
      <div className={cn("flex items-center gap-1.5 px-6 pb-6 pt-2 text-xs", tint.muted)}>
        <Icon icon="solar:calendar-linear" className="size-3.5 shrink-0" />
        <span>Deadline {scholarship.deadline}</span>
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Reduced motion fallback                                            */
/* ------------------------------------------------------------------ */

function ReducedMotionFallback({
  scholarships,
}: {
  scholarships: Scholarship[];
}) {
  const router = useRouter();

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured scholarships"
      className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4"
    >
      {scholarships.map((s) => (
        <div key={s.id} className="h-120 w-80 shrink-0 snap-center">
          <CoverflowCard
            scholarship={s}
            isCenter={false}
            onClick={() => router.push(`/scholarships?q=${encodeURIComponent(s.name)}`)}
          />
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  CoverflowCarousel                                                  */
/* ------------------------------------------------------------------ */

export function CoverflowCarousel({
  scholarships,
}: {
  scholarships: Scholarship[];
}) {
  const shouldReduceMotion = useReducedMotion();
  const router = useRouter();
  const total = scholarships.length;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(1024);

  // Measure container via ResizeObserver — more accurate than window resize events
  // because it fires on element-level size changes (e.g. sidebar open/close)
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex(((index % total) + total) % total);
    },
    [total],
  );

  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const prev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  // Autoplay
  useEffect(() => {
    if (shouldReduceMotion || isPaused || isDragging) return;
    const timer = setInterval(next, 8000);
    return () => clearInterval(timer);
  }, [shouldReduceMotion, isPaused, isDragging, next]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
    },
    [next, prev],
  );

  // Drag handler
  const handleDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      setIsDragging(false);
      const threshold = 50;
      const velocity = 500;
      if (info.offset.x < -threshold || info.velocity.x < -velocity) {
        next();
      } else if (info.offset.x > threshold || info.velocity.x > velocity) {
        prev();
      }
    },
    [next, prev],
  );

  const handleCardClick = useCallback(
    (index: number) => {
      if (index === activeIndex) {
        router.push(`/scholarships?q=${encodeURIComponent(scholarships[index].name)}`);
      } else {
        goTo(index);
      }
    },
    [activeIndex, goTo, router, scholarships],
  );

  if (shouldReduceMotion) {
    return <ReducedMotionFallback scholarships={scholarships} />;
  }

  return (
    <div
      ref={containerRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured scholarships"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="group relative outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-4 py-20"
    >
      {/* Live region for screen readers */}
      <div aria-live="polite" className="sr-only">
        {scholarships[activeIndex].name} — {scholarships[activeIndex].provider}
      </div>

      {/* 3D Stage */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.15}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        className="pointer-events-none relative flex h-120 items-center justify-center"
        style={{ perspective: 1200 }}
      >
        {scholarships.map((scholarship, i) => {
          const rawOffset = i - activeIndex;
          const offset = wrapOffset(rawOffset, total);
          const t = getTransformValues(offset, containerWidth);

          return (
            <motion.div
              key={scholarship.id}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${total}: ${scholarship.name}`}
              className="pointer-events-auto absolute h-120"
              animate={{
                x: t.x,
                rotateY: t.rotateY,
                z: t.z,
                scale: t.scale,
                opacity: t.opacity,
              }}
              transition={SPRING}
              style={{
                zIndex: t.zIndex,
                transformStyle: "preserve-3d",
                willChange: "transform",
              }}
            >
              <CoverflowCard
                scholarship={scholarship}
                isCenter={offset === 0}
                onClick={() => handleCardClick(i)}
              />
            </motion.div>
          );
        })}
      </motion.div>

      {/* Arrow buttons — visible on hover, use margin centering to avoid translate conflict with Button active state */}
      <Button
        variant="ghost"
        size="icon-lg"
        aria-label="Previous scholarship"
        onClick={(e) => { e.stopPropagation(); prev(); }}
        className="absolute inset-y-0 left-2 z-20 my-auto opacity-100 transition-opacity group-hover:opacity-100 sm:left-4"
      >
        <Icon icon="solar:arrow-left-line-duotone" />
      </Button>
      <Button
        variant="ghost"
        size="icon-lg"
        aria-label="Next scholarship"
        onClick={(e) => { e.stopPropagation(); next(); }}
        className="absolute inset-y-0 right-2 z-20 my-auto opacity-100 transition-opacity group-hover:opacity-100 sm:right-4"
      >
        <Icon icon="solar:arrow-right-line-duotone" />
      </Button>
    </div>
  );
}

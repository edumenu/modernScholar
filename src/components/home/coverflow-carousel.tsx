"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
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
import {
  CLASSIFICATION_COLORS,
  getClassificationTint,
  isScholarshipActive,
} from "@/data/scholarships";
import { getEligibilityTagLabel } from "@/lib/eligibility";
import { SESSION_DATE } from "@/lib/session-date";

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
/*  CoverflowCard — Stat-First Specimen (tall variant)                 */
/* ------------------------------------------------------------------ */

function MetaItem({
  label,
  value,
  tintMuted,
  tintText,
}: {
  label: string;
  value: string;
  tintMuted: string;
  tintText: string;
}) {
  return (
    <div className="min-w-0">
      <dt
        className={cn(
          "text-[9px] font-semibold uppercase tracking-widest",
          tintMuted,
        )}
      >
        {label}
      </dt>
      <dd
        className={cn(
          "mt-1 line-clamp-2 text-[11px] font-medium leading-snug wrap-break-word",
          tintText,
        )}
      >
        {value}
      </dd>
    </div>
  );
}

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

  const seasonLabel = `${scholarship.season} '${String(
    scholarship.deadlineYear,
  ).slice(-2)}`;
  const eligibilityLabel =
    scholarship.eligibilityTags.length > 0
      ? scholarship.eligibilityTags
          .slice(0, 2)
          .map(getEligibilityTagLabel)
          .join(" · ")
      : "Open to all";
  const opensLabel = scholarship.openDate ?? "Rolling";
  const levelLabel = scholarship.classification.join(" · ");
  const deadlineLabel = `${scholarship.deadline}, ${scholarship.deadlineYear}`;

  // Scale hero amount to fit long award strings (e.g. "Up to $5,000", "105 scholarships at $25,000 each")
  const awardLength = scholarship.awardAmount.length;
  const awardSizeClass =
    awardLength > 18
      ? "text-lg leading-snug"
      : awardLength > 10
        ? "text-2xl leading-tight"
        : "text-[2.25rem] leading-none";

  return (
    <button
      type="button"
      onClick={onClick}
      data-cursor="text"
      data-cursor-text={isCenter ? "View" : "Focus"}
      className={cn(
        "relative flex h-full w-64 shrink-0 cursor-pointer flex-col overflow-hidden rounded-2xl outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:w-80",
        "shadow-[0_6px_32px_rgba(32,26,25,0.07)]",
        "group",
        tint.bg,
        // tint.border,
      )}
    >
      {/* Header: classification badges + season micro-tag */}
      <div className="flex items-start justify-between gap-2 px-5 pt-5">
        <div className="flex flex-wrap items-center gap-1.5">
          {scholarship.classification.slice(0, 2).map((level) => {
            const colors = CLASSIFICATION_COLORS[level];
            return (
              <span
                key={level}
                className={cn(
                  "inline-flex items-center rounded-full px-2 py-0.5",
                  "text-[9px] font-semibold uppercase tracking-wider",
                  colors.bg,
                  colors.text,
                )}
              >
                {level}
              </span>
            );
          })}
        </div>
        {/* <span
          className={cn(
            "shrink-0 pt-0.5 font-heading text-[10px] italic tracking-wide",
            tint.muted,
          )}
        >
          {seasonLabel}
        </span> */}
      </div>

      {/* Hero amount */}
      <div className="px-5 pt-6 text-left">
        <p
          className={cn(
            "text-[9px] font-semibold uppercase tracking-[0.25em]",
            tint.muted,
          )}
        >
          Award
        </p>
        <p
          className={cn(
            "mt-1.5 line-clamp-2 wrap-break-word font-heading font-bold tracking-tight",
            awardSizeClass,
            tint.text,
          )}
        >
          {scholarship.awardAmount}
        </p>
      </div>

      {/* Hairline rule with classification dot */}
      <div className="relative mx-5 mt-5 h-px" aria-hidden="true">
        <div
          className={cn(
            "absolute inset-0 bg-linear-to-r to-transparent",
            tint.accent,
          )}
        />
        <div
          className={cn(
            "absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full",
          )}
        />
      </div>

      {/* Two-column metadata grid */}
      <dl className="grid grid-cols-2 gap-x-3 gap-y-3 px-5 pt-4 text-left">
        <MetaItem
          label="Eligibility"
          value={eligibilityLabel}
          tintMuted={tint.muted}
          tintText={tint.text}
        />
        <MetaItem
          label="Opens"
          value={opensLabel}
          tintMuted={tint.muted}
          tintText={tint.text}
        />
        <MetaItem
          label="Level"
          value={levelLabel}
          tintMuted={tint.muted}
          tintText={tint.text}
        />
        <MetaItem
          label="Deadline"
          value={deadlineLabel}
          tintMuted={tint.muted}
          tintText={tint.text}
        />
      </dl>

      <div className="flex-1" />

      {/* Specimen name (title) + provider at the bottom */}
      <div className="flex flex-col items-start justify-start gap-1.5 px-5 py-12 text-left">
        <div
          className={cn(
            "h-px w-2/3 bg-linear-to-r to-transparent transition-all duration-300 group-hover:w-full",
            tint.accent,
          )}
          aria-hidden="true"
        />
        <h2
          className={cn(
            "line-clamp-2 font-heading text-base font-bold leading-tight sm:text-xl",
            tint.text,
          )}
        >
          {scholarship.name}
        </h2>
        <p className={cn("line-clamp-1 text-[11px] font-medium", tint.muted)}>
          {scholarship.provider}
        </p>
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
        <div key={s.id} className="h-100 w-64 shrink-0 snap-center sm:h-120 sm:w-80">
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
  scholarships: scholarshipsProp,
}: {
  scholarships: Scholarship[];
}) {
  const shouldReduceMotion = useReducedMotion();
  const router = useRouter();
  // Filter to active-only at the source so every downstream consumer
  // (autoplay, drag, keyboard nav, live region) only sees open scholarships.
  // Memoize against scholarshipsProp so autoplay re-renders don't rebuild the
  // array; SESSION_DATE keeps the snapshot stable across the session.
  const scholarships = useMemo(
    () =>
      scholarshipsProp.filter((s) => isScholarshipActive(s, SESSION_DATE)),
    [scholarshipsProp],
  );
  const total = scholarships.length;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
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

  // Autoplay — also pauses when the carousel has keyboard focus so SR users
  // aren't interrupted every 8s by the live region announcing a new slide.
  useEffect(() => {
    if (shouldReduceMotion || isPaused || isDragging || isFocused) return;
    const timer = setInterval(next, 8000);
    return () => clearInterval(timer);
  }, [shouldReduceMotion, isPaused, isDragging, isFocused, next]);

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

  // Drag handler — gate on horizontal-dominant motion so vertical page scrolls
  // through the carousel area on touch devices don't trigger horizontal nav.
  const handleDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      setIsDragging(false);
      if (Math.abs(info.offset.x) <= Math.abs(info.offset.y)) return;
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
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
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
        // dragDirectionLock makes Motion only report movement on whichever
        // axis the user starts in — prevents vertical page-scroll gestures
        // on touch from being misread as horizontal carousel nav.
        dragDirectionLock
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        className="pointer-events-none relative flex h-100 items-center justify-center sm:h-120"
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
              className="pointer-events-auto absolute h-100 sm:h-120"
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
                willChange: Math.abs(offset) <= 1 ? "transform" : "auto",
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

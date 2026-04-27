"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  type PanInfo,
} from "motion/react";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button/button";
import { useTextLayout } from "@/lib/pretext/use-text-layout";
import { PRETEXT_FONTS } from "@/lib/pretext/fonts";
import type { Scholarship } from "@/data/scholarships";
import { generateGradient } from "@/data/scholarships";

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
/*  Card text width constants (matches card w-80 minus p-5 * 2)        */
/* ------------------------------------------------------------------ */

const CARD_TEXT_WIDTH = 280;
const TITLE_LINE_HEIGHT = 25;
const PROVIDER_LINE_HEIGHT = 20;

/* ------------------------------------------------------------------ */
/*  CoverflowCard                                                      */
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
  const isGradient = scholarship.image === "gradient";

  const { lineCount: titleLines } = useTextLayout({
    text: scholarship.name,
    font: PRETEXT_FONTS.cardTitle,
    maxWidth: CARD_TEXT_WIDTH,
    lineHeight: TITLE_LINE_HEIGHT,
  });

  const { lineCount: providerLines } = useTextLayout({
    text: scholarship.provider,
    font: PRETEXT_FONTS.bodySmall,
    maxWidth: CARD_TEXT_WIDTH,
    lineHeight: PROVIDER_LINE_HEIGHT,
  });

  const titleOverflows = titleLines > 1;
  const providerOverflows = providerLines > 1;

  return (
    <button
      type="button"
      onClick={onClick}
      data-cursor="text"
      data-cursor-text={isCenter ? "View" : "Focus"}
      className={cn(
        "relative block h-full w-80 shrink-0 cursor-pointer overflow-hidden rounded-2xl shadow-lg outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "group",
      )}
    >
      {isGradient ? (
        <div
          className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
          style={{ background: generateGradient(scholarship.id) }}
        />
      ) : (
        <Image
          src={scholarship.image}
          alt={scholarship.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="320px"
        />
      )}
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col justify-between p-5">
        {/* Top: Education level pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {scholarship.classification.slice(0, 2).map((level) => (
            <span
              key={level}
              className="inline-flex items-center gap-1.5 rounded-full bg-tertiary/40 px-3 py-1 shadow-[2px_2px_4px_rgba(0,0,0,0.1),-1px_-1px_3px_rgba(255,255,255,0.1)]"
            >
              <span className="size-1.5 rounded-full bg-white" />
              <span className="text-xs uppercase tracking-widest text-white">
                {level}
              </span>
            </span>
          ))}
        </div>

        {/* Bottom: Info */}
        <div className="flex items-end justify-start gap-3">
          <div className="flex min-w-0 flex-col gap-1">
            <h3
              className="truncate text-left text-lg font-medium leading-snug text-white"
              title={titleOverflows ? scholarship.name : undefined}
            >
              {scholarship.name}
            </h3>
            <p
              className="truncate text-left text-sm text-white/80"
              title={providerOverflows ? scholarship.provider : undefined}
            >
              {scholarship.provider}
            </p>
            <p className="text-left text-sm text-white/70">
              <span className="font-medium text-white">
                {scholarship.awardAmount}
              </span>{" "}
              &middot; {scholarship.deadline}
            </p>
          </div>
        </div>
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
            onClick={() => router.push(`/scholarships?q=${s.id}`)}
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

  // Measure container
  useEffect(() => {
    function measure() {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
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
    const timer = setInterval(next, 4000);
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
        router.push(`/scholarships?q=${scholarships[index].id}`);
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

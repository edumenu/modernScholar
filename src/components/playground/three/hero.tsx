"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";
import { AdminBuilding } from "./admin-building";

const CHIPS = [
  {
    label: "148 applications reviewed",
    dot: "var(--pg3-grass)",
    className: "left-[2%] top-[16%] md:left-[6%]",
    depth: 70,
    delay: 1.7,
    bob: 4.2,
    rotate: -4,
  },
  {
    label: "$1.2M awarded this cycle",
    dot: "var(--pg3-marigold)",
    className: "right-[1%] top-[8%] md:right-[5%]",
    depth: 90,
    delay: 1.82,
    bob: 5,
    rotate: 3,
  },
  {
    label: "Deadline synced — relax",
    dot: "var(--pg3-sky)",
    className: "bottom-[30%] left-[1%] hidden md:block md:left-[3%]",
    depth: 110,
    delay: 1.94,
    bob: 4.6,
    rotate: 2,
  },
  {
    label: "Committee of 9, zero email chains",
    dot: "var(--pg3-coral)",
    className: "bottom-[22%] right-[2%] hidden md:block md:right-[4%]",
    depth: 60,
    delay: 2.06,
    bob: 5.4,
    rotate: -3,
  },
];

export function Hero() {
  const reduceMotion = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), {
    stiffness: 120,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), {
    stiffness: 120,
    damping: 18,
  });

  function handlePointerMove(event: React.PointerEvent<HTMLElement>) {
    if (reduceMotion) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    mx.set((event.clientX - bounds.left) / bounds.width - 0.5);
    my.set((event.clientY - bounds.top) / bounds.height - 0.5);
  }

  function handlePointerLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <section
      id="top"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative overflow-hidden px-4 pb-10 pt-32 md:pt-40"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, type: "spring", stiffness: 190, damping: 20 }}
          className="pg3-mono pg3-sticker-sm rounded-full bg-[var(--pg3-cloud)] px-4 py-1.5 text-[11px] uppercase tracking-[0.18em]"
        >
          Scholarship Administration · Est. Today
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 160, damping: 20 }}
          className="pg3-display mt-6 text-balance text-[clamp(2.9rem,8.5vw,7rem)] leading-[0.98]"
        >
          Every scholarship.
          <br />
          One{" "}
          <span className="pg3-serif italic font-normal text-[var(--pg3-terracotta)]">
            office.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, type: "spring", stiffness: 160, damping: 20 }}
          className="mt-6 max-w-xl text-pretty text-base font-medium text-[var(--pg3-ink-soft)] md:text-lg"
        >
          Quad is the administration building your scholarship program never
          had — applications, reviews, budgets, and awards, all under one very
          handsome roof.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 160, damping: 20 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#finale"
            className="pg3-btn rounded-full bg-[var(--pg3-marigold)] px-7 py-3.5 text-sm font-bold"
          >
            Book a tour
          </a>
          <a
            href="#rooms"
            className="pg3-btn rounded-full bg-[var(--pg3-cloud)] px-7 py-3.5 text-sm font-bold"
          >
            Peek inside ↓
          </a>
        </motion.div>
      </div>

      {/* Building scene with 3D mouse tilt */}
      <div className="mx-auto mt-10 max-w-4xl md:mt-6" style={{ perspective: 1400 }}>
        <motion.div
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="relative"
        >
          <AdminBuilding />

          {CHIPS.map((chip) => (
            <div
              key={chip.label}
              className={cn("absolute", chip.className)}
              style={{ transform: `translateZ(${chip.depth}px)` }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.5, rotate: chip.rotate * 3 }}
                animate={{ opacity: 1, scale: 1, rotate: chip.rotate }}
                transition={{
                  delay: chip.delay,
                  type: "spring",
                  stiffness: 260,
                  damping: 15,
                }}
              >
                <motion.div
                  animate={reduceMotion ? undefined : { y: [0, -9, 0] }}
                  transition={{
                    duration: chip.bob,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="pg3-sticker-sm flex items-center gap-2 rounded-full bg-[var(--pg3-cloud)] px-3.5 py-2 text-[11px] font-bold md:text-xs"
                >
                  <span
                    aria-hidden
                    className="size-2.5 rounded-full border-2 border-[var(--pg3-ink)]"
                    style={{ background: chip.dot }}
                  />
                  {chip.label}
                </motion.div>
              </motion.div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

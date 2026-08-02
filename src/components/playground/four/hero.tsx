"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";

const AdminBuildingScene = dynamic(
  () =>
    import("./admin-building-scene").then((m) => m.AdminBuildingScene),
  {
    ssr: false,
    loading: () => null,
  },
);

const EASE = [0.16, 1, 0.3, 1] as const;

function fadeUp(delay: number) {
  return {
    initial: { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, ease: EASE, delay },
  };
}

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-svh flex-col overflow-hidden">
      <div className="pg4-blueprint absolute inset-0" aria-hidden />

      {/* Corner coordinates, survey-plate style */}
      <div
        className="pg4-mono pointer-events-none absolute inset-x-6 top-20 z-10 flex justify-between text-[10px] uppercase text-[var(--pg4-ink-soft)] md:inset-x-10"
        aria-hidden
      >
        <motion.span {...fadeUp(0.9)}>Fig. 01 — Administration Hall</motion.span>
        <motion.span {...fadeUp(1.0)} className="hidden sm:inline">
          Scale 1:200
        </motion.span>
        <motion.span {...fadeUp(1.1)} className="hidden md:inline">
          34.1478° N / 118.1445° W
        </motion.span>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col items-center px-6 pt-28 text-center md:px-10 md:pt-32">
        <motion.p
          {...fadeUp(0.15)}
          className="pg4-mono text-[11px] uppercase text-[var(--pg4-blue)]"
        >
          The scholarship administration platform
        </motion.p>

        <h1 className="pg4-display mt-6 text-[clamp(2.2rem,11vw,7.25rem)]">
          <motion.span {...fadeUp(0.3)} className="block">
            Administration,
          </motion.span>
          <motion.span {...fadeUp(0.45)} className="pg4-outline block">
            rebuilt<span className="text-[var(--pg4-blue)] [-webkit-text-stroke:0]">.</span>
          </motion.span>
        </h1>

        <motion.p
          {...fadeUp(0.6)}
          className="mt-6 max-w-xl text-balance text-[15px] leading-relaxed text-[var(--pg4-ink-soft)] md:text-base"
        >
          Modern Scholar is the operating system for scholarship programs —
          eligibility, review, awarding, and reporting engineered into one calm,
          exact surface.
        </motion.p>

        <motion.div {...fadeUp(0.75)} className="mt-8 flex items-center gap-4">
          <a
            href="#access"
            className="pg4-mono whitespace-nowrap bg-[var(--pg4-ink)] px-5 py-3.5 text-[11px] uppercase text-[var(--pg4-paper)] transition-colors hover:bg-[var(--pg4-blue)] sm:px-7"
          >
            Request access
          </a>
          <a
            href="#platform"
            className="pg4-mono whitespace-nowrap border border-[var(--pg4-line)] px-5 py-3.5 text-[11px] uppercase text-[var(--pg4-ink)] transition-colors hover:border-[var(--pg4-ink)] sm:px-7"
          >
            See the platform
          </a>
        </motion.div>
      </div>

      {/* The administration building, assembling itself. The canvas is taller
          than its layout box and bottom-anchored, so the model's empty sky
          overlaps the text block instead of pushing the hero past the fold. */}
      <div className="relative mt-auto h-[42svh] w-full md:h-[40svh]">
        <div
          className="pg4-ground-shadow absolute bottom-[10%] left-1/2 h-[16%] w-[min(680px,80vw)] -translate-x-1/2"
          aria-hidden
        />
        <div className="absolute inset-x-0 bottom-0 h-[46svh]">
          <AdminBuildingScene />
        </div>
      </div>

      <div
        className="pg4-mono pointer-events-none absolute bottom-6 left-6 z-10 hidden text-[10px] uppercase text-[var(--pg4-ink-soft)] md:block md:left-10"
        aria-hidden
      >
        Est. 2026 — Pasadena, CA
      </div>
      <div
        className="pg4-scroll-cue pg4-mono pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-[10px] uppercase text-[var(--pg4-ink)]"
        aria-hidden
      >
        Scroll ↓
      </div>
      <div
        className="pg4-mono pointer-events-none absolute bottom-6 right-6 z-10 hidden text-[10px] uppercase text-[var(--pg4-ink-soft)] md:block md:right-10"
        aria-hidden
      >
        SOC 2 Type II / FERPA ready
      </div>
    </section>
  );
}

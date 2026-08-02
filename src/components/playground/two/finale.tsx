"use client";

import Link from "next/link";
import { motion } from "motion/react";

const reveal = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function Finale() {
  return (
    <section
      id="begin"
      aria-labelledby="pg2-begin-heading"
      className="pg2-speckles relative flex min-h-dvh flex-col justify-center overflow-hidden bg-[var(--pg2-void)] px-5 pt-32 pb-10 md:px-10"
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 45% at 50% 110%, rgba(240,194,92,0.14), transparent 70%), radial-gradient(60% 50% at 30% 20%, rgba(36,30,63,0.5), transparent 70%)",
        }}
      />

      <motion.div
        variants={reveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-15% 0px" }}
        className="relative z-10 mx-auto my-auto flex max-w-4xl flex-col items-center text-center"
      >
        <p className="pg2-mono mb-6 text-[11px] font-medium tracking-[0.32em] text-[var(--pg2-star)] uppercase">
          Free for students
        </p>
        <h2
          id="pg2-begin-heading"
          className="pg2-display text-[clamp(3rem,8vw,7rem)] leading-[0.98] text-[var(--pg2-moon)]"
        >
          Begin your <em className="text-[var(--pg2-star)] italic">ascent.</em>
        </h2>
        <p className="mt-6 max-w-md leading-relaxed text-[var(--pg2-dusk)]">
          Five minutes to your first constellation. No credit card, no
          spreadsheet, no searching in the dark.
        </p>
        <a
          href="#sky"
          className="group relative mt-10 overflow-hidden rounded-full bg-[var(--pg2-star)] px-10 py-5 text-base font-semibold text-[var(--pg2-void)] transition-shadow duration-300 hover:shadow-[0_0_60px_rgba(240,194,92,0.4)]"
        >
          <span className="relative z-10">Start charting — it&apos;s free</span>
          <span
            aria-hidden
            className="absolute inset-0 -translate-x-full bg-[var(--pg2-star-soft)] transition-transform duration-500 ease-out group-hover:translate-x-0"
          />
        </a>
      </motion.div>

      <footer className="relative z-10 border-t border-[var(--pg2-line-dark)] pt-8">
        <div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-4">
          <p className="pg2-display text-lg text-[var(--pg2-moon)] italic">
            Modern Scholar
          </p>
          <p className="pg2-mono text-[10px] tracking-[0.18em] text-[var(--pg2-dusk)] uppercase">
            Playground Two — a concept study. Fraunces · Instrument Sans · Three.js · Motion
          </p>
          <div className="pg2-mono flex gap-6 text-[10px] tracking-[0.18em] uppercase">
            <Link
              href="/"
              className="text-[var(--pg2-dusk)] transition-colors hover:text-[var(--pg2-star)]"
            >
              Current home
            </Link>
            <Link
              href="/playgroundOne"
              className="text-[var(--pg2-dusk)] transition-colors hover:text-[var(--pg2-star)]"
            >
              Playground One
            </Link>
          </div>
        </div>
      </footer>
    </section>
  );
}

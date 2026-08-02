"use client";

import { motion } from "motion/react";

const CONFETTI = [
  { className: "left-[8%] top-[18%]", color: "var(--pg3-coral)", rotate: -12, delay: 0 },
  { className: "left-[22%] top-[68%]", color: "var(--pg3-sky)", rotate: 18, delay: 0.4 },
  { className: "right-[10%] top-[24%]", color: "var(--pg3-grass)", rotate: 24, delay: 0.8 },
  { className: "right-[24%] top-[70%]", color: "var(--pg3-cloud)", rotate: -20, delay: 1.2 },
];

export function Finale() {
  return (
    <>
      <section
        id="finale"
        className="relative scroll-mt-24 overflow-hidden border-t-2 border-[var(--pg3-ink)] bg-[var(--pg3-marigold)] px-4 py-28 md:py-36"
      >
        {CONFETTI.map((piece) => (
          <motion.span
            key={piece.className}
            aria-hidden
            initial={{ rotate: piece.rotate }}
            animate={{ y: [0, -16, 0], rotate: [piece.rotate, piece.rotate + 12, piece.rotate] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: piece.delay }}
            className={`absolute hidden h-7 w-5 rounded-md border-2 border-[var(--pg3-ink)] md:block ${piece.className}`}
            style={{ background: piece.color }}
          />
        ))}

        <div className="relative mx-auto max-w-3xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 34 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ type: "spring", stiffness: 170, damping: 20 }}
            className="pg3-display text-balance text-5xl md:text-7xl"
          >
            Class is in{" "}
            <span className="pg3-serif italic font-normal text-[var(--pg3-terracotta)]">
              session.
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ type: "spring", stiffness: 170, damping: 20, delay: 0.1 }}
            className="mx-auto mt-6 max-w-xl text-pretty text-base font-semibold md:text-lg"
          >
            Move your scholarship program into the administration building it
            deserves. Set-up takes an afternoon, not a semester.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ type: "spring", stiffness: 170, damping: 20, delay: 0.2 }}
            className="mt-10"
          >
            <a
              href="#top"
              className="pg3-btn inline-block rounded-full bg-[var(--pg3-ink)] px-9 py-4 text-base font-bold text-[var(--pg3-cloud)]"
            >
              Enroll your program — it&apos;s free
            </a>
          </motion.div>
        </div>
      </section>

      <footer className="border-t-2 border-[var(--pg3-ink)] bg-[var(--pg3-paper)] px-4 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
          <p className="pg3-display text-lg">Quad</p>
          <p className="pg3-mono text-[11px] uppercase tracking-[0.18em] text-[var(--pg3-ink-soft)]">
            Playground Three — a concept study for Modern Scholar
          </p>
          <a
            href="#top"
            className="text-sm font-semibold text-[var(--pg3-ink-soft)] transition-colors hover:text-[var(--pg3-ink)]"
          >
            Back to the quad ↑
          </a>
        </div>
      </footer>
    </>
  );
}

"use client";

import { motion } from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;

const QUEUE = [
  { name: "A. Okonkwo", program: "STEM Futures Grant", score: 94, status: "Advance" },
  { name: "M. Herrera", program: "First-Gen Fellows", score: 91, status: "Advance" },
  { name: "J. Lindqvist", program: "Merit Award '26", score: 88, status: "Committee" },
  { name: "T. Nguyen", program: "STEM Futures Grant", score: 84, status: "Committee" },
  { name: "R. Achebe", program: "Arts Residency", score: 79, status: "Hold" },
];

const BARS = [42, 68, 55, 88, 74, 96, 63, 81];

export function ConsolePreview() {
  return (
    <section id="console" className="border-y border-[var(--pg4-line)] bg-[var(--pg4-panel)]">
      <div className="mx-auto max-w-[1440px] px-6 py-24 md:px-10 md:py-32">
        <div className="max-w-2xl">
          <p className="pg4-mono text-[11px] uppercase text-[var(--pg4-blue)]">
            2.0 — Console
          </p>
          <h2 className="pg4-display mt-4 text-[clamp(2rem,4.5vw,3.6rem)]">
            One console for the whole awarding season.
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-[var(--pg4-ink-soft)]">
            The review queue, committee scores, and disbursement ledger share a
            single state — change a rubric and every downstream number updates in
            place.
          </p>
        </div>

        <div className="relative mt-16">
          {/* Main console panel */}
          <motion.div
            initial={{ opacity: 0, y: 48 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 0.9, ease: EASE }}
            className="border border-[var(--pg4-line)] bg-white shadow-[0_32px_64px_-32px_rgba(20,21,25,0.18)]"
          >
            <div className="flex items-center justify-between border-b border-[var(--pg4-line)] px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="inline-block size-2 rounded-full bg-[var(--pg4-blue)]" />
                <span className="pg4-mono text-[11px] uppercase">Review queue — Fall cycle</span>
              </div>
              <span className="pg4-mono hidden text-[10px] uppercase text-[var(--pg4-ink-soft)] sm:inline">
                318 pending / 1,204 total
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px]">
              <div>
                {QUEUE.map((row) => (
                  <div
                    key={row.name}
                    className="pg4-console-row flex items-center justify-between gap-4 px-6 py-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{row.name}</p>
                      <p className="pg4-mono mt-0.5 truncate text-[10px] uppercase text-[var(--pg4-ink-soft)]">
                        {row.program}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-4">
                      <span className="pg4-mono text-[11px] text-[var(--pg4-ink)]">{row.score}</span>
                      <span
                        className={`pg4-mono px-2.5 py-1 text-[10px] uppercase ${
                          row.status === "Advance"
                            ? "bg-[var(--pg4-blue-soft)] text-[var(--pg4-blue)]"
                            : row.status === "Committee"
                              ? "bg-[var(--pg4-paper)] text-[var(--pg4-ink)]"
                              : "bg-transparent text-[var(--pg4-ink-soft)]"
                        }`}
                      >
                        {row.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-[var(--pg4-line)] p-6 lg:border-l lg:border-t-0">
                <p className="pg4-mono text-[10px] uppercase text-[var(--pg4-ink-soft)]">
                  Disbursement — weekly
                </p>
                {/* Stagger is driven from this container: a scaleY(0) bar has a
                    zero-height rect, so per-bar viewport triggers never fire. */}
                <motion.div
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-15% 0px" }}
                  variants={{
                    show: { transition: { staggerChildren: 0.06, delayChildren: 0.3 } },
                  }}
                  className="mt-6 flex h-32 items-end gap-2"
                >
                  {BARS.map((h, i) => (
                    <motion.div
                      key={i}
                      variants={{
                        hidden: { scaleY: 0 },
                        show: { scaleY: 1, transition: { duration: 0.7, ease: EASE } },
                      }}
                      style={{ height: `${h}%` }}
                      className={`flex-1 origin-bottom ${i === 5 ? "bg-[var(--pg4-blue)]" : "bg-[var(--pg4-ivory)]"}`}
                    />
                  ))}
                </motion.div>
                <div className="mt-6 border-t border-[var(--pg4-line-soft)] pt-4">
                  <p className="pg4-display text-3xl">$2.4M</p>
                  <p className="pg4-mono mt-1 text-[10px] uppercase text-[var(--pg4-ink-soft)]">
                    Cleared this week
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Floating annotation cards */}
          <motion.div
            initial={{ opacity: 0, y: 32, rotate: -1.5 }}
            whileInView={{ opacity: 1, y: 0, rotate: -1.5 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.25 }}
            className="absolute -top-8 right-4 hidden border border-[var(--pg4-line)] bg-[var(--pg4-paper)] px-5 py-4 shadow-[0_16px_32px_-16px_rgba(20,21,25,0.25)] md:block"
          >
            <p className="pg4-mono text-[10px] uppercase text-[var(--pg4-ink-soft)]">Blind review</p>
            <p className="mt-1 text-sm font-medium">
              Names hidden until scores lock
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32, rotate: 1.5 }}
            whileInView={{ opacity: 1, y: 0, rotate: 1.5 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.4 }}
            className="absolute -bottom-8 left-4 hidden border border-[var(--pg4-line)] bg-[var(--pg4-ink)] px-5 py-4 text-[var(--pg4-paper)] shadow-[0_16px_32px_-16px_rgba(20,21,25,0.35)] md:block"
          >
            <p className="pg4-mono text-[10px] uppercase text-[var(--pg4-paper)]/60">Audit trail</p>
            <p className="mt-1 text-sm font-medium">Every decision, timestamped</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

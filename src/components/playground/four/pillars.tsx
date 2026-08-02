"use client";

import { motion } from "motion/react";

const PILLARS = [
  {
    num: "1.1",
    title: "Discover",
    copy: "A living registry of verified programs. Dead links pruned, deadlines tracked, eligibility tagged — before an applicant ever sees them.",
  },
  {
    num: "1.2",
    title: "Review",
    copy: "Rubric-driven scoring routed to the right committee, with blind-review modes and conflict-of-interest checks built into the flow.",
  },
  {
    num: "1.3",
    title: "Award",
    copy: "Offers, acceptances, and disbursement schedules in one ledger. Every dollar reconciled against the fund it came from.",
  },
  {
    num: "1.4",
    title: "Report",
    copy: "Board-ready reporting in one export: demographics, yield, dollars out the door — auditable back to the source record.",
  },
];

const EASE = [0.16, 1, 0.3, 1] as const;

export function Pillars() {
  return (
    <section id="platform" className="mx-auto max-w-[1440px] px-6 py-24 md:px-10 md:py-32">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="pg4-mono text-[11px] uppercase text-[var(--pg4-blue)]">
            1.0 — Platform
          </p>
          <h2 className="pg4-display mt-4 max-w-2xl text-[clamp(2rem,4.5vw,3.6rem)]">
            The full life of an award, under one roof.
          </h2>
        </div>
        <p className="pg4-mono max-w-xs text-[11px] uppercase leading-relaxed text-[var(--pg4-ink-soft)]">
          Four wings. One foundation. No spreadsheets holding up the ceiling.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 border-l border-t border-[var(--pg4-line)] sm:grid-cols-2 xl:grid-cols-4">
        {PILLARS.map((pillar, i) => (
          <motion.article
            key={pillar.num}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.7, ease: EASE, delay: i * 0.08 }}
            className="group relative border-b border-r border-[var(--pg4-line)] bg-[var(--pg4-panel)] p-8 transition-colors hover:bg-[var(--pg4-ink)] md:p-10"
          >
            <p className="pg4-mono text-[11px] text-[var(--pg4-blue)] transition-colors group-hover:text-[var(--pg4-paper)]">
              {pillar.num}
            </p>
            <h3 className="pg4-display mt-16 text-2xl transition-colors group-hover:text-[var(--pg4-paper)] md:mt-24">
              {pillar.title}
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-[var(--pg4-ink-soft)] transition-colors group-hover:text-[var(--pg4-paper)]/70">
              {pillar.copy}
            </p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

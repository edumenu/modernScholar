"use client";

import { motion } from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;

const STEPS = [
  {
    num: "01",
    title: "Import your programs",
    copy: "Bring funds, cycles, and historical awards in from spreadsheets or your SIS. We reconcile duplicates on the way in.",
  },
  {
    num: "02",
    title: "Configure eligibility",
    copy: "Express requirements as rules, not prose. Applicants see only what they qualify for; reviewers never screen the unqualified.",
  },
  {
    num: "03",
    title: "Route the reviews",
    copy: "Committees, rubrics, blind modes, and recusals set once per cycle. Scores roll up the moment the last reader submits.",
  },
  {
    num: "04",
    title: "Disburse and report",
    copy: "Award letters, acceptance tracking, and payment schedules close the loop — with an export your auditors will actually accept.",
  },
];

export function Process() {
  return (
    <section id="onboarding" className="border-t border-[var(--pg4-line)] bg-[var(--pg4-panel)]">
      <div className="mx-auto max-w-[1440px] px-6 py-24 md:px-10 md:py-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="pg4-mono text-[11px] uppercase text-[var(--pg4-blue)]">
              4.0 — Onboarding
            </p>
            <h2 className="pg4-display mt-4 max-w-2xl text-[clamp(2rem,4.5vw,3.6rem)]">
              Live before the next deadline.
            </h2>
          </div>
          <p className="pg4-mono max-w-xs text-[11px] uppercase leading-relaxed text-[var(--pg4-ink-soft)]">
            Most programs onboard in under three weeks.
          </p>
        </div>

        <div className="mt-14">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.7, ease: EASE, delay: i * 0.06 }}
              className="group grid grid-cols-[auto_1fr] items-baseline gap-x-6 border-t border-[var(--pg4-line)] py-8 transition-colors last:border-b hover:bg-white md:grid-cols-[120px_1fr_1fr] md:gap-x-10 md:py-10"
            >
              <span className="pg4-display text-2xl text-[var(--pg4-ink-soft)] transition-colors group-hover:text-[var(--pg4-blue)] md:text-3xl">
                {step.num}
              </span>
              <h3 className="pg4-display text-xl md:text-2xl">{step.title}</h3>
              <p className="col-start-2 mt-3 max-w-lg text-sm leading-relaxed text-[var(--pg4-ink-soft)] md:col-start-3 md:mt-0">
                {step.copy}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

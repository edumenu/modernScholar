"use client";

import { motion } from "motion/react";

const STEPS = [
  {
    number: "01",
    title: "Post your program",
    copy: "Set the award, the criteria, and the deadline. Quad builds the application page and starts the clock.",
    accent: "var(--pg3-sky)",
    rotate: -2.5,
  },
  {
    number: "02",
    title: "Review together",
    copy: "Invite your committee, score on shared rubrics, and watch consensus form in real time — no attachments.",
    accent: "var(--pg3-marigold)",
    rotate: 1.8,
  },
  {
    number: "03",
    title: "Award & report",
    copy: "Notify winners, schedule disbursements, and send donors a report they will actually read.",
    accent: "var(--pg3-grass)",
    rotate: -1.6,
  },
];

export function Steps() {
  return (
    <section id="steps" className="scroll-mt-24 px-4 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="pg3-mono text-xs uppercase tracking-[0.18em] text-[var(--pg3-ink-soft)]">
            Office hours
          </p>
          <h2 className="pg3-display mt-3 text-balance text-4xl md:text-6xl">
            Three steps to{" "}
            <span className="pg3-serif italic font-normal text-[var(--pg3-terracotta)]">
              commencement
            </span>
          </h2>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <motion.article
              key={step.number}
              initial={{ opacity: 0, y: 50, rotate: 0 }}
              whileInView={{ opacity: 1, y: 0, rotate: step.rotate }}
              whileHover={{ rotate: 0, y: -6 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ type: "spring", stiffness: 180, damping: 18, delay: i * 0.12 }}
              className="pg3-sticker rounded-3xl bg-[var(--pg3-cloud)] p-8"
            >
              <span
                className="pg3-display pg3-sticker-sm inline-grid size-12 place-items-center rounded-xl text-lg"
                style={{ background: step.accent }}
              >
                {step.number}
              </span>
              <h3 className="pg3-display mt-6 text-2xl">{step.title}</h3>
              <p className="mt-3 text-sm font-medium leading-relaxed text-[var(--pg3-ink-soft)]">
                {step.copy}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

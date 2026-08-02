"use client";

import { motion } from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;

const METRICS = [
  { value: "$142M", label: "Disbursed through the platform last cycle" },
  { value: "11 days", label: "Average application-to-decision time" },
  { value: "96.4%", label: "Awards released on schedule" },
  { value: "0", label: "Spreadsheets required" },
];

export function Metrics() {
  return (
    <section id="outcomes" className="mx-auto max-w-[1440px] px-6 py-24 md:px-10 md:py-32">
      <p className="pg4-mono text-[11px] uppercase text-[var(--pg4-blue)]">
        3.0 — Outcomes
      </p>

      <div className="mt-12 grid grid-cols-1 gap-x-10 sm:grid-cols-2 xl:grid-cols-4">
        {METRICS.map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.7, ease: EASE, delay: i * 0.08 }}
            className="border-t border-[var(--pg4-ink)] pb-10 pt-6"
          >
            <p className="pg4-display text-[clamp(2.6rem,5vw,4.2rem)]">
              {metric.value}
            </p>
            <p className="pg4-mono mt-3 max-w-[26ch] text-[11px] uppercase leading-relaxed text-[var(--pg4-ink-soft)]">
              {metric.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

"use client";

import { motion } from "motion/react";

const VOICES = [
  {
    quote:
      "We ran our whole cycle out of one browser tab. Our old process was eleven spreadsheets and a prayer.",
    name: "Marisol V.",
    role: "Foundation Director",
    accent: "var(--pg3-marigold)",
  },
  {
    quote:
      "The committee actually finished reviewing early. I did not know that was legal.",
    name: "Devon A.",
    role: "Scholarship Chair",
    accent: "var(--pg3-sky)",
  },
  {
    quote:
      "Donor reports went from a two-week scramble to a coffee break. Quad pays for itself in dignity alone.",
    name: "Priya N.",
    role: "Programs Manager",
    accent: "var(--pg3-grass)",
  },
];

export function Voices() {
  return (
    <section
      id="voices"
      className="scroll-mt-24 border-t-2 border-[var(--pg3-ink)] bg-[var(--pg3-cloud)] px-4 py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="pg3-mono text-xs uppercase tracking-[0.18em] text-[var(--pg3-ink-soft)]">
            From the yearbook
          </p>
          <h2 className="pg3-display mt-3 text-balance text-4xl md:text-6xl">
            Voted{" "}
            <span className="pg3-serif italic font-normal text-[var(--pg3-terracotta)]">
              most likely
            </span>{" "}
            to be renewed
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {VOICES.map((voice, i) => (
            <motion.figure
              key={voice.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ type: "spring", stiffness: 190, damping: 20, delay: i * 0.1 }}
              className="pg3-sticker flex flex-col justify-between rounded-3xl bg-[var(--pg3-paper)] p-7"
            >
              <blockquote className="pg3-serif text-xl leading-snug md:text-2xl">
                “{voice.quote}”
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-3">
                <span
                  aria-hidden
                  className="pg3-display pg3-sticker-sm grid size-11 place-items-center rounded-full text-sm"
                  style={{ background: voice.accent }}
                >
                  {voice.name[0]}
                </span>
                <span>
                  <span className="block text-sm font-bold">{voice.name}</span>
                  <span className="pg3-mono block text-[11px] uppercase tracking-wider text-[var(--pg3-ink-soft)]">
                    {voice.role}
                  </span>
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

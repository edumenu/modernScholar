"use client";

import { motion } from "motion/react";

const reveal = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const voices = [
  {
    quote: "It felt less like a database and more like someone finally drew me a map.",
    name: "Devon R.",
    detail: "$12,000 · community college transfer",
  },
  {
    quote: "The deadline choreography alone is worth it. I never opened a spreadsheet again.",
    name: "Priya S.",
    detail: "$9,500 · biomedical engineering",
  },
  {
    quote: "My counselor uses my sky in our meetings now. We just point at stars.",
    name: "Marcus T.",
    detail: "$21,000 · first-gen senior",
  },
];

export function Voices() {
  return (
    <section
      id="stories"
      aria-labelledby="pg2-stories-heading"
      className="bg-[var(--pg2-parchment)] px-5 py-24 md:px-10 md:py-36"
    >
      <motion.div
        variants={reveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-15% 0px" }}
        className="mx-auto max-w-5xl"
      >
        <p
          id="pg2-stories-heading"
          className="pg2-mono mb-10 text-center text-[11px] font-medium tracking-[0.32em] text-[var(--pg2-gold-deep)] uppercase"
        >
          Stories
        </p>
        <blockquote className="text-center">
          <p className="pg2-display text-[clamp(1.9rem,4.5vw,3.75rem)] leading-[1.15] text-[var(--pg2-ink)]">
            <span aria-hidden className="text-[var(--pg2-gold-deep)]">
              &ldquo;
            </span>
            I stopped scrolling spreadsheets and started watching my own sky.
            Three months later — <em className="text-[var(--pg2-gold-deep)] italic">$28,000.</em>
            <span aria-hidden className="text-[var(--pg2-gold-deep)]">
              &rdquo;
            </span>
          </p>
          <footer className="pg2-mono mt-8 text-[11px] tracking-[0.2em] text-[var(--pg2-umber)] uppercase">
            Amara O. — first-gen sophomore, Ohio State
          </footer>
        </blockquote>
      </motion.div>

      <div className="mx-auto mt-20 grid max-w-5xl gap-6 md:grid-cols-3">
        {voices.map((voice, i) => (
          <motion.figure
            key={voice.name}
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl border border-[var(--pg2-line)] bg-[var(--pg2-paper)] p-6"
          >
            <blockquote className="mb-6 leading-relaxed text-[var(--pg2-ink)]">
              &ldquo;{voice.quote}&rdquo;
            </blockquote>
            <figcaption>
              <p className="pg2-display text-lg text-[var(--pg2-ink)]">{voice.name}</p>
              <p className="pg2-mono mt-1 text-[10px] tracking-[0.16em] text-[var(--pg2-gold-deep)] uppercase">
                {voice.detail}
              </p>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}

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

const cards = [
  {
    match: 98,
    title: "Horizon STEM Fellowship",
    provider: "Meridian Foundation",
    amount: "$25,000",
    deadline: "Due Mar 14",
    tags: ["STEM", "Undergrad", "National"],
    rotate: -1.4,
  },
  {
    match: 94,
    title: "First-Gen Futures Grant",
    provider: "Bright Path Trust",
    amount: "$10,000",
    deadline: "Due Apr 02",
    tags: ["First-gen", "Any major"],
    rotate: 0.9,
  },
  {
    match: 91,
    title: "Kestrel Creative Arts Award",
    provider: "The Kestrel Society",
    amount: "$7,500",
    deadline: "Due Mar 28",
    tags: ["Arts", "Portfolio"],
    rotate: -0.7,
  },
  {
    match: 89,
    title: "Northstar Nursing Scholarship",
    provider: "Aster Health Collective",
    amount: "$18,000",
    deadline: "Due May 09",
    tags: ["Nursing", "Ohio"],
    rotate: 1.2,
  },
];

export function Showcase() {
  return (
    <section
      id="brightest"
      aria-labelledby="pg2-brightest-heading"
      className="bg-[var(--pg2-paper)] px-5 pb-24 md:px-10 md:pb-36"
    >
      <motion.div
        variants={reveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-15% 0px" }}
        className="mb-14 flex flex-wrap items-end justify-between gap-6 md:mb-20"
      >
        <div>
          <p className="pg2-mono mb-4 text-[11px] font-medium tracking-[0.32em] text-[var(--pg2-gold-deep)] uppercase">
            Tonight&apos;s brightest
          </p>
          <h2
            id="pg2-brightest-heading"
            className="pg2-display max-w-2xl text-[clamp(2.4rem,5.5vw,4.5rem)] leading-[1.02] text-[var(--pg2-ink)]"
          >
            Four stars over
            <br />
            your <em className="italic">horizon.</em>
          </h2>
        </div>
        <p className="pg2-mono max-w-xs text-[11px] leading-relaxed tracking-[0.14em] text-[var(--pg2-umber)] uppercase">
          A sample sky, drawn from a fictional profile
        </p>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card, i) => (
          <motion.article
            key={card.title}
            initial={{ opacity: 0, y: 40, rotate: card.rotate }}
            whileInView={{ opacity: 1, y: 0, rotate: card.rotate }}
            whileHover={{ y: -10, rotate: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{
              duration: 0.7,
              delay: i * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex flex-col rounded-2xl border border-[var(--pg2-line)] bg-[var(--pg2-parchment)] p-6 shadow-[0_20px_50px_-30px_rgba(26,23,18,0.35)]"
          >
            <div className="mb-8 flex items-center justify-between">
              <span className="pg2-mono flex items-center gap-2 text-[11px] font-semibold tracking-[0.14em] text-[var(--pg2-gold-deep)] uppercase">
                <span className="size-1.5 rounded-full bg-[var(--pg2-gold-deep)]" />
                {card.match}% match
              </span>
              <span className="pg2-mono rounded-full border border-[var(--pg2-line)] px-3 py-1 text-[10px] tracking-[0.12em] text-[var(--pg2-umber)] uppercase">
                {card.deadline}
              </span>
            </div>

            <h3 className="pg2-display mb-1 text-2xl leading-snug text-[var(--pg2-ink)]">
              {card.title}
            </h3>
            <p className="mb-8 text-sm text-[var(--pg2-umber)]">{card.provider}</p>

            <p className="pg2-display mt-auto mb-6 text-4xl text-[var(--pg2-gold-deep)]">
              {card.amount}
            </p>

            <div className="flex flex-wrap gap-2 border-t border-[var(--pg2-line)] pt-5">
              {card.tags.map((tag) => (
                <span
                  key={tag}
                  className="pg2-mono text-[10px] tracking-[0.16em] text-[var(--pg2-umber)] uppercase"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

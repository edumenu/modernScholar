"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const reveal = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
  },
};

function ProfileVisual() {
  const chips = ["First-gen", "Nursing", "3.7 GPA", "Ohio", "Transfer", "Volunteer EMT"];
  return (
    <div className="flex flex-wrap content-center gap-2.5">
      {chips.map((chip, i) => (
        <span
          key={chip}
          className={cn(
            "pg2-mono rounded-full border px-4 py-2 text-[11px] tracking-[0.12em] uppercase",
            i === 1
              ? "border-[var(--pg2-gold-deep)] bg-[var(--pg2-star)] font-semibold text-[var(--pg2-void)]"
              : "border-[var(--pg2-line)] text-[var(--pg2-umber)]",
          )}
        >
          {chip}
        </span>
      ))}
    </div>
  );
}

function SkyVisual() {
  const dots = [
    [18, 96], [52, 34], [88, 118], [122, 22], [150, 84], [196, 46], [226, 108], [72, 72],
  ];
  const gold = [1, 4, 5, 7];
  const path = "52,34 72,72 150,84 196,46";
  return (
    <svg
      viewBox="0 0 248 140"
      className="h-auto w-full max-w-[320px]"
      aria-hidden
    >
      <polyline
        points={path}
        fill="none"
        stroke="var(--pg2-gold-deep)"
        strokeWidth="1"
        strokeDasharray="3 4"
      />
      {dots.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={gold.includes(i) ? 4 : 2.5}
          fill={gold.includes(i) ? "var(--pg2-gold-deep)" : "var(--pg2-line)"}
        />
      ))}
    </svg>
  );
}

function CopilotVisual() {
  const rows = [
    { label: "Essay draft v3 reviewed", done: true },
    { label: "Recommender nudged", done: true },
    { label: "Submit by Mar 14", done: false },
  ];
  return (
    <div className="w-full max-w-[320px] rounded-2xl border border-[var(--pg2-line)] bg-[var(--pg2-parchment)] p-5">
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex items-center gap-3 border-b border-[var(--pg2-line)] py-3 text-sm text-[var(--pg2-ink)] last:border-b-0"
        >
          <span
            className={cn(
              "pg2-mono flex size-5 shrink-0 items-center justify-center rounded-full text-[10px]",
              row.done
                ? "bg-[var(--pg2-gold-deep)] text-[var(--pg2-paper)]"
                : "border border-[var(--pg2-gold-deep)] text-[var(--pg2-gold-deep)]",
            )}
          >
            {row.done ? "✓" : "→"}
          </span>
          {row.label}
        </div>
      ))}
    </div>
  );
}

const steps = [
  {
    number: "01",
    title: "Tell the sky who you are",
    body: "Two minutes of story — first-gen, field of study, GPA, zip code — becomes the coordinates we search by. No forms that feel like forms.",
    visual: <ProfileVisual />,
  },
  {
    number: "02",
    title: "Watch your constellation assemble",
    body: "Overnight, twelve thousand awards are scored against your story. Only the ones worth your time are drawn into your sky — ranked, mapped, explained.",
    visual: <SkyVisual />,
  },
  {
    number: "03",
    title: "Fly with a co-pilot",
    body: "Deadlines choreographed, essays versioned, recommenders nudged at exactly the right moment. You do the writing. We do the navigating.",
    visual: <CopilotVisual />,
  },
];

export function Method() {
  return (
    <section
      id="method"
      aria-labelledby="pg2-method-heading"
      className="bg-[var(--pg2-paper)] px-5 py-24 md:px-10 md:py-36"
    >
      <motion.div
        variants={reveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-15% 0px" }}
        className="mb-16 md:mb-24"
      >
        <p className="pg2-mono mb-4 text-[11px] font-medium tracking-[0.32em] text-[var(--pg2-gold-deep)] uppercase">
          The method
        </p>
        <h2
          id="pg2-method-heading"
          className="pg2-display max-w-3xl text-[clamp(2.4rem,5.5vw,4.5rem)] leading-[1.02] text-[var(--pg2-ink)]"
        >
          From night sky
          <br />
          to <em className="italic">shortlist.</em>
        </h2>
      </motion.div>

      <div>
        {steps.map((step) => (
          <motion.div
            key={step.number}
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-12% 0px" }}
            className="grid items-center gap-x-12 gap-y-8 border-t border-[var(--pg2-line)] py-14 md:grid-cols-[minmax(120px,1fr)_2fr_2fr] md:py-20"
          >
            <span className="pg2-display pg2-outline-num text-[clamp(4rem,8vw,7.5rem)] leading-none">
              {step.number}
            </span>
            <div>
              <h3 className="pg2-display mb-4 text-3xl text-[var(--pg2-ink)] md:text-4xl">
                {step.title}
              </h3>
              <p className="max-w-md leading-relaxed text-[var(--pg2-umber)]">
                {step.body}
              </p>
            </div>
            <div className="flex md:justify-end">{step.visual}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

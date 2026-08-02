"use client";

import { motion } from "motion/react";

const ROOMS = [
  {
    number: "Room 101",
    dept: "Admissions",
    title: "One form, every applicant",
    copy: "A single beautiful application that dedupes itself, checks eligibility automatically, and never asks for a transcript twice.",
    accent: "var(--pg3-grass)",
    shape: "circle" as const,
  },
  {
    number: "Room 202",
    dept: "Review Hall",
    title: "Committees that agree",
    copy: "Blind review, shared rubrics, and live score tallies. Nine reviewers, one decision, zero reply-all threads.",
    accent: "var(--pg3-sky)",
    shape: "triangle" as const,
  },
  {
    number: "Room 305",
    dept: "The Vault",
    title: "Budgets that balance",
    copy: "Award ledgers, disbursement schedules, and rollover math handled to the cent — your finance office will send flowers.",
    accent: "var(--pg3-marigold)",
    shape: "square" as const,
  },
  {
    number: "Room 410",
    dept: "Records",
    title: "Reports in a heartbeat",
    copy: "Donor updates, compliance exports, and impact stories generated from data you already have. One click, genuinely.",
    accent: "var(--pg3-coral)",
    shape: "star" as const,
  },
];

function RoomShape({
  shape,
  accent,
}: {
  shape: "circle" | "triangle" | "square" | "star";
  accent: string;
}) {
  return (
    <svg aria-hidden viewBox="0 0 40 40" className="size-9 shrink-0">
      {shape === "circle" && (
        <circle cx={20} cy={20} r={15} fill={accent} stroke="var(--pg3-ink)" strokeWidth={2.5} />
      )}
      {shape === "triangle" && (
        <polygon
          points="20,5 36,34 4,34"
          fill={accent}
          stroke="var(--pg3-ink)"
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
      )}
      {shape === "square" && (
        <rect x={6} y={6} width={28} height={28} rx={6} fill={accent} stroke="var(--pg3-ink)" strokeWidth={2.5} />
      )}
      {shape === "star" && (
        <path
          d="M20 4 L24.2 14.6 L35.5 15.4 L26.8 22.8 L29.6 33.8 L20 27.6 L10.4 33.8 L13.2 22.8 L4.5 15.4 L15.8 14.6 Z"
          fill={accent}
          stroke="var(--pg3-ink)"
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

export function Rooms() {
  return (
    <section id="rooms" className="scroll-mt-24 px-4 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="pg3-mono text-xs uppercase tracking-[0.18em] text-[var(--pg3-ink-soft)]">
            Take the tour
          </p>
          <h2 className="pg3-display mt-3 text-balance text-4xl md:text-6xl">
            Four rooms.{" "}
            <span className="pg3-serif italic font-normal text-[var(--pg3-terracotta)]">
              Zero
            </span>{" "}
            filing cabinets.
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {ROOMS.map((room, i) => (
            <motion.article
              key={room.number}
              initial={{ opacity: 0, y: 40, rotate: i % 2 === 0 ? -1.5 : 1.5 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              whileHover={{ y: -6 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
                delay: (i % 2) * 0.08,
              }}
              className="pg3-sticker rounded-3xl bg-[var(--pg3-cloud)] p-7 md:p-9"
            >
              <div className="flex items-start justify-between gap-4">
                <div
                  className="pg3-sticker-sm inline-flex items-center gap-2 rounded-full px-3.5 py-1.5"
                  style={{ background: room.accent }}
                >
                  <span className="pg3-mono text-[11px] font-bold uppercase tracking-wider">
                    {room.number}
                  </span>
                </div>
                <RoomShape shape={room.shape} accent={room.accent} />
              </div>

              <p className="pg3-mono mt-6 text-[11px] uppercase tracking-[0.18em] text-[var(--pg3-ink-soft)]">
                Dept. of {room.dept}
              </p>
              <h3 className="pg3-display mt-2 text-2xl md:text-3xl">
                {room.title}
              </h3>
              <p className="mt-3 text-sm font-medium leading-relaxed text-[var(--pg3-ink-soft)] md:text-base">
                {room.copy}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

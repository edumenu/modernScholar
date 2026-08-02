"use client";

import { motion } from "motion/react";

const LINKS = [
  { label: "The tour", href: "#rooms" },
  { label: "Numbers", href: "#numbers" },
  { label: "How it works", href: "#steps" },
  { label: "Voices", href: "#voices" },
];

export function PgNav() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, type: "spring", stiffness: 180, damping: 20 }}
      className="fixed inset-x-4 top-4 z-50"
    >
      <nav className="pg3-sticker mx-auto flex max-w-4xl items-center justify-between gap-4 rounded-full bg-[var(--pg3-cloud)] py-2.5 pl-5 pr-2.5">
        <a href="#top" className="flex items-center gap-2.5">
          <span
            aria-hidden
            className="pg3-display grid size-8 place-items-center rounded-lg border-2 border-[var(--pg3-ink)] bg-[var(--pg3-marigold)] text-sm"
          >
            Q
          </span>
          <span className="pg3-display text-lg tracking-tight">Quad</span>
        </a>

        <ul className="hidden items-center gap-6 md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-semibold text-[var(--pg3-ink-soft)] transition-colors hover:text-[var(--pg3-ink)]"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#finale"
          className="pg3-btn rounded-full bg-[var(--pg3-coral)] px-5 py-2 text-sm font-bold text-[var(--pg3-cloud)]"
        >
          Book a tour
        </a>
      </nav>
    </motion.header>
  );
}

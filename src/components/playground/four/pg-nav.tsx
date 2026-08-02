"use client";

import { motion } from "motion/react";

const LINKS = ["Platform", "Console", "Outcomes", "Onboarding"];

export function PgNav() {
  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50 border-b border-[var(--pg4-line)] bg-[var(--pg4-paper)]/85 backdrop-blur-md"
    >
      <nav className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-6 md:px-10">
        <a href="#top" className="flex items-baseline gap-3">
          <span className="pg4-display text-[17px] tracking-tight">Modern Scholar</span>
          <span className="pg4-mono hidden text-[10px] uppercase text-[var(--pg4-ink-soft)] sm:inline">
            Admin. OS — v4.0
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((link, i) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="pg4-mono text-[11px] uppercase text-[var(--pg4-ink-soft)] transition-colors hover:text-[var(--pg4-ink)]"
            >
              {i + 1}.0&ensp;{link}
            </a>
          ))}
        </div>

        <a
          href="#access"
          className="pg4-mono border border-[var(--pg4-ink)] bg-[var(--pg4-ink)] px-5 py-2.5 text-[11px] uppercase text-[var(--pg4-paper)] transition-colors hover:bg-transparent hover:text-[var(--pg4-ink)]"
        >
          Request access
        </a>
      </nav>
    </motion.header>
  );
}

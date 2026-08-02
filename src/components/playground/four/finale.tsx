"use client";

import { motion } from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Finale() {
  return (
    <section id="access" className="relative overflow-hidden border-t border-[var(--pg4-line)]">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center px-6 py-28 text-center md:px-10 md:py-40">
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="pg4-mono text-[11px] uppercase text-[var(--pg4-blue)]"
        >
          5.0 — Access
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
          className="pg4-display mt-6 text-[clamp(2.6rem,7vw,6.5rem)]"
        >
          Rebuild your
          <br />
          <span className="pg4-outline">administration.</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.25 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#top"
            className="pg4-mono whitespace-nowrap bg-[var(--pg4-ink)] px-8 py-4 text-[11px] uppercase text-[var(--pg4-paper)] transition-colors hover:bg-[var(--pg4-blue)]"
          >
            Request access
          </a>
          <a
            href="mailto:registrar@modernscholar.example"
            className="pg4-mono whitespace-nowrap border border-[var(--pg4-line)] px-8 py-4 text-[11px] uppercase transition-colors hover:border-[var(--pg4-ink)]"
          >
            Talk to the registrar
          </a>
        </motion.div>
      </div>

      <footer className="border-t border-[var(--pg4-line)]">
        <div className="pg4-mono mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-6 py-6 text-[10px] uppercase text-[var(--pg4-ink-soft)] md:px-10">
          <span>© 2026 Modern Scholar — Admin. OS</span>
          <div className="flex gap-6">
            <a href="#top" className="transition-colors hover:text-[var(--pg4-ink)]">
              Privacy
            </a>
            <a href="#top" className="transition-colors hover:text-[var(--pg4-ink)]">
              Terms
            </a>
            <a href="#top" className="transition-colors hover:text-[var(--pg4-ink)]">
              Security
            </a>
          </div>
          <span>Fig. 05 — End of survey</span>
        </div>
      </footer>
    </section>
  );
}

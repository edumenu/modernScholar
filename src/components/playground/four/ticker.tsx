const ITEMS = [
  "$142M disbursed last cycle",
  "3,208 active programs",
  "96.4% on-time awards",
  "41 partner institutions",
  "SOC 2 Type II",
  "FERPA aligned",
  "11-day average review",
];

export function Ticker() {
  return (
    <div className="pg4-rule overflow-hidden border-b border-[var(--pg4-line)] bg-[var(--pg4-panel)] py-4">
      <div className="pg4-marquee flex w-max whitespace-nowrap">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex" aria-hidden={copy === 1}>
            {ITEMS.map((item) => (
              <span
                key={item}
                className="pg4-mono mx-8 flex items-center gap-8 text-[11px] uppercase text-[var(--pg4-ink-soft)]"
              >
                {item}
                <span className="inline-block size-1.5 bg-[var(--pg4-blue)]" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

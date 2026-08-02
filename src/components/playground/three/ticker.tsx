const ITEMS = [
  "Applications in",
  "Reviews out",
  "Awards disbursed",
  "Donors delighted",
  "Zero spreadsheets",
  "Deadlines on autopilot",
];

function Row() {
  return (
    <div className="flex shrink-0 items-center">
      {ITEMS.map((item) => (
        <span
          key={item}
          className="pg3-display flex items-center whitespace-nowrap text-2xl uppercase tracking-tight md:text-3xl"
        >
          <span className="px-5">{item}</span>
          <span aria-hidden className="text-[var(--pg3-marigold)]">
            ✶
          </span>
        </span>
      ))}
    </div>
  );
}

export function Ticker() {
  return (
    <section
      aria-label="Quad highlights"
      className="overflow-hidden border-y-2 border-[var(--pg3-ink)] bg-[var(--pg3-ink)] py-4 text-[var(--pg3-paper)]"
    >
      <div className="pg3-marquee flex w-max">
        <Row />
        <div aria-hidden>
          <Row />
        </div>
      </div>
    </section>
  );
}

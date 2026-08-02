const awards = [
  { amount: "$25,000", name: "Horizon STEM Fellowship" },
  { amount: "$10,000", name: "First-Gen Futures Grant" },
  { amount: "$7,500", name: "Kestrel Creative Arts Award" },
  { amount: "$18,000", name: "Northstar Nursing Scholarship" },
  { amount: "$12,000", name: "Meridian Community Leaders Fund" },
  { amount: "$5,000", name: "Early Light Essay Prize" },
  { amount: "$30,000", name: "Polaris Graduate Research Grant" },
  { amount: "$8,500", name: "Wayfinder Transfer Scholarship" },
];

function TickerRow({ hidden }: { hidden?: boolean }) {
  return (
    <div aria-hidden={hidden} className="flex shrink-0 items-center">
      {awards.map((award) => (
        <span
          key={award.name}
          className="pg2-mono flex items-center gap-4 pr-4 text-xs tracking-[0.14em] whitespace-nowrap text-[var(--pg2-umber)] uppercase md:text-sm"
        >
          <span className="font-semibold text-[var(--pg2-gold-deep)]">
            {award.amount}
          </span>
          {award.name}
          <span className="px-4 text-[var(--pg2-star)]">&#10022;</span>
        </span>
      ))}
    </div>
  );
}

export function Ticker() {
  return (
    <div className="overflow-hidden border-y border-[var(--pg2-line)] bg-[var(--pg2-paper)] py-5">
      <div className="pg2-marquee flex w-max">
        <TickerRow />
        <TickerRow hidden />
      </div>
    </div>
  );
}

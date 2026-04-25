import { AnimatedSection } from "@/components/ui/animatedSection/animated-section"
import { AnimatedLines } from "@/components/ui/animatedLines/animated-lines"
import { PRETEXT_FONTS } from "@/lib/pretext/fonts"
import { scholarships, SCHOLARSHIP_CATEGORIES } from "@/data/scholarships";

/** Count scholarships with deadlines in the current month */
function getDeadlinesThisMonth(): number {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  return scholarships.filter((s) => {
    const d = new Date(s.deadline);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }).length;
}

const totalScholarships = scholarships.length;
const categoryCount = SCHOLARSHIP_CATEGORIES.length - 1; // exclude "All"
const deadlinesThisMonth = getDeadlinesThisMonth();

// Find max amount
const maxAmount = (() => {
  let max = 0;
  for (const s of scholarships) {
    const val = Number(s.amount.replace(/[^0-9.]/g, "")) || 0;
    if (val > max) max = val;
  }
  return `$${max.toLocaleString()}`;
})();

export function ScholarshipHero() {
  return (
    <>
      <div className="flex flex-col gap-4 pt-2 pb-2">
        <AnimatedLines
          text="Scholarships"
          font={PRETEXT_FONTS.heroHeadline}
          lineHeight={56}
          as="h1"
          mode="chars"
          className="font-heading text-4xl md:text-5xl lg:text-7xl font-bold leading-none tracking-tighter"
          staggerDelay={0.05}
          variant="revealUp"
        />
        <AnimatedSection delay={0.4}>
          <p className="max-w-2xl text-base text-on-surface-variant md:text-lg lg:text-xl">
            Discover opportunities tailored to your goals. Filter by category
            and find the perfect scholarship for your academic journey.
          </p>
        </AnimatedSection>
        {/* Stat strip */}
        <AnimatedSection delay={0.1}>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-on-surface-variant md:text-sm">
            <span>{totalScholarships} scholarships</span>
            <span>{categoryCount} categories</span>
            <span>Up to {maxAmount}</span>
            {deadlinesThisMonth > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-tertiary/15 px-3 py-0.5 text-xs font-medium text-tertiary md:text-sm">
                {deadlinesThisMonth} deadline
                {deadlinesThisMonth !== 1 ? "s" : ""} this month
              </span>
            )}
          </div>
        </AnimatedSection>
      </div>
    </>
  );
}

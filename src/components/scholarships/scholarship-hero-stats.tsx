"use client";
import { AnimatedSection } from "@/components/ui/animatedSection/animated-section";

interface ScholarshipHeroStatsProps {
  totalScholarships: number;
  educationLevelsCount: number;
  maxAmount: string | null;
  closingSoon: number;
}

export function ScholarshipHeroStats({
  totalScholarships,
  educationLevelsCount,
  maxAmount,
  closingSoon,
}: ScholarshipHeroStatsProps) {
  return (
    <AnimatedSection delay={0.1}>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-on-surface-variant md:text-sm">
        <span>{totalScholarships} scholarships</span>
        <span>{educationLevelsCount} education levels</span>
        {maxAmount && <span>Up to {maxAmount}</span>}
        {closingSoon > 0 && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-tertiary/15 px-3 py-0.5 text-xs font-medium text-tertiary md:text-sm">
            {closingSoon} closing soon
          </span>
        )}
      </div>
    </AnimatedSection>
  );
}

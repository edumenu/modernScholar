import type { Metadata } from "next"
import { ScholarshipHero } from "@/components/scholarships/scholarship-hero";
import { ScholarshipGrid } from "@/components/scholarships/scholarship-grid";
import { PageTransition } from "@/components/ui/page-transition";

export const metadata: Metadata = {
  title: "Explore Scholarships | Modern Scholar",
  description:
    "Discover scholarships tailored to your goals. Filter by education level and find the perfect scholarship for your academic journey.",
};

export default function ScholarshipsPage() {
  return (
    <PageTransition>
      <div className="page-padding-y flex flex-col gap-16 h-auto">
        <ScholarshipHero />
        <ScholarshipGrid />
      </div>
    </PageTransition>
  );
}

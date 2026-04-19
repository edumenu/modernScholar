import { Suspense } from "react";
import { ScholarshipHero } from "@/components/scholarships/scholarship-hero";
import { ScholarshipGrid } from "@/components/scholarships/scholarship-grid";

export const metadata = {
  title: "Explore Scholarships | Modern Scholar",
  description:
    "Discover scholarships tailored to your goals. Filter by category and find the perfect scholarship for your academic journey.",
};

export default function ScholarshipsPage() {
  return (
    <div className="page-padding-y flex flex-col gap-16 h-auto">
      <ScholarshipHero />
      <Suspense fallback={<div className="min-h-150" />}>
        <ScholarshipGrid />
      </Suspense>
    </div>
  );
}

import type { Metadata } from "next";
import { HeroSection } from "@/components/home/hero-section"
import { FeaturedScholarships } from "@/components/home/featured-scholarships"
import { WhatsNext } from "@/components/home/whats-next";
import { FAQSection } from "@/components/home/faq-section"
import { PageTransition } from "@/components/ui/page-transition";

export const metadata: Metadata = {
  title: "Modern Scholar — Discover Scholarships That Fit You",
  description:
    "A curated catalogue of scholarships for high school, undergraduate, and graduate students. Find, compare, and apply with editorial guidance.",
  openGraph: {
    title: "Modern Scholar — Discover Scholarships That Fit You",
    description:
      "A curated catalogue of scholarships for high school, undergraduate, and graduate students.",
    type: "website",
  },
};

export default function Home() {
  return (
    <PageTransition>
      <HeroSection />
      <FeaturedScholarships />
      <WhatsNext />
      <FAQSection />
    </PageTransition>
  );
}

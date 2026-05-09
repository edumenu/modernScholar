import { HeroSection } from "@/components/home/hero-section"
import { FeaturedScholarships } from "@/components/home/featured-scholarships"
import { WhatsNext } from "@/components/home/whats-next";
import { FAQSection } from "@/components/home/faq-section"
import { PageTransition } from "@/components/ui/page-transition";

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

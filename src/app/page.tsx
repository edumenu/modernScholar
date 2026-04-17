import { HeroSection } from "@/components/home/hero-section"
import { FeaturedScholarships } from "@/components/home/featured-scholarships"
import { WhatsNext } from "@/components/home/whats-next";
import { FAQSection } from "@/components/home/faq-section"

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedScholarships />
      <WhatsNext />
      <FAQSection />
    </>
  );
}

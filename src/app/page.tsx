import { HeroSection } from "@/components/home/hero-section"
import { FeaturedScholarships } from "@/components/home/featured-scholarships"
import { ComingSoon } from "@/components/home/coming-soon"
import { FAQSection } from "@/components/home/faq-section"

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedScholarships />
      <ComingSoon />
      <FAQSection />
    </>
  )
}

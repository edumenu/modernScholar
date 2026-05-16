import type { Metadata } from "next";
import ReactDOM from "react-dom";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturedScholarships } from "@/components/home/featured-scholarships";
import { WhatsNext } from "@/components/home/whats-next";
import { FAQSection } from "@/components/home/faq-section";
import { PageTransition } from "@/components/ui/page-transition";
import { splineScenes } from "@/config/spline-scenes";

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
  // Kick off the .splinecode fetch during HTML parse so the bytes are already
  // in cache when the client mounts <SplineScene>. We can't know the user's
  // resolved theme on the server, so preload both — the runtime will reuse
  // whichever the client ends up requesting.
  ReactDOM.preload(splineScenes.heroLight(), {
    as: "fetch",
    crossOrigin: "anonymous",
  });
  ReactDOM.preload(splineScenes.heroDark(), {
    as: "fetch",
    crossOrigin: "anonymous",
  });

  return (
    <PageTransition>
      <HeroSection />
      <FeaturedScholarships />
      <WhatsNext />
      <FAQSection />
    </PageTransition>
  );
}

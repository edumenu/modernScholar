import type { Metadata } from "next";
import ReactDOM from "react-dom";
import { HeroSection } from "@/components/home/hero-section";
import { ExpiresSoonScholarships } from "@/components/home/expires-soon-scholarships";
import { WhatsNext } from "@/components/home/whats-next";
import { FAQSection } from "@/components/home/faq-section";
import { PageTransition } from "@/components/ui/page-transition";
import { ErrorBoundary } from "@/components/ui/error-boundary/error-boundary";
import { JsonLd } from "@/components/ui/json-ld";
import { splineScenes } from "@/config/spline-scenes";
import { siteJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: {
    absolute: "Modern Scholar — Discover Scholarships That Fit You",
  },
  description:
    "A curated catalogue of scholarships for high school, undergraduate, and graduate students. Find, compare, and apply with editorial guidance.",
  openGraph: {
    title: "Modern Scholar — Discover Scholarships That Fit You",
    description:
      "A curated catalogue of scholarships for high school, undergraduate, and graduate students.",
    type: "website",
    url: "/",
    images: ["/opengraph-image.png"],
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

  // Each top-level home section is wrapped in its own ErrorBoundary so a
  // render error stays scoped to that section instead of bubbling to
  // src/app/error.tsx and replacing the whole page. This was prompted by a
  // dark × landscape crash where the hero (Spline + theme resolution) took
  // down the entire route.
  return (
    <PageTransition>
      <JsonLd data={siteJsonLd()} />
      <ErrorBoundary label="Hero">
        <HeroSection />
      </ErrorBoundary>
      <ErrorBoundary label="Expires Soon">
        <ExpiresSoonScholarships />
      </ErrorBoundary>
      <ErrorBoundary label="What's Next">
        <WhatsNext />
      </ErrorBoundary>
      <ErrorBoundary label="FAQ">
        <FAQSection />
      </ErrorBoundary>
    </PageTransition>
  );
}

import type { Metadata } from "next";
import { WellnessHero } from "@/components/playground/five/wellness-hero";

export const metadata: Metadata = {
  title: "Playground Five — Vibrant Wellness",
  robots: { index: false, follow: false },
};

export default function PlaygroundFive() {
  return <WellnessHero />;
}

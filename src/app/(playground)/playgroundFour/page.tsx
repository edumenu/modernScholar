import type { Metadata } from "next";
import { PgNav } from "@/components/playground/four/pg-nav";
import { Hero } from "@/components/playground/four/hero";
import { Ticker } from "@/components/playground/four/ticker";
import { Pillars } from "@/components/playground/four/pillars";
import { ConsolePreview } from "@/components/playground/four/console-preview";
import { Metrics } from "@/components/playground/four/metrics";
import { Process } from "@/components/playground/four/process";
import { Finale } from "@/components/playground/four/finale";

export const metadata: Metadata = {
  title: "Playground Four — Registrar",
  robots: { index: false, follow: false },
};

export default function PlaygroundFour() {
  return (
    <>
      <PgNav />
      <Hero />
      <Ticker />
      <Pillars />
      <ConsolePreview />
      <Metrics />
      <Process />
      <Finale />
    </>
  );
}

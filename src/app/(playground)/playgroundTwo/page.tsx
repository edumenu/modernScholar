import type { Metadata } from "next";
import { PgNav } from "@/components/playground/two/pg-nav";
import { Hero } from "@/components/playground/two/hero";
import { Dawn } from "@/components/playground/two/dawn";
import { Ticker } from "@/components/playground/two/ticker";
import { Method } from "@/components/playground/two/method";
import { Showcase } from "@/components/playground/two/showcase";
import { Voices } from "@/components/playground/two/voices";
import { Finale } from "@/components/playground/two/finale";

export const metadata: Metadata = {
  title: "Playground Two — First Light",
  robots: { index: false, follow: false },
};

export default function PlaygroundTwo() {
  return (
    <>
      <PgNav />
      <Hero />
      <Dawn />
      <Ticker />
      <Method />
      <Showcase />
      <Voices />
      <Finale />
    </>
  );
}

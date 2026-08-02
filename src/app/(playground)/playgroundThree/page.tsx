import type { Metadata } from "next";
import { PgNav } from "@/components/playground/three/pg-nav";
import { Hero } from "@/components/playground/three/hero";
import { Ticker } from "@/components/playground/three/ticker";
import { Rooms } from "@/components/playground/three/rooms";
import { Numbers } from "@/components/playground/three/numbers";
import { Steps } from "@/components/playground/three/steps";
import { Voices } from "@/components/playground/three/voices";
import { Finale } from "@/components/playground/three/finale";

export const metadata: Metadata = {
  title: "Playground Three — Quad",
  robots: { index: false, follow: false },
};

export default function PlaygroundThree() {
  return (
    <>
      <PgNav />
      <Hero />
      <Ticker />
      <Rooms />
      <Numbers />
      <Steps />
      <Voices />
      <Finale />
    </>
  );
}

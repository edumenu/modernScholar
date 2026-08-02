import type { Metadata } from "next";
import { PlaygroundIndex } from "@/components/playground/playground-index";

export const metadata: Metadata = {
  title: "Playground — Design experiments",
  robots: { index: false, follow: false },
};

export default function PlaygroundPage() {
  return <PlaygroundIndex />;
}

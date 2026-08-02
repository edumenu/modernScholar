import { Bricolage_Grotesque, Fragment_Mono, Instrument_Serif } from "next/font/google";
import { cn } from "@/lib/utils";
import "./playground-three.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-pg3-sans",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-pg3-serif",
});

const fragmentMono = Fragment_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pg3-mono",
});

export default function PlaygroundThreeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Full-bleed via margin (not transform) so descendant position:fixed
    // elements stay viewport-anchored.
    <div
      data-pg3-root
      className={cn(
        bricolage.variable,
        instrumentSerif.variable,
        fragmentMono.variable,
        "pg3-dots relative w-dvw [margin-inline:calc(50%-50dvw)]",
      )}
    >
      {children}
    </div>
  );
}

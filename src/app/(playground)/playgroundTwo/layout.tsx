import { Fraunces, Instrument_Sans, Spline_Sans_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import "./playground-two.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-pg2-display",
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-pg2-sans",
});

const splineSansMono = Spline_Sans_Mono({
  subsets: ["latin"],
  variable: "--font-pg2-mono",
});

export default function PlaygroundTwoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Full-bleed via margin (not transform) so descendant position:fixed
    // elements stay viewport-anchored.
    <div
      data-pg2-root
      className={cn(
        fraunces.variable,
        instrumentSans.variable,
        splineSansMono.variable,
        "pg2-grain relative w-dvw [margin-inline:calc(50%-50dvw)]",
      )}
    >
      {children}
    </div>
  );
}

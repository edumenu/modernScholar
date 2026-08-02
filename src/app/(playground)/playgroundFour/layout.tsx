import { Archivo, Spline_Sans_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import "./playground-four.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-pg4-sans",
  axes: ["wdth"],
});

const splineMono = Spline_Sans_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-pg4-mono",
});

export default function PlaygroundFourLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Full-bleed via margin (not transform) so descendant position:fixed
    // elements stay viewport-anchored.
    <div
      data-pg4-root
      className={cn(
        archivo.variable,
        splineMono.variable,
        "relative w-dvw [margin-inline:calc(50%-50dvw)]",
      )}
    >
      {children}
    </div>
  );
}

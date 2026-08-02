import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import "./playground-five.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function PlaygroundFiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Full-bleed via margin (not transform) so descendant position:fixed
    // elements stay viewport-anchored.
    <div
      data-pg5-root
      className={cn(
        inter.className,
        "relative w-dvw [margin-inline:calc(50%-50dvw)]",
      )}
    >
      {children}
    </div>
  );
}

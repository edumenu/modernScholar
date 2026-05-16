import type { ReactNode } from "react";
import { HomeSplineLoader } from "@/components/home/home-spline-loader";

export default function HomeLayout({ children }: { children: ReactNode }) {
  return <HomeSplineLoader>{children}</HomeSplineLoader>;
}

import type { Metadata } from "next";
import { Poppins, Noto_Serif } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "next-themes";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { PageShell } from "@/components/ui/page-shell";
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Modern Scholar",
  description: "Empowering students to discover and secure scholarships.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full", poppins.variable, notoSerif.variable)}
    >
      <body className="min-h-full flex flex-col">
        <NuqsAdapter>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <SmoothScrollProvider>
              <CustomCursor />
              <Header />
              <PageShell className="">{children}</PageShell>
              <Footer />
            </SmoothScrollProvider>
          </ThemeProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}

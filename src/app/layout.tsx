import type { Metadata } from "next";
import Script from "next/script";
import { Poppins, Noto_Serif } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { SITE_URL } from "@/lib/constants";
import { ThemeProvider } from "next-themes";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { PageShell } from "@/components/ui/page-shell";
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "@/components/ui/sonner/sonner";
import { MotionConfigProvider } from "@/components/motion-config-provider";
import { ComparisonRehydrator } from "@/components/scholarships/comparison-rehydrator";

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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // `template` applies to child segments — every page sets its own unique
  // title and Next.js appends "| Modern Scholar". Do NOT include the suffix
  // in page titles after this lands.
  title: {
    default: "Modern Scholar",
    template: "%s | Modern Scholar",
  },
  description: "Empowering students to discover and secure scholarships.",
  openGraph: {
    siteName: "Modern Scholar",
    type: "website",
    locale: "en_US",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
  },
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
      className={cn("relative h-full", poppins.variable, notoSerif.variable)}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden">
        {process.env.NODE_ENV === "production" && (
          <>
            <Script
              defer
              src="/u/script.js"
              data-website-id="8a041372-1cb8-4271-958e-d79dd2bb4f9b"
              data-host-url="/u"
              strategy="afterInteractive"
            />
            <Script id="ms-clarity" strategy="afterInteractive">
              {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "x0f31uaqun");`}
            </Script>
          </>
        )}
        <NuqsAdapter>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            enableColorScheme
          >
            <MotionConfigProvider>
              <SmoothScrollProvider>
                <ComparisonRehydrator />
                <CustomCursor />
                <Header />
                <PageShell className="">{children}</PageShell>
                <Footer />
                <Toaster />
              </SmoothScrollProvider>
            </MotionConfigProvider>
          </ThemeProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}

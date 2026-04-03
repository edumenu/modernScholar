"use client"
import { useState } from "react";
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "./theme-toggle"
import { MobileMenuButton } from "./mobile-menu"
import { glassPill } from "./styles";
import { useScroll, useMotionValueEvent, motion } from "motion/react";

const HEADER_HEIGHT = 112; // 28 * 4 (h-28 in Tailwind = 112px)

// ============================================================================
// Scroll-Animated Header Wrapper
// This component handles scroll animation independently to prevent re-renders
// of the navbar content when scrolling
// ============================================================================
function ScrollAnimatedHeader({ children }: { children: React.ReactNode }) {
  const [headerOffset, setHeaderOffset] = useState(0);
  const { scrollY } = useScroll();
  const [lastScrollY, setLastScrollY] = useState(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const difference = latest - lastScrollY;
    if (latest < 600) {
      setHeaderOffset(0);
    } else {
      const newOffset = headerOffset + difference;
      const clampedOffset = Math.max(0, Math.min(HEADER_HEIGHT, newOffset));
      setHeaderOffset(clampedOffset);
    }
    setLastScrollY(latest);
  });

  return (
    <motion.header
      style={{
        transform: `translateY(-${headerOffset}px)`,
      }}
      transition={{ duration: 0, ease: "easeInOut" }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      {children}
    </motion.header>
  );
}

const navItems = [
  { title: "Scholarships", href: "/scholarships" },
  { title: "Blog", href: "/blog" },
  { title: "Contact Us", href: "/contact" },
];

export function Header() {
  const pathname = usePathname()

  return (
    <ScrollAnimatedHeader>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:outline-none"
      >
        Skip to content
      </a>
      <header className="fixed inset-x-0 top-0 z-50 flex justify-end lg:justify-center px-4 pt-4">
        <nav className="flex items-center gap-4" aria-label="Main navigation">
          {/* Logo pill */}
          <Link
            href="/"
            className={cn(
              glassPill,
              "lg:flex hidden size-11.5 items-center justify-center transition-shadow hover:shadow-[0_8px_40px_rgba(31,38,135,0.22)]",
              "dark:bg-primary-400",
            )}
            aria-label="Home"
          >
            <Image
              src="/iconBurgundy.png"
              alt="Modern Scholar"
              width={36}
              height={36}
              className="size-20 object-contain dark:hidden"
            />
            <Image
              src="/iconWhite.png"
              alt="Modern Scholar"
              width={36}
              height={36}
              className="hidden size-20 object-contain dark:block"
            />
          </Link>

          {/* Desktop nav links pill */}
          <div
            className={cn(
              glassPill,
              "hidden h-11.5 items-stretch gap-8 p-1 lg:flex",
            )}
          >
            {navItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-full px-3 text-sm tracking-tight text-on-surface transition-colors hover:text-primary",
                    isActive &&
                      "bg-primary-100 text-on-surface dark:bg-primary-900/40 hover:text-none",
                  )}
                >
                  {item.title}
                </Link>
              );
            })}
          </div>

          {/* Theme toggle pill */}
          <div
            className={cn(
              glassPill,
              "hidden h-11.5 items-center justify-center px-2.5 lg:flex",
            )}
          >
            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <MobileMenuButton />
        </nav>
      </header>
    </ScrollAnimatedHeader>
  );
}

"use client"
import { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "./theme-toggle"
import { SettingsDropdown } from "./settings-dropdown"
import { MobileMenuButton } from "./mobile-menu"
import { glassPill } from "../styles";
import { useScroll, useMotionValueEvent, motion } from "motion/react";

const HEADER_HEIGHT = 112; // 28 * 4 (h-28 in Tailwind = 112px)

// ============================================================================
// Scroll-Animated Header Wrapper
// Uses refs and direct DOM manipulation to avoid re-renders and prevent
// Motion layout animations from triggering on scroll offset changes
// ============================================================================
function ScrollAnimatedHeader({ children }: { children: React.ReactNode }) {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerOffset = useRef(0);
  const lastScrollY = useRef(0);
  const { scrollY } = useScroll();
  const pathname = usePathname();

  useEffect(() => {
    headerOffset.current = 0;
    lastScrollY.current = 0;
    if (headerRef.current) {
      headerRef.current.style.transform = "translateY(0px)";
    }
  }, [pathname]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const difference = latest - lastScrollY.current;
    if (latest < 600) {
      headerOffset.current = 0;
    } else {
      const newOffset = headerOffset.current + difference;
      headerOffset.current = Math.max(0, Math.min(HEADER_HEIGHT, newOffset));
    }
    lastScrollY.current = latest;
    if (headerRef.current) {
      headerRef.current.style.transform = `translateY(-${headerOffset.current}px)`;
    }
  });

  return (
    <div
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50"
    >
      {children}
    </div>
  );
}

const navItems = [
  { title: "Scholarships", href: "/scholarships" },
  { title: "Blog", href: "/blog" },
  { title: "Contact Us", href: "/contact" },
];

export function Header() {
  const pathname = usePathname()
  const isHome = pathname === "/";
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

  const measureActive = useCallback(() => {
    const activeItem = navItems.find(
      (item) => pathname === item.href || pathname.startsWith(item.href + "/"),
    );
    if (activeItem) {
      const el = linkRefs.current[activeItem.href];
      if (el) {
        setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
      }
    } else {
      setIndicator(null);
    }
  }, [pathname]);

  useEffect(() => {
    document.fonts.ready.then(measureActive);

    const observer = new ResizeObserver(measureActive);
    const navEl = linkRefs.current[navItems[0]?.href]?.parentElement;
    if (navEl) observer.observe(navEl);

    return () => observer.disconnect();
  }, [measureActive]);

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
              "lg:flex hidden size-11.5 items-center justify-center transition-shadow hover:shadow-[0_8px_40px_rgba(31,38,135,0.22)] focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
              isHome && "bg-primary-100/80 dark:bg-primary/20",
            )}
            aria-label="Home"
          >
            <Image
              src="/iconBurgundy.png"
              alt="Modern Scholar"
              width={28}
              height={28}
              className="size-7 object-contain block dark:hidden"
            />
            <Image
              src="/iconWhite.png"
              alt="Modern Scholar"
              width={28}
              height={28}
              className="size-7 object-contain hidden dark:block"
            />
          </Link>

          {/* Desktop nav links pill */}
          <div
            className={cn(
              glassPill,
              "relative hidden h-11.5 items-stretch gap-8 p-1 lg:flex",
            )}
          >
            {indicator && (
              <motion.span
                className="absolute inset-y-1 rounded-full bg-primary-100/80 dark:bg-primary/20"
                initial={false}
                animate={{ left: indicator.left, width: indicator.width }}
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  ref={(el) => { linkRefs.current[item.href] = el; }}
                  className={cn(
                    "relative flex items-center rounded-full px-3 text-sm tracking-tight text-on-surface",
                    isActive && "text-primary font-medium",
                  )}
                >
                  <span className="relative z-10">{item.title}</span>
                </Link>
              );
            })}
            <SettingsDropdown />
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

          {/* Mobile logo + menu button */}
          <Link
            href="/"
            className={cn(
              glassPill,
              "flex lg:hidden size-11.5 items-center justify-center transition-shadow hover:shadow-[0_8px_40px_rgba(31,38,135,0.22)] focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
              isHome && "bg-primary-100/80 dark:bg-primary/20",
            )}
            aria-label="Home"
          >
            <Image
              src="/iconBurgundy.png"
              alt="Modern Scholar"
              width={24}
              height={24}
              className="size-6 object-contain block dark:hidden"
            />
            <Image
              src="/iconWhite.png"
              alt="Modern Scholar"
              width={24}
              height={24}
              className="size-6 object-contain hidden dark:block"
            />
          </Link>
          <MobileMenuButton />
        </nav>
      </header>
    </ScrollAnimatedHeader>
  );
}

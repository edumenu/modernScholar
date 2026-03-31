"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "./theme-toggle"
import { MobileMenuButton } from "./mobile-menu"

const navItems = [
  { title: "Scholarships", href: "/" },
  { title: "Blog", href: "/blog" },
  { title: "Contact", href: "/contact" },
  { title: "About", href: "/about" },
]

const glassPill =
  "rounded-full border border-white/40 bg-white/25 shadow-[0_8px_32px_rgba(31,38,135,0.15)] backdrop-blur-2xl dark:border-white/10 dark:bg-white/10 dark:shadow-[0_8px_32px_rgba(0,0,0,0.25)]"

export function Header() {
  const pathname = usePathname()

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-end lg:justify-center px-4 pt-4">
      <nav className="flex items-center gap-4">
        {/* Logo pill */}
        <Link
          href="/"
          className={cn(
            glassPill,
            "lg:flex hidden size-11.5 items-center justify-center transition-shadow hover:shadow-[0_8px_40px_rgba(31,38,135,0.22)]"
          )}
          aria-label="Home"
        >
          <Image
            src="/iconBurgundy.png"
            alt="Modern Scholar"
            width={36}
            height={36}
            className="size-20 object-contain"
          />
        </Link>

        {/* Desktop nav links pill */}
        <div
          className={cn(
            glassPill,
            "hidden h-11.5 items-stretch gap-8 p-1 lg:flex"
          )}
        >
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

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
            "hidden h-11.5 items-center justify-center px-2.5 lg:flex"
          )}
        >
          <ThemeToggle />
        </div>

        {/* Mobile menu button */}
        <MobileMenuButton />
      </nav>
    </header>
  )
}

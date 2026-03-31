"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import Image from "next/image";
import { ThemeToggle } from "./theme-toggle";

const navItems = [
  { title: "Home", href: "/" },
  { title: "Scholarships", href: "/scholarships" },
  { title: "Blog", href: "/blog" },
  { title: "Contact", href: "/contact" },
  { title: "About", href: "/about" },
]

const menuSlide = {
  initial: { x: "100%" },
  enter: {
    x: "0%",
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as const },
  },
  exit: {
    x: "100%",
    transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] as const },
  },
}

const linkSlide = {
  initial: { x: 80, opacity: 0 },
  enter: (i: number) => ({
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.76, 0, 0.24, 1] as const,
      delay: 0.05 * i,
    },
  }),
  exit: (i: number) => ({
    x: 80,
    opacity: 0,
    transition: {
      duration: 0.6,
      ease: [0.76, 0, 0.24, 1] as const,
      delay: 0.03 * i,
    },
  }),
}

const indicatorScale = {
  open: {
    scale: 1,
    transition: { duration: 0.3, ease: [0.76, 0, 0.24, 1] as const },
  },
  closed: {
    scale: 0,
    transition: { duration: 0.3, ease: [0.76, 0, 0.24, 1] as const },
  },
}

const glassPill =
  "rounded-full border border-white/40 bg-white/25 shadow-[0_8px_32px_rgba(31,38,135,0.15)] backdrop-blur-2xl dark:border-white/10 dark:bg-white/10 dark:shadow-[0_8px_32px_rgba(0,0,0,0.25)]";

function Curve() {
  const initialPath = `M100 0 L100 ${typeof window !== "undefined" ? window.innerHeight : 900} Q-100 ${typeof window !== "undefined" ? window.innerHeight / 2 : 450} 100 0`
  const targetPath = `M100 0 L100 ${typeof window !== "undefined" ? window.innerHeight : 900} Q100 ${typeof window !== "undefined" ? window.innerHeight / 2 : 450} 100 0`

  const curve = {
    initial: { d: initialPath },
    enter: {
      d: targetPath,
      transition: { duration: 1, ease: [0.76, 0, 0.24, 1] as const },
    },
    exit: {
      d: initialPath,
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as const },
    },
  }

  return (
    <svg
      className="absolute -left-24.75 top-0 h-full w-25 fill-surface stroke-none"
    >
      <motion.path
        variants={curve}
        initial="initial"
        animate="enter"
        exit="exit"
      />
    </svg>
  )
}

function NavLink({
  data,
  isActive,
  setSelectedIndicator,
}: {
  data: { title: string; href: string; index: number }
  isActive: boolean
  setSelectedIndicator: (href: string) => void
}) {
  const { title, href, index } = data

  return (
    <motion.div
      className="relative flex items-center"
      onMouseEnter={() => setSelectedIndicator(href)}
      custom={index}
      variants={linkSlide}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      <motion.div
        variants={indicatorScale}
        animate={isActive ? "open" : "closed"}
        className="absolute -left-8 size-2.5 rounded-full bg-primary"
      />
      <Link
        href={href}
        className={cn(
          "font-heading text-[2.75rem] font-normal text-on-surface transition-colors hover:text-primary",
          isActive && "text-primary"
        )}
      >
        {title}
      </Link>
    </motion.div>
  )
}

function MobileNav({ onClose }: { onClose: () => void }) {
  const pathname = usePathname()
  const [selectedIndicator, setSelectedIndicator] = useState(pathname)

  return (
    <motion.div
      variants={menuSlide}
      initial="initial"
      animate="enter"
      exit="exit"
      className="fixed inset-y-0 right-0 z-50 flex w-[min(480px,85vw)] flex-col bg-surface"
    >
      <Curve />

      <div className="flex flex-1 flex-col justify-between px-10 pb-12 pt-16">
        <div
          onMouseLeave={() => setSelectedIndicator(pathname)}
          className="flex flex-col gap-3"
        >
          <p className="mb-6 border-b border-outline-variant/30 pb-2 text-xs font-medium uppercase tracking-widest text-on-surface-variant">
            Navigation
          </p>
          {navItems.map((item, index) => (
            <NavLink
              key={item.href}
              data={{ ...item, index }}
              isActive={selectedIndicator === item.href}
              setSelectedIndicator={setSelectedIndicator}
            />
          ))}
        </div>

        <div className="flex justify-start items-center gap-6 border-t border-outline-variant/30 pt-6">
          <div>
            <Image
              src="/iconBurgundy.png"
              alt="Modern Scholar"
              width={36}
              height={36}
              className="size-14 object-contain"
            />
          </div>
          <div className="gap-6 flex">
            <a
              href="#"
              className="text-xs text-on-surface-variant transition-colors hover:text-on-surface"
            >
              Instagram
            </a>
            <a
              href="#"
              className="text-xs text-on-surface-variant transition-colors hover:text-on-surface"
            >
              LinkedIn
            </a>
            <a
              href="#"
              className="text-xs text-on-surface-variant transition-colors hover:text-on-surface"
            >
              Twitter
            </a>
          </div>
          {/* Theme toggle pill */}
          <div
            className={cn(
              glassPill,
              "flex h-8 w-fit items-center justify-center lg:px-2.5",
            )}
          >
            <ThemeToggle />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function MobileMenuButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative z-60 flex size-11.5 cursor-pointer items-center justify-center rounded-full",
          "border border-white/40 bg-white/25 shadow-[0_8px_32px_rgba(31,38,135,0.15)]",
          "backdrop-blur-2xl transition-colors",
          "dark:border-white/10 dark:bg-white/10 dark:shadow-[0_8px_32px_rgba(0,0,0,0.25)]",
          "lg:hidden"
        )}
      >
        <div className="flex w-5 flex-col items-center gap-1.25">
          <span
            className={cn(
              "h-[1.5px] w-full rounded-full bg-on-surface transition-all duration-300",
              isOpen && "translate-y-[3.25px] rotate-45"
            )}
          />
          <span
            className={cn(
              "h-[1.5px] w-full rounded-full bg-on-surface transition-all duration-300",
              isOpen && "-translate-y-[3.25px] -rotate-45"
            )}
          />
        </div>
      </button>

      <AnimatePresence mode="wait">
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
              onClick={() => setIsOpen(false)}
            />
            <MobileNav onClose={() => setIsOpen(false)} />
          </>
        )}
      </AnimatePresence>
    </>
  )
}

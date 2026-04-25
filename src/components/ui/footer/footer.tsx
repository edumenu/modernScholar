"use client"

import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"


const quickLinks = [
  { title: "Scholarships", href: "/scholarships" },
  { title: "Blog", href: "/blog" },
  { title: "Contact Us", href: "/contact" },
]

const legalLinks = [
  { title: "Privacy Policy", href: "/privacy" },
  { title: "Terms of Service", href: "/terms" },
  { title: "Cookie Policy", href: "/cookies" },
]


function FooterContent() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-between px-6 py-8 lg:px-8">
      {/* Main footer content */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[2fr_1fr_1fr]">
        {/* Brand column */}
        <div className="flex flex-col gap-6">
          <Link href="/" className="inline-flex w-fit" aria-label="Home">
            <Image
              src="/iconWhite.png"
              alt="Modern Scholar"
              width={96}
              height={96}
              className="size-24 object-contain hidden dark:block"
            />
            <Image
              src="/iconBurgundy.png"
              alt="Modern Scholar"
              width={96}
              height={96}
              className="size-24 object-contain block dark:hidden"
            />
          </Link>
          <p className="max-w-sm text-xs lg:text-sm leading-relaxed text-on-surface-variant">
            Curated scholarship discovery for ambitious students.
          </p>
        </div>

        {/* Quick Links column */}
        <div className="flex flex-col gap-4">
          <h3 className="font-sans text-sm font-semibold uppercase tracking-widest text-on-surface-variant">
            Quick Links
          </h3>
          <nav aria-label="Footer quick links">
            <ul className="flex flex-col gap-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-on-surface-variant transition-colors hover:text-on-surface"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Legal column */}
        <div className="flex flex-col gap-4">
          <h3 className="font-sans text-sm font-semibold uppercase tracking-widest text-on-surface-variant">
            Legal
          </h3>
          <nav aria-label="Footer legal links">
            <ul className="flex flex-col gap-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-on-surface-variant transition-colors hover:text-on-surface"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex flex-col gap-4 border-t border-outline-variant/20 pt-6 lg:flex-row md:items-center lg:justify-between">
        <p className="text-sm text-on-surface-variant">
          &copy; {new Date().getFullYear()} Modern Scholar. All rights
          reserved.
        </p>
      </div>

      {/* Large decorative brand text */}
      <div>
        <p className="font-heading text-[clamp(2rem,8vw,5rem)] font-bold leading-none tracking-tighter text-on-surface/8">
          Modern Scholar
        </p>
      </div>
    </div>
  )
}

export function Footer() {
  const footerRef = useRef<HTMLElement>(null)
  const [useReveal, setUseReveal] = useState(true)

  useEffect(() => {
    const el = footerRef.current
    if (!el) return

    const check = () => {
      setUseReveal(el.scrollHeight <= window.innerHeight)
    }

    check()
    const observer = new ResizeObserver(check)
    observer.observe(el)
    window.addEventListener("resize", check)
    return () => {
      observer.disconnect()
      window.removeEventListener("resize", check)
    }
  }, [])

  if (!useReveal) {
    return (
      <footer ref={footerRef} className="flex flex-col bg-surface-container-highest">
        <FooterContent />
      </footer>
    )
  }

  return (
    <div
      className="relative h-[50vh]"
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      <div className="fixed bottom-0 left-0 right-0 h-[50vh]">
        <footer ref={footerRef} className="flex h-full flex-col bg-surface-container-highest">
          <FooterContent />
        </footer>
      </div>
    </div>
  )
}

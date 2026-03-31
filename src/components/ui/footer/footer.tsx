import Link from "next/link"
import Image from "next/image"
import { Icon } from "@iconify/react"

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

const socialLinks = [
  {
    label: "Twitter",
    href: "https://twitter.com",
    icon: "mdi:twitter",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: "mdi:linkedin",
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: "mdi:instagram",
  },
]

export function Footer() {
  return (
    <div
      className="relative h-screen lg:h-125"
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      <div className="fixed bottom-0 left-0 right-0 h-screen lg:h-125">
        <footer className="flex h-full flex-col bg-surface-container-low">
          <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-between px-6 pt-16 pb-8 lg:px-8">
            {/* Main footer content */}
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[2fr_1fr_1fr]">
              {/* Brand column */}
              <div className="flex flex-col gap-6">
                <Link href="/" className="inline-flex w-fit" aria-label="Home">
                  <Image
                    src="/iconBurgundy.png"
                    alt="Modern Scholar"
                    width={40}
                    height={40}
                    className="size-10 object-contain"
                  />
                </Link>
                <p className="max-w-sm text-xs lg:text-sm leading-relaxed text-on-surface-variant">
                  Empowering students to discover and secure scholarships.
                  End-to-end scholarship management with intelligent matching.
                </p>
                <div className="flex gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="flex size-10 items-center justify-center rounded-md bg-surface-container text-on-surface-variant transition-colors hover:text-on-surface"
                    >
                      <Icon icon={social.icon} className="size-5" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick Links column */}
              <div className="flex flex-col gap-4">
                <h3 className="font-heading text-sm font-semibold uppercase tracking-widest text-on-surface-variant">
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
                <h3 className="font-heading text-sm font-semibold uppercase tracking-widest text-on-surface-variant">
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
                &copy; {new Date().getFullYear()} Modern Scholar. All rights reserved.
              </p>
            </div>

            {/* Large decorative brand text */}
            <div className="overflow-hidden">
              <p className="font-heading text-[clamp(2rem,10vw,10rem)] font-bold leading-none tracking-tighter text-on-surface/4">
                Modern Scholar
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

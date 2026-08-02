"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260715_082433_69699cf8-444b-4484-93cc-053e57896dfd.mp4";

const NAV_LINKS = [
  { label: "Home", href: "#", active: true },
  { label: "Our Approach", href: "#", active: false },
  { label: "Healing Methods", href: "#", active: false },
];

const AVATARS = [
  "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100",
  "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100",
  "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100",
  "https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=100",
];

type IconProps = React.SVGProps<SVGSVGElement>;

function iconBase(props: IconProps): IconProps {
  return {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    ...props,
  };
}

function CircleUserRoundIcon(props: IconProps) {
  return (
    <svg {...iconBase(props)}>
      <path d="M18 20a6 6 0 0 0-12 0" />
      <circle cx="12" cy="10" r="4" />
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

function MenuIcon(props: IconProps) {
  return (
    <svg {...iconBase(props)}>
      <path d="M4 5h16" />
      <path d="M4 12h16" />
      <path d="M4 19h16" />
    </svg>
  );
}

function XIcon(props: IconProps) {
  return (
    <svg {...iconBase(props)}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function Logo() {
  return (
    <svg
      viewBox="0 0 256 256"
      className="h-8 w-8 fill-white md:h-9 md:w-9"
      aria-label="Vibrant Wellness"
    >
      <path d="M 128 128 C 198.692 128 256 185.308 256 256 L 151.883 256 C 149.812 220.307 120.213 192 84 192 C 47.787 192 18.188 220.307 16.117 256 L 0 256 C 0 185.308 57.308 128 128 128 Z M 104.117 0 C 106.188 35.694 135.787 64 172 64 C 208.213 64 237.812 35.694 239.883 0 L 256 0 C 256 70.692 198.692 128 128 128 C 57.308 128 0 70.692 0 0 Z" />
    </svg>
  );
}

function TriangleDots() {
  // Pyramid of 9 dots: rows of 1 / 3 / 5 inside a 20x20 box.
  const dots = [
    { x: 8.75, y: 1 },
    { x: 4.375, y: 8 },
    { x: 8.75, y: 8 },
    { x: 13.125, y: 8 },
    { x: 0, y: 15 },
    { x: 4.375, y: 15 },
    { x: 8.75, y: 15 },
    { x: 13.125, y: 15 },
    { x: 17.5, y: 15 },
  ];
  return (
    <div className="relative h-5 w-5">
      {dots.map((dot, i) => (
        <span
          key={i}
          className="absolute bg-white/60"
          style={{ width: 2.5, height: 2.5, left: dot.x, top: dot.y }}
        />
      ))}
    </div>
  );
}

function CheckerGrid() {
  return (
    <div className="grid w-fit grid-cols-3 gap-0.5">
      {Array.from({ length: 9 }, (_, i) => (
        <span
          key={i}
          className={cn(
            "h-1 w-1 rounded-full",
            i % 2 === 0 ? "bg-white/60" : "bg-white/0",
          )}
        />
      ))}
    </div>
  );
}

export function WellnessHero() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <section className="relative flex h-screen flex-col overflow-hidden bg-black text-white">
      <video
        src={VIDEO_URL}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      />

      <nav className="relative z-20 flex items-center justify-between px-5 pt-6 sm:px-8 sm:pt-8 md:px-16 lg:px-20">
        <Logo />

        {/* Wrapper handles centering: .liquid-glass sets position:relative,
            which would override the `absolute` utility on the same element. */}
        <div className="absolute left-1/2 hidden -translate-x-1/2 md:block">
          <div className="liquid-glass flex items-center gap-8 rounded-full px-8 py-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-opacity",
                  link.active
                    ? "text-white"
                    : "text-white/70 hover:opacity-100",
                )}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="liquid-glass hidden h-10 w-10 items-center justify-center rounded-full md:flex">
          <CircleUserRoundIcon
            className="h-5 w-5 text-white/80"
            strokeWidth={1.5}
          />
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="liquid-glass relative z-50 flex h-10 w-10 items-center justify-center rounded-full md:hidden"
        >
          <MenuIcon
            className={cn(
              "absolute h-5 w-5 transition-all duration-300",
              menuOpen
                ? "rotate-90 scale-0 opacity-0"
                : "rotate-0 scale-100 opacity-100",
            )}
          />
          <XIcon
            className={cn(
              "absolute h-5 w-5 transition-all duration-300",
              menuOpen
                ? "rotate-0 scale-100 opacity-100"
                : "-rotate-90 scale-0 opacity-0",
            )}
          />
        </button>
      </nav>

      <div
        className={cn(
          "fixed inset-0 z-10 flex flex-col items-center justify-center bg-black/80 backdrop-blur-xl transition-opacity duration-500 ease-out md:hidden",
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <div
          className={cn(
            "flex flex-col items-center gap-8 transition-transform duration-500 ease-out",
            menuOpen ? "translate-y-0" : "-translate-y-8",
          )}
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={cn(
                "text-2xl font-medium",
                link.active ? "text-white" : "text-white/70",
              )}
            >
              {link.label}
            </a>
          ))}
          <div className="flex items-center gap-3">
            <div className="liquid-glass flex h-10 w-10 items-center justify-center rounded-full">
              <CircleUserRoundIcon
                className="h-5 w-5 text-white/80"
                strokeWidth={1.5}
              />
            </div>
            <span className="text-sm font-light text-white/60">Account</span>
          </div>
        </div>
      </div>

      <main
        className={cn(
          "relative z-10 flex flex-1 flex-col justify-between px-5 pb-8 transition-opacity duration-300 sm:px-8 sm:pb-10 md:px-16 md:pb-12 lg:px-20",
          menuOpen &&
            "pointer-events-none opacity-0 md:pointer-events-auto md:opacity-100",
        )}
      >
        <div className="mt-14 max-w-2xl sm:mt-20 md:mt-28">
          <div className="liquid-glass mb-5 inline-flex items-center gap-2.5 rounded-full px-3 py-1.5 sm:mb-6 sm:gap-3 sm:px-4 sm:py-2">
            <div className="flex -space-x-2">
              {AVATARS.map((src) => (
                <img
                  key={src}
                  src={src}
                  alt=""
                  className="h-5 w-5 rounded-full border-2 border-white/20 object-cover sm:h-6 sm:w-6"
                />
              ))}
            </div>
            <span className="text-xs font-light text-white/80 sm:text-sm">
              our path to natural wellness
            </span>
          </div>

          <h1
            className="text-4xl font-normal leading-[1.05] text-white sm:text-5xl md:text-6xl lg:text-7xl"
            style={{ letterSpacing: "-0.05em" }}
          >
            Heal Your Body
            <br />
            Naturally
          </h1>

          <p className="mt-4 text-sm font-light text-white/70 sm:mt-5 sm:text-base md:text-lg">
            Holistic wellness. Transformative results.
          </p>

          <button
            type="button"
            className="liquid-glass mt-6 rounded-full px-6 py-3 text-sm font-medium text-white transition duration-300 hover:bg-white/10 sm:mt-8 sm:px-7 sm:py-3.5"
          >
            Begin Your Journey
          </button>
        </div>

        <div className="flex items-end gap-6 sm:gap-10 md:gap-16">
          <div>
            <TriangleDots />
            <div className="mt-3 text-xl font-normal text-white sm:text-2xl md:text-3xl">
              48 Hours
            </div>
            <div className="mt-1 text-xs font-light text-white/60 sm:text-sm">
              Initial Consultation
            </div>
          </div>
          <div>
            <CheckerGrid />
            <div className="mt-3 text-xl font-normal text-white sm:text-2xl md:text-3xl">
              Initial Consultation
            </div>
            <div className="mt-1 text-xs font-light text-white/60 sm:text-sm">
              Healing Sessions
            </div>
          </div>
        </div>
      </main>
    </section>
  );
}

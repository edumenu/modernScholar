"use client"

import {
  useState,
  useEffect,
  useCallback,
  lazy,
  Suspense,
  startTransition,
} from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Icon } from "@iconify/react"
import { motion, AnimatePresence } from "motion/react"
import { toast } from "sonner"
import { AnimatedSection } from "@/components/ui/animatedSection/animated-section"
import { CTAButton } from "@/components/ui/button/cta-button"
import { Button } from "@/components/ui/button/button"

const SplineScene = lazy(() =>
  import("@/components/home/spline-scene").then((mod) => ({
    default: mod.SplineScene,
  })),
);

const CONTACT_SPLINE_URL_LIGHT =
  "https://prod.spline.design/p0mZprPwlZ2CJwpI/scene.splinecode";
const CONTACT_SPLINE_URL_DARK =
  "https://prod.spline.design/TIEvLLUQbEXBkhx7/scene.splinecode";

const CONTACT_EMAIL = "dearmodernscholar@gmail.com"

const QUESTION_ROUTES = [
  {
    icon: "solar:magnifer-line-duotone",
    label: "Scholarship Help",
    description: "Finding & applying",
  },
  {
    icon: "solar:chat-round-dots-line-duotone",
    label: "Platform Feedback",
    description: "Bugs & suggestions",
  },
  {
    icon: "solar:diploma-line-duotone",
    label: "Partnership",
    description: "Collaborate with us",
  },
];

function NudgeArrow() {
  return (
    <div className="flex items-center gap-2">
      <svg
        width="40"
        height="32"
        viewBox="0 0 40 32"
        fill="none"
        className="text-on-surface/40 -scale-x-100"
      >
        <path
          d="M36 4C28 4 8 2 4 28"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="4 3"
        />
        <path
          d="M1 20L4 28L10 22"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="whitespace-nowrap rounded-full border border-outline-variant/60 bg-surface-container/70 px-3 py-1.5 text-xs font-medium tracking-wide text-on-surface-variant shadow-[0px_4px_16px_0px_rgba(31,38,135,0.12)] backdrop-blur-sm">
        or copy email address
      </span>
    </div>
  );
}

function CopyEmailButton() {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL)
      setCopied(true)
      toast.success("Email copied!")
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Failed to copy email")
    }
  }, [])

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={handleCopy}
      aria-label="Copy email address"
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.span
            key="check"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Icon
              icon="solar:check-read-line-duotone"
              className="size-5 text-secondary-700"
            />
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Icon icon="solar:copy-line-duotone" className="size-5" />
          </motion.span>
        )}
      </AnimatePresence>
    </Button>
  )
}

function QuestionRouting() {
  return (
    <div className="grid grid-cols-3 gap-3">
      {QUESTION_ROUTES.map((route) => (
        <div
          key={route.label}
          className="flex flex-col items-center gap-2 rounded-2xl bg-surface-container-low p-4 text-center"
        >
          <Icon icon={route.icon} className="size-6 text-secondary" />
          <span className="text-xs font-medium text-on-surface">
            {route.label}
          </span>
          <span className="text-[11px] text-on-surface-variant">
            {route.description}
          </span>
        </div>
      ))}
    </div>
  );
}

function MobileContactImage() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    startTransition(() => setMounted(true));
  }, []);

  if (!mounted) {
    return (
      <div className="aspect-4/3 w-full animate-pulse rounded-3xl bg-surface-container" />
    );
  }

  const src =
    resolvedTheme === "dark"
      ? "/darkContactPhone.png"
      : "/lightContactPhone.png";

  return (
    <div className="overflow-hidden rounded-3xl bg-surface-container">
      <Image
        src={src}
        alt="Modern Scholar contact illustration"
        width={800}
        height={600}
        className="h-auto w-full object-cover"
        priority
      />
    </div>
  );
}

export function ContactFormSection() {
  const [isButtonHovered, setIsButtonHovered] = useState(false)
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    startTransition(() => setMounted(true));
  }, []);

  const splineUrl =
    mounted && resolvedTheme === "dark"
      ? CONTACT_SPLINE_URL_DARK
      : CONTACT_SPLINE_URL_LIGHT;

  const splineFallback = (
    <div className="flex size-full items-center justify-center">
      <div className="size-12 animate-pulse rounded-full bg-surface-container" />
    </div>
  );

  return (
    <div className="rounded-3xl bg-surface-container-low p-8 md:p-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left column - 3D Spline scene (desktop) / Static image (mobile) */}
        <div className="flex items-center justify-center">
          {/* Desktop: 3D scene in a styled container */}
          <div className="hidden lg:block w-full rounded-3xl overflow-hidden bg-surface-container shadow-md">
            <Suspense fallback={splineFallback}>
              {mounted ? (
                <SplineScene
                  key={resolvedTheme}
                  scene={splineUrl}
                  className="h-120 w-full"
                />
              ) : (
                splineFallback
              )}
            </Suspense>
          </div>

          {/* Mobile: theme-aware static image */}
          <div className="block lg:hidden w-full">
            <MobileContactImage />
          </div>
        </div>

        {/* Right column - Contact section */}
        <AnimatedSection variant="fadeUp" delay={0.4}>
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl tracking-tight">
                Get in Touch
              </h2>
              <p className="text-on-surface-variant text-base md:text-lg max-w-lg">
                Send us an email for any inquiries, feedback, or just to say hi!
                We&apos;d love to hear from you.
              </p>
            </div>

            {/* Question routing tiles */}
            <QuestionRouting />

            {/* Email CTA with nudge arrow */}
            <div className="flex flex-col gap-6">
              <div
                className="relative flex flex-wrap items-center gap-4"
                onMouseEnter={() => setIsButtonHovered(true)}
                onMouseLeave={() => setIsButtonHovered(false)}
              >
                <a href={`mailto:${CONTACT_EMAIL}`}>
                  <CTAButton
                    label="SEND EMAIL"
                    variant="primary"
                    type="button"
                  />
                </a>

                {/* Floating nudge arrow — hides on hover, returns after */}
                <div className="hidden sm:block">
                  <AnimatePresence>
                    {!isButtonHovered && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5, x: 20 }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                          x: 0,
                          y: [0, -6, 0],
                          rotate: [0, -2, 0],
                        }}
                        exit={{
                          opacity: 0,
                          scale: 0.6,
                          x: 30,
                          y: -10,
                          transition: { duration: 0.3, ease: "backIn" },
                        }}
                        transition={{
                          opacity: {
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                          },
                          scale: {
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                          },
                          x: { type: "spring", stiffness: 300, damping: 20 },
                          y: {
                            repeat: Infinity,
                            duration: 2,
                            ease: "easeInOut",
                            delay: 0.5,
                          },
                          rotate: {
                            repeat: Infinity,
                            duration: 2,
                            ease: "easeInOut",
                            delay: 0.5,
                          },
                        }}
                      >
                        <NudgeArrow />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Email address + copy */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-on-surface-variant tracking-wide">
                  {CONTACT_EMAIL}
                </span>
                <CopyEmailButton />
              </div>

              {/* Response time expectation */}
              <p className="text-sm text-on-surface-variant">
                We typically respond within 1&ndash;2 business days.
              </p>

              {/* Team description */}
              {/* <p className="text-sm text-on-surface-variant max-w-md">
                We&apos;re a small team of educators and developers in North
                Carolina, building better tools for scholarship discovery.
              </p> */}

              {/* Location */}
              <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                <Icon icon="solar:map-point-line-duotone" className="size-5" />
                <span>Raleigh-Durham, North Carolina &middot; EST</span>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}

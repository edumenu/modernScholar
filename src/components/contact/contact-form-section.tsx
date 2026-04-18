"use client"

import {
  useState,
  useEffect,
  useCallback,
  lazy,
  Suspense,
  startTransition,
} from "react";
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

function NudgeArrow() {
  return (
    <div className="flex items-center gap-2">
      {/* Curved arrow SVG pointing left toward the button */}
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
      {/* Glassmorphic pill label */}
      <span className="whitespace-nowrap rounded-full border border-white/50 bg-white/30 px-3 py-1.5 text-xs font-medium tracking-wide text-on-surface-variant shadow-[0px_4px_16px_0px_rgba(31,38,135,0.12)] backdrop-blur-sm">
        or copy email address
      </span>
    </div>
  )
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      {/* Left column - 3D Spline scene (desktop only) */}
      <div className="hidden lg:flex items-center justify-center">
        <Suspense fallback={splineFallback}>
          {mounted ? (
            <SplineScene
              key={resolvedTheme}
              scene={splineUrl}
              className="h-150 w-full"
            />
          ) : (
            splineFallback
          )}
        </Suspense>
      </div>

      {/* Right column - Mailto contact section */}
      <AnimatedSection variant="fadeUp" delay={0.4}>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl tracking-tight">
              Get in Touch
            </h2>
            <p className="text-on-surface-variant text-base md:text-lg max-w-lg">
              Send us an email for any inquiries, feedback, or just to say hi!
              We’d love to hear from you.
            </p>
          </div>

          {/* Email CTA with nudge arrow */}
          <div className="flex flex-col gap-6">
            <div
              className="relative flex flex-wrap items-center gap-4"
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
            >
              <a href={`mailto:${CONTACT_EMAIL}`}>
                <CTAButton label="SEND EMAIL" variant="primary" type="button" />
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
                        scale: { type: "spring", stiffness: 300, damping: 20 },
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

            {/* Location */}
            <div className="flex items-center gap-2 text-sm text-on-surface-variant">
              <Icon icon="solar:map-point-line-duotone" className="size-5" />
              <span>Raleigh-Durham, North Carolina · EST</span>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}

/* ==========================================================================
   PRESERVED: Original contact form for future use (backend integration)
   ========================================================================== */
/*
import { Input } from "@/components/ui/input/input"
import { Label } from "@/components/ui/label/label"
import { Textarea } from "@/components/ui/textarea/textarea"

const glassInputClasses =
  "h-14 rounded-2xl border-white/40 bg-white/25 px-6 text-base text-on-surface placeholder:text-on-surface/50 shadow-[inset_0px_2px_10px_0px_rgba(31,38,135,0.1)] focus-visible:border-secondary focus-visible:ring-[3px] focus-visible:ring-secondary/30"

const labelClasses =
  "text-xs font-medium tracking-[1.2px] uppercase text-on-surface-variant"

<form className="flex flex-col gap-6">
  <div className="flex flex-col gap-3">
    <Label htmlFor="name" className={labelClasses}>NAME*</Label>
    <Input id="name" name="name" type="text" required className={glassInputClasses} />
  </div>
  <div className="flex flex-col gap-3">
    <Label htmlFor="email" className={labelClasses}>EMAIL ADDRESS*</Label>
    <Input id="email" name="email" type="email" required placeholder="yourname@email.com" className={glassInputClasses} />
  </div>
  <div className="flex flex-col gap-3">
    <Label htmlFor="school" className={labelClasses}>SCHOOL NAME</Label>
    <Input id="school" name="school" type="text" className={glassInputClasses} />
  </div>
  <div className="flex flex-col gap-3">
    <Label htmlFor="subject" className={labelClasses}>SUBJECT</Label>
    <Input id="subject" name="subject" type="text" className={glassInputClasses} />
  </div>
  <div className="flex flex-col gap-3">
    <Label htmlFor="message" className={labelClasses}>YOUR MESSAGE</Label>
    <Textarea id="message" name="message" placeholder="Write your message to us here" className={`${glassInputClasses} min-h-[178px] py-4 resize-none`} />
  </div>
  <div>
    <CTAButton label="SUBMIT" variant="primary" type="button" />
  </div>
</form>
*/

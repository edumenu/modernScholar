"use client"

import { useState, useCallback } from "react"
import { Icon } from "@iconify/react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"
import { AnimatedSection } from "../ui/animatedSection/animated-section";
import { ParallaxLayer } from "@/components/ui/parallax-layer";

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: "How does Modern Scholar help me find scholarships?",
    answer:
      "Modern Scholar curates scholarships from thousands of providers and matches them to your academic profile, interests, and eligibility. Our platform makes it easy to browse, filter, and discover opportunities you might otherwise miss.",
  },
  {
    question: "Is Modern Scholar free to use?",
    answer:
      "Yes, Modern Scholar is completely free for students. We believe every student deserves access to scholarship opportunities without barriers. Our platform is funded through partnerships with educational institutions and scholarship providers.",
  },
  {
    question: "What types of scholarships are available?",
    answer:
      "We feature a wide range of scholarships including merit-based, need-based, community service, STEM, arts, athletics, and identity-based awards. Scholarships range from $500 to full-tuition coverage across undergraduate and graduate programs.",
  },
  {
    question: "How do I apply for a scholarship through the platform?",
    answer:
      "Each scholarship listing includes detailed application requirements, deadlines, and a direct link to the provider's application portal. We streamline the process by saving your profile information so you can apply faster across multiple scholarships.",
  },
  {
    question: "Can I track my scholarship applications?",
    answer:
      "Application tracking is one of our upcoming features! Soon you'll be able to manage all your applications, set deadline reminders, and track your submission status — all from your personalized dashboard.",
  },
]

function AccordionItem({
  item,
  index,
  isOpen,
  onToggle,
}: {
  item: FAQItem
  index: number
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className="rounded-2xl bg-surface-container-low">
      <button
        id={`faq-btn-${index}`}
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left focus-visible:rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        aria-expanded={isOpen}
        aria-controls={`faq-panel-${index}`}
      >
        <span className="text-base font-medium text-on-surface">
          {item.question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="shrink-0"
          aria-hidden="true"
        >
          <Icon
            icon="solar:alt-arrow-down-line-duotone"
            className="size-5 text-on-surface-variant"
          />
        </motion.span>
      </button>
      <div
        id={`faq-panel-${index}`}
        role="region"
        aria-labelledby={`faq-btn-${index}`}
        className={cn(
          "grid transition-[grid-template-rows] duration-250 ease-in-out",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <p className="px-6 pb-5 text-sm leading-relaxed text-on-surface-variant">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const handleToggle = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index))
  }, [])

  return (
    <section
      aria-labelledby="faq-heading"
      className="flex justify-center items-center min-h-[75vh]"
    >
      <AnimatedSection>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.5fr] lg:gap-12">
          {/* Left column — heading */}
          <ParallaxLayer yRange={[-15, 15]} className="flex flex-col gap-2">
            <p className="text-xs font-medium uppercase tracking-widest text-tertiary">
              FAQ
            </p>
            <h2
              id="faq-heading"
              className="font-heading text-3xl font-medium tracking-tight text-on-surface md:text-[3rem] md:leading-none"
            >
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-lg text-on-surface-variant">
              Everything you need to know about finding and applying for
              scholarships.
            </p>
          </ParallaxLayer>

          {/* Right column — accordion */}
          <ParallaxLayer yRange={[10, -10]} className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                item={faq}
                index={i}
                isOpen={openIndex === i}
                onToggle={() => handleToggle(i)}
              />
            ))}
          </ParallaxLayer>
        </div>
      </AnimatedSection>
    </section>
  );
}

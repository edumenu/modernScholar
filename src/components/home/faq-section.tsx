"use client"

import { useState, useCallback } from "react"
import { Icon } from "@iconify/react"
import { motion, AnimatePresence } from "motion/react"
import { AnimatedSection } from "./animated-section"

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
  isOpen,
  onToggle,
}: {
  item: FAQItem
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className="border-b border-outline-variant/20">
      <button
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center justify-between gap-4 py-5 text-left focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        aria-expanded={isOpen}
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
          <Icon icon="solar:alt-arrow-down-line-duotone" className="size-5 text-on-surface-variant" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm leading-relaxed text-on-surface-variant">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const handleToggle = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index))
  }, [])

  return (
    <section aria-labelledby="faq-heading" className="flex min-h-screen flex-col justify-center">
      <AnimatedSection>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.5fr] lg:gap-12">
          {/* Left column — heading */}
          <div className="flex flex-col gap-2">
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
          </div>

          {/* Right column — accordion */}
          <div className="border-t border-outline-variant/20 overflow-y-hidden">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                item={faq}
                isOpen={openIndex === i}
                onToggle={() => handleToggle(i)}
              />
            ))}
          </div>
        </div>
      </AnimatedSection>
    </section>
  )
}

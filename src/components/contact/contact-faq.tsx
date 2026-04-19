"use client"

import { useState, useCallback } from "react"
import { Icon } from "@iconify/react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"
import { AnimatedSection } from "@/components/ui/animatedSection/animated-section"

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: "How do I submit a scholarship not in your database?",
    answer:
      "Send us an email with the scholarship name, provider, deadline, and a link to the official listing. We review every submission and add verified scholarships within a few days.",
  },
  {
    question: "Is Modern Scholar free to use?",
    answer:
      "Yes, Modern Scholar is completely free for students. We believe every student deserves access to scholarship opportunities without barriers.",
  },
  // {
  //   question: "How do I report incorrect scholarship information?",
  //   answer:
  //     "If you spot outdated or incorrect details on a listing, please email us with the scholarship name and what needs updating. We take data accuracy seriously and will investigate promptly.",
  // },
  {
    question: "What kinds of questions can I ask?",
    answer:
      "Anything related to scholarships, the platform, or your educational journey. Whether you need help narrowing down options, understanding eligibility, or navigating the application process — we're here to help.",
  },
  // {
  //   question: "Can I find you on social media?",
  //   answer:
  //     "We're building our social presence! For now, email is the best way to reach us. Stay tuned for updates on our social channels.",
  // },
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
    <div className="rounded-2xl bg-surface-container-low">
      <button
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left focus-visible:rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
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
          <Icon
            icon="solar:alt-arrow-down-line-duotone"
            className="size-5 text-on-surface-variant"
          />
        </motion.span>
      </button>
      <div
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
  )
}

export function ContactFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const handleToggle = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index))
  }, [])

  return (
    <section aria-labelledby="contact-faq-heading">
      <AnimatedSection variant="fadeUp" delay={0.2}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium uppercase tracking-widest text-tertiary">
              FAQ
            </p>
            <h2
              id="contact-faq-heading"
              className="font-heading text-2xl md:text-3xl font-medium tracking-tight text-on-surface"
            >
              Common Questions
            </h2>
          </div>

          <div className="flex flex-col gap-3">
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

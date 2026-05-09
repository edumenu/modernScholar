import { ContactHero } from "@/components/contact/contact-hero"
import { ContactFormSection } from "@/components/contact/contact-form-section"
import { ContactFAQ } from "@/components/contact/contact-faq"
import { PageTransition } from "@/components/ui/page-transition"

export const metadata = {
  title: "Contact Us | Modern Scholar",
  description:
    "Have questions or feedback? Get in touch with us at Modern Scholar.",
}

export default function ContactUsPage() {
  return (
    <PageTransition>
      <div className="page-padding-y flex flex-col gap-16 min-h-screen">
        <ContactHero />
        <ContactFormSection />
        <ContactFAQ />
      </div>
    </PageTransition>
  )
}

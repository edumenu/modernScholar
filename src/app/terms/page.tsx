import type { Metadata } from "next";

import { Callout } from "@/components/blog/callout";
import { LegalLayout } from "@/components/legal/legal-layout";
import { LegalSection } from "@/components/legal/legal-section";
import {
  CONTACT_EMAIL,
  CONTROLLERS,
  DISPUTE_VENUE,
  GOVERNING_LAW,
  LAST_UPDATED,
} from "@/lib/legal-constants";

export const metadata: Metadata = {
  title: "Terms of Service | Modern Scholar",
  description:
    "Terms of service for Modern Scholar — how to use the site and what to verify.",
};

const SECTIONS = [
  { id: "acceptance", title: "Acceptance of these terms" },
  { id: "about-service", title: "About the Service" },
  { id: "eligibility", title: "Eligibility" },
  { id: "scholarship-data", title: "Scholarship data disclaimer" },
  { id: "editorial-content", title: "Editorial content" },
  { id: "acceptable-use", title: "Acceptable use" },
  { id: "intellectual-property", title: "Intellectual property" },
  { id: "third-party-links", title: "Third-party links" },
  { id: "disclaimers", title: "Disclaimers" },
  { id: "limitation-of-liability", title: "Limitation of liability" },
  { id: "indemnification", title: "Indemnification" },
  { id: "termination", title: "Termination" },
  { id: "governing-law", title: "Governing law" },
  { id: "disputes", title: "Disputes" },
  { id: "changes", title: "Changes to these terms" },
  { id: "contact", title: "Contact" },
] as const;

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms of Service"
      lastUpdated={LAST_UPDATED.terms}
      sections={SECTIONS}
      className="terms-numbered"
      tldr={
        <>
          <p>
            Modern Scholar is a free, editorial guide to scholarships. Always
            verify deadlines, eligibility, and award details with the
            scholarship provider directly before you apply. We do our best to
            keep listings accurate, but we can&apos;t guarantee them. By using
            the site, you agree to the terms below.
          </p>
        </>
      }
    >
      <LegalSection id="acceptance" title="Acceptance of these terms">
        <p>
          By visiting or using Modern Scholar (the &ldquo;Service&rdquo;), you
          agree to these Terms of Service. If you don&apos;t agree, please
          don&apos;t use the site.
        </p>
        <p>
          We may update these terms from time to time. The version on this page
          is the current one, and the &ldquo;Last updated&rdquo; date at the
          top tells you when it was last changed.
        </p>
      </LegalSection>

      <LegalSection id="about-service" title="About the Service">
        <p>
          Modern Scholar is an independent editorial project that curates and
          explains scholarship opportunities for students. It is operated by{" "}
          {CONTROLLERS}.
        </p>
        <p>
          The Service is free to use. There are no accounts, no payments, and
          no required sign-ups. We don&apos;t process applications, award
          scholarships, or act as an agent for any scholarship provider. We
          point you to opportunities and write about how to approach them.
        </p>
      </LegalSection>

      <LegalSection id="eligibility" title="Eligibility">
        <p>
          The Service is intended for general audiences and is not directed at
          children under 13. By using the site, you confirm that you can form
          a binding agreement in your jurisdiction, or that a parent or
          guardian has agreed on your behalf.
        </p>
        <p>
          Some scholarships listed on the site have their own eligibility
          rules (citizenship, age, school, field of study, financial need, and
          so on). Those rules are set by the scholarship provider, not by us.
          Always confirm them on the provider&apos;s own website before you
          apply.
        </p>
      </LegalSection>

      <LegalSection
        id="scholarship-data"
        title="Scholarship data disclaimer"
      >
        <p>
          We work hard to keep our scholarship listings accurate, current, and
          useful. We&apos;re also a small team, scholarship programs change
          their rules frequently, and providers sometimes update deadlines or
          discontinue awards without notice.
        </p>
        <Callout type="warning">
          <p>
            Scholarship information on Modern Scholar is provided{" "}
            <strong>as-is, without any warranty</strong>. Deadlines,
            eligibility rules, award amounts, and provider contact details
            change frequently and may be out of date, incomplete, or
            incorrect.{" "}
            <strong>
              You must verify every detail directly with the scholarship
              provider before you apply.
            </strong>
          </p>
          <p>
            We are not liable for missed deadlines, rejected applications,
            ineligibility surprises, third-party fraud, or any financial loss
            arising from your reliance on information you found here. Treat
            our listings as a starting point for your own research, never as
            the final word.
          </p>
        </Callout>
      </LegalSection>

      <LegalSection id="editorial-content" title="Editorial content">
        <p>
          The articles, guides, essays, illustrations, design system, and
          other editorial content on Modern Scholar are written and produced
          by us. They are protected by copyright and are owned by Modern
          Scholar.
        </p>
        <p>
          You&apos;re welcome to read, share links to, and quote short
          excerpts of our editorial content with credit and a link back.
          Reposting full articles, mirroring the site, or republishing our
          writing as your own is not permitted without our prior written
          consent.
        </p>
      </LegalSection>

      <LegalSection id="acceptable-use" title="Acceptable use">
        <p>By using the Service, you agree not to:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            Use the site in any way that violates a law or someone else&apos;s
            rights.
          </li>
          <li>
            Attempt to break, overload, or interfere with the site or the
            servers and networks behind it, including through excessive
            automated traffic.
          </li>
          <li>
            Probe for vulnerabilities, bypass security measures, or access
            parts of the site you weren&apos;t intended to reach.
          </li>
          <li>
            Impersonate Modern Scholar or suggest that we endorse you, your
            site, or your business when we haven&apos;t.
          </li>
        </ul>
        <p>
          If you&apos;d like to use our content or data in a way that goes
          beyond ordinary reading and sharing, write to us at{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-primary underline underline-offset-2"
          >
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection id="intellectual-property" title="Intellectual property">
        <p>
          The Modern Scholar name, wordmark, visual identity, layout, code,
          and editorial content are owned by Modern Scholar or its
          contributors and are protected by copyright, trademark, and other
          intellectual property laws.
        </p>
        <p>
          Scholarship names, provider logos, and program descriptions belong
          to the organizations that run those scholarships. We surface them
          for editorial and informational purposes only; their inclusion on
          the site does not imply any affiliation or endorsement.
        </p>
      </LegalSection>

      <LegalSection id="third-party-links" title="Third-party links">
        <p>
          The site links out to scholarship providers, university pages,
          government resources, and other third-party websites. We don&apos;t
          control those sites, and including a link is not an endorsement.
        </p>
        <p>
          When you leave Modern Scholar, the destination site&apos;s terms,
          privacy policy, and practices apply. We&apos;re not responsible for
          what those sites do, what they collect, or how they treat you.
        </p>
      </LegalSection>

      <LegalSection id="disclaimers" title="Disclaimers">
        <p>
          The Service is provided <strong>&ldquo;as is&rdquo;</strong> and{" "}
          <strong>&ldquo;as available&rdquo;</strong>, without warranties of
          any kind, whether express or implied. To the fullest extent
          permitted by law, we disclaim all warranties, including
          merchantability, fitness for a particular purpose, accuracy,
          non-infringement, and uninterrupted availability.
        </p>
        <p>
          We don&apos;t warrant that the site will be error-free, that
          listings will be complete or current, that the site will be
          available at any specific time, or that any defects will be
          corrected.
        </p>
      </LegalSection>

      <LegalSection
        id="limitation-of-liability"
        title="Limitation of liability"
      >
        <p>
          To the fullest extent permitted by law, Modern Scholar and its
          operators won&apos;t be liable for any indirect, incidental,
          special, consequential, or punitive damages — including lost
          opportunities, lost scholarships, missed deadlines, lost data, or
          lost profits — arising out of or related to your use of the Service,
          even if we&apos;ve been advised that such damages were possible.
        </p>
        <p>
          To the extent any liability cannot be excluded under applicable law,
          our total liability to you for all claims relating to the Service is
          limited to one hundred U.S. dollars (US$100).
        </p>
      </LegalSection>

      <LegalSection id="indemnification" title="Indemnification">
        <p>
          You agree to defend and indemnify Modern Scholar and its operators
          from any claims, damages, costs, and expenses (including reasonable
          attorneys&apos; fees) arising out of your use of the Service, your
          violation of these terms, or your violation of any law or
          third-party right.
        </p>
      </LegalSection>

      <LegalSection id="termination" title="Termination">
        <p>
          You can stop using the Service at any time — just close the tab.
        </p>
        <p>
          We may suspend or block access to the Service (or to specific
          visitors) at any time and for any reason, including suspected
          violations of these terms. The sections of these terms that by their
          nature should survive termination (intellectual property,
          disclaimers, limitation of liability, indemnification, governing
          law, and disputes) will continue to apply.
        </p>
      </LegalSection>

      <LegalSection id="governing-law" title="Governing law">
        <p>
          These terms and any dispute arising out of or relating to them or
          the Service are governed by {GOVERNING_LAW}, without regard to its
          conflict-of-laws principles. The United Nations Convention on
          Contracts for the International Sale of Goods does not apply.
        </p>
      </LegalSection>

      <LegalSection id="disputes" title="Disputes">
        <p>
          You and Modern Scholar agree that any dispute arising out of or
          relating to these terms or the Service will be resolved exclusively
          in {DISPUTE_VENUE}, and each party consents to the personal
          jurisdiction of those courts.
        </p>
        <p>
          There is no arbitration clause. We&apos;d rather have a direct
          conversation first — if something&apos;s wrong, please email us at{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-primary underline underline-offset-2"
          >
            {CONTACT_EMAIL}
          </a>{" "}
          and we&apos;ll try to sort it out before anything formal happens.
        </p>
      </LegalSection>

      <LegalSection id="changes" title="Changes to these terms">
        <p>
          We may update these terms as the Service evolves. When we do,
          we&apos;ll change the &ldquo;Last updated&rdquo; date at the top of
          this page. For material changes, we&apos;ll also surface a notice on
          the homepage for 14 days so returning visitors can&apos;t easily
          miss it.
        </p>
        <p>
          Your continued use of the Service after a change means you accept
          the updated terms. If you don&apos;t accept them, stop using the
          site.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="Contact">
        <p>
          Questions about these terms? Reach us at{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-primary underline underline-offset-2"
          >
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </LegalSection>

    </LegalLayout>
  );
}

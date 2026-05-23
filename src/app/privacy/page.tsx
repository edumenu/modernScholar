import type { Metadata } from "next";

import { Callout } from "@/components/blog/callout";
import { LegalLayout } from "@/components/legal/legal-layout";
import { LegalSection } from "@/components/legal/legal-section";
import { LegalSubsection } from "@/components/legal/legal-subsection";
import {
  BREACH_WINDOW_HOURS,
  CONTACT_EMAIL,
  CONTROLLERS,
  LAST_UPDATED,
  RESPONSE_WINDOW_DAYS,
} from "@/lib/legal-constants";

export const metadata: Metadata = {
  title: "Privacy Policy | Modern Scholar",
  description:
    "Learn how Modern Scholar handles your data — what we collect, why, and the rights you have under GDPR and CCPA.",
};

const SECTIONS = [
  { id: "who-we-are", title: "Who we are" },
  { id: "what-we-collect", title: "What we collect" },
  { id: "why-we-collect-it", title: "Why we collect it" },
  { id: "where-data-goes", title: "Where data goes" },
  { id: "how-long-we-keep-it", title: "How long we keep it" },
  { id: "your-rights", title: "Your rights" },
  { id: "childrens-privacy", title: "Children's privacy" },
  { id: "international-transfers", title: "International transfers" },
  { id: "changes", title: "Changes to this policy" },
  { id: "contact", title: "Contact" },
] as const;

export default function PrivacyPage() {
  const tldr = (
    <>
      <p>
        Modern Scholar is a free scholarship discovery site with no accounts, no
        analytics, and no advertising. We don&apos;t sell or share your personal
        information. The only data we touch is what your browser sends to our
        hosting provider so the site can load, plus a few small preferences your
        browser saves locally so the site remembers your theme and saved
        scholarships.
      </p>
      <p className="mt-3">
        If you&apos;re in the EU/UK, you have GDPR rights. If you&apos;re in
        California, you have CCPA rights. Email us at{" "}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="text-primary underline underline-offset-2"
        >
          {CONTACT_EMAIL}
        </a>{" "}
        to exercise them.
      </p>
    </>
  );

  return (
    <LegalLayout
      title="Privacy Policy"
      lastUpdated={LAST_UPDATED.privacy}
      sections={SECTIONS}
      tldr={tldr}
    >
      <LegalSection id="who-we-are" title="Who we are">
        <p>
          Modern Scholar is operated from {CONTROLLERS}. We act as the data
          controller under the GDPR. Questions, requests, and notices should go
          to{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-primary underline underline-offset-2"
          >
            {CONTACT_EMAIL}
          </a>
          .
        </p>
        <p>
          We do not yet publish a postal address. If that changes, we&apos;ll
          add the address here and update the &quot;Last updated&quot; date at
          the top of this page.
        </p>
      </LegalSection>

      <LegalSection id="what-we-collect" title="What we collect">
        <p>
          We want to be exact about this, because most of what privacy policies
          claim to collect isn&apos;t something we ever touch. Here is the
          complete list:
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong className="font-semibold text-on-surface">
              Server logs from our hosting provider.
            </strong>{" "}
            When your browser requests a page, our hosting provider
            automatically records your IP address, user-agent string, the URL
            you requested, and a timestamp. We use these only for security and
            debugging.
          </li>
          <li>
            <strong className="font-semibold text-on-surface">
              A few preferences your browser stores locally.
            </strong>{" "}
            We use the browser&apos;s <code>localStorage</code> to remember
            three things:
            <ul className="mt-2 list-[circle] space-y-1 pl-6">
              <li>
                <code>theme</code> — whether you&apos;ve chosen light or dark
                mode.
              </li>
              <li>
                <code>ms-comparison</code> — the scholarships you&apos;ve added
                to your comparison list.
              </li>
              <li>
                <code>ms-settings</code> — small UI preferences for the
                scholarship browser.
              </li>
            </ul>
            These values stay on your device. They are not sent to us.
          </li>
          <li>
            <strong className="font-semibold text-on-surface">
              Emails you send us.
            </strong>{" "}
            If you email{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-primary underline underline-offset-2"
            >
              {CONTACT_EMAIL}
            </a>
            , the message is delivered to a Gmail inbox we read. We keep it as
            long as we need to respond and will delete it on request.
          </li>
        </ul>
        <p>
          That&apos;s it. We do not run analytics, advertising pixels, session
          replay, fingerprinting, A/B testing, or cross-site tracking of any
          kind. We do not ask for your name, email, school, or any other
          personal information unless you choose to put it in an email to us.
        </p>
      </LegalSection>

      <LegalSection id="why-we-collect-it" title="Why we collect it">
        <p>
          For visitors in the EU and UK, the GDPR requires us to name a legal
          basis for each thing we do with your data. Here are ours:
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong className="font-semibold text-on-surface">
              Server logs:
            </strong>{" "}
            <em>legitimate interest</em>. We need them to keep the site running,
            diagnose errors, and detect abuse. The data is minimal and
            short-lived.
          </li>
          <li>
            <strong className="font-semibold text-on-surface">
              localStorage preferences:
            </strong>{" "}
            <em>user-initiated</em>. They exist because you interacted with the
            site (changed the theme, saved a scholarship, adjusted a setting).
            They live on your device and you can clear them anytime.
          </li>
          <li>
            <strong className="font-semibold text-on-surface">
              Emails you send us:
            </strong>{" "}
            <em>user-initiated</em>. You wrote to us; we read and reply.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="where-data-goes" title="Where data goes">
        <p>
          We use a small set of third-party services to deliver the site. None
          of them set first-party cookies on Modern Scholar, and none of them
          receive data we&apos;ve combined with anything personal.
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong className="font-semibold text-on-surface">
              Our hosting provider
            </strong>{" "}
            hosts the site in the United States and sees the request data
            described above.
          </li>
        </ul>
        <p>
          We don&apos;t sell or share your personal information with anyone for
          marketing, advertising, or any other commercial purpose. If we ever
          add a service that would change this, we&apos;ll update this section
          first.
        </p>
      </LegalSection>

      <LegalSection id="how-long-we-keep-it" title="How long we keep it">
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong className="font-semibold text-on-surface">
              Hosting provider server logs:
            </strong>{" "}
            approximately 30 days. We don&apos;t extend this window.
          </li>
          <li>
            <strong className="font-semibold text-on-surface">
              localStorage values:
            </strong>{" "}
            stay in your browser until you clear them. Clearing your site data
            removes them immediately.
          </li>
          <li>
            <strong className="font-semibold text-on-surface">
              Inbound emails:
            </strong>{" "}
            kept as long as we reasonably need to respond and follow up.
            We&apos;ll delete a message on request.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="your-rights" title="Your rights">
        <p>
          Depending on where you live, privacy law gives you certain rights over
          the data we hold about you. To exercise any of them, email{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-primary underline underline-offset-2"
          >
            {CONTACT_EMAIL}
          </a>
          . We respond within {RESPONSE_WINDOW_DAYS} days. In practice we hold
          very little, so most requests resolve quickly.
        </p>

        <LegalSubsection
          id="gdpr-rights"
          title="If you’re in the EU or UK (GDPR)"
        >
          <p>You have the right to:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>access the data we hold about you;</li>
            <li>correct anything that&apos;s wrong;</li>
            <li>ask us to delete it;</li>
            <li>
              restrict or object to specific processing (for example,
              legitimate-interest server logging);
            </li>
            <li>
              receive a copy of data you&apos;ve given us in a portable format;
            </li>
            <li>
              lodge a complaint with your local supervisory authority if you
              think we&apos;ve mishandled your data.
            </li>
          </ul>
          <p>
            We won&apos;t charge you to exercise a right, and we won&apos;t
            penalize you for using one.
          </p>
        </LegalSubsection>

        <LegalSubsection
          id="ccpa-rights"
          title="If you’re in California (CCPA / CPRA)"
        >
          <p>You have the right to:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>know what categories of personal information we collect;</li>
            <li>
              access the specific pieces of personal information we hold about
              you;
            </li>
            <li>request that we delete it;</li>
            <li>request that we correct inaccurate information;</li>
            <li>not be discriminated against for exercising any of these.</li>
          </ul>
          <p>
            <strong className="font-semibold text-on-surface">
              We do not sell or share personal information,
            </strong>{" "}
            as those terms are defined under California law. We have not done so
            in the last twelve months and we have no plans to. Because there is
            nothing to opt out of, we don&apos;t publish a &quot;Do Not Sell or
            Share My Personal Information&quot; link.
          </p>
        </LegalSubsection>
      </LegalSection>

      <LegalSection id="childrens-privacy" title="Children's privacy">
        <p>
          Modern Scholar is not directed to children under 13. We don&apos;t
          knowingly collect personal information from anyone under 13. The site
          has no signup or submission flow, so in practice we don&apos;t collect
          personal information from anyone, regardless of age.
        </p>
        <Callout type="tip">
          <p>
            Parents and guardians may email us at{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-primary underline underline-offset-2"
            >
              {CONTACT_EMAIL}
            </a>{" "}
            to review or delete any information submitted by their child.
            We&apos;ll respond within {RESPONSE_WINDOW_DAYS} days.
          </p>
        </Callout>
      </LegalSection>

      <LegalSection
        id="international-transfers"
        title="International transfers"
      >
        <p>
          Modern Scholar is hosted in the United States. If you&apos;re visiting
          from the EU, UK, or another region with data protection rules, your
          request data is processed in the US. We rely on our hosting
          provider&apos;s Data Processing Addendum and Standard Contractual
          Clauses as the legal mechanism for these transfers.
        </p>
        <p>
          The data involved is the minimal set described above — server log
          fields, nothing more.
        </p>
      </LegalSection>

      <LegalSection id="changes" title="Changes to this policy">
        <p>
          We&apos;ll update this policy when something changes — for example,
          when we add a feature that touches new data. Small edits (typo fixes,
          clarifications) refresh the &quot;Last updated&quot; date at the top
          of the page.
        </p>
        <p>
          For material changes — anything that affects what we collect, why, or
          who sees it — we&apos;ll surface a notice on the homepage for 14 days
          so returning visitors don&apos;t miss it.
        </p>
        <p>
          If we ever experience a security breach affecting personal
          information, we&apos;ll notify affected users by email and via a
          homepage banner within {BREACH_WINDOW_HOURS} hours of confirming the
          incident, as required by GDPR and applicable US state laws.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="Contact">
        <p>
          For any privacy question, request, or complaint, email us at{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-primary underline underline-offset-2"
          >
            {CONTACT_EMAIL}
          </a>
          . One inbox handles general, privacy, deletion, and breach
          correspondence.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}

import type { Metadata } from "next";

import { LegalLayout } from "@/components/legal/legal-layout";
import { LegalSection } from "@/components/legal/legal-section";
import { CONTACT_EMAIL, LAST_UPDATED } from "@/lib/legal-constants";

export const metadata: Metadata = {
  title: "Cookie Policy | Modern Scholar",
  description:
    "What Modern Scholar stores in your browser, what we don't track, and how to clear it.",
};

const STORAGE_ROWS = [
  {
    name: "theme",
    purpose: "Stores your light/dark mode preference (next-themes).",
    lifetime: "Until you clear your browser storage.",
    category: "Essential / user-initiated",
  },
  {
    name: "ms-comparison",
    purpose:
      "Stores the scholarships you've added to your comparison list (Zustand).",
    lifetime: "Until you clear your browser storage.",
    category: "Essential / user-initiated",
  },
  {
    name: "ms-settings",
    purpose:
      "Stores your UI preferences such as reduced motion and density (Zustand).",
    lifetime: "Until you clear your browser storage.",
    category: "Essential / user-initiated",
  },
] as const;

const SECTIONS = [
  { id: "what-we-store", title: "What we store" },
  { id: "what-we-dont-use", title: "What we don't use" },
  { id: "third-party-cdns", title: "Third-party CDNs and fonts" },
  { id: "how-to-clear", title: "How to clear what we store" },
  { id: "changes", title: "Changes to this policy" },
  { id: "contact", title: "Contact" },
] as const;

export default function CookiesPage() {
  return (
    <LegalLayout
      title="Cookie Policy"
      lastUpdated={LAST_UPDATED.cookies}
      sections={SECTIONS}
      tldr={
        <p>
          Modern Scholar does not use cookies. We store a few small values in
          your browser&apos;s <strong>localStorage</strong> so the site
          remembers your theme and comparison list. We do not run Google
          Analytics, advertising pixels, or any other tracking. You can clear
          everything from your browser at any time.
        </p>
      }
    >
      <LegalSection id="what-we-store" title="What we store">
        <p>
          We don&apos;t set any HTTP cookies. Instead, we use{" "}
          <strong>localStorage</strong> — a small key-value store built into
          your browser — to remember a handful of preferences locally on your
          device. None of these values are sent to a server. They stay in your
          browser until you clear them.
        </p>
        <div
          role="region"
          aria-label="Storage values stored in your browser"
          className="relative overflow-x-auto after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:w-8 after:bg-linear-to-l after:from-surface after:to-transparent"
        >
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-surface-container text-on-surface">
              <tr>
                <th
                  scope="col"
                  className="border border-outline-variant px-3 py-2 font-semibold"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="border border-outline-variant px-3 py-2 font-semibold"
                >
                  Purpose
                </th>
                <th
                  scope="col"
                  className="border border-outline-variant px-3 py-2 font-semibold"
                >
                  Lifetime
                </th>
                <th
                  scope="col"
                  className="border border-outline-variant px-3 py-2 font-semibold"
                >
                  Category
                </th>
              </tr>
            </thead>
            <tbody className="text-on-surface-variant">
              {STORAGE_ROWS.map((row) => (
                <tr key={row.name} className="align-top">
                  <td className="border border-outline-variant px-3 py-2 font-mono text-xs text-on-surface">
                    {row.name}
                  </td>
                  <td className="border border-outline-variant px-3 py-2">
                    {row.purpose}
                  </td>
                  <td className="border border-outline-variant px-3 py-2">
                    {row.lifetime}
                  </td>
                  <td className="border border-outline-variant px-3 py-2">
                    {row.category}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LegalSection>

      <LegalSection id="what-we-dont-use" title="What we don't use">
        <p>
          To be explicit, Modern Scholar does <strong>not</strong> use any of
          the following:
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Google Analytics or any other analytics product.</li>
          <li>
            Meta Pixel, TikTok Pixel, or other social-media tracking pixels.
          </li>
          <li>Advertising cookies or ad-personalization tags.</li>
          <li>Cross-site tracking pixels of any kind.</li>
          <li>Third-party consent or cookie-banner tooling.</li>
        </ul>
        <p>
          Because we don&apos;t run non-essential tracking, there is no consent
          banner — there&apos;s nothing to consent to. If we ever add analytics
          or another non-essential tracker, we&apos;ll update this policy and
          put a proper consent flow in place first.
        </p>
      </LegalSection>

      <LegalSection id="third-party-cdns" title="Third-party CDNs and fonts">
        <p>
          A few parts of the site are delivered from third-party content
          delivery networks (CDNs). These providers can see your IP address and
          basic request metadata when your browser fetches assets from them, but
          they do <strong>not</strong> set any first-party cookies on the Modern
          Scholar domain:
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Spline</strong> (<code>prod.spline.design</code>) — serves
            the 3D scenes on pages like the contact and 404 pages.
          </li>
          {/* <li>
            <strong>Iconify</strong> (<code>api.iconify.design</code>) — serves
            the icon set used throughout the interface.
          </li> */}
        </ul>
        {/* <p>
          Google Fonts are <strong>self-hosted at build time</strong> by
          Next.js. Your browser does not contact Google when loading our
          typefaces; the font files are served from our own domain.
        </p> */}
      </LegalSection>

      <LegalSection id="how-to-clear" title="How to clear what we store">
        <p>
          Because everything we store lives in your browser, you control it. We
          don&apos;t provide an in-app clear button — your browser already has
          the right tools:
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Chrome</strong>: Settings → Privacy and security → Clear
            browsing data → Cookies and other site data. Or open DevTools →
            Application → Storage → Local storage → right-click the entry for
            this site → Clear.
          </li>
          <li>
            <strong>Safari</strong>: Settings → Privacy → Manage Website Data →
            search for the site → Remove. Or enable the Develop menu and use
            Develop → Web Inspector → Storage.
          </li>
          <li>
            <strong>Firefox</strong>: Settings → Privacy & Security → Cookies
            and Site Data → Manage Data. Or open DevTools → Storage → Local
            Storage and delete entries.
          </li>
        </ul>
        <p>
          Clearing these values won&apos;t break the site. The next time you
          visit, it&apos;ll behave as if you were a first-time visitor —
          you&apos;ll see the default theme and an empty comparison list.
        </p>
      </LegalSection>

      <LegalSection id="changes" title="Changes to this policy">
        <p>
          If we ever change what we store in your browser — for example, by
          adding analytics or a newsletter signup — we&apos;ll update this page,
          bump the &quot;Last updated&quot; date at the top, and surface a
          notice on the homepage for 14 days so returning visitors don&apos;t
          miss it.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="Contact">
        <p>
          Questions about what we store or how to clear it? Email us at{" "}
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

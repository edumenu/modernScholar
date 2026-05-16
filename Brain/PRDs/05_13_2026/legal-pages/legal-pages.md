# PRD — Legal Pages (Privacy Policy, Terms of Service, Cookie Policy)

> Implementation PRD derived from `legal-pages-decisions.md` (locked
> 2026-05-13 via `/grill-me`). Read the decisions doc first for full
> rationale; this PRD focuses on the *how*.

## Problem Statement

Modern Scholar's `/privacy`, `/terms`, and `/cookies` routes currently
render two-sentence placeholder stubs that say each policy is "being
finalized." Public users hitting the footer find effectively no real
content, which (a) hurts trust signals for a site asking students to
follow scholarship recommendations, (b) leaves us exposed under GDPR /
CCPA / COPPA even though our actual data practices are minimal, and (c)
blocks any future feature that touches PII (newsletter, accounts,
analytics) because we'd have no baseline policy to amend.

The interview confirmed real legal exposure today is low (no PII
collected, no accounts, no tracking), but a launch-ready editorial
platform needs real policies that match its brand voice rather than
generic templated boilerplate.

## Location

`Brain/PRDs/05_13_2026/legal-pages/legal-pages.md`

Companion file: `Brain/PRDs/05_13_2026/legal-pages/legal-pages-decisions.md`
(locked decisions from `/grill-me` interview).

## Solution

Replace each of the three stub pages with full plain-language policies
authored in a Stripe/Vercel tone, rendered through a new shared
`<LegalLayout>` component that owns the chrome (last-updated label,
heading typography, container width, TL;DR slot). Content lives directly
in each route's `page.tsx` as JSX rather than MDX, since policy prose
needs no rich embeds and the three pages share an identical structural
contract.

A small `legal-constants.ts` module centralizes the contact email,
controller identity, governing-law string, response windows, and
per-policy "Last Updated" dates so that a change to any of these flows
through all three pages from one place.

No new routes, no consent banners, no cookie/consent UI, no analytics,
and no MDX wiring are introduced. Footer links and sitemap entries
already exist and remain unchanged.

## User Stories

1. As a privacy-conscious visitor, I want to read a plain-language
   summary of what Modern Scholar does with my data, so that I can
   decide whether to continue using the site.
2. As an EU/UK visitor, I want to see explicit GDPR rights and the legal
   basis for any processing, so that I can exercise my rights if I
   choose.
3. As a California resident, I want to confirm Modern Scholar does not
   sell or share my personal information, so that no further opt-out
   action is required of me.
4. As the parent of a student under 13, I want to see a clear notice
   that the service is not directed at children under 13 and a path to
   request review or deletion, so that I know how to act on my child's
   behalf.
5. As a student researching scholarships, I want a clearly worded
   disclaimer that scholarship data may be inaccurate or outdated, so
   that I know to verify deadlines and eligibility with the provider
   directly.
6. As a content creator, I want the terms to make clear that the
   editorial blog content belongs to Modern Scholar, so that
   unauthorized reposting can be addressed.
7. As an automated scraper operator, I want a clear acceptable-use
   clause stating that systematic extraction without permission is
   prohibited, so that the operator (or I, as the site owner) know the
   ground rules.
8. As a visitor on a slow connection or screen reader, I want each
   policy page to follow a clean heading hierarchy and load without
   third-party scripts, so that I can read it accessibly.
9. As Edem (operator), I want to update the "Last Updated" date for a
   single policy by editing one constant, so that I don't have to chase
   the date across multiple files.
10. As Edem (operator), I want to add a new disclosure (e.g., when
    newsletter ships) by inserting a single `<LegalSection>` and
    refreshing the "Last Updated" date, so that policy maintenance is
    low-friction.
11. As a returning visitor, I want any material policy change to be
    surfaced via a homepage banner for 14 days, so that I don't miss
    significant updates. (Banner is deferred infrastructure — see Out of
    Scope; the policy text references this commitment.)
12. As a search engine crawler, I want all three pages to be statically
    rendered, indexable, and listed in the sitemap with correct
    `lastModified` metadata, so that the policies surface in relevant
    queries. (Sitemap and metadata are already wired; this PRD must not
    regress them.)
13. As Edem (operator), I want a stated 30-day window for handling data
    deletion/access requests and a 72-hour window for breach
    notification, so that I have a clear bar to meet when requests
    arrive.
14. As a developer onboarding to this codebase, I want a `LegalLayout`
    component that documents the typography contract for legal text, so
    that I can ship a new policy page (e.g., DPA, accessibility
    statement) without re-litigating the design.

## Implementation Decisions

### Modules

**`LegalLayout`** — `src/components/legal/legal-layout.tsx`

- Server component (no client state needed).
- Wraps content in the existing `<PageTransition>` so route motion is
  consistent with the rest of the app.
- Applies `page-padding-y` (existing utility) for vertical rhythm.
- Constrains content to `max-w-3xl` (decision Q24) for legal readability,
  centered within the existing `PageShell`'s `max-w-7xl` outer container.
- Renders, in order: a small "Last Updated" label (uppercase,
  tracking-wide, secondary color), an H1 in Noto Serif at
  `text-3xl md:text-4xl`, an optional TL;DR card (primary-tinted left
  border on a `surface-container` background), and the children
  (rendered as `<LegalSection>` blocks).
- Renders a small footer block at the bottom of every legal page: "Have
  a question? Contact us at `<email>`" using the existing email-link
  styling pattern (`text-primary underline underline-offset-2`).
- Props: `title: string`, `lastUpdated: string` (ISO date), `tldr?: ReactNode`, `children: ReactNode`.

**`LegalSection`** — `src/components/legal/legal-section.tsx`

- Server component.
- Props: `id: string`, `title: string`, `children: ReactNode`.
- Renders an H2 (Noto Serif, `text-2xl`) with the section's `id`
  attribute set, and the body in Poppins paragraph typography
  (`text-base leading-relaxed text-on-surface-variant`).
- Applies `scroll-mt-24` (or matching offset) on the section element so
  if anchor links are ever added later they land below the header.

**`LegalSubsection`** — `src/components/legal/legal-subsection.tsx`

- Server component.
- Props: `id?: string`, `title: string`, `children: ReactNode`.
- Renders an H3 (Noto Serif, `text-xl`) plus body content. Used for
  nested headings such as "Your Rights → GDPR" and "Your Rights → CCPA".

**`legal-constants.ts`** — `src/lib/legal-constants.ts`

- Exports:
  - `CONTACT_EMAIL = "dearmodernscholar@gmail.com"`
  - `CONTROLLERS = "Edem Dumenu and Catherine Dumenu, North Carolina, USA"`
  - `GOVERNING_LAW = "the laws of the State of North Carolina, USA"`
  - `DISPUTE_VENUE = "the state or federal courts located in North Carolina"`
  - `RESPONSE_WINDOW_DAYS = 30`
  - `BREACH_WINDOW_HOURS = 72`
  - `LAST_UPDATED = { privacy: "YYYY-MM-DD", terms: "YYYY-MM-DD", cookies: "YYYY-MM-DD" }`
- Each policy page imports its own date from this object, eliminating
  the need to search-and-replace dates across files.

**Content rewrites (existing routes)** — `src/app/{privacy,terms,cookies}/page.tsx`

- Replace the entire body of each existing stub with a `<LegalLayout>`
  + `<LegalSection>` composition reflecting the structures locked in the
  decisions doc (12 sections for Privacy, 17 for Terms, 7 for Cookies).
- Preserve and update the existing `metadata` exports at the top of each
  file. Description copy may be refreshed to reflect real content
  ("Learn how Modern Scholar handles your data" rather than "Privacy
  policy for Modern Scholar.").
- Keep the existing `<PageTransition>` behavior — `LegalLayout` will
  wrap its own children in it, so the page file becomes the layout +
  sections composition only.

**Reuse `<Callout>`** — `src/components/blog/callout.tsx`

- Use `<Callout type="warning">` for the scholarship-data disclaimer
  block in Terms (medium-strength language, per decision Q14).
- Use `<Callout type="tip">` for the parental-request line in Privacy
  (decision Q11).
- No changes to the Callout component itself.

### Content authoring requirements

The full prose is drafted directly inside each `page.tsx`. Drafts must:

- Match the Stripe/Vercel voice (locked Q8): plain language, short
  paragraphs, no defined terms or numbered legalese.
- Cite the **exact** data inventory from decisions Q5 — no generic "we
  may collect" phrasing. Specifically name `theme`, `ms-comparison`, and
  `ms-settings` localStorage keys, and identify Spline + Iconify as
  third-party CDNs that see IPs but set no first-party cookies.
- Correctly describe Google Fonts as **self-hosted at build time by
  Next.js**, not as a runtime third-party request to Google.
- State GDPR legal basis as "legitimate interest" for DigitalOcean server
  logs and "user-initiated" for all other processing (decision Q9).
- Include the under-13 disclaimer and parental contact line (decision
  Q11).
- Include the medium-strength scholarship disclaimer (decision Q14).
- Include the light anti-scraping clause (decision Q15).
- Reference North Carolina as governing law and venue, no arbitration
  clause (decision Q16).
- State the 30-day response window and 72-hour breach notification
  commitment (decisions Q25, Q26).
- Commit to a 14-day homepage banner for material changes (decision Q12)
  — the policy text references this; the banner mechanism itself is out
  of scope for this PRD (see Out of Scope).

### Footer / navigation

No footer changes. The three links and their hrefs (`/privacy`,
`/terms`, `/cookies`) are already in place and continue to work
unchanged.

### Sitemap & robots

No changes. `sitemap.ts` already includes all three routes with
`changeFrequency: "yearly"`, `priority: 0.3`, and git-derived
`lastModified` dates. Editing the policy content will naturally bump
`lastModified` because `getGitLastModified(routeFile(...))` reads git
history of the route's `page.tsx`. The hand-maintained
`LAST_UPDATED.{policy}` constant in `legal-constants.ts` is for
user-facing display only and intentionally lives separately from the
git mtime used by the sitemap.

### Styling and design system compliance

- Container: `max-w-3xl` (within existing `PageShell`'s `max-w-7xl`).
- Headings: Noto Serif at H1 `text-3xl md:text-4xl`, H2 `text-2xl`, H3
  `text-xl`. Body and labels in Poppins.
- TL;DR card: `bg-surface-container`, rounded corners, left border
  `border-l-4 border-primary`, padded interior, body text in
  `text-on-surface`.
- Email links: existing pattern,
  `text-primary underline underline-offset-2`.
- Internal cross-references (e.g., "see Section 7 below"):
  `text-secondary underline underline-offset-2`.
- Lists: disc bullets, indented, body color.
- No glassmorphism — these are Z-1 surfaces per the design system, not
  floating elements (CLAUDE.md rule).
- Dark mode: inherits from existing tokens (`text-on-surface`,
  `text-on-surface-variant`, `bg-surface-container`); no policy-specific
  dark-mode overrides should be needed.

### Accessibility

- Single H1 per page.
- No skipped heading levels (H1 → H2 → H3 only where nesting is
  semantic).
- Email links use descriptive text (the address itself), no "click here"
  patterns.
- All `<Callout>` content remains readable in both `prefers-contrast: more`
  and `prefers-reduced-transparency` modes (Callout component already
  satisfies this — verify, don't re-implement).

### New dependencies

None.

## Step 5: Submit an Asana ticket

Defer the Asana ticket question to the conversation following this PRD.
The user will be asked explicitly whether to create the ticket via the
`/create-asana-ticket` command before any external action is taken.

## Testing Decisions

- **Modules to test**:
  - **`LegalLayout`** — Vitest render test (in
    `src/__tests__/legal-layout.test.tsx` or co-located): pass
    `title`, `lastUpdated`, `tldr`, and a sample `<LegalSection>` child;
    assert the rendered DOM contains the H1 string, the formatted
    last-updated label, the TL;DR box content, and the child section's
    H2.
  - **Per-route smoke** — Playwright via the existing
    `@vitest/browser-playwright` harness: visit `/privacy`, `/terms`,
    `/cookies`; assert each returns a 200, contains a single H1 matching
    the policy title, contains the contact email, and contains a
    "Last updated" string.
  - **a11y heading hierarchy** — one Playwright assertion per route that
    no heading level is skipped (H1 followed only by H2, H2 followed
    only by H2 or H3).
- **What we deliberately don't test**:
  - Full snapshot of policy copy — legal text will be edited iteratively
    and snapshot churn would be high-noise and low-signal.
  - Cookie-banner behavior — there is no banner (decision Q17).
  - Cookie/consent persistence — no consent is collected.
- **Prior art**:
  - `src/__tests__/` is the existing top-level test folder for Vitest
    tests; follow the existing pattern.
  - Existing blog content tests (`callout`, `pull-quote`,
    `mdx-kitchen-sink`) demonstrate the Storybook + Vitest pattern for
    static content components. The legal layout follows the same
    approach.
  - `vitest.config.ts` already wires the browser provider; no new
    config required.

## Out of Scope

- **Cookie consent banner.** No banner is added in any form. If a future
  PRD introduces analytics or non-essential tracking, that PRD owns the
  banner.
- **Material-change homepage banner mechanism.** The policy text
  commits to surfacing material changes via a 14-day homepage banner,
  but building the banner primitive itself (toggle, dismiss, persist)
  is a separate feature. The first material change will trigger its
  own PRD.
- **MDX migration.** Pages remain JSX. No `content/legal/*.mdx` is
  introduced.
- **Versioning UI.** No version number, no inline changelog, no diff
  link, no archive of past versions. Date-only per decision Q19.
- **Table of contents.** No ToC, no scrollspy, no anchor-link sidebar
  per decision Q23.
- **Newsletter privacy section.** Excluded until the newsletter feature
  itself ships (decision Q6). The shipping PR for newsletter is
  responsible for adding the section.
- **Per-role email aliases** (`privacy@`, `legal@`, custom-domain
  forwarding). Single inbox per decision Q4.
- **Physical mailing address.** Deferred until LLC formation
  (decision Q3). Tracked in `Brain/future/Todos.md` (must be added by
  the same change-set that introduces this PRD).
- **External legal review.** No outside counsel review for MVP launch
  (decision Q21).
- **Self-service deletion / data export UI.** Manual via inbox is the
  flow (decision Q25).
- **Cookie scanner or third-party consent tooling** (Termly,
  CookieYes, etc.). Not used.

## Further Notes

### Authoring & operator workflow

- "Last Updated" dates live in `legal-constants.ts`. When you edit a
  policy's content, bump its date in the same change.
- The sitemap's `lastModified` is git-derived and updates
  automatically — no manual maintenance required there.
- The internal runbooks for (a) handling deletion requests and (b)
  responding to a breach must be added to `Brain/` as a side artifact
  of this PRD's first implementation. Suggested locations:
  `Brain/future/Todos.md` (deletion-request handling) and a new
  `Brain/future/breach-runbook.md` for the breach plan. These are
  internal-only and do not ship to users.

### Discipline rules captured for future PRs

- Any PR that introduces a new data collection point (newsletter,
  account, analytics, form submission) MUST update the Privacy Policy
  and Cookie Policy in the same change, and bump the corresponding
  `LAST_UPDATED.*` constant.
- Any PR that affects the scholarship data pipeline in a way that
  affects accuracy (new scrape sources, automated freshness checks
  disabled, etc.) MUST be reviewed against the medium-strength
  scholarship disclaimer in Terms; if the data quality framing
  materially changes, update Terms.

### Performance

- All three pages remain statically generated (no `"use client"`
  directives in the page files themselves; `<PageTransition>` is the
  only client component in the tree and already exists site-wide).
- No new third-party scripts. No new fonts. No new images. Page weight
  remains roughly equivalent to current stubs plus the additional text
  content.

### Open questions

- None. The decisions doc resolved every open branch. Any new decision
  surfaced during implementation should be added to the decisions doc
  (not silently in code) and reviewed before merge.

### Migration considerations

- The change is content-only — no schema, no API, no data migration.
- Removing the "being finalized" copy from the stubs is a one-step
  swap. Old URL structure preserved; SEO impact is positive (real
  content where there was placeholder text).
- The first deploy is also the right moment to add the deferred
  reminder ("Form LLC → PO Box → update addresses") to
  `Brain/future/Todos.md`, as part of the same PR.

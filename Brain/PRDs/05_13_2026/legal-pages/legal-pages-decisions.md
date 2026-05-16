# Project Decisions — Legal Pages (Privacy, Terms, Cookies)

> Generated from `/grill-me` interview on 2026-05-13

## Overview

Modern Scholar is an MVP scholarship discovery platform with no user accounts, no
backend forms, no analytics, and no third-party trackers. It does run on
DigitalOcean (server logs), uses localStorage for theme + comparison list, and links
out to a single `mailto:` for contact. Three static legal pages (Privacy Policy,
Terms of Service, Cookie Policy) already exist as placeholder stubs at
`/privacy`, `/terms`, `/cookies` and need real content + improved layout before
public launch. This document captures the structural and content decisions that
will drive implementation.

## Decisions

### Scope & jurisdiction

- **Decision**: Treat audience as global. Default to the strictest applicable
  privacy law (GDPR) and layer CCPA, UK GDPR, PIPEDA, and COPPA on top.
- **Rationale**: Site is English-only with no geo-blocking, scholarship topic
  has no borders, and writing once for the strictest regime avoids future
  retrofits.
- **Depends on**: All downstream content decisions (data inventory, rights
  section, minors clause).

### Legal entity behind site

- **Decision**: Joint sole proprietors — Edem and Catherine Dumenu,
  based in North Carolina. No LLC formed.
- **Rationale**: Reflects current legal reality. Both individuals are joint
  data controllers under GDPR; liability sits on them personally.
- **Depends on**: Governing law (NC), contact path (Catherine as primary inbox
  owner), future deferred decision to form LLC.

### Public contact address

- **Decision**: Defer until LLC is formed. List only email contact in policies.
- **Rationale**: User does not want to publish home address; PO Box / virtual
  mailbox deferred as cost is not yet justified for MVP. Acknowledged this is
  technically non-compliant with CalOPPA / GDPR Art 13 — accepted as MVP risk.
- **Alternatives considered**: PO Box ($80/yr), virtual mailbox ($15/mo) —
  ruled out as premature.
- **Depends on**: LLC formation milestone (when triggered, add address line to
  all three policies).

### Primary contact email

- **Decision**: Single inbox — `dearmodernscholar@gmail.com` — used for
  general, privacy, legal, deletion, and breach contact.
- **Rationale**: MVP volume does not justify alias setup. Custom domain
  forwarding deferred.
- **Alternatives considered**: Per-role addresses (`privacy@`, `legal@`),
  Gmail `+alias` — ruled out as unnecessary overhead at MVP scale.

### Data inventory

- **Decision**: The following is the complete, authoritative inventory of data
  the site touches today:
  1. DigitalOcean server logs — IP, user-agent, request path, timestamp.
  2. localStorage keys — `theme` (next-themes), `ms-comparison` (Zustand),
     `ms-settings` (Zustand).
  3. Mailto interactions — user-initiated emails delivered to gmail.
  4. Spline CDN (`prod.spline.design`) — sees visitor IP when 3D scenes load.
  5. Iconify CDN (`api.iconify.design`) — sees visitor IP for icon fetches.
  6. Google Fonts — self-hosted by Next.js at build time, no data to Google.
- **Rationale**: Confirmed by direct code inspection. Policy must reflect this
  exactly; no generic boilerplate.
- **Depends on**: Privacy Policy "What we collect" section, Cookie Policy
  table.

### Newsletter / future email collection

- **Decision**: Do not mention in current policies. When newsletter is built,
  update policy in the same PR.
- **Rationale**: Promising features you do not yet offer creates a
  policy-vs-practice mismatch.
- **Depends on**: Self-discipline rule recorded in the implementation PRD.

### Privacy Policy structure

- **Decision**: 12-section skeleton:
  1. TL;DR summary
  2. Who we are
  3. What we collect
  4. Why we collect it (with GDPR legal bases)
  5. Where data goes (third parties / sub-processors)
  6. How long we keep it
  7. Your rights (GDPR + CCPA)
  8. Children's privacy (COPPA)
  9. International transfers
  10. Changes to this policy
  11. Contact
  12. Last updated
- **Rationale**: Maps one-to-one to data inventory. Each section is a
  natural disclosure for the locked data set.

### Voice and tone

- **Decision**: Stripe / Vercel style — plain language, short paragraphs,
  no legalese, headers and key takeaways up top.
- **Rationale**: Matches Modern Scholar editorial brand. Risk surface is
  low (no payment, no health data) so heavy legal formality unnecessary.
- **Alternatives considered**: GitHub balanced (summary + formal text),
  traditional legalese — ruled out as overkill and brand-incongruent.

### GDPR legal basis

- **Decision**: State **legitimate interest** for DigitalOcean server logs (security
  and debugging). All other processing labeled **user-initiated**. No consent
  banners; no claim of consent for processing we don't do.
- **Rationale**: Accurate to the data inventory; avoids fake consent flows
  which are themselves a compliance problem.

### CCPA "Do Not Sell" treatment

- **Decision**: Statement in Privacy Policy only — "We do not sell or share
  personal information." No footer link, no opt-out form.
- **Rationale**: No data is sold or shared cross-context; footer link would
  imply otherwise. Revisit if cross-site tracking is ever added.

### Minors / COPPA

- **Decision**: Disclaim service is "not directed to children under 13."
  Include parental request line: "Parents may email us to review or delete
  any information submitted by their child."
- **Rationale**: No PII is collected from anyone, so COPPA exposure is
  inherently low. Disclaimer is the standard minimum.
- **Alternatives considered**: Under-16 (GDPR-K) threshold and active age
  gate — ruled out as unnecessary given no signup flow exists.

### Retention and transfers

- **Decision**:
  - DigitalOcean logs: ~30 days, no extension.
  - localStorage: until user clears their browser.
  - Inbound email: kept as long as needed to respond; deletable on request.
  - International transfers: US-hosted (DigitalOcean); EU/UK users acknowledge
    transfer; rely on DigitalOcean's DPA / SCCs.
- **Rationale**: Defaults match real infrastructure behavior; no custom
  retention engineering required.

### Change notification

- **Decision**: "Last Updated" date refreshed on every change. Material
  changes additionally trigger a homepage banner for 14 days.
- **Rationale**: Cheap to implement (banner primitives already exist) and
  signals good faith. Cosmetic edits do not trigger the banner.
- **Depends on**: Implementation PRD to define banner mechanism.

### Terms of Service structure

- **Decision**: 17-section skeleton — acceptance, about the service,
  eligibility, scholarship data disclaimer, editorial content, acceptable
  use, IP, third-party links, disclaimers (AS IS), limitation of liability,
  indemnification, termination, governing law (NC), disputes, changes,
  contact, last updated.

### Scholarship data disclaimer strength

- **Decision**: **Medium-strength** disclaimer. State AS-IS / no warranty /
  user must verify with provider / no liability for missed deadlines,
  rejections, ineligibility surprises, third-party fraud, or financial loss.
- **Rationale**: Hard tier (consequential-damages waiver) reads as
  user-hostile and is unnecessary for a free service. Soft tier leaves
  liability vector wide.
- **Alternatives considered**: Soft and Hard tiers — ruled out per above.

### Acceptable use / anti-scraping

- **Decision**: Light clause — "No automated scraping or systematic
  extraction without written permission." No DMCA machinery, no rate-limit
  declaration.
- **Rationale**: Proportional to current scale; gives standing to send a
  takedown letter if needed without creating enforcement infrastructure.

### Governing law and disputes

- **Decision**: North Carolina state and federal courts, no arbitration
  clause.
- **Rationale**: Free informational service does not justify arbitration
  overhead. NC small claims handles realistic disputes.

### Cookie consent UX

- **Decision**: No banner today. Policy alone discloses essential storage.
- **Rationale**: All current localStorage usage qualifies as essential or
  user-initiated under ePrivacy. Adding a banner would imply tracking that
  doesn't exist. Revisit when analytics or third-party tracking is added.

### Cookie Policy structure

- **Decision**: TL;DR → table of localStorage keys → explicit "what we
  don't use" list (GA, Meta Pixel, advertising cookies) → third-party CDN
  note (Spline, Iconify) → how to clear → changes → contact.
- **Rationale**: Short, scannable, specific. Avoids template bloat.

### Versioning scheme

- **Decision**: Date-only — single "Last updated: YYYY-MM-DD" line at top.
  No version numbers, no inline changelog.
- **Rationale**: Date is sufficient evidence of changes; changelog adds
  maintenance overhead with little user-facing value.
- **Alternatives considered**: Semver + inline changelog, Git-backed history
  link — ruled out as unnecessary.

### Generation strategy

- **Decision**: AI-drafted from these locked decisions. No Termly / iubenda /
  Termsfeed template. No external legal review at MVP stage.
- **Rationale**: Interview produced the expensive part (inventory + structural
  choices). Drafting follows mechanically. Avoids template bloat and tone
  mismatch.
- **Depends on**: Implementation PRD to specify draft → review → publish flow.

### Implementation pattern

- **Decision**: Three pages remain as `page.tsx` server components, share a
  new `<LegalLayout>` UI component that handles typography, last-updated
  banner, contact CTA, page padding.
- **Rationale**: DRY across the three pages; matches existing component
  patterns (`PageTransition` wrapper, Noto Serif heading, Poppins body); no
  MDX overhead since content is plain prose.
- **Alternatives considered**: MDX in `content/legal/`, hardcoded JSX in each
  page — ruled out per overhead vs. duplication tradeoff.

### Table of contents

- **Decision**: No ToC on any policy page.
- **Rationale**: Simplest implementation. Pages are scrollable; user can use
  browser find.

### Typography contract

- **Decision**:
  - Container max width: `max-w-3xl`.
  - Page heading: Noto Serif, `text-3xl md:text-4xl font-bold`.
  - Section heading: Noto Serif, `text-2xl`.
  - Subsection heading: Noto Serif, `text-xl`.
  - Body: Poppins, `text-base leading-relaxed text-on-surface-variant`.
  - Last-updated label: small caps / tracking-wide, secondary color, above H1.
  - TL;DR box: `surface-container` background, rounded, primary-tinted left
    border.
  - Email links: existing pattern (`text-primary underline underline-offset-2`).
  - Internal cross-references: `text-secondary` + underline.

### Deletion / access request flow

- **Decision**: Manual via inbox. Stated 30-day response window in Privacy
  Policy. Internal handling runbook lives in `Brain/` notes, not in the policy.
- **Rationale**: No accounts, almost nothing to delete in practice. Web form
  is overkill at MVP volume.

### Breach notification

- **Decision**: Policy clause states 72-hour notification window by email and
  homepage banner. Internal runbook lives in `Brain/` notes (rotate creds,
  enable MFA, draft notice, post banner).
- **Rationale**: Required by GDPR and US state laws. Runbook ensures the
  first incident is not the first time the procedure is read.

## Deferred

- **Physical address in policies** — defer until LLC is formed. At that time:
  form LLC → obtain PO Box or virtual mailbox → add address line to all three
  policies → update `Brain/future/Todos.md` to reflect close-out.
- **Per-role email aliases** (`privacy@`, `legal@`) — defer until inbox volume
  justifies separation.
- **Cookie banner / consent UX** — defer until any non-essential tracking
  (analytics, ads, cross-site pixels) is introduced.
- **Newsletter privacy section** — defer until newsletter feature is built;
  must update in same PR.
- **External legal review** — defer indefinitely; acceptable for MVP risk
  profile.

## Open Questions

- None remaining. All branches resolved and cross-checked. Move to
  `/write-a-prd` to convert these decisions into an implementation plan.

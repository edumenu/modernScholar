# Module 4: Contact Page Revamp

> Part of the [UX/UI Audit](ux-audit-overview.md) — Priority: P1

## Problem Statement

The contact page is the thinnest page on the site. On mobile, the 3D scene is hidden and users see approximately 6 lines of text and one button — the shortest page on the platform. The mailto-only CTA fails silently on devices without a configured mail client (common on Chromebooks and mobile-first student devices). There is no response time expectation, no FAQ, no question routing, and no tonal surface layering. The page structure (hero + email CTA) communicates minimal effort on a high-intent conversion page where students are seeking help with life-changing financial decisions.

## Solution

Mobile-friendly layout, response time expectations, inline FAQ, and tonal surface depth. Transform it from a utility dead-end into a trust-building brand moment.

## User Stories

1. As a student on a Chromebook, I want a contact form on the page, so that I can reach out without relying on a mailto link that may not work.
2. As a student considering reaching out, I want to see a response time expectation, so that I know whether to expect a reply in hours or weeks.
3. As a mobile user, I want the contact page to feel complete, so that I don't see an empty page with just a heading and a button.
4. As a student with a specific question type (scholarship help, platform feedback, partnership inquiry), I want visual question routing, so that I feel I'm reaching the right person.
5. As a student unsure whether to email, I want to see 3-5 FAQ answers inline, so that I can self-serve common questions.
6. As a user scrolling the page, I want tonal surface shifts between sections, so that I can tell where one section ends and another begins.
7. As a user viewing the 3D scene, I want it framed in a container with rounded corners, so that it feels intentionally placed rather than floating.
8. As a user, I want to see a brief team description, so that I know there are real people behind this platform.

## Implementation Decisions

### 1. Mobile Experience

On viewports below `lg:`, render a light and dark image depending on the theme: modern-scholar/public/lightContactPhone.png and modern-scholar/public/darkContactPhone.png

The goal is eliminating the barren mobile experience without WebGL performance cost.

**Components affected**: `contact-form-section.tsx`

### 2. Response Time and Trust Signals

Add below the email display: "We typically respond within 1-2 business days." Add a brief team description: "We're a small team of educators and developers in North Carolina, building better tools for scholarship discovery." These are copy-only changes with outsized trust impact.

**Components affected**: `contact-form-section.tsx`

### 3. Inline FAQ Section

Add a 3-5 question accordion below the contact CTA section. Questions:
- "How do I submit a scholarship not in your database?"
- "Is Modern Scholar free to use?"
- "How do I report incorrect scholarship information?"
- "What kinds of questions can I ask?"
- "Can I find you on social media?"

Use the Base UI `Collapsible` primitive. Each accordion item sits on `surface-container-low` for tonal depth. Animate expand with a 250ms height transition.

**Components affected**: `contact-form-section.tsx` or new `contact-faq.tsx`
**Page affected**: `contact/page.tsx` (add new section)

### 4. Tonal Surface Layering

Add `bg-surface-container-low rounded-3xl p-8 md:p-12` to the contact form section outer div. This creates spatial separation from the hero without using borders (per the design system's No-Line Rule).

**Components affected**: `contact-form-section.tsx`

### 5. 3D Scene Container

Wrap the Spline `Suspense` boundary in a container with `rounded-3xl overflow-hidden bg-surface-container shadow-md`. This gives the scene a surface to rest on and spatial anchoring.

**Components affected**: `contact-form-section.tsx`

### 6. Question Routing Visual

Add three icon tiles above the email CTA: "Scholarship Help" (magnifier icon), "Platform Feedback" (chat icon), "Partnership" (handshake icon). These are visual categories, not separate email addresses — they help users feel they're reaching the right inbox even though everything goes to one address.

**Components affected**: `contact-form-section.tsx`

### 7. NudgeArrow Token Fix

Replace `border-white/50 bg-white/30` with `border-outline-variant/60 bg-surface-container/70` to align with the warm color system. The current cool-white treatment stands out against the warm cream palette.

**Components affected**: `contact-form-section.tsx`

## Testing Decisions

- **Modules to test**: Contact form submission (Playwright: fill form, submit, verify success state), form validation (unit test: required fields, email format), mobile layout rendering (Playwright: viewport 375px, verify no empty space)
- **Prior art**: Existing Playwright setup

## Out of Scope

- Real-time chat widget or chatbot
- Interactive map embedding
- Newsletter subscription (separate feature)
- Social media feed integration

## Further Notes

- The "Open Letter" layout is a bold redesign idea from Module 6 — structure the page as an editorial letter ("Dear Student,") with the CTA as "Write Back." Consider this as a Phase 2 enhancement after the functional foundation is solid.
- Consider reducing Spline scene height from `h-150` to `h-120` so the right column content doesn't feel vertically compressed.
- The `key={resolvedTheme}` on the Spline component causes a full WebGL re-fetch on dark mode toggle. Consider hoisting scene selection to avoid double-loading.

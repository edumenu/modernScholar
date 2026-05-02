# Branch 5: UI/UX Polish

> Priority: P2 — Should fix before launch
> Depends on: Branch 4 (Design System Compliance) for spacing and border decisions
> Date: 2026-04-22

## Problem Statement

Several UI/UX issues across Modern Scholar reduce the product's credibility and usability. The home page hero H1 is undersized for an editorial display heading. The primary CTA has an unnecessarily long animation delay. The "Apply Now" button in the expanded scholarship modal has no destination. The contact page has no actual form — only a mailto link. Blog filters use ephemeral `useState` instead of URL parameters, making filtered views unsharable. The footer promises features that don't exist and links to pages that 404. The mobile header has an unconventional right-aligned layout. These issues collectively erode user trust and conversion potential.

## Solution

Adjust the hero typography to match the editorial display intent. Fix CTA timing. Wire up the "Apply Now" button or replace with appropriate action. Add a contact form or clearly document the mailto-only approach. Align blog filters to URL state. Clean up footer content. Fix mobile header layout.

## User Stories

1. As a first-time visitor landing on the home page, I want the headline to feel bold and editorial, so that I immediately understand this is a premium, trustworthy platform.
2. As a user on the home page, I want the primary CTA to appear quickly after the headline, so that I can take action without waiting for animations to finish.
3. As a user viewing an expanded scholarship card, I want the "Apply Now" button to navigate me to the scholarship's application page, so that I can actually apply.
4. As a user on the contact page, I want to submit a message without leaving the browser, so that I don't need to configure a mail client or lose my web context.
5. As a user filtering blog posts by category and searching, I want to share the filtered URL with a friend, so that they see the same results.
6. As a user clicking "Privacy Policy" or "Terms" in the footer, I want to land on an actual page, so that I trust the platform handles my data responsibly.
7. As a mobile user, I want the header to have the logo on the left and the menu button on the right, so that the navigation feels familiar and balanced.
8. As a user reading the footer, I want the description to accurately reflect what the platform currently offers, so that I'm not misled by promises of features that don't exist.
9. As a user on the scholarships page, I want dimmed (non-matching) cards to still be interactive, so that I can click them to switch my filter context rather than being locked out.

## Implementation Decisions

### Module 1: Hero Typography Scale

In `src/components/home/hero-section.tsx`, update the H1 element:

- Replace `text-3xl md:text-5xl` with a fluid clamp: `text-[clamp(2.5rem,6vw+1rem,5.5rem)]`.
- Add `tracking-tighter` for the editorial tight-set display look.
- Add `leading-[1.05]` for tight line height appropriate at display sizes.

This aligns with `SystemDesign.md`'s display-lg specification and matches the scale used on other page heroes (blog uses `clamp(3rem,8vw+1rem,7rem)`, scholarships uses `text-4xl md:text-5xl lg:text-7xl`).

### Module 2: CTA Animation Timing

In `src/components/home/hero-section.tsx`:

- Reduce the "Explore" CTA button's `delay` from `0.7` to `0.45` (immediately after the headline's `0.4` delay).
- The CTA is the primary conversion element and should not lag behind supporting content.

### Module 3: "Apply Now" Button Destination

In `src/components/scholarships/scholarship-grid.tsx`, the expanded modal's "Apply Now" button:

- Add an `applyUrl` field to the `Scholarship` interface in `src/data/scholarships.ts`. For scholarships without a known URL, use a placeholder or the scholarship provider's homepage.
- Wire the button to navigate to `scholarship.applyUrl` in a new tab: `<a href={scholarship.applyUrl} target="_blank" rel="noopener noreferrer">`.
- If `applyUrl` is not available for a scholarship, show "Learn More" instead of "Apply Now" and link to a search query or the provider's site.

### Module 4: Contact Form

In `src/components/contact/contact-form-section.tsx`:

- Add a minimal contact form with fields: name (text input), email (email input), subject (select, pre-populated from the QuestionRouting tiles), and message (textarea).
- Make the QuestionRouting tiles interactive: clicking a tile pre-selects the corresponding subject in the form and scrolls to the form section.
- For form submission, use a Next.js Server Action that sends email via Resend, or use a third-party form service (Formspree, Getform) as a no-backend alternative.
- Include basic client-side validation (required fields, email format) and server-side validation.
- Show success/error states using the existing Sonner toast system (which will be mounted in Branch 1).
- Keep the existing mailto link as a secondary option below the form: "Prefer email? Reach us at hello@modernscholar.io".

### Module 5: Blog Filter URL State

In `src/components/blog/blog-grid.tsx`:

- Replace `useState` for `searchQuery` and `activeCategory` with `useQueryState` from nuqs.
- This matches the existing pattern in `src/components/scholarships/scholarship-grid.tsx` which already uses nuqs for all filter state.
- URL structure: `/blog?category=guides&q=stem` (or similar).
- Ensure the page number state (already using nuqs) works correctly with the new filter params (reset page to 1 when filters change).

### Module 6: Footer Content Cleanup

In `src/components/ui/footer/footer.tsx`:

- Update the brand description from "End-to-end scholarship management with intelligent matching" to something that reflects current capabilities, e.g., "Curated scholarship discovery for ambitious students."
- For legal links (`/privacy`, `/terms`, `/cookies`): either create minimal placeholder pages (recommended) or change the links to `#` with a tooltip "Coming soon" and reduce their visual prominence.
- For social links: either add real social media profile URLs or remove the social links section entirely. Linking to `twitter.com` root domain is worse than no link.

Recommendation: Create minimal legal pages (`src/app/privacy/page.tsx`, `src/app/terms/page.tsx`) with placeholder content stating "This policy is being finalized" — this is better than a 404 and establishes the URL pattern for when real content is added.

### Module 7: Mobile Header Layout

In `src/components/ui/header/header.tsx`:

- Change the mobile layout from `justify-end` to `justify-between`.
- Position the logo pill on the left and the hamburger menu button on the right.
- Add `px-4 pt-4` padding for mobile to prevent the logo from touching the screen edge.

```
Mobile: [Logo]                    [☰]
Desktop: (centered nav pill, unchanged)
```

This follows the conventional mobile navigation pattern that users expect.

### Module 8: Dimmed Card Interactivity

In `src/components/scholarships/scholarship-card.tsx`:

- Remove `pointer-events-none` from the dimmed card class list.
- Keep the visual dimming (`opacity-40 saturate-50`) to indicate non-matching status.
- Add an `onClick` handler that, when a dimmed card is clicked, switches the active category filter to that card's category.
- Add a subtle tooltip or visual hint on hover: "Click to filter by [category]".

### Module 9: Home Page Mobile Brand Duplication

In `src/components/home/hero-section.tsx`:

- Remove the mobile-only "Modern Scholar" `<p>` block (lines 61–70) that duplicates the brand name already rendered by `AnimatedLines` below.
- The header logo already provides brand identity on mobile. The animated headline section is sufficient for brand reinforcement.

## Testing Decisions

- **Modules to test**: Module 4 (contact form submission and validation), Module 5 (blog URL state persistence across navigation), Module 8 (dimmed card click behavior)
- **Prior art**: The scholarships page nuqs integration (`scholarship-grid.tsx`) is the reference implementation for Module 5. Contact form testing can follow standard form submission patterns with Vitest (mock the server action) and Playwright (E2E form fill and submit).

## Out of Scope

- Blog detail page design refinements (article line length, sidebar layout)
- Scholarship data enrichment (adding more fields to the data model beyond `applyUrl`)
- Home page animation choreography overhaul
- Footer redesign (only content corrections)
- Contact page Spline 3D scene performance

## Further Notes

- Module 4 (Contact Form) is the largest item in this branch and could be split into its own sub-PRD if needed. The form backend choice (Server Action vs. Formspree) should be decided before implementation.
- Module 6 (Footer Content) requires stakeholder input on what the real social media URLs are and what legal content will be provided.
- Module 3 (Apply Now) requires populating `applyUrl` for all scholarships in the data file. This is a data entry task that may take time — consider shipping with "Learn More" as the default label and progressively adding URLs.
- The mobile header layout change (Module 7) should be verified against the mobile menu opening animation to ensure the hamburger button position is consistent between closed and open states.

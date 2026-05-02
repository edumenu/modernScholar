# Branch 1: Critical Blockers

> Priority: P0 — Must fix before launch
> Date: 2026-04-22

## Problem Statement

Modern Scholar has no error handling infrastructure, no SEO crawl permissions, an exposed API key, and several HTML/ARIA violations that would cause failures in production. Users hitting any unhandled error see a bare white screen. Search engines cannot discover or index the site. Screen reader users cannot navigate core interactive patterns. These are hard blockers for a public launch.

## Solution

Add the missing Next.js route segment files (error boundary, 404 page, loading states), create robots.txt and sitemap for search engine access, fix the API key storage, resolve invalid HTML nesting, mount the toast notification provider, fix the skip-to-content link positioning, and add missing ARIA attributes to the FAQ accordion.

## User Stories

1. As a user who navigates to a non-existent URL, I want to see a branded 404 page with navigation back to the home or scholarships page, so that I don't feel lost on a generic error screen.
2. As a user who encounters a runtime error on any page, I want to see a friendly error page with a retry option, so that I know the site is still functional and I can recover.
3. As a user waiting for a page to load during navigation, I want to see a loading skeleton that matches the site's design, so that I know content is coming.
4. As a search engine crawler, I want to discover a robots.txt and sitemap.xml at the site root, so that I can properly index all public pages and blog posts.
5. As a screen reader user navigating the FAQ section, I want the accordion buttons to be properly linked to their content panels via aria-controls, so that I can navigate directly from a question to its answer.
6. As a user on the contact page, I want the "Send Email" action to work correctly across all browsers and assistive technologies, so that I am not blocked by invalid HTML nesting.
7. As a user who copies an email address on the contact page, I want to see a toast confirmation, so that I know the copy succeeded.
8. As a keyboard user pressing Tab at the top of any page, I want the skip-to-content link to appear at a fixed viewport position regardless of scroll state, so that I can bypass navigation reliably.
9. As the site owner, I want API keys stored only in `.env.local` (gitignored), so that credentials are never accidentally committed or exposed.

## Implementation Decisions

### Module 1: Route Segment Error Handling

Create three new files in `src/app/`:

- **`error.tsx`** — A Client Component (`"use client"`) that receives `{ error, reset }` props. Displays the brand name, an empathetic error message, and a "Try Again" button that calls `reset()`. Also includes a link back to the home page. Styled consistently with the site's editorial aesthetic using the existing design tokens and typography (Noto Serif heading, Poppins body).
- **`not-found.tsx`** — A Server Component that renders a branded 404 page. Includes the "Modern Scholar" heading, a message like "This page doesn't exist", and prominent links to `/` and `/scholarships`. Uses the existing `AnimatedSection` component for entrance animation.
- **`loading.tsx`** — A root-level loading skeleton. Uses CSS `animate-pulse` on placeholder blocks that approximate the common page layout (hero area + content grid). Keeps the loading state lightweight with no JS dependencies.

Additionally, create `src/app/blog/[slug]/not-found.tsx` for blog-post-specific 404s with contextual messaging ("This article may have been moved or removed") and a link back to `/blog`.

### Module 2: SEO Infrastructure

Create two new files in `src/app/`:

- **`robots.ts`** — Exports a `MetadataRoute.Robots` object allowing all user agents to crawl `/` and pointing to the sitemap URL.
- **`sitemap.ts`** — Exports a `MetadataRoute.Sitemap` array containing all static routes (`/`, `/scholarships`, `/blog`, `/contact`) and dynamically generated entries for each blog post slug from `src/data/blog-posts.ts`. Each entry includes `lastModified`, `changeFrequency`, and `priority`.

The production domain URL should be defined as a constant (e.g., `SITE_URL`) shared between sitemap, robots, and metadata configurations.

### Module 3: API Key Security

Move the Firecrawl API key from `.env` to `.env.local`. The `.env` file should contain only the variable name with an empty value as documentation. The key should also be rotated since it may have been visible in the working directory.

### Module 4: FAQ Accordion ARIA Fix

In `src/components/home/faq-section.tsx`, the `AccordionItem` component needs:

- An `index` prop passed from the parent map function.
- `id={`faq-btn-${index}`}` on the `<button>` element.
- `aria-controls={`faq-panel-${index}`}` on the `<button>` element.
- `id={`faq-panel-${index}`}` on the collapsible content `<div>`.
- `role="region"` and `aria-labelledby={`faq-btn-${index}`}` on the content `<div>`.

The same pattern should be applied to `src/components/contact/contact-faq.tsx` if it uses a similar accordion.

### Module 5: Contact Page HTML Fix

In `src/components/contact/contact-form-section.tsx`, the `<a href="mailto:..."><CTAButton /></a>` nesting is invalid HTML (interactive element inside interactive element). Replace with either:

- Make `CTAButton` accept an `href` prop and render as `<a>` when provided, or
- Replace the `<a>` wrapper with an `onClick` handler that sets `window.location.href`.

### Module 6: Sonner Toast Provider

Mount the `<Toaster />` component from Sonner in `src/app/layout.tsx` so that `toast.success()` and `toast.error()` calls (used in `CopyEmailButton` on the contact page) actually render visible toast notifications.

### Module 7: Skip-to-Content Link

Move the `<a href="#main-content">` skip link outside of the `ScrollAnimatedHeader` component in `src/components/ui/header/header.tsx`. The skip link must be a direct sibling above the header, not a child of it, because CSS `transform` on the header ancestor repositions fixed-position children. The link should remain `sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60]`.

## Testing Decisions

- **Modules to test**: Module 1 (error/not-found rendering), Module 4 (ARIA attributes), Module 6 (toast visibility)
- **Prior art**: The project uses Vitest for unit tests and has Storybook for component testing. Playwright browser tests are configured but sparse. Error boundary and not-found tests should verify rendering via Vitest component tests. ARIA tests can be verified via Storybook accessibility addon or Playwright accessibility assertions.

## Out of Scope

- Per-route `loading.tsx` files (only root-level for now)
- Content Security Policy headers (covered in Branch 6)
- Custom error pages per HTTP status code (only generic error boundary)
- `.env` encryption or secrets management tooling

## Further Notes

- The Firecrawl API key rotation should happen immediately and independently of the code changes.
- The `SITE_URL` constant should be defined once and imported by both `sitemap.ts` and `robots.ts` — this same constant will be reused in Branch 2 (SEO & Metadata) for `metadataBase`.
- The blog `[slug]/not-found.tsx` should reuse layout elements from the root `not-found.tsx` to maintain visual consistency.

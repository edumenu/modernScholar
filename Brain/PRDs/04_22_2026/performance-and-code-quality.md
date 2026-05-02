# Branch 6: Performance & Code Quality

> Priority: P2 — Should fix before launch
> Depends on: None (independent)
> Date: 2026-04-22

## Problem Statement

Several performance and code quality issues in Modern Scholar will impact production bundle size, runtime behavior, and maintainability. The `BlogDetail` component is entirely client-rendered despite most of its content being static. A scholarship card hover animation specifies spring physics parameters on a tween transition type (parameters silently ignored). The `featured-scholarships.tsx` file duplicates the `Scholarship` interface and hardcodes data that should come from the canonical data source. The blog page `<Suspense>` has no fallback. The `next.config.ts` is empty — missing security headers, image configuration, and console stripping. The `PageTransition` component uses `AnimatePresence mode="wait"` which blocks navigation for 250ms on every route change.

## Solution

Split client/server rendering boundaries for large content components. Fix animation configuration errors. Deduplicate types and data. Add Suspense fallbacks. Harden the Next.js configuration for production. Evaluate page transition strategy.

## User Stories

1. As a user on a slow connection reading a blog post, I want the article content to be server-rendered and available immediately, so that I don't wait for a client-side JavaScript bundle to render static text.
2. As a user hovering over scholarship cards, I want the hover animation to feel physically natural (spring-based), so that the interaction feels polished.
3. As a developer maintaining the codebase, I want a single `Scholarship` type definition and data source, so that updates to scholarship data are reflected everywhere automatically.
4. As a user navigating to the blog listing page, I want to see a loading placeholder while the blog grid loads, so that the page doesn't flash empty.
5. As a user browsing the site, I want pages to respond to security best practices (proper headers, no console logs in production), so that the platform feels professional and secure.
6. As a user navigating between pages, I want transitions to feel snappy rather than sluggish, so that the site feels fast and responsive.
7. As a developer running `npm run build`, I want zero TypeScript errors and no unused imports, so that the build is clean.

## Implementation Decisions

### Module 1: BlogDetail Server/Client Split

In `src/components/blog/blog-detail.tsx`:

- Extract the static prose rendering (title, excerpt, hero image, section content, author bio, series navigation) into a new Server Component: `BlogDetailContent`.
- Keep only the scroll-tracking refs (`articleRef`) and the progress bar components (`ArticleProgressBar`, `ReadingProgress`) in a thin Client Component wrapper.
- The page component (`src/app/blog/[slug]/page.tsx`) renders `BlogDetailContent` as a Server Component with the `ReadingProgressWrapper` Client Component as a sibling or parent that provides the ref.

This reduces the client-side JavaScript bundle for blog posts significantly — all prose rendering, image display, and metadata cards become zero-JS server-rendered HTML.

Also in `src/components/contact/contact-form-section.tsx`: extract `QuestionRouting` and `NudgeArrow` as Server Components if they have no client-side interactivity. The layout grid, email address display, and location text are all static.

### Module 2: Scholarship Card Animation Fix

In `src/components/scholarships/scholarship-card.tsx`:

- Change the hover animation transition from `{ type: "tween", stiffness: 400, damping: 28 }` to `{ type: "spring", stiffness: 400, damping: 28 }`.
- The `stiffness` and `damping` parameters are spring-specific and are silently ignored when `type: "tween"` is set. The current behavior is a default linear tween, not the intended spring physics.

### Module 3: Deduplicate Scholarship Type and Data

In `src/components/home/featured-scholarships.tsx`:

- Remove the local `Scholarship` interface definition.
- Import `Scholarship` from `@/data/scholarships`.
- Replace the hardcoded `MARQUEE_DATA` arrays with a slice or curated selection from the canonical `scholarships` array in `@/data/scholarships`.
- If the marquee needs specific fields not in the canonical type (e.g., a `featured` flag), extend the type rather than duplicating it.

This ensures any update to scholarship data (titles, amounts, deadlines, images) is automatically reflected in the home page marquee.

### Module 4: Blog Suspense Fallback

In `src/app/blog/page.tsx`:

- Add a `fallback` prop to the `<Suspense>` wrapping `<BlogGrid />`.
- Use a minimum-height placeholder: `<div className="min-h-150" />` (matching the pattern used in `src/app/scholarships/page.tsx`).
- Optionally, create a skeleton component that approximates the blog grid layout (3-column grid of gray pulse rectangles) for a more polished loading experience.

### Module 5: Next.js Config Hardening

In `next.config.ts`, add:

**Security Headers:**
```typescript
async headers() {
  return [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      ],
    },
  ]
}
```

**Image Configuration:**
```typescript
images: {
  remotePatterns: [
    // Add external domains as scholarship/blog data evolves
  ],
}
```

**Console Removal** (if supported by the Next.js version):
- Use `compiler.removeConsole: { exclude: ["error"] }` to strip `console.log` and `console.warn` from production builds while keeping `console.error` for debugging.

### Module 6: Page Transition Strategy

In `src/components/ui/page-transition.tsx`:

- The current `AnimatePresence mode="wait"` blocks the new page from mounting until the exit animation completes (~250ms). Combined with Lenis smooth scroll, this makes navigation feel sluggish.
- Option A: Reduce exit animation duration from 250ms to 150ms.
- Option B: Switch to `mode="sync"` which allows the new page to enter while the old page exits (crossfade).
- Option C: Remove the Motion-based page transition entirely and use the View Transitions API (already partially supported via `next-themes`). This is the most performant option as it runs on the compositor thread.

Recommendation: Option A (reduce duration) for immediate improvement. Option C (View Transitions) as a follow-up when browser support is sufficient for the target audience.

### Module 7: Blog Detail Line Length

In `src/components/blog/blog-detail.tsx`:

- Add `max-w-prose` (65ch) to the article content area to constrain line length for readability.
- The current two-column layout (`lg:grid-cols-[260px_1fr]`) allows the article column to span ~900px on wide viewports, well beyond the optimal 60–80 character line length for body text.
- Apply `max-w-prose` to the `<article>` or the content `<div>` within the article, not to the grid cell (which should remain full-width for the sidebar alignment).

## Testing Decisions

- **Modules to test**: Module 1 (blog detail renders correctly with server/client split — verify no hydration mismatches), Module 2 (hover animation uses spring physics — visual regression test), Module 5 (security headers present in production build)
- **Prior art**: Hydration issues from server/client splits can be caught by running `npm run build && npm run start` and checking the browser console for hydration warnings. Security headers can be verified via `curl -I localhost:3000` against the production server. The existing Storybook setup can capture visual regressions for animation changes.

## Out of Scope

- Code splitting strategy (dynamic imports beyond what's already in place)
- Bundle size analysis and tree-shaking optimization
- Database or API performance (no backend exists)
- Lighthouse score optimization as a formal target
- Test coverage expansion beyond the specific modules listed

## Further Notes

- Module 1 (BlogDetail split) is the most impactful performance improvement in this branch. Blog posts are likely the highest-traffic pages (SEO-driven content) and shipping less JavaScript per page directly improves Core Web Vitals.
- Module 5 (Config Hardening) should be tested against the Spline 3D scenes — some security headers (particularly CSP, if added later) could block the Spline runtime's script loading. The current headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy) are safe.
- Module 6 (Page Transition) is a judgment call — the current 250ms exit feels deliberate and editorial. If the team prefers the slow, cinematic feel, keep it. If speed is prioritized, reduce it. Don't change it without stakeholder input.
- The `cn()` usage audit: `src/components/blog/blog-detail.tsx` uses template literal class strings instead of `cn()` for conditional classes (e.g., series navigation links). These should be converted to `cn()` to ensure `tailwind-merge` resolves class conflicts correctly.

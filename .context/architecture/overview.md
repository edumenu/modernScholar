# Architecture Overview

A high-level map of how a request becomes a rendered page.

## Routes

```
/                  src/app/(home)/page.tsx              Home — hero, featured scholarships, FAQ, marquee, Spline 3D
/scholarships      src/app/scholarships/page.tsx        Discovery — filters, list, comparison, mobile sheet
/blog              src/app/blog/page.tsx                Blog listing — filters, cards
/blog/[slug]       src/app/blog/[slug]/page.tsx         MDX detail — hero, content, related posts, share dock
/contact           src/app/contact/page.tsx             Form + Spline scene + FAQ
/privacy, /terms,
/cookies           src/app/{privacy,terms,cookies}/     Legal — static MDX-like layouts
```

Route group `(home)` is used purely to group home assets without altering the URL.

## Provider stack (root layout)

`src/app/layout.tsx` wraps every page in this exact order (outermost → innermost):

```
<NuqsAdapter>             ← URL state
  <ThemeProvider>         ← next-themes (class strategy, View Transitions)
    <MotionConfigProvider> ← reduced-motion + global Motion config
      <SmoothScrollProvider> ← Lenis
        <ComparisonRehydrator />   ← restores Zustand comparison state from localStorage
        <CustomCursor />
        <Header />
        <PageShell>{children}</PageShell>
        <Footer />
        <Toaster />        ← sonner
```

When adding global behavior, prefer extending an existing provider over adding a new one.

## Component layering

```
src/app/<route>/page.tsx              Server (or "use client" if needed) — composes sections
  └─ src/components/<route>/*         Route-specific section components
       └─ src/components/ui/*         Primitives (button, card, sheet, dialog, …)
            └─ @base-ui/react         Accessible headless primitives
```

Primitives never import from route-specific folders. Route-specific components are not reused across routes — copy or hoist to `ui/` first.

## Data flow

```
MasterScholarshipList.csv
       ↓ scripts/check-links.ts          (HEAD-checks URLs)
scripts/output/link-report.json
       ↓ scripts/scrape-scholarships.ts  (impit scrape)
src/data/scholarships-enriched.json
       ↓ scripts/tag-eligibilities.ts    (keyword tagging, in-place)
src/data/scholarships-enriched.json
       ↓
src/data/scholarships.ts                 (typed export)
       ↓
useScholarshipFilters() + nuqs           (URL-driven filter state)
       ↓
<ScholarshipCard /> in /scholarships
```

Blog content has its own pipeline:

```
ScholarshipBlogs.md
       ↓ scripts/convert-blogs.ts
content/blog/<slug>.mdx                  (frontmatter + MDX body)
       ↓ generateStaticParams + gray-matter
src/app/blog/[slug]/page.tsx
```

## Render-time concerns

- **Hydration**: Spline scenes, custom cursor, smooth scroll, ripples, motion — all client-only. The root layout's `<body>` is server-rendered; everything below the providers can hydrate as needed.
- **Suspense boundaries**: wrap heavy 3D (`<HomeSplineLoader />`, contact `<Spline />`) so they never block FCP.
- **View Transitions**: theme switch and selected page transitions opt in via `PageTransition`.

## Where state lives

See `.context/architecture/state.md`.

---
applies_to: ["src/app/**/*.{tsx,ts,mdx}", "next.config.ts", "mdx-components.tsx"]
load_when: "creating routes, layouts, metadata, or touching Next.js conventions"
deep_ref: "node_modules/next/dist/docs/"
---

# Next.js 16 App Router Rules

## Critical rules (read first)

1. **This is Next.js 16, not the version you trained on.** Several APIs have changed — async `params`/`searchParams`, new caching semantics, `next.config.ts` shape. Read the relevant doc in `node_modules/next/dist/docs/` before writing route code.
2. **Use `--webpack` flag** for dev and build (set in `package.json`). Turbopack is intentionally not used here.
3. **Default to server components.** Add `"use client"` only when the file uses hooks, browser APIs, or event handlers.
4. **Metadata exports go in the route's `page.tsx` or `layout.tsx`** via `export const metadata: Metadata = …`. Don't put `<title>` or `<meta>` tags in JSX.

## Route map

```
src/app/
├── layout.tsx              # Root: ThemeProvider, MotionConfig, SmoothScroll, Header, Footer, NuqsAdapter, Toaster
├── (home)/page.tsx         # / — home (route group keeps root path clean)
├── scholarships/page.tsx   # /scholarships — filtered list, URL-driven via nuqs
├── blog/page.tsx           # /blog — listing
├── blog/[slug]/page.tsx    # /blog/<slug> — MDX detail
├── contact/page.tsx        # /contact — Spline scene
├── privacy/page.tsx        # /privacy
├── terms/page.tsx          # /terms
└── cookies/page.tsx        # /cookies
```

## Conventions

- **Dynamic params are async.** `export default async function Page({ params }: { params: Promise<{ slug: string }> })` — await `params` before reading.
- **`generateStaticParams`** for blog: read filenames from `content/blog/*.mdx`.
- **`generateMetadata`** for blog detail: read frontmatter via `gray-matter`.
- **MDX**: enabled via `@next/mdx`. Custom components registered in `mdx-components.tsx`. Blog posts live in `content/blog/`.
- **Fonts**: loaded once in root layout via `next/font/google` and exposed as CSS variables (`--font-sans`, `--font-heading`).

## URL state

- Use `nuqs` (already wired via `NuqsAdapter` in root layout) for any filter / search / pagination state that should survive reload and be shareable.
- See `src/hooks/use-scholarship-filters.ts` as the reference pattern for combining nuqs parsers.

## Theming

- `next-themes` with `attribute="class"`, `defaultTheme="system"`, View Transitions API on theme switch.
- Don't read `theme` during render of server components — gated through `<ThemeProvider>` client boundary.

## Testing routes

- Page-level integration tests live in `src/app/__tests__/`.
- Use Vitest browser mode (Playwright) — never spin up `next dev` in test code.

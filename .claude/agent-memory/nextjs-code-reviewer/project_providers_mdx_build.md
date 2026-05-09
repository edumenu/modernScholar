---
name: Providers, MDX & Build Config patterns
description: Key findings from providers, MDX component surface, pretext lib, and build config review (2026-05-08)
type: project
---

Providers, MDX, pretext lib, and build config review completed 2026-05-08.

Key decisions and issues found:

- `output: "export"` in next.config.ts + `"start": "next start"` in package.json are incompatible — static export has no Node server. The `start` script will fail after build.
- `--webpack` flag is pinned on both `dev` and `build` scripts, blocking Turbopack adoption. No comment explains why.
- `remark-gfm` is absent from the remarkPlugins chain — GFM tables/strikethrough silently degrade in blog MDX.
- `useMDXComponents` takes a required `components: MDXComponents` param; the `@mdx-js/react` type declares it optional. Should be `components?: MDXComponents` to match the upstream type.
- `h2` in mdx-components.tsx has no generated anchor `id`; `h3` does. TOC jump links to `##` headings will silently fail.
- `img` fallback in mdx-components.tsx (no width/height) renders bare `<img>` without `loading="lazy"` or `decoding="async"`.
- `sectionHeading` in fonts.ts uses weight 500 for Noto Serif, but layout.tsx only loads weights 400 and 700 — browser synthesizes 500, shifting pretext metrics.
- Rules-of-Hooks violation in `pretext-hooks.stories.tsx` CLSPrevention story: hooks called inside a plain object `render` function, not a named React component. All other stories use named component wrappers — this one was missed.
- `.storybook/preview.ts` decorator calls `Story()` as a plain function — known footgun with React 19 + Storybook 10 for hook-bearing stories.
- `ThemeProvider` missing `disableTransitionOnChange` — CSS transitions fire during theme switch causing flash.
- No `typecheck` script in package.json; tsc --noEmit is never run in CI or pre-commit.
- `noUncheckedIndexedAccess` not enabled in tsconfig.json.
- Dead commented-out `Geist_Mono` import in layout.tsx.

Strengths: Lenis SSR-safe (use client + ReactLenis root), MotionConfig reducedMotion="user" at root, suppressHydrationWarning on html, useMDXComponents correctly avoids "use client", module-level prepareCache with font-load invalidation, three-project Vitest setup (node/jsdom/browser-playwright).

**Why:** Review commissioned 2026-05-08 as part of ongoing provider/infrastructure audit.
**How to apply:** When touching next.config.ts, layout.tsx, mdx-components, or vitest.config.ts, check these known gaps first.

# Providers, MDX & Build Config Review

_Reviewed 2026-05-08. Re-audited 2026-05-10 — see "Status update" section below; original report content unchanged._
_Next.js 16.2.1 docs consulted: `node_modules/next/dist/docs/01-app/02-guides/mdx.md`, `01-app/01-getting-started/01-installation.md`._

---

## Status update — 2026-05-10

**Resolved:** none.

**Still open — every finding in this report:**
- Critical: `pretext-hooks.stories.tsx:559-570` Rules-of-Hooks violation in `CLSPrevention` story unchanged; `package.json:8` `"start": "next start"` + `next.config.ts:6` `output: "export"` mismatch unchanged.
- High: `--webpack` flag still pinned in dev/build scripts; `remark-gfm` still absent (`next.config.ts:21` only has `remarkFrontmatter`, no `remark-gfm` in `package.json`); pretext font-ready race in `use-text-lines.ts` / `use-text-layout.ts` unchanged.
- Medium: `ThemeProvider` still missing `disableTransitionOnChange` + `enableColorScheme` (`layout.tsx:51` unchanged); h2 still has no anchor id in `mdx-components.tsx`; `tsconfig.json` still without `noUncheckedIndexedAccess`; no `typecheck` script in `package.json`; commented-out `Geist_Mono` block still at `layout.tsx:28-31`.

---

## Summary

The provider tree, Lenis scroll integration, and MDX component surface are all structured correctly and carry no runtime-breaking bugs. The most actionable issues are a React Rules-of-Hooks violation in a Storybook story, a missing `remark-gfm` plugin that silently degrades blog formatting, an unguarded `output: "export"` + `next start` mismatch in `package.json`, the deliberate `--webpack` flag pinning that blocks Turbopack adoption, and a handful of TypeScript and tooling nits.

---

## Critical issues

- **`src/lib/pretext/pretext-hooks.stories.tsx:559–632`** — **Rules of Hooks violation in a Storybook story render function.**
  The `CLSPrevention` story calls `useTextLayout` twice at the top level of an _object literal_ `render` function:

  ```ts
  export const CLSPrevention: Story = {
    render: () => {
      const withWebFont  = useTextLayout({ … }) // hook call
      const withFallback = useTextLayout({ … }) // hook call
      return (…)
    },
  }
  ```

  Storybook's Vitest integration compiles and runs story render functions as plain functions, not as React function components. React's reconciler never manages these frames, so hook call order is not guaranteed to be stable across hot reloads and concurrent renders. In production Storybook builds this can surface as "Invalid hook call" errors or silently stale values. The fix is to extract the render body into a named component:

  ```tsx
  function CLSPreventionDemo() {
    const withWebFont  = useTextLayout({ … })
    const withFallback = useTextLayout({ … })
    return (…)
  }
  export const CLSPrevention: Story = {
    render: () => <CLSPreventionDemo />,
  }
  ```

  Every other story in this file already follows this pattern (e.g. `ResponsiveWidthDemo`, `InteractivePlaygroundDemo`). This one was missed.

- **`package.json:6`** — `"start": "next start"` is present, but `next.config.ts:5` sets `output: "export"`. Static export mode produces a plain `out/` directory; `next start` is a Node.js server that expects a `.next/` build artifact. Running `npm start` after `npm run build` will fail with `"Could not find a production build"`. Either remove `start` from scripts (and document serving `out/` with a static file server) or remove `output: "export"` if a server runtime is actually needed.

---

## High-impact improvements

- **`next.config.ts:6` / `package.json:6-7`** — `next dev --webpack` and `next build --webpack` explicitly opt out of Turbopack. Per the Next.js 16 installation docs (`01-installation.md:156`): "Turbopack is now the default bundler." The `--webpack` flag is a regression escape hatch, not a recommended long-term config. This forces webpack on both dev and CI, losing the ~10× faster refresh times Turbopack offers, and will be harder to drop later as webpack support receives less attention. If there is a specific webpack plugin or loader blocking Turbopack (e.g. `@splinetool/react-spline` or a remark plugin), document it as a TODO comment in `next.config.ts`. Otherwise, remove `--webpack` from both scripts and verify the build.

- **`next.config.ts:21` / `src/components/blog/mdx-components.tsx` (all)** — `remarkPlugins: [remarkFrontmatter]` is the only remark plugin. The blog MDX files are authored in GitHub-Flavored Markdown (tables, strikethrough, task lists are common in scholarship content), but `remark-gfm` is absent. Without it, GFM syntax silently renders as raw text. Add `remark-gfm` to `remarkPlugins` (it is already in the dependency ecosystem; just needs installing and wiring). While Turbopack requires passing plugin names as strings (see MDX doc, line 729), webpack mode accepts module references — add it as `remarkGfm` once Turbopack migration is done, or use the string form `'remark-gfm'` now to stay Turbopack-compatible.

- **`src/lib/pretext/use-text-lines.ts:83` and `src/lib/pretext/use-text-layout.ts:77`** — `document.fonts.check(font)` is called synchronously during render (outside a `useMemo` or `useEffect`). On the server side these files are gated by `"use client"` so the call is React-client-only, but `document.fonts.check()` can also return `false` for a font that _is_ loaded in some browsers if the font descriptor string does not exactly match a loaded face. More practically: `isFontReady` is computed fresh on every render pass while `fontLoadedAsync` state is a snapshot — if a concurrent render fires between the state update and the next paint, `isFontReady` and `fontLoadedAsync` can disagree. The pattern is correct in intent but fragile. A safer idiom captures `isFontReady` inside the `useMemo` that computes `initial` so the comparison is stable within a render. This is a correctness edge case rather than a crash.

- **`src/components/smooth-scroll-provider.tsx:33-38`** — `autoResize: true` in `ReactLenis` options and the `LenisRouteResizer` component both handle resize. `autoResize` subscribes Lenis to the native `resize` event internally. `lenis.resize()` is then called again manually on `pathname` change (appropriate) plus a 500 ms fallback (appropriate for lazy 3D scenes). These do not conflict, but the comment at line 16 describes only the Spline case — it should also mention that the primary `lenis.resize()` on line 14 handles route-driven layout shifts immediately, and the `500 ms` delay handles async content. Minor documentation gap, not a bug.

- **`vitest.config.ts:46-63`** — The Storybook project project uses `extends: true`, which inherits the top-level `resolve.alias` (`@` → `src/`). However the Storybook project does not set `environment` explicitly; it defaults to whatever `extends: true` inherits, which for the root config is `node`. Storybook's browser runner overrides this via the `browser` block, so stories that use DOM APIs work. But if a story file is accidentally included in the `unit` or `component` project globs (the include patterns are broad), it would run in Node without the browser polyfills. This is low-risk because the Storybook stories live under `src/**/*.stories.*` and the unit include pattern is `src/**/__tests__/**/*.test.{ts,tsx}` — they don't overlap. Worth a comment in the config explaining this boundary.

---

## Medium-impact improvements

- **`src/app/layout.tsx:52`** — `ThemeProvider` is missing `disableTransitionOnChange`. When `next-themes` switches the `class` attribute on `<html>`, any CSS transitions already attached (e.g. `transition-colors` on body/card elements) will animate during the theme flip, causing a flash. Adding `disableTransitionOnChange` suppresses all transitions for one frame around the switch, which is the standard next-themes pattern. The project's CLAUDE.md mentions the View Transitions API for theme switching — if that is implemented via a `startViewTransition` wrapper elsewhere, document its location; if it is not yet implemented, this flag covers the interim.

- **`src/app/layout.tsx:52`** — `ThemeProvider` does not set `enableColorScheme`. Without it, the browser's native color-scheme (scrollbar tint, form control fills) may not update when the user switches themes. Add `enableColorScheme` (default is `true` in recent next-themes, but being explicit is safer and self-documenting).

- **`mdx-components.tsx` (root, line 9)** — The root file is a single re-export. This is correct per the Next.js 16 convention (`mdx-components.tsx` must live at the project root or `src/`). The re-export approach is clean. One note: the official Next.js doc shows `useMDXComponents(): MDXComponents` with no parameter, while this project exports `useMDXComponents(components: MDXComponents): MDXComponents` with a required (not optional) parameter. The `@mdx-js/react` type (`lib/index.d.ts`) defines the parameter as optional (`components?: Readonly<MDXComponents> | MergeComponents | null | undefined`). Making the project's parameter match that optional signature (`components?: MDXComponents`) prevents a TypeScript mismatch if Next.js's internal caller ever invokes it without an argument.

- **`src/components/blog/mdx-components.tsx:37-44`** — `h2` is styled but does not get a generated `id` anchor, while `h3` does (lines 46-59). If the blog's table-of-contents or in-page jump links target `## ` headings, those links will silently 404 in-page. Apply the same `id={id ?? slugify(nodeToText(children))}` and `scroll-mt-32` treatment to `h2` for consistency with `h3`.

- **`src/components/blog/mdx-components.tsx:127-165`** — The `img` fallback (line 149) renders a bare `<img>` without `loading="lazy"` or `decoding="async"`. When `@next/mdx` renders inline images that lack `width`/`height` attributes (common in blog MDX), the fallback path is taken. These images block parsing without those attributes. Add `loading="lazy" decoding="async"` to the fallback `<img>` element.

- **`tsconfig.json`** — `noUncheckedIndexedAccess` is absent. The project accesses array indices directly in several places (e.g. `pretext-hooks.stories.tsx:175`, `use-container-width.ts:20` `entries[0]`). Enabling `noUncheckedIndexedAccess` would surface these as type errors that require explicit guards (`entries[0]?.contentBoxSize[0]?.inlineSize`), which `use-container-width.ts` already does defensively. The setting is low-friction to enable given the existing defensive coding style.

- **`eslint.config.mjs`** — No `eslint-plugin-tailwindcss` (or the Tailwind v4 equivalent) is configured. Class-order violations and nonexistent utility names are only caught at build time by Tailwind's PostCSS pass (which silently drops unknown utilities). Adding Tailwind ESLint integration gives editor-time feedback.

- **`package.json` scripts** — No `typecheck` script exists. There is no pre-commit hook or CI script that runs `tsc --noEmit`. Developers can merge TypeScript errors that `next build` (which skips `tsc` in some configurations) does not surface. Add `"typecheck": "tsc --noEmit"` and reference it in a `pre-commit` or CI step.

---

## Low / nits

- **`src/lib/pretext/use-text-lines.ts:14` / `use-text-layout.ts:14`** — `getCacheKey` in both files produces identical logic (`${font}|${text}`). The two module-level caches (`prepareCache` in each file) store different types (`PreparedTextWithSegments` vs `PreparedText`). This is correct but the duplication is worth noting if these hooks are ever consolidated into a single module.

- **`src/lib/pretext/fonts.ts:20`** — `sectionHeading: "500 30px 'Noto Serif'"` uses weight `500`, but `Noto_Serif` in `layout.tsx` is loaded only with weights `"400"` and `"700"`. The browser will synthesize weight 500 as bold, which may shift metrics slightly from what pretext measures. Either load weight `500` in the font declaration or change `sectionHeading` to `"400 30px 'Noto Serif'"`.

- **`src/app/layout.tsx:29-31`** — Commented-out `Geist_Mono` import block. Dead code; remove it.

- **`next.config.ts:8`** — `images: { unoptimized: true }` is required by `output: "export"` (Next.js cannot run the image optimization server in static mode). The `mdx-components.tsx` `img` handler already documents this at line 148. No action needed, but a comment in `next.config.ts` explaining the coupling would help future maintainers who might try to remove `output: "export"` without realizing image optimization would then silently break.

- **`vitest.config.ts:27`** — The `unit` project includes `scripts/**/*.test.ts`. The `scripts/` directory contains data-pipeline scripts (`scrape-scholarships.ts`, `check-links.ts`) that make network calls. If tests for these scripts ever exercise live network paths without mocking, they would be flaky in CI. A note in the config or a dedicated `scripts` project with explicit network-off guards would clarify intent.

- **`.storybook/preview.ts:43`** — `return Story()` calls the story render function as a plain function rather than as a React element (`return <Story />`). In Storybook 10 with React 19, calling a component as a function bypasses the React fiber reconciler, meaning hooks inside the story's render wrapper do not get a stable fiber identity. This is the same root cause as the CLSPrevention hook violation above. Use `return Story()` only for non-React-component stories; prefer `return <Story />` (i.e. `Story({...context})` wrapped in JSX) for hook-bearing stories. This is a known Storybook 10 footgun with React 19.

---

## Notable strengths

- **Lenis SSR safety** is handled correctly: `"use client"` on `smooth-scroll-provider.tsx` prevents any server-side execution of Lenis, and `ReactLenis root` correctly attaches to `window` only after hydration. The `LenisRouteResizer` pattern of calling `lenis.resize()` on `pathname` change (plus a 500 ms async fallback for 3D scenes) is thoughtful and solves a real problem with Spline scenes shifting page height post-load.

- **`MotionConfigProvider`** is minimal and correct: a single `<MotionConfig reducedMotion="user">` wrapper at the root ensures all Motion animations across the tree respect `prefers-reduced-motion` without each animation component needing its own guard. Placement inside `ThemeProvider` but outside `SmoothScrollProvider` is appropriate.

- **`suppressHydrationWarning` on `<html>`** at `layout.tsx:46` is correctly placed to suppress the `class` attribute mismatch that `next-themes` produces between server and client renders.

- **`useMDXComponents` in `src/components/blog/mdx-components.tsx`** correctly avoids `"use client"` — the function is consumed by Next.js at build time as a Server Component context, and adding `"use client"` would break the MDX pipeline. The JSDoc comment at line 33 explicitly calls this out.

- **`use-container-width.ts`** returns `null` before the first `ResizeObserver` callback, which is the correct SSR-safe default — callers can gate on `width !== null` before passing to measurement hooks. `use-text-lines.ts` and `use-text-layout.ts` both guard on `maxWidth === null` (lines 71, 65 respectively), so the contract is honoured end-to-end.

- **Module-level `prepareCache` maps** in `use-text-lines.ts` and `use-text-layout.ts` correctly cache `prepareWithSegments` / `prepare` results across renders for the same `font|text` key, avoiding redundant canvas measurement work. Cache invalidation on font load (lines 92–95 / 86–89) via `prepareCache.delete` before setting state is the right pattern.

- **The `mdx-components.tsx` root re-export** cleanly separates the Next.js file convention (root-level) from the actual implementation (under `src/components/blog/`), avoiding code duplication and keeping the component map co-located with blog components.

- **Storybook config** uses `@storybook/nextjs-vite` and the `storybookTest` Vitest plugin, which runs story tests in a real browser via Playwright — a much higher-fidelity test environment than jsdom for visual/layout components. The three-project Vitest config (unit/node, component/jsdom, storybook/browser) is well-structured.

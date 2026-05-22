# ADR 0001 — Next.js 16 on Webpack (not Turbopack)

**Status:** Accepted
**Date:** 2026-04 (approx, see git history of `package.json`)

## Context

Next.js 16 ships Turbopack as the default bundler. Webpack remains as an opt-in via `--webpack`. We are on the bleeding edge of Next.js 16; multiple breaking API changes landed (async `params`/`searchParams`, caching semantics, `next.config.ts` shape).

## Decision

Use `next dev --webpack` and `next build --webpack`. Pin via `package.json` scripts.

## Why

- Spline (`@splinetool/react-spline`) and MDX (`@next/mdx`) integrations behave more predictably on webpack at this version.
- Turbopack's HMR has edge-case issues with our `motion` + Lenis combination; webpack avoids them.
- Build determinism is more important than dev speed for this site (mostly static).

## Consequences

- Slightly slower dev startup.
- All AI-generated config edits must remember to keep the `--webpack` flag.
- Revisit when Next 16.x stabilizes or our integration list shrinks.

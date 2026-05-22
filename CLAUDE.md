@AGENTS.md

# Modern Scholar — Entry Point

A scholarship discovery and curation platform with a premium editorial aesthetic ("Academic Curator"). Next.js 16 + React 19 + TailwindCSS v4 + Motion + Spline.

This file is intentionally short. It's the **routing table** for context: match the path you're touching against the table below, then load the matching rule file in `.claude/rules/`. Deeper references live in `.context/`.

## Commands (most-used)

```bash
npm run dev               # Next dev (webpack — keep the flag)
npm run build             # Production build (webpack)
npm run lint              # ESLint
npm test                  # Vitest: unit + component
npm run storybook         # Storybook on :6006
npm run check-links       # Data pipeline step 1
npm run scrape-scholarships  # Data pipeline step 2
npm run tag-eligibilities    # Data pipeline step 3 (re-tag only)
npm run convert:blogs     # Generate content/blog/*.mdx from ScholarshipBlogs.md
```

## Routing table — path → rule file to load

| When you touch… | Load this rule |
|-----------------|----------------|
| `src/app/**/*.{tsx,ts,mdx}`, `next.config.ts`, `mdx-components.tsx` | `.claude/rules/app-router.md` |
| `src/components/**/*.{tsx,ts}` | `.claude/rules/components.md` |
| `src/**/*.{tsx,css}`, `src/app/globals.css` | `.claude/rules/design-system.md` |
| Any file adding scroll / entrance / hover animations | `.claude/rules/animation.md` |
| `scripts/**/*.ts`, `src/data/**`, `MasterScholarshipList.csv` | `.claude/rules/data-pipeline.md` |
| `content/blog/**/*.mdx`, `ScholarshipBlogs.md`, `scripts/convert-blogs.ts` | `.claude/rules/content-authoring.md` |
| `**/*.test.{ts,tsx}`, `**/*.stories.tsx`, `vitest.*` | `.claude/rules/testing.md` |

For multi-file tasks, load every rule whose glob matches.

## Tier-2 references (load on demand)

| File | When to load |
|------|--------------|
| `.context/ai-rules.md` | Project-wide constraints (mirrored here — see "Always apply" below) |
| `.context/glossary.md` | When a domain term needs clarification (Scholarship, Eligibility Tag, Callout, etc.) |
| `.context/architecture/overview.md` | Route map, provider stack, render pipeline, data flow |
| `.context/architecture/state.md` | Where state lives (URL / local / Zustand) |
| `.context/decisions/*.md` | Why we made a non-obvious technical choice |
| `.context/prompts/*.md` | Pre-built task templates for common workflows |
| `SystemDesign.md` | Authoritative 22KB design-system spec |
| `Brain/PRDs/<date>/` | Product requirement docs |
| `Brain/audits/`, `qa-reports/` | QA findings, append-only |

## Always apply

1. **This is Next.js 16.** Read `node_modules/next/dist/docs/` before route work — APIs changed.
2. **Don't expand scope.** Bug fix ≠ refactor. Three similar lines beat a premature abstraction.
3. **No comments unless WHY is non-obvious.** Never explain WHAT the code does.
4. **No backwards-compat shims.** Delete unused code rather than leaving placeholders.
5. **No emojis** unless explicitly requested.
6. **Edit existing files** over creating new ones.

## Tech stack one-liner

Next.js 16 (App Router, webpack) · React 19 · TailwindCSS v4 (OKLCH tokens) · Motion v12 · Lenis · Spline · Base UI · Zustand · nuqs · next-themes · MDX · Vitest + Playwright · Storybook 10.

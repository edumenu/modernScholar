---
name: grill-with-context
description: Grilling session that challenges your plan against the existing domain model, sharpens terminology, and updates documentation (glossary, ADRs, topic rules) inline as decisions crystallise. Use when user wants to stress-test a plan against Modern Scholar's language and documented decisions.
---

<what-to-do>

Interview user relentlessly about every aspect of plan until shared understanding reached. Walk down each branch of design tree, resolve dependencies one-by-one. Each question, give recommended answer.

Ask one question at a time. Wait for feedback before next.

If question answerable from codebase, explore instead of asking.

</what-to-do>

<supporting-info>

## Context map (Modern Scholar)

Two-tier docs. **Tier 1 always loaded** = `CLAUDE.md` (single root) + `AGENTS.md` sibling. **Tier 2 on-demand** = `.claude/rules/` (path-scoped) and `.context/` (cross-cutting deep refs).

```
/
├── CLAUDE.md                       ← Tier 1 (routing table: path → rule file)
├── AGENTS.md                       ← Tier 1 sibling (Next.js-16 warning)
├── SystemDesign.md                 ← 22 KB authoritative design-system spec
├── .claude/rules/                  ← Tier 2 path-scoped rules (loaded when glob matches)
│   ├── animation.md
│   ├── app-router.md
│   ├── components.md
│   ├── content-authoring.md
│   ├── data-pipeline.md
│   ├── design-system.md
│   └── testing.md
├── .context/                       ← Tier 2 cross-cutting deep refs
│   ├── README.md                   ← how the context map works
│   ├── ai-rules.md                 ← project-wide always/never (mirrors CLAUDE.md "Always apply")
│   ├── glossary.md                 ← DOMAIN TERMS — write resolved terms here
│   ├── architecture/
│   │   ├── overview.md             ← page map, component layering, render pipeline
│   │   └── state.md                ← Zustand + nuqs + provider boundaries
│   ├── decisions/                  ← ADRs (NNNN-slug.md, sequential)
│   │   ├── 0001-nextjs-16-webpack.md
│   │   ├── 0002-base-ui-over-radix.md
│   │   ├── 0003-motion-for-animation.md
│   │   ├── 0004-oklch-color-space.md
│   │   └── 0005-mdx-blog-source-of-truth.md
│   └── prompts/                    ← pre-built task templates
│       ├── add-new-page.md
│       ├── add-blog-post.md
│       └── add-scholarship-component.md
└── Brain/
    ├── PRDs/<date>/                ← product requirements (one folder per ship date)
    ├── audits/                     ← QA / mobile audits — append-only
    └── code-reviews/               ← saved /review and /ultrareview outputs
```

**Router lives in Tier 1.** `CLAUDE.md` has a "Routing table — path → rule file to load" table mapping file paths → `.claude/rules/<domain>.md`. Use it to find existing depth before asking user.

## Before grilling — load context

1. Read `/CLAUDE.md`. Identifies stack + routing table + "Always apply" rules.
2. Read `/AGENTS.md`. One line: Next.js-16 caveat.
3. Read `/.context/glossary.md`. Know existing terminology.
4. Read `/.context/ai-rules.md`. Know hard project-wide rules + Karpathy guidelines.
5. Skim `ls /.context/decisions/`. Know past decisions by slug.
6. Match the plan's file globs against the routing table → load matching `.claude/rules/<domain>.md` files.
7. If plan touches a deep ref the rule file points at (e.g. `.context/architecture/state.md`), pull it.
8. If plan matches an existing prompt template in `/.context/prompts/`, read it — may already encode the workflow.

Use the routing table. Don't re-discover what's already documented.

## During the session

### Challenge against the glossary

If user uses term that conflicts with `/.context/glossary.md`, call it out. "Glossary defines `Eligibility Tag` as the machine-derived label from `tag-eligibilities`, separate from free-text `eligibility`. You said `eligibility` — mean which?"

Glossary already disambiguates: Domain (Scholarship, Application Status, Eligibility Tag, Award Range, Match Badge), Pipeline (Master List, Link Report, Enriched JSON), UI/Component (Callout, Comparison Sheet, Coverflow Carousel, Page Shell, AnimatedSection), Theming (OKLCH, Tonal Surface), External (Base UI, Lenis, Motion, nuqs, Spline, Zustand).

### Sharpen fuzzy language

Vague/overloaded terms → propose canonical name from glossary. "You said `card` — mean `ScholarshipCard`, `InlineScholarshipCard` (MDX), or the generic `Card` primitive from `ui/card/`?"

### Discuss concrete scenarios

Stress-test domain relationships with edge cases. Probe boundaries between concepts. Use real Modern Scholar flows (browsing the scholarship list, comparison sheet rehydration, blog MDX rendering, scroll-triggered entrance animations, the data pipeline order).

### Cross-reference with code

User states how X works → grep repo. Contradiction → surface. "You said comparison state survives reload, but `stores/comparison.ts` rehydrates via `ComparisonRehydrator` which only restores from `sessionStorage` — confirm scope?"

### Update glossary inline

Term resolved → update `/.context/glossary.md` immediately. Don't batch.

Format (matches existing file):

```md
- **Term Name** — One-sentence definition. What it IS, not what it does.
```

Rules:

- Tight: one sentence per term.
- Group under existing subheadings (Domain, Pipeline, UI / Component, Theming / Tokens, External) or add new subheading if natural cluster.
- Only Modern-Scholar-specific terms. General programming concepts don't belong.
- Glossary = terminology only. No implementation details. No specs.

### Update rule files when an implementation pattern emerges

Pattern/rule that future agent must know → update the relevant `.claude/rules/<domain>.md` (routing table maps file glob → rule). NOT glossary.

Example: "all new scholarship filters must be URL-driven via nuqs" → `.claude/rules/app-router.md` (URL state section) or `.claude/rules/components.md` if filter primitives live in `components/scholarships/`.

If pattern is hard-and-fast and applies across the whole repo → add a numbered point to `/.context/ai-rules.md` under "Critical" with a one-line **Why**.

### Offer ADRs sparingly

Offer ADR only when ALL three true:

1. **Hard to reverse** — meaningful cost to change later.
2. **Surprising without context** — future reader asks "why this way?".
3. **Result of real trade-off** — genuine alternatives, picked one for reasons.

Skip otherwise. The existing five ADRs (Next.js 16 + webpack, Base UI over Radix, Motion over Framer/GSAP, OKLCH color space, MDX as blog source of truth) set the bar.

ADR location: `/.context/decisions/NNNN-slug.md` where `NNNN` is the next sequential number (e.g. `0006-...`). No INDEX file — `ls` is the index. Match the section structure of an existing ADR (read `0002-base-ui-over-radix.md` for the canonical shape): **Context**, **Decision**, **Alternatives considered**, **Consequences**.

After writing ADR, cross-link from `/.context/architecture/overview.md` or the relevant `.claude/rules/<domain>.md` if load-bearing.

### Scope hygiene

Match the scope the user named. Don't bleed:

- Scholarship-page work → don't drift into blog MDX unless the integration boundary is genuinely affected.
- Data-pipeline change → don't restyle the consuming components.
- Design-token tweak → don't refactor unrelated components that happen to use the token.

The "no scope creep" rule in `/.context/ai-rules.md` exists for a reason — enforce it during grilling.

### Domain edges to probe

- **Pipeline order**: any plan touching scholarship data must respect `check-links → scrape-scholarships → tag-eligibilities`. Ask which step the change lives at.
- **Application Status is derived**: never stored in JSON. If user says "set status to expired", that's a smell.
- **Glass tiers**: cards/forms/sidebars don't get glass. Only floating Z-2+ elements do. Push back on glass-on-card proposals.
- **Server vs client component boundary**: hooks/state/Motion/Spline → `"use client"`. Default to server. Confirm which side new components live on.
- **URL vs Zustand vs local**: filters/search/pagination → nuqs. Comparison set → Zustand. Modal open/close → local. Confirm placement.

## Output of grilling

Session should leave repo with:

- Updated `/.context/glossary.md` (new/clarified terms).
- Optionally updated `.claude/rules/<domain>.md` (new patterns/rules for the scope).
- Optionally new ADR in `/.context/decisions/NNNN-slug.md` (hard-to-reverse decisions).
- Optionally new line in `/.context/ai-rules.md` "Critical" (project-wide hard-and-fast rule with **Why**).
- Optionally new template in `/.context/prompts/` if the grilled-out plan is a workflow worth replaying.

No `CONTEXT.md`, no `CONTEXT-MAP.md`, no `docs/adr/`, no `anti-patterns.md`, no `router.md`. Repo uses its own layout — `CLAUDE.md` routes, `.claude/rules/` deepens, `.context/` cross-cuts.

</supporting-info>

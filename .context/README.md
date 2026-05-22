# .context/ — Tier-2 Reference Library

Deep documentation loaded **on demand**, not at every conversation start. Use when a task needs more than the path-scoped rules in `.claude/rules/`.

## Map

```
.context/
├── README.md              ← you are here
├── ai-rules.md            Project-wide constraints applied to every task
├── glossary.md            Domain & code terminology (Scholarship, Eligibility Tag, Callout, …)
├── architecture/
│   ├── overview.md        Page map, component layering, render pipeline
│   └── state.md           Zustand stores + nuqs URL params + provider boundaries
├── decisions/             Architecture Decision Records (ADRs)
│   ├── 0001-nextjs-16-webpack.md
│   ├── 0002-base-ui-over-radix.md
│   ├── 0003-motion-for-animation.md
│   ├── 0004-oklch-color-space.md
│   └── 0005-mdx-blog-source-of-truth.md
└── prompts/               Pre-built task templates
    ├── add-new-page.md
    ├── add-blog-post.md
    └── add-scholarship-component.md
```

## Sibling docs (outside `.context/`)

| File | What it contains |
|------|------------------|
| `CLAUDE.md` | Tier-1 entry point with the path → rule routing table. |
| `AGENTS.md` | Cross-tool sibling of CLAUDE.md (Next.js-version warning). |
| `SystemDesign.md` | 22 KB authoritative design-system spec. The shorter `.claude/rules/design-system.md` is the working summary. |
| `Brain/PRDs/<date>/` | Product requirement docs, one folder per ship date. |
| `Brain/audits/` | QA findings, mobile audits — append-only history. |
| `Brain/code-reviews/` | Saved code-review outputs from `/review` and `/ultrareview`. |
| `Brain/Ideas.md` | Brainstorm scratchpad. |
| `qa-reports/`, `Brain/QA-Reports/` | Manual QA passes. |

## How to use

1. Start a task with `CLAUDE.md` loaded (Tier 1).
2. Match your file paths against the routing table → load only the relevant `.claude/rules/<domain>.md`.
3. If a rule file points to a deeper reference here (e.g. `deep_ref: .context/architecture/overview.md`), pull it in then.
4. For one-off "how do I do X" tasks, check `.context/prompts/` first — they bundle the right rules + steps for common workflows.

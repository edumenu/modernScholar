---
name: brainstorming
description: "Use this BEFORE any extended creative work on Modern Scholar (not simple execution) — new features, pages, components, animations, data-pipeline changes, or behavior changes. Explores intent, constraints, and design through collaborative dialogue, then writes a validated design doc. Use when the user says 'brainstorm', 'help me think through', 'I have an idea', 'design a feature', or starts describing something new to build."
---

# Brainstorming Ideas Into Designs

Turn a raw idea into a fully formed, validated design through natural collaborative dialogue — grounded in Modern Scholar's actual codebase, not assumptions.

This skill sits **upstream** of the rest of the pipeline:

```
brainstorming  →  grill-with-context  →  write-a-prd  →  implement-prd
(shape idea)      (stress-test)          (formalize)      (build)
```

Stop wherever the work is done. A small idea may go straight from here to implementation; a large one flows through the whole chain.

## Before asking anything — load context

The codebase is ground truth. Don't ask what the repo can answer.

1. **Read the routing table** in `CLAUDE.md` — match the paths the idea touches against it, and load every matching `.claude/rules/*.md`.
2. **Skim relevant Tier-2 refs**: `.context/architecture/overview.md` (page/component map), `.context/glossary.md` (domain terms — Scholarship, Eligibility Tag, Callout), and any `.context/decisions/*.md` that constrain the idea.
3. **Check current state**: recent commits, open notes in `Brain/`, existing components in the affected `src/components/<area>/` folder.
4. Only after this, start the dialogue — armed with what already exists.

## The Process

**Understanding the idea:**
- Ask questions **one at a time**. Only one question per message — if a topic needs more exploration, break it into multiple messages.
- Prefer multiple-choice questions (easier to answer), but open-ended is fine.
- Ask **only critically important** questions. If it's already clear from the conversation, the codebase, or context, don't ask. This isn't an interview — if you have zero questions, just start.
- If a question is answerable by reading the repo, read the repo instead of asking.
- Focus on: purpose, constraints, success criteria, and which existing patterns/rules apply.

**Exploring approaches:**
- Propose 2-3 approaches with trade-offs before settling.
- Lead with your recommended option and explain the reasoning.
- Anchor options in project reality — reuse existing primitives (`Button`, `Card`, `AnimatedSection`), respect the design system ("no glass on cards"), and honor the Next.js 16 / webpack / Motion constraints. Flag when an approach fights an ADR in `.context/decisions/`.

**Presenting the design:**
- Once you understand what you're building, present the design in **sections of 200-300 words**.
- Ask after each section whether it looks right so far. Be ready to go back and clarify.
- Cover: architecture & affected routes/components, data flow (URL/local/Zustand — see `.context/architecture/state.md`), design-system fit, animation approach, error/edge cases, and testing (which Vitest project or e2e).

## Key Principles

- **One question at a time** — don't overwhelm.
- **Multiple choice preferred** — easier than open-ended.
- **Only critically important questions** — skip anything the context already answers.
- **YAGNI ruthlessly** — cut unnecessary features unless the user is intentionally building long-term vision. Three similar JSX blocks beat a premature abstraction.
- **Explore alternatives** — always propose 2-3 approaches first.
- **Incremental validation** — present in sections, validate each.
- **Reuse over invention** — prefer existing components, tokens, and patterns. No new dependencies (no `framer-motion`, `gsap`, extra icon libs).
- **Be flexible** — go back and clarify when something doesn't fit.

## After the Design

**Write the design doc:**
- Save the validated design to `Brain/PRDs/<YYYY-MM-DD>/<topic>-design.md` (create the dated folder if missing).
- Keep it scannable: bullets over paragraphs, module names + responsibilities, reference rules rather than restating them ("follows glassmorphism rules in design-system.md").
- Do **not** commit unless the user asks.

**Hand off (ask which, don't assume):**
- Want to stress-test the plan against the domain model? → **`grill-with-context`**
- Ready to formalize into a PRD / GitHub issue? → **`write-a-prd`**
- Small and clear enough to build now? → just start, pointing the work at the design doc (note: `implement-prd` reads from `.claude/plans/`, so use it only after a PRD lands there).

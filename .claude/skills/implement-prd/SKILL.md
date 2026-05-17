---
name: implement-prd
description: Implement a PRD (Product Requirements Document) from .claude/plans/. Triggers when the user wants to start building, coding, or executing a feature that has a PRD or plan written. Use when the user says any of: "implement the PRD", "build the feature", "execute the plan", "go ahead and build it", "start implementing", "the PRD is ready", "the PRD is approved", "implement the frontend/backend module", "build from the PRD", "time to implement", "go ahead and implement", or any variation referencing implementing, building, executing, coding, or constructing a feature from a PRD, plan, or spec in .claude/plans/. Also triggers when the user mentions a specific PRD file path or references a PRD by name and asks you to build/implement/execute it.
---

This skill implements a PRD from `.claude/plans/` and produces a verification report.

## Communication Mode

Activate the `caveman:caveman` skill (full level) for all user-facing communication during this skill. Drop articles, filler, pleasantries, and hedging. Fragments OK. Keep technical substance exact. Code, commits, PRs, verification reports, and security warnings stay in normal prose. Revert on "stop caveman" or "normal mode".

## Workflow

### Step 1: Find the PRD

- Look in `.claude/plans/` for the most recent PRD file (or the one specified by the user)
- Read the PRD thoroughly to understand the full scope of work

### Step 2: Create a git worktree or work in the existing branch for the PRD

- Ask the user if you should work on the existing branch, create a new branch or create a new worktree.
- If user says yes to worktree:
  - Create a new git worktree for this PRD to keep changes isolated until ready to merge
  - The git worktree should be named after the PRD file (example: `my-feature-name`) and should be created from the main branch. Branch name should be eg. `feature/my-feature-name`
    - branch types: feature/ — new functionality, fix/ — bug fixes, chore/ — maintenance, config, deps, refactor/ — code restructuring, hotfix/ — urgent production fixes
  - The git worktree should be created in this folder. Example: `../my-feature-name`
- If user says yes to new branch:
  - The branch should be created from the main branch. Branch name should be eg. `feature/my-feature-name`
    - branch types: feature/ — new functionality, fix/ — bug fixes, chore/ — maintenance, config, deps, refactor/ — code restructuring, hotfix/ — urgent production fixes
- If user says no to new branch and worktress:
  - Work on the existing branch

### Step 3: Implement

Dispatch work via the Agent tool to the specialized agent that matches the task. Do NOT implement directly in the main thread — delegate so each agent runs with focused context and tooling.

**Agent selection matrix:**

| PRD work type                                                                                                                                                                               | Agent               | Use when                                                                             |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- | ------------------------------------------------------------------------------------ |                                                       |
| Next.js Server Components, Server Actions, BetterAuth, DAL/HMAC calls to Strapi, Zustand, React Hook Form + Zod, nuqs, route wiring, data fetching                                    | `frontend-engineer` | Any change under `frontend/` involving logic, data, or routing                       |
| New visual components, layouts, Tailwind/shadcn primitives, design-system work, Figma → code, styling/visual polish (no business logic)                                                     | `ui-designer`       | Pure presentational/visual work under `frontend/`                                    |

**Dispatch rules:**

- Full-stack PRDs: launch `frontend-engineer` in parallel when their work is independent (single message, multiple Agent calls).
- Frontend PRD with both new UI primitives and data wiring: `ui-designer` builds dumb components first, then `frontend-engineer` wires data/server actions. Sequential.
- Pure-frontend PRD: single agent, no orchestration.
- Modular PRDs (Module 1 frontend, etc.): map each module to its agent.
- Brief each agent with: PRD path, exact module/section, files listed in the PRD, branch/worktree path, instruction NOT to commit, and constraint to stop and surface contradictions instead of improvising.

**Implementation rules (passed to every agent):**

- Follow PRD implementation decisions exactly
- Modify only files listed in the PRD unless a discovered dependency requires more
- If something contradicts the PRD, stop and surface it — do not improvise
- Do not commit code. User reviews via `git status` / `git diff` in the worktree

### Step 4: Verify

After implementation is complete, verify each acceptance criterion / user story from the PRD:

- Re-read every modified file to confirm changes are correct
- Check that imports resolve and there are no obvious syntax errors
- Run the build if applicable (`npm run build` or equivalent) to catch compile-time errors
- Run existing tests if the PRD mentions them
- Walk through each item in the PRD's implementation decisions and confirm it was done

### Step 5: Write Verification Report

Create file at same location as the PRD with suffix `-verification.md` (example: `my-feature-name-verification.md`) with the following format:

**Core principle:** the report answers one question — _what got done?_ Cap **40 lines**. Skim in 30 seconds.

**Strip these (do NOT include):**

- Acceptance-criteria-to-code mapping tables (redundant with checklist)
- Out-of-Scope echo (PRD owns scope — say "respected" if asked)
- Long prose Notes / context paragraphs
- File path + line numbers in every checklist item (one-line note is enough)
- Sub-headings under Issues ("Resolved during verification", "Deferred", etc.) — flat bullets
- Architecture commentary, future work musings, "what I considered but didn't do"

**Keep these (and only these):**

```markdown
# Verification Report: <PRD Title>

**PRD:** <link>
**Date:** YYYY-MM-DD
**Status:** Complete | Partial | Blocked
**Branch:** <branch-name> (uncommitted | committed: <sha>)

## What Shipped

- One bullet per acceptance criterion. Checked = done, unchecked = not done. Brief note only if non-obvious.
- [x] Criterion 1
- [x] Criterion 2
- [ ] Criterion 3 — deferred, see Issues

## Files Touched

| File         | Change           |
| ------------ | ---------------- |
| path/to/file | One-line summary |

(One row per file. No code excerpts.)

## Issues

- Flat bullet list. Each: problem + status (fixed / deferred / blocked). One line each.
- Empty section if none — write "None."

## Next

One line. Manual acceptance, qa-validation handoff, commit pending, etc.
```

**Cap enforcement:** if report exceeds 40 lines, cut Files Touched rows (combine related files) or trim Issues phrasing. Never cut "What Shipped" — that's the answer to the question.

### Step 6: Updates

If issues surface during verification or user review, fix them and update **only the affected section** of the report. Do not mark acceptance criteria complete until fully met. Don't append a changelog — overwrite in place.

### Important

- Do NOT commit code unless user explicitly asks
- If PRD has "Out of Scope" section, respect it strictly
- If verification reveals a problem, fix before writing the report

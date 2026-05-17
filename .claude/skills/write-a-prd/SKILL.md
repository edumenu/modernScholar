---
name: write-a-prd
description: Create a PRD through codebase exploration and module design, then submit as a GitHub issue. Use when user wants to write a PRD, plan a new feature, or formalize requirements.
---

# Write a PRD

Turn described feature into structured PRD and submit as GitHub issue. Skip steps already covered by prior context.

## Communication Style

Use **caveman mode (full)** for all responses throughout this skill. Follow the `/caveman` skill rules:

- Drop articles (a/an/the), filler, pleasantries, hedging. Fragments OK. Short synonyms.
- Pattern: `[thing] [action] [reason]. [next step].`
- Technical terms stay exact. Code blocks unchanged. Errors quoted exact.
- **Auto-Clarity exception**: Drop caveman for security warnings, irreversible action confirmations, or when user asks to clarify. Resume after.
- PRD document itself: write in normal professional English (not caveman). Caveman only for conversation with user.

## Brevity Rules (read first, enforce always)

PRDs must be **short and scannable**. Long PRDs go unread. Defaults:

- **Hard cap: 150 lines.** Typical PRD: 60–120 lines. If you exceed 150, split into multiple PRDs (overview + sub-PRDs) or move rationale into a companion `*-decisions.md` file.
- **Bullets, not paragraphs.** Each bullet ≤ 2 lines. No paragraph longer than 3 lines.
- **One reason per decision.** Don't restate the *why* across sections. If rationale needs more than one line, it belongs in `*-decisions.md`, not the PRD.
- **No filler.** Cut "in order to", "it is important to note", restated problem statements, transition sentences, and any sentence whose deletion doesn't change meaning.
- **Consolidate user stories.** Group variants of the same need under one story. Cap at 6 stories. If you need more, the feature is too large — split the PRD.
- **No code, no file trees, no copy drafts.** Module names + responsibilities only. Code samples, prose drafts, and component-internal styling belong in implementation, not the PRD.
- **No restating CLAUDE.md / design-system rules.** Reference them ("follows glassmorphism rules in CLAUDE.md"), don't reproduce them.
- **No "Further Notes" dumping ground.** If something matters, it goes in the right section. If it doesn't, cut it.

Before writing the PRD, sketch the section line-counts in your head. If any single section runs past ~30 lines, you're probably reproducing rationale or restating the codebase — cut it.

## Step 1: Gather problem and solution

Get the user's description of the problem and proposed solution. If a prior session (e.g., /grill-me) covered this, summarize and confirm rather than re-asking. Check for design artifacts like `DECISIONS.md` or `SystemDesign.md` — when one exists, the PRD references it instead of restating its content.

## Step 2: Explore the codebase

Ground yourself in the repo: verify the user's claims, understand the architecture, identify affected modules, and check for existing issue templates. The codebase is ground truth. Note findings for the PRD but do **not** reproduce file contents inside it.

## Step 3: Design modules

Sketch major modules to build or modify — responsibility, interface, new vs existing. Look for **deep module** opportunities (significant functionality behind simple interfaces). Present to the user and confirm which modules should have tests. Capture each module in ≤ 4 bullets for the PRD.

## Step 4: Write the PRD

Use the template below. **Each section has a line budget — respect it.** When a section would overflow, push detail into `*-decisions.md` and link to it.

```markdown
# PRD — [Feature Name]

> One-sentence purpose. Link to `*-decisions.md` if one exists.

## Problem Statement  *(≤ 6 lines)*
- Pain from user's perspective.
- Why it matters now (one line).

## Location  *(≤ 3 lines)*
`Brain/PRDs/<MM_DD_YYYY>/<feature-kebab>/<feature-kebab>.md`
Companion: `…-decisions.md` (if applicable).

## Solution  *(≤ 8 lines)*
- What changes for the user, in bullets.
- Mention the one architectural shape (e.g., "new shared layout + constants module"). No prose.

## User Stories  *(≤ 6 stories, 1 line each)*
1. As a [actor], I want [feature], so that [benefit].

## Implementation Decisions  *(≤ 40 lines total)*
**Modules** — one bullet per module:
- `ModuleName` (new/existing, path): one-line responsibility + key interface.

**Key decisions** — one bullet each, format `Decision — one-line rationale`:
- e.g., `Content in page.tsx, not MDX — three pages, no rich embeds.`

**Schema / API / dependencies** — only if changed. Bullet list, no prose.

Do not include: code snippets, full prose drafts, styling minutiae already in design system, or content authoring rules (those live in `*-decisions.md`).

## Testing Decisions  *(≤ 10 lines)*
- **Test**: [Module] — [what to assert, one line].
- **Skip**: [What we deliberately don't test + why, one line].
- **Prior art**: [File or pattern to mirror, one line].

## Out of Scope  *(≤ 6 bullets)*
- Explicit boundaries, one line each.

## Open Questions  *(omit if none)*
- One per line. If more than 3, hold the PRD and resolve first.
```

### Location rules

1. PRD filename is the feature in kebab-case. Path is **always repo-relative** to the project root (`<repo-root>/Brain/PRDs/...`) — never absolute paths from your home directory or workspace root. Example: `Brain/PRDs/03_28_2026/user-authentication/user-authentication.md`. Verify the parent folder with `ls Brain/PRDs/` before writing.
2. If the feature is too large for one ≤150-line PRD, split into sub-PRDs in the same folder: `user-authentication-overview.md`, `user-authentication-login.md`, `user-authentication-signup.md`, etc. The overview lists the sub-PRDs and is itself ≤80 lines.
3. Long rationale, locked Q&A, and content drafts go in `<feature>-decisions.md` alongside the PRD — not in the PRD itself.

### Self-check before saving

Run this checklist against your draft. Cut until all pass:

- [ ] Total length ≤ 150 lines.
- [ ] No section exceeds its budget.
- [ ] No paragraph longer than 3 lines.
- [ ] No code blocks (except the location path).
- [ ] User stories ≤ 6, deduplicated.
- [ ] No rationale repeated across sections.
- [ ] Every bullet earns its place — deletion would lose information.

If any item fails, trim before showing to the user.

## Step 5: Submit an Asana ticket

After the PRD is saved, ask the user whether to create a matching Asana ticket. If yes, use `/create-asana-ticket`. Title and description should match the PRD's feature name and Problem/Solution summary — not the entire PRD.

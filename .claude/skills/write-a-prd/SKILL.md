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

## Step 1: Gather problem and solution

Get the user's description of the problem and proposed solution. If a prior session (e.g., /grill-me) covered this, summarize and confirm rather than re-asking. Check for design artifacts like `DECISIONS.md` or `SystemDesign.md`.

## Step 2: Explore the codebase

Ground yourself in the repo: verify the user's claims, understand the architecture, identify affected modules, and check for existing issue templates. The codebase is ground truth.

## Step 3: Design modules

Sketch major modules to build or modify — responsibility, interface, new vs existing. Look for **deep module** opportunities (significant functionality behind simple interfaces). Present to the user and confirm which modules should have tests.

## Step 4: Write the PRD

```markdown
## Problem Statement
[The pain from the user's perspective.]

## Location
1. The PRD name should be the feature name in kebab_case and should be placed in the folder matching the current date. eg. /Users/edemdumenu/Documents/Workspace/DearModernScholar/Brain/PRDs/03_28_2026/user-authentication.md
2. If the feature is too large for one PRD, break them into parts and place them in a different folder. For example, if the feature is "User Authentication", it can be broken down into "User Authentication - Login", "User Authentication - Signup", "User Authentication - Forgot Password", etc. "user-authentication-overview.md", "user-authentication-login.md", "user-authentication-signup.md", "user-authentication-forgot-password.md"

## Solution
[What changes for the user.]

## User Stories
[Exhaustive numbered list — happy path, edge cases, errors, admin flows.]
1. As a [actor], I want [feature], so that [benefit]

## Implementation Decisions
[Modules and interfaces, architectural decisions with rationale, schema changes, API contracts, key interactions, new dependencies. No file paths or code snippets.]

## Step 5: Submit an Asana ticket

Based on the PRD, and best practices for creating tickets, ask the user before creating a ticket in Asana matching the PRD. The title and the description should match the PRD task. Use the "/create-asana-ticket" command to create the sana ticket.

## Testing Decisions
- **Modules to test**: [Which and why]
- **Prior art**: [Similar patterns in the codebase]

## Out of Scope
[Explicit boundaries to prevent scope creep.]

## Further Notes
[Migration, rollout, performance, open questions.]
```

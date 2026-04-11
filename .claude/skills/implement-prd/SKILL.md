---
name: implement-prd
description: Implement a PRD by reading the document, creating a feature branch, and building out the code. Use when user wants to implement a PRD, build a feature from a PRD, says "implement this PRD", provides a PRD path and wants it built, or references a PRD file and asks you to code it. Also trigger when user says "build this", "implement this", or "code this" alongside a PRD file path.
---

# Implement PRD

Take a PRD document and turn it into working code. The user provides the PRD path and any specific instructions about what to focus on.

# IMPORTANT
DO NOT COMMIT ANY CODE! LEAVE CODE UNCOMMITTED!

## Step 1: Read and understand the PRD

Read the PRD file at the path the user provides. If the path points to a folder (multi-part PRDs), ask the user which part(s) to implement — don't assume.

Extract and internalize:
- **Problem and solution** — what are we building and why
- **User stories** — these are your acceptance criteria
- **Implementation decisions** — modules, interfaces, schemas, API contracts
- **Testing decisions** — which modules need tests, what patterns to follow
- **Out of scope** — respect these boundaries strictly

Summarize your understanding back to the user in a few sentences before writing any code. This catches misalignment early.

## Step 2: Explore the codebase

Before touching anything, understand what exists:
- Project structure, tech stack, conventions
- Modules the PRD says to modify — read them thoroughly
- Existing patterns for similar features (routing, components, services, etc.)
- Test patterns and frameworks already in use
- Database schemas, API routes, shared types

The PRD intentionally avoids file paths and code snippets because they go stale. Your job is to map the PRD's module descriptions to actual code locations.

## Step 3: Create a feature branch, worktree or work in the same branch

Ask the user if you should create a new branch, a worktree or not. If yes to a new branch or worktree, create a branch from the current base branch. Use a descriptive name derived from the PRD:

```
feature/<prd-name>
```

For example, a PRD named `user-authentication.md` becomes `feature/user-authentication`.

## Step 4: Implement

Build out the feature according to the PRD and the user's instructions. Key principles:

- **Follow existing patterns.** If the codebase uses a specific way of defining routes, components, or services, match that style. Don't introduce new patterns unless the PRD calls for it.
- **Implement in logical order.** Start with foundational pieces (schemas, types, core modules) and work outward toward the edges (UI, API endpoints). This way each layer can build on the one below it.
- **Respect the PRD's module boundaries.** The PRD describes modules and their interfaces for a reason — they represent deliberate design decisions. Don't merge modules the PRD keeps separate or split ones it keeps together.
- **Commit as you go.** Make meaningful commits at natural boundaries — after completing a module, after wiring up a major integration. Don't save everything for one giant commit at the end. Each commit message should reference what part of the PRD it addresses.

## Step 5: Write tests

After the implementation is complete, write tests based on the PRD's Testing Decisions section:

- Test the modules the PRD specifies
- Follow the testing patterns already in the codebase (the PRD's "prior art" section points to examples)
- Test external behavior, not implementation details — a good test breaks when the feature breaks and passes when it works, regardless of how internals are structured
- Cover the user stories as acceptance tests where practical

## Step 6: Verify

Before telling the user you're done:

1. Run the project's linter/formatter if one exists
2. Run the test suite (both new and existing tests) to make sure nothing is broken
3. Do a final `git diff` against the base branch to review everything you've changed
4. Run teh build if applicable (`npm run build`) to catch compiled errors
5. Run existing tests: if the PRD mentions them. 
6. Walk through each item in the PRD's implementation decisions and confirm it was done. 

## Step 7: Verify
- Create a verification file at `Brain/PRDs/<date>/<prd-file-name>-verification.md` with what was completed
- If there are any issues found during the verification, fix them and update the verification report accordingly. Do not mark acceptance criteria complete until they are fully met. 

Report to the user: what was built, which user stories are covered, and any issues or open questions that came up during implementation. Leave the code on the branch for their review.

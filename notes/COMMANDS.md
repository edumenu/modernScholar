⏺ You can reference GitHub issues in your commit messages using these formats:

  - Reference only: #123 or GH-123 — links the commit to the issue without closing it
  - Auto-close on merge to default branch: Use keywords before the issue number:
    - Fixes #123
    - Closes #123
    - Resolves #123

  You can place these anywhere in the commit message — title or body:

  Add ripple animation to CTA button

  Implements the cursor-following ripple hover effect on all CTA button
  variants to match the regular Button component.

  Closes #45

  Multiple issues work too: Fixes #12, closes #34

  For cross-repo references: Fixes org/repo#123

  These keywords only auto-close when the commit lands on the default branch (usually main), either via
  direct push or merged PR.
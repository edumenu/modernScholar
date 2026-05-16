- ~~Update expired stamp label
- ~~Add 404 3D to 404 pages
- ~~Fix the share button on scholarship cards
- ~~Do an extensive test for the scholarship search page
- ~~Fix QA issues
- Look into general performance especially with spline 3D
- ~~Animation to extra filter sheet, remove ripple effect on filter options
- Look into K to 12 categories
- ~~Update loading vector icon from top to bottom
- ~~Add delay loading to the home page
- Look into strategies for getting user emails
- Update dark theme material
-  Clean up tablet and mobile views
- Start thinking about unique tests on every single page. 
- ~~Add hover animations to the hero section image. 

Future todos:
- Spline performance testing: [[spline-3d-performance-testing]]
- Web animation best practices: [[web-animation-best-practices]]
- Explore converting to bun
- On the scholarship page, look into various ways scholarships can be categorized. eg https://bold.org/scholarships/, https://bigfuture.collegeboard.org/scholarship-search

## Legal pages — deferred operator follow-ups

- When LLC formed → obtain PO Box or virtual mailbox → add physical address to `/privacy`, `/terms`, `/cookies` (and bump the relevant `LAST_UPDATED.*` in `src/lib/legal-constants.ts`). Until then, the policies intentionally omit a mailing address.

### Manual deletion-request handling runbook

Respond within 30 days of receipt (the window the Privacy Policy commits to). Inbox: `dearmodernscholar@gmail.com`.

1. **Locate** — search Gmail for the requester's email address as sender; collect every inbound thread (deletion request, prior correspondence, any reply chains).
2. **Confirm identity** — reply from the same address asking the requester to confirm it's their request. If the address doesn't match anything on file, request a second verifying detail (e.g., approximate date of the original message) before proceeding.
3. **Purge** — delete all located threads from Gmail, then empty Trash to remove from "All Mail". We hold no other data store, so this is the only step. If a future PR introduces an additional data store (newsletter list, account DB), this runbook must be updated in the same PR.
4. **Reply with confirmation** — send a short plain-language confirmation that the data has been deleted, citing the date. Then delete that reply thread as well once the requester acknowledges (or after 7 days of no response).
5. **Log nothing personal** — do not record the requester's identity in any persistent file. A bare counter (e.g., "deletion requests handled in 2026: 3") is fine if useful.

If a request can't be honored within 30 days (e.g., extended absence), reply before the deadline with an explanation and a revised completion date.

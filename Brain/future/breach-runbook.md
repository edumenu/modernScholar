# Breach Response Runbook

> **Internal only.** Do not link from any public page. The Privacy Policy commits to a 72-hour notification window for affected users; this runbook is how that commitment is actually met.

**Scope of "breach":** any unauthorized access to, disclosure of, or loss of integrity affecting (a) the `dearmodernscholar@gmail.com` inbox, (b) the DigitalOcean account or deploy pipeline, (c) any third-party account that holds Modern Scholar data or controls the domain (registrar, DNS, GitHub repo). Defacement of the public site without data exposure is a site-integrity incident, not a privacy breach — handle it under Contain + Post-mortem but the 72-hour user-notification step does not apply.

The clock starts the moment Edem or Catherine become aware that a breach has *probably* occurred — not when it is fully confirmed.

---

## 1. Detect

Triggers that should start this runbook:
- Google sends a "new sign-in" / "suspicious activity" alert for the shared Gmail account from an unrecognized device.
- DigitalOcean, GitHub, or the domain registrar sends an unrecognized-login or recovery-email-changed notice.
- A user reports receiving correspondence from `dearmodernscholar@gmail.com` that we did not send.
- The public site is serving content we did not deploy.
- A credential we use is reported in a third-party breach (Have I Been Pwned, etc.) and the same password was reused anywhere.

Note the exact UTC time of first awareness. This is hour zero of the 72-hour clock.

## 2. Contain

Do all of the below in order. Don't skip — every step closes off a parallel attack path.

1. **Rotate every credential** that touched the affected surface: Gmail password, DigitalOcean password, GitHub password, registrar password, any reused passwords elsewhere.
2. **Enable / re-enable MFA** on every account in the previous step. Prefer an authenticator app over SMS. Save new recovery codes to the password manager only.
3. **Revoke active sessions** on each account (Gmail: "Sign out all other sessions"; GitHub: Settings → Sessions → revoke; DigitalOcean: Account → Active sessions).
4. **Audit OAuth grants** on Gmail and GitHub. Revoke anything you don't recognize.
5. **Audit recovery email and recovery phone** on each account — attackers commonly add their own to maintain persistence even after a password rotation.
6. **Lock the deploy pipeline** if the breach plausibly touched it: pause auto-deploys on DigitalOcean until the GitHub repo is verified clean.

## 3. Assess scope

Determine, in writing (even just a local note), the answers to:
- **What was accessed?** Inbox contents, source code, deploy keys, DNS, something else?
- **Whose data was exposed?** Specifically: did inbound emails from real users sit in the inbox during the window of compromise? If yes, list those sender addresses — they are the users who must be notified.
- **What was changed?** Compare the current state of the site, the repo (`git log`), DNS records, and DigitalOcean build settings against what is expected.
- **Window of exposure.** Best-estimate earliest and latest times the attacker had access. Err toward a wider window when uncertain.

If the answer to "whose data was exposed" is the empty set (e.g., GitHub repo compromise where the repo is already public, no inbox access, no DNS changes), then the 72-hour user notification step does not apply — skip to Post-mortem. Otherwise continue.

## 4. Notify within 72 hours

By **hour 72** from first awareness, the following must be done:

1. **Email each affected user individually** from `dearmodernscholar@gmail.com` (or a temporary alternate address if that inbox is still compromised). The email must state, in plain language:
   - That a breach occurred and we believe their data was involved.
   - What specifically was exposed (inbox contents, the email address they wrote from, the substance of their request, etc.).
   - When it happened (the exposure window from Assess scope).
   - What we have done (rotated credentials, enabled MFA, revoked sessions, etc.).
   - What they should do (rotate any password they may have shared with us; be alert for phishing referencing the substance of their prior message).
   - The contact address for follow-up questions.
2. **Post a homepage banner** disclosing the breach in summary form. The banner mechanism does not currently exist as a primitive (see legal-pages PRD Out of Scope); when needed, build the simplest possible version inline on the home page (a dismissible `<aside>` with the disclosure text, no persistence). Leave it up for **14 days** to match the material-change commitment in the Privacy Policy.
3. **Update `/privacy`** with a dated note linking to the incident summary, and bump `LAST_UPDATED.privacy` in `src/lib/legal-constants.ts`.

GDPR's separate 72-hour-to-supervisory-authority notification only applies if we are a controller of EU personal data at the time of the incident. We currently collect no personal data via the site itself — only via inbound email correspondence. If a future feature changes that (newsletter, accounts), this runbook must be updated in the same PR to add the supervisory-authority step.

## 5. Post-mortem

Within two weeks of containment, write up:
- **Timeline** — hour zero, contain steps, notify steps, all with timestamps.
- **Root cause** — the actual technical or operational failure, not "the attacker got in." (Phished credential? Reused password? Missing MFA? Compromised third-party? Stolen device?)
- **What worked** — detection paths and containment steps that did their job.
- **What didn't** — gaps that delayed detection or containment.
- **Changes shipped** — concrete code, config, or process changes (e.g., "added MFA to registrar," "rotated to a password manager-generated unique password on every account," "added a monthly credential audit to Todos").

Store the post-mortem in `Brain/` (do not publish externally). Reference it from this runbook so future incidents can compare.

---

## Notes

- This runbook is **internal-only**. It is not linked from `/privacy`, `/terms`, `/cookies`, or anywhere else in the public site. Users see only the policy commitment ("we'll notify affected users within 72 hours"); they do not see the procedure.
- Keep this file current. Any new account, data store, or third-party integration must be reflected in the Detect and Assess scope sections in the same PR that adds it.
- If breach plausibility is ambiguous (e.g., a suspicious-login alert from a location you might have actually visited), default to running steps 1–2 anyway. Rotating a password and re-enabling MFA is cheap; missing a real breach is not.

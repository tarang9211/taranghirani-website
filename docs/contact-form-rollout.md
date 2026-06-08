# Contact Form Rollout

## Context

`/contact` now has a typed enquiry form on top of the existing WhatsApp / email / Instagram quick-paths. Submissions are emailed to `safaris@taranghirani.com` and `tarang9211@gmail.com` via Resend, with the enquirer's email set as `Reply-To` so replying from either inbox goes straight back to them.

**Funnel position:**

```
Website /contact
    ↓
Form submission → Resend → inbox (safaris@ + tarang9211@)
    ↓
Personal reply / WhatsApp follow-up
    ↓
Booking / commission / print sale
```

This is the lead-capture counterpart to the Kit-driven newsletter funnel — different purpose, different infra. The two should not be merged.

---

## What's already built

- `components/ContactForm.tsx` — name, email, country code + phone, message. Per-field validation, honeypot anti-spam, loading/success/error states.
- `pages/api/contact.ts` — POST handler that validates input and sends via Resend. Includes plain-text + HTML email bodies.
- `pages/contact.tsx` — form placed above ContactLinks; new copy ("Looking to learn photography or plan a photography focussed experience?").
- `resend@6.x` added to dependencies.

---

## 1. Resend Account Setup

**Steps:**

1. Sign up at <https://resend.com> (free tier: 100 emails/day, 3,000/month — more than enough headroom).
2. Navigate to **API Keys** → **Create API Key**. Name it `taranghirani-website-prod`. Permissions: **Sending access** only.
3. Copy the key (starts with `re_`). You will not see it again — store in a password manager and immediately add to Vercel + `.env.local` per step 2.

---

## 2. Environment Variables

| Variable               | Where                           | Required | Purpose                                                                                                            |
| ---------------------- | ------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------ |
| `RESEND_API_KEY`       | Vercel dashboard + `.env.local` | Yes      | Authenticates the Resend send call.                                                                                |
| `CONTACT_FROM_ADDRESS` | Vercel dashboard + `.env.local` | Optional | Override the From line once a domain is verified (see §4). Falls back to `Tarang Hirani Website <onboarding@resend.dev>`. |

**Vercel setup:**

1. Vercel dashboard → Project → Settings → Environment Variables.
2. Add `RESEND_API_KEY`, mark **Sensitive**, scope to **Production + Preview**.
3. Skip `CONTACT_FROM_ADDRESS` for now — only set it after §4 is complete.
4. Redeploy (or trigger a new build) so the new env reaches the running app.

**Local:**

Append to `.env.local` (already gitignored):

```
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxx
```

---

## 3. Smoke Test

After the Vercel env var lands and the deploy is live:

1. Open the deployed `/contact` page (production or a Preview URL).
2. Submit a real enquiry with your own name + a throwaway message ("Test — please ignore").
3. Confirm:
   - The form shows the success state ("Thanks — I'll be in touch.").
   - Both inboxes (`safaris@taranghirani.com` and `tarang9211@gmail.com`) receive the email within ~30 seconds.
   - The email "From" reads `Tarang Hirani Website <onboarding@resend.dev>` until §4 is done.
   - Hitting **Reply** in either inbox addresses the enquirer's email, not Resend.
4. Submit an empty form to verify per-field validation messages appear in red below each field.
5. Submit a form filled with invalid data (e.g. `not-an-email`) to verify the email format check fires.

---

## 4. Domain Verification (Polished Sender)

**Goal:** change the From line from `onboarding@resend.dev` to something like `enquiries@taranghirani.com` for trust and deliverability.

**Steps:**

1. Resend dashboard → **Domains** → **Add Domain** → enter `taranghirani.com`.
2. Resend will show 3 DNS records to add:
   - `MX` for the return-path (e.g. `send.taranghirani.com` → `feedback-smtp.us-east-1.amazonses.com`)
   - `TXT` for SPF (e.g. `send.taranghirani.com` → `v=spf1 include:amazonses.com ~all`)
   - `TXT` for DKIM (a long key)
3. Add all three records in your DNS provider (likely Vercel DNS, Cloudflare, or wherever `taranghirani.com` is hosted). Use the **exact** host names Resend shows — usually scoped to a `send.` subdomain.
4. Click **Verify** in Resend. Propagation is usually 5–60 minutes; can take up to 24 hours.
5. Once verified, set the Vercel env var:
   ```
   CONTACT_FROM_ADDRESS=Tarang Hirani <enquiries@taranghirani.com>
   ```
6. Redeploy. Submit a test enquiry — the From line should now show the branded sender.

**Notes:**

- The verified address does not need to exist as a real mailbox. It's just the From identity. Replies still route to the enquirer via the `Reply-To` header.
- If you want to receive bounce notifications, configure a webhook in Resend → Webhooks (optional, low priority).

---

## 5. Future Enhancements (Not in Scope Now)

These are deliberately deferred until there's a real need:

- **Spam handling beyond honeypot:** add Cloudflare Turnstile or hCaptcha if bot submissions get noisy.
- **Rate limiting:** Vercel has built-in protections, but if abused, add `upstash/ratelimit` keyed by IP.
- **Enquiry-type routing:** add a "What's this about?" dropdown (Safari / Workshop / Prints / Collab) and route to different inboxes or use it as the email subject prefix.
- **CRM sync:** push submissions into Kit as tagged subscribers, or into a Google Sheet via a webhook, so enquiries are searchable.
- **Auto-acknowledgement email:** send a confirmation email to the enquirer so they know it landed.

---

## Files Touched

- `components/ContactForm.tsx` (new)
- `pages/api/contact.ts` (new)
- `pages/contact.tsx` (modified)
- `package.json` + `yarn.lock` (added `resend`)
- `docs/contact-form-rollout.md` (this file)

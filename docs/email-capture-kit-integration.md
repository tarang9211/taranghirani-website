# Email Capture System — Kit Integration Plan

## Context

Build an email capture system integrated with Kit (ConvertKit) so Tarang can grow an owned audience for safari bookings, photography content, and future products. Emails sent from safaris@taranghirani.com.

**Funnel structure:**

```
Instagram Feed (discovery)
    ↓
Instagram Broadcast Channel (casual engagement)
    ↓
Email List via Kit (committed audience — this is where you sell)
    ↓
Safari Booking / Purchase
```

---

## 1. Vercel Changes (Secrets & Configuration)

**Approach:** Use Vercel's native environment variables — they're encrypted at rest, scoped per environment (production/preview/dev), and injected into serverless functions at runtime. This is the standard for Next.js on Vercel and is more appropriate than the `config` npm package (which is designed for hierarchical config files in traditional Node apps, not serverless).

**Environment variables to add:**

| Variable | Where | Purpose |
|----------|-------|---------|
| `KIT_API_SECRET` | Vercel dashboard + `.env.local` | Kit API authentication (server-side only) |
| `KIT_FORM_ID` | Vercel dashboard + `.env.local` | Target form ID for website subscribers |

**Steps:**

1. In Vercel dashboard → Project → Settings → Environment Variables
2. Add `KIT_API_SECRET` — mark as "Sensitive", scope to Production + Preview
3. Add `KIT_FORM_ID` — scope to Production + Preview
4. For local dev, add both to `.env.local` (already gitignored)

**Security:**

- Variables without `NEXT_PUBLIC_` prefix are **never** exposed to the browser — they only exist in API routes (serverless functions)
- `KIT_FORM_ID` is used only in the server-side API route — the client calls `/api/subscribe` and never sees the form ID or API secret
- No secrets in code, no config files committed to repo
- `.env.local` is already in `.gitignore`

---

## 2. Domain & Email Setup (DNS on Vercel)

Kit needs DNS records on taranghirani.com so emails from safaris@taranghirani.com are authenticated and don't land in spam.

### 2a. Kit Account Setup

1. Create free account at kit.com
2. Go to Settings → Email → set sender name "Tarang Hirani" and sender email "safaris@taranghirani.com"

### 2b. Domain Verification in Kit

1. Kit dashboard → Settings → Email → Sending Domains → Add Domain
2. Enter `taranghirani.com`
3. Kit will provide DNS records to add:

| Record Type | Purpose | What it does |
|-------------|---------|--------------|
| **CNAME** (DKIM) | Email authentication | Proves emails are legitimately from your domain |
| **TXT** (SPF) | Sender authorization | Tells mail servers Kit is allowed to send on your behalf |
| **CNAME** (Return-path) | Bounce handling | Routes bounced emails back through Kit |

### 2c. Add DNS Records in Vercel

1. Go to Vercel dashboard → Domains → taranghirani.com → DNS Records
2. Add each record Kit provides (copy values exactly)
3. Go back to Kit and click "Verify" — propagation usually takes 5-30 minutes
4. Once verified, Kit can send authenticated emails from safaris@taranghirani.com

### 2d. Optional: DMARC Record

- Add a TXT record: `_dmarc.taranghirani.com` → `v=DMARC1; p=none; rua=mailto:safaris@taranghirani.com`
- This monitors email authentication. Start with `p=none` (monitor only), tighten later.

### 2e. Create a Form in Kit

1. Kit dashboard → Grow → Landing Pages & Forms → New Form
2. Create an inline form (we won't use Kit's form HTML — we're building a custom form)
3. Note the Form ID from the URL (e.g., `https://app.kit.com/forms/designers/12345` → ID is `12345`)
4. This Form ID becomes the `KIT_FORM_ID` environment variable

---

## 3. API (Email Submission Endpoint)

**New file:** `/pages/api/subscribe.ts`

### Flow

```
Browser form submit
  → POST /api/subscribe { email }
    → Server validates email format
    → Server calls Kit API v4
    → Returns success/error to browser
```

### Kit API v4 Call

```
POST https://api.kit.com/v4/forms/{KIT_FORM_ID}/subscribers
Authorization: Bearer {KIT_API_SECRET}
Content-Type: application/json

{ "email_address": "visitor@example.com" }

Note: Only capturing email for now. If first name is added later, use
`autocomplete="given-name"` on the input so iOS/Android keyboards surface
the stored name via autofill (zero-friction tap to fill). Kit stores
first_name natively via the API.
```

### Validation

- Reject non-POST methods → 405
- Validate email format server-side (basic sanity check — Kit handles authoritative validation and will reject truly invalid addresses)
- Return 400 for obviously malformed input
- Return 200 on success (subscriber added or already exists)
- Return 500 if Kit API fails (generic error message — don't leak Kit error details to client)

**Note on client-side validation:** Use `<input type="email" required>` which relies on the browser's built-in HTML5 email validation per the spec. No custom regex needed.

### Rate Limiting

- Vercel has built-in DDoS protection on serverless functions
- Kit handles email deduplication — submitting the same email twice is a no-op, not an error

---

## 4. User Experience

### 4a. Form Component — `/components/EmailSignup.tsx`

**Two variants:**

**`variant="section"` (Homepage)**

- Centered layout with heading, description, and form
- Heading: "Stay in the Loop"
- Description: "Safari dates, field notes, and photography tips. Straight to your inbox."
- Input + button side by side on desktop, stacked on mobile
- Dark theme (charcoal bg, sage accents) — matches surrounding sections

**`variant="inline"` (Footer & Blog)**

- Compact single-row: input + submit button
- Minimal copy — placeholder text does the work
- Footer: dark theme | Blog: adapts to light bg-paper theme via `theme` prop

### 4b. Form States

| State | UI | Behavior |
|-------|-----|----------|
| **Idle** | Input + "Subscribe" button | Ready for input |
| **Loading** | Button shows spinner, input disabled | Prevents double submit |
| **Success** | Form replaced with "You're in! Check your inbox." | Confirms action taken |
| **Error** | Red text below form: "Something went wrong. Try again." | Button re-enabled |
| **Already subscribed** | "You're already subscribed!" | Friendly acknowledgment, not an error |

### 4c. Confirmation & Welcome Email (Kit handles this)

- **Recommend single opt-in** for a personal brand — less friction, higher conversion. Double opt-in loses 20-30% of signups.
- Configure in Kit: Settings → Subscriber settings → set to single opt-in
- Set up a **Welcome Email** automation in Kit:
  - Trigger: "Subscribes to a form" (the website form)
  - Email: Welcome message from Tarang — who you are, what they'll get, link to latest blog post or gallery
  - This is configured entirely in Kit's dashboard, no code needed

### 4d. Email Delivery Errors

Email delivery is Kit's responsibility after a subscriber is added. Kit handles:

- **Retries** for soft bounces (temporary delivery failures)
- **Bounce tracking** — hard bounces are automatically removed from the list
- **Deliverability monitoring** — Kit monitors sender reputation

From the website's perspective:

- Our job ends once Kit confirms the subscriber was added (API returns 200)
- The UX should set expectations: success message says "Check your inbox (and spam folder)"
- If emails consistently land in spam, that's a domain authentication issue — the DNS/DKIM setup in section 2 prevents this
- Kit provides deliverability stats in their dashboard to monitor this

### 4e. Unsubscribe Flow (Kit handles this entirely)

- **Every email Kit sends automatically includes an unsubscribe link** — this is legally required (CAN-SPAM, GDPR) and Kit enforces it
- Clicking unsubscribe takes the user to a Kit-hosted page where they confirm
- Kit marks them as unsubscribed — they won't receive future emails
- **No code needed on the website** for unsubscribing
- Kit also handles: complaint tracking, bounce management, re-subscribe requests

### 4f. GDPR / Privacy

- Kit is GDPR-compliant and provides data processing agreements
- The form should include a small note: "No spam. Unsubscribe anytime."
- No checkbox needed for implied consent (entering email = consent) in most jurisdictions, but the note builds trust

---

## 5. Homepage Integration

**Current:** `InstagramCTA.tsx` shows "Follow my journey" + Instagram link.

**Change:** Evolve into a "Stay Connected" section that includes BOTH email capture and Instagram:

```
           Stay in the Loop

  Safari dates, field notes, and photography tips.
           Straight to your inbox.

    [ your@email.com ] [ Subscribe → ]

         No spam. Unsubscribe anytime.

                 ── or ──

            @tarang.hirani →
```

This keeps Instagram as an entry point while making email the primary CTA.

---

## 6. Files Summary

### Create

| File | Purpose |
|------|---------|
| `/pages/api/subscribe.ts` | API route — validates email, calls Kit API |
| `/components/EmailSignup.tsx` | Reusable form component (section + inline variants) |

### Modify

| File | Change |
|------|--------|
| `/components/InstagramCTA.tsx` | Evolve into combined email + Instagram section |
| `/components/Footer.tsx` | Add compact inline email form |
| `/pages/blog/[slug].jsx` | Add inline email CTA between body and footer nav |
| `/pages/index.tsx` | Update import if component is renamed |

### Manual (Tarang)

| Task | Where |
|------|-------|
| Create Kit account | kit.com |
| Add DNS records | Vercel dashboard → Domains → taranghirani.com |
| Add env vars | Vercel dashboard → Project Settings → Environment Variables |
| Configure welcome email | Kit dashboard → Automations |
| Set single opt-in | Kit dashboard → Settings |

---

## 7. Verification

1. `yarn dev` — site loads, no errors
2. Submit email on homepage → confirm subscriber appears in Kit dashboard
3. Submit same email again → "Already subscribed" state (not error)
4. Submit invalid email → browser validation catches it (`type="email"` + `required`)
5. Test footer form on gallery page and blog page
6. Test blog post inline CTA
7. Mobile responsive check on all three placements
8. Check Kit sends welcome email after signup
9. Check unsubscribe link works in the welcome email

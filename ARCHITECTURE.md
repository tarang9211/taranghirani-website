# Architecture

This document describes the infrastructure and tooling behind taranghirani.com — where things are hosted, how they're wired together, and which dashboard controls what. It's a map of the operational stack, not a deployment runbook.

## Tooling

The framework and runtime stack used to build the site.

- **Next.js 16** (Pages Router, Turbopack) — pages live in `pages/`, serverless API routes in `pages/api/`
- **React 18** + **TypeScript 5**
- **Tailwind CSS 3** — utility styling; tokens defined in `tailwind.config.js`. See `DESIGN.md` for the design system.
- **Cloudinary** — image hosting and delivery, via `next/image` and the `cloudinary` SDK
- **Sharp** + **Satori** — image optimisation and OG image generation
- **next-sitemap** — sitemap.xml generation
- **Lucide React** — icon set
- **Yarn** — package manager (Node 22.x per `package.json` engines)

## Domain

- **Canonical domain:** `www.asilisafaris.in` (since November 2026). `taranghirani.com`, `www.taranghirani.com` and the bare `asilisafaris.in` all 308-redirect to it page for page. The redirects live in `next.config.js` (host-based) and are mirrored in Vercel → Project → Settings → Domains. Keep `taranghirani.com` on the Vercel project and keep renewing it: old links and Google's index still point there.
- **Email on asilisafaris.in:** Google Workspace (MX `smtp.google.com`). `tarang@asilisafaris.in` is the public address.
- **Registrar:** Squarespace Domains for both domains. `asilisafaris.in` expires 2027-08-08.
- **DNS:** Managed at **Squarespace**, not Vercel (checked November 2026). `taranghirani.com` uses Squarespace's Google-era nameservers (`ns-cloud-a*.googledomains.com`) and `asilisafaris.in` uses `nsb*.squarespacedns.com`. Each domain has its apex `A` record and its `www` `CNAME` pointing at Vercel. Vercel only serves the site and does the redirects. It doesn't hold the DNS.
- **Practical implication:** for anything DNS-related (email auth, subdomains, verification records), go to **Squarespace → Domains → (domain) → DNS**. Don't delete the `taranghirani.com` A/CNAME records: the redirects to `www.asilisafaris.in` need that domain to keep reaching Vercel.

## Vercel

Vercel handles three responsibilities for this site.

### 1. Hosting & deploys

- Connected to the GitHub repo; every push to `main` builds and deploys to production.
- Preview deployments are created automatically for pull requests.
- Build settings use Next.js defaults — there is no `vercel.json`; build-time configuration lives in `next.config.js`.

### 2. Domains

Both domains are attached to the project under Settings → Domains. DNS itself lives at Squarespace (see the Domain section above).

### 3. Environment variables & secrets

- `KIT_API_SECRET` and `KIT_FORM_ID` (see Email below) are stored as encrypted env vars in Vercel and exposed only to the serverless API route.
- Cloudinary delivery uses public URLs, so no secret is required at runtime.

## Email

Two services work together. **Kit** handles outbound email (newsletters, broadcasts, automations). **ImprovMX** handles inbound email to `safaris@taranghirani.com`.

> **Being retired.** `safaris@taranghirani.com` is to be deleted once nothing depends on it: Kit's sender moves to `tarang@asilisafaris.in` (with Kit's DNS records added for `asilisafaris.in`), the Facebook page and any Resend `CONTACT_FROM_ADDRESS` stop using it, and the alias is removed in ImprovMX. Keep the `taranghirani.com` MX records until the alias is gone. Update this section when that's done.

### Outbound — Kit (formerly ConvertKit)

- Newsletter capture and broadcasts run through Kit.
- The signup form on the site posts to the serverless route at `pages/api/subscribe.ts`, which calls Kit's v4 API (`https://api.kit.com/v4/`) using `KIT_API_SECRET` and subscribes the email to the form identified by `KIT_FORM_ID`.
- Sender address `safaris@taranghirani.com` is configured in the Kit dashboard.
- Deliverability is set up via DNS records that Kit provides (DKIM CNAME, SPF TXT, return-path CNAME). These are added in the Squarespace DNS panel.

### Inbound alias — ImprovMX

- `safaris@taranghirani.com` is **not** a real mailbox. It's a free alias provided by ImprovMX that forwards incoming mail to the personal inbox.
- Set up by pointing the MX records for `taranghirani.com` at ImprovMX (`mx1.improvmx.com`, `mx2.improvmx.com`) in the Squarespace DNS panel, plus the ImprovMX SPF include.
- Aliases are managed at improvmx.com.

### Why both?

Kit can send *from* `safaris@taranghirani.com`, but doesn't provide a mailbox to *receive* replies. ImprovMX provides the receiving half — so replies and direct emails land in the personal inbox without paying for a mail host.

## Dashboard cheat sheet

| Need to change…              | Go to            |
| ---------------------------- | ---------------- |
| Renew the domain             | Squarespace      |
| Edit a DNS record            | Squarespace      |
| Add an env var / secret      | Vercel           |
| Deploy or roll back          | Vercel / GitHub  |
| Edit a newsletter or form    | Kit              |
| Add / change an email alias  | ImprovMX         |
| Upload or transform an image | Cloudinary       |

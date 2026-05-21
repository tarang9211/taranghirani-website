# Architecture

This document describes the infrastructure and tooling behind taranghirani.com — where things are hosted, how they're wired together, and which dashboard controls what. It's a map of the operational stack, not a deployment runbook.

## Tooling

The framework and runtime stack used to build the site.

- **Next.js 14** (Pages Router) — pages live in `pages/`, serverless API routes in `pages/api/`
- **React 18** + **TypeScript 5**
- **Tailwind CSS 3** — utility styling; tokens defined in `tailwind.config.js`. See `DESIGN.md` for the design system.
- **Cloudinary** — image hosting and delivery, via `next-cloudinary` and the `cloudinary` SDK
- **Sharp** + **Satori** — image optimisation and OG image generation
- **next-sitemap** — sitemap.xml generation
- **Lucide React** — icon set
- **Yarn** — package manager (Node 22.x per `package.json` engines)

## Domain

- **Registrar:** Squarespace Domains. `taranghirani.com` is registered and renewed here.
- **DNS:** Managed at Vercel. Squarespace points the nameservers at Vercel so DNS records (A, CNAME, TXT, MX) are edited in the Vercel dashboard, not at Squarespace.
- **Practical implication:** for anything DNS-related (email auth, subdomains, verification records), go to **Vercel → Project → Domains → DNS Records**. Squarespace is only touched for renewal, WHOIS, or transfers.

## Vercel

Vercel handles three responsibilities for this site.

### 1. Hosting & deploys

- Connected to the GitHub repo; every push to `main` builds and deploys to production.
- Preview deployments are created automatically for pull requests.
- Build settings use Next.js defaults — there is no `vercel.json`; build-time configuration lives in `next.config.js`.

### 2. DNS for taranghirani.com

As described in the Domain section above, all DNS records are managed in the Vercel dashboard.

### 3. Environment variables & secrets

- `KIT_API_SECRET` and `KIT_FORM_ID` (see Email below) are stored as encrypted env vars in Vercel and exposed only to the serverless API route.
- Cloudinary delivery uses public URLs, so no secret is required at runtime.

## Email

Two services work together. **Kit** handles outbound email (newsletters, broadcasts, automations). **ImprovMX** handles inbound email to `safaris@taranghirani.com`.

### Outbound — Kit (formerly ConvertKit)

- Newsletter capture and broadcasts run through Kit.
- The signup form on the site posts to the serverless route at `pages/api/subscribe.ts`, which calls Kit's v4 API (`https://api.kit.com/v4/`) using `KIT_API_SECRET` and subscribes the email to the form identified by `KIT_FORM_ID`.
- Sender address `safaris@taranghirani.com` is configured in the Kit dashboard.
- Deliverability is set up via DNS records that Kit provides (DKIM CNAME, SPF TXT, return-path CNAME). These are added in Vercel's DNS panel. A walkthrough lives in `docs/email-capture-kit-integration.md`.

### Inbound alias — ImprovMX

- `safaris@taranghirani.com` is **not** a real mailbox. It's a free alias provided by ImprovMX that forwards incoming mail to the personal inbox.
- Set up by pointing the MX records for `taranghirani.com` at ImprovMX (`mx1.improvmx.com`, `mx2.improvmx.com`) in Vercel's DNS panel, plus the ImprovMX SPF include.
- Aliases are managed at improvmx.com.

### Why both?

Kit can send *from* `safaris@taranghirani.com`, but doesn't provide a mailbox to *receive* replies. ImprovMX provides the receiving half — so replies and direct emails land in the personal inbox without paying for a mail host.

## Dashboard cheat sheet

| Need to change…              | Go to            |
| ---------------------------- | ---------------- |
| Renew the domain             | Squarespace      |
| Edit a DNS record            | Vercel           |
| Add an env var / secret      | Vercel           |
| Deploy or roll back          | Vercel / GitHub  |
| Edit a newsletter or form    | Kit              |
| Add / change an email alias  | ImprovMX         |
| Upload or transform an image | Cloudinary       |

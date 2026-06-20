# Notion Enquiry CRM

## Context

Every contact-form submission is emailed via Resend (see
[contact-form-rollout.md](./contact-form-rollout.md)). Email alone is a push
notification, not a record you can work — so each enquiry is **also** appended to
a Notion database that doubles as a lightweight CRM (a status pipeline you drag
leads through: New → Contacted → Quoted → Booked / Lost).

The Notion write is **best-effort and additive**: it runs in
`pages/api/contact.ts` only after the notification email has already succeeded,
inside a `try/catch`. If Notion is unconfigured or errors, it's logged and the
request still returns `{ success: true }` — the email flow, honeypot, and
acknowledgement are never affected.

```
Form submission → Resend → inbox (notification + acknowledgement)
                     ↓
              Notion database (CRM row, Status = New)
```

## How it works in code

- `lib/notion.ts` — `recordEnquiryInNotion(enquiry)` builds the page properties
  and calls `notion.pages.create`. No-ops with a warning if the env vars are
  missing (so local dev without Notion works). Long text (`Message`, `Subject`)
  is split into ≤2000-char chunks because Notion caps a single rich_text chunk at
  2000 characters.
- `pages/api/contact.ts` — calls the helper best-effort after the notification
  email send.

## One-time Notion setup

1. **Create an internal integration** at <https://www.notion.so/my-integrations>
   ("New integration", capability: Insert content). Copy the Internal Integration
   Secret.
2. **Create a full-page database** with the properties in the schema below. Names
   and types must match exactly — the code writes to these property names.
3. **Share the database with the integration**: open the database → `•••` →
   Connections → connect your integration. *(Skipping this gives a 404 even with
   a valid ID.)*
4. **Copy the database ID** — the 32-char hex string in the database URL, before
   `?v=`: `notion.so/<workspace>/<DATABASE_ID>?v=...`.

## Database schema

| Property      | Type   | Source                                   |
| ------------- | ------ | ---------------------------------------- |
| **Name**      | Title  | `name`                                   |
| **Email**     | Email  | `email`                                  |
| **Phone**     | Phone  | `countryCode` + `phone`                  |
| **Type**      | Select | `type` (`Workshop`, `Safari`, `Other`)   |
| **Subject**   | Text   | `subject` (fixed enquiry, e.g. workshop) |
| **Source**    | Select | `source` (`contact`, `workshops`)        |
| **Message**   | Text   | `message`                                |
| **Status**    | Select | always set to `New` on insert            |
| **Submitted** | Date   | server timestamp                         |

`Status` options to pre-create: `New`, `Contacted`, `Quoted`, `Booked`, `Lost`.

## Environment variables

Set in `.env.local` (local) and Vercel → Settings → Environment Variables
(Production + Preview):

```
NOTION_ACCESS_TOKEN=<integration secret>
NOTION_DATABASE_ID=<32-char database id>
```

## Note on the package

`@notionhq/client` is pinned to `2.3.0`. The 3.x line requires Node 22; this
project currently runs on Node 20, so the 2.x line is used.

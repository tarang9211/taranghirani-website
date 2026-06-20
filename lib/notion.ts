import { Client } from "@notionhq/client";

// A contact-form enquiry, already trimmed and validated by the API route.
export type Enquiry = {
  name: string;
  email: string;
  fullPhone: string;
  type: string;
  subject: string;
  source: string;
  message: string;
};

// Notion caps a single rich_text content chunk at 2000 characters. The message
// field is validated to <= 5000, so split it across multiple chunks.
const NOTION_TEXT_CHUNK = 2000;

function richText(value: string) {
  const chunks: { text: { content: string } }[] = [];
  for (let i = 0; i < value.length; i += NOTION_TEXT_CHUNK) {
    chunks.push({ text: { content: value.slice(i, i + NOTION_TEXT_CHUNK) } });
  }
  return chunks;
}

/**
 * Append an enquiry to the Notion database as a new page (CRM row).
 *
 * Best-effort by design: if the env vars are missing it no-ops with a warning so
 * local dev without Notion still works, and any API failure throws to the caller
 * which logs it without failing the request (the notification email already
 * succeeded by the time this runs).
 */
export async function recordEnquiryInNotion(enquiry: Enquiry): Promise<void> {
  const auth = process.env.NOTION_ACCESS_TOKEN;
  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!auth || !databaseId) {
    console.warn(
      "Notion not configured (NOTION_ACCESS_TOKEN / NOTION_DATABASE_ID missing) — skipping enquiry record",
    );
    return;
  }

  const notion = new Client({ auth });

  const properties: Record<string, unknown> = {
    Name: { title: [{ text: { content: enquiry.name } }] },
    Email: { email: enquiry.email },
    Phone: { phone_number: enquiry.fullPhone },
    Message: { rich_text: richText(enquiry.message) },
    Status: { select: { name: "New" } },
    // The database's "Created Date" (created_time) auto-captures submission time,
    // so there is no timestamp property to write here.
  };

  // Optional fields: omit empty selects/text — the Notion API rejects an empty
  // select option name.
  if (enquiry.type) properties.Type = { select: { name: enquiry.type } };
  if (enquiry.source) properties.Source = { select: { name: enquiry.source } };
  if (enquiry.subject)
    properties.Subject = { rich_text: richText(enquiry.subject) };

  await notion.pages.create({
    parent: { database_id: databaseId },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    properties: properties as any,
  });
}

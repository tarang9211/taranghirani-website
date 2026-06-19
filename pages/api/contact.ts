import type { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";

const TO_ADDRESSES = ["safaris@taranghirani.com", "tarang9211@gmail.com"];
const FROM_ADDRESS =
  process.env.CONTACT_FROM_ADDRESS ||
  "Tarang Hirani Website <onboarding@resend.dev>";

const MAX_LEN = {
  name: 120,
  email: 200,
  phone: 40,
  countryCode: 8,
  message: 5000,
  type: 40,
  source: 60,
  subject: 160,
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, countryCode, phone, message } = req.body || {};

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof countryCode !== "string" ||
    typeof phone !== "string" ||
    typeof message !== "string"
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const trimmed = {
    name: name.trim(),
    email: email.trim(),
    countryCode: countryCode.trim(),
    phone: phone.trim(),
    message: message.trim(),
  };

  // Optional qualification fields — missing/legacy callers still succeed.
  const type =
    typeof req.body?.type === "string" ? req.body.type.trim() : "";
  const source =
    typeof req.body?.source === "string" ? req.body.source.trim() : "";
  // Fixed enquiry subject (e.g. a specific workshop). When present it both
  // becomes the email subject line and is recorded in the notification body.
  const subjectField =
    typeof req.body?.subject === "string" ? req.body.subject.trim() : "";

  if (
    !trimmed.name ||
    !trimmed.email ||
    !trimmed.phone ||
    !trimmed.message ||
    !trimmed.countryCode
  ) {
    return res.status(400).json({ error: "Please fill in every field" });
  }

  if (
    trimmed.name.length > MAX_LEN.name ||
    trimmed.email.length > MAX_LEN.email ||
    trimmed.phone.length > MAX_LEN.phone ||
    trimmed.countryCode.length > MAX_LEN.countryCode ||
    trimmed.message.length > MAX_LEN.message ||
    type.length > MAX_LEN.type ||
    source.length > MAX_LEN.source ||
    subjectField.length > MAX_LEN.subject
  ) {
    return res.status(400).json({ error: "One of your fields is too long" });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed.email)) {
    return res
      .status(400)
      .json({ error: "Please enter a valid email address" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("Missing RESEND_API_KEY env var");
    return res.status(500).json({ error: "Server configuration error" });
  }

  const resend = new Resend(apiKey);

  const fullPhone = `${trimmed.countryCode} ${trimmed.phone}`;
  const subject = subjectField
    ? subjectField
    : type
      ? `${type} enquiry from ${trimmed.name}`
      : `New enquiry from ${trimmed.name}`;

  const text = [
    `New enquiry from ${trimmed.name}`,
    "",
    ...(subjectField ? [`Re:     ${subjectField}`] : []),
    `Email:  ${trimmed.email}`,
    `Phone:  ${fullPhone}`,
    ...(type ? [`Type:   ${type}`] : []),
    `Source: ${source || "—"}`,
    "",
    "Message:",
    trimmed.message,
    "",
    "—",
    "Sent from the contact form on taranghirani.com",
  ].join("\n");

  const html = `<!doctype html>
<html><body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color:#080808; max-width:560px; margin:0 auto; padding:24px;">
  <p style="font-size:11px; letter-spacing:0.2em; text-transform:uppercase; color:#C4956A; margin:0 0 16px;">New Enquiry</p>
  <h1 style="font-size:22px; font-weight:600; margin:0 0 24px;">${escapeHtml(trimmed.name)}</h1>
  <table style="width:100%; border-collapse:collapse; margin-bottom:24px;">
    ${
      subjectField
        ? `<tr>
      <td style="padding:8px 0; color:#525252; font-size:13px; width:80px; vertical-align:top;">Re</td>
      <td style="padding:8px 0; font-size:14px; font-weight:600;">${escapeHtml(subjectField)}</td>
    </tr>`
        : ""
    }
    <tr>
      <td style="padding:8px 0; color:#525252; font-size:13px; width:80px; vertical-align:top;">Email</td>
      <td style="padding:8px 0; font-size:14px;"><a href="mailto:${escapeHtml(trimmed.email)}" style="color:#080808;">${escapeHtml(trimmed.email)}</a></td>
    </tr>
    <tr>
      <td style="padding:8px 0; color:#525252; font-size:13px; vertical-align:top;">Phone</td>
      <td style="padding:8px 0; font-size:14px;"><a href="tel:${escapeHtml(trimmed.countryCode + trimmed.phone.replace(/\s/g, ""))}" style="color:#080808;">${escapeHtml(fullPhone)}</a></td>
    </tr>
    ${
      type
        ? `<tr>
      <td style="padding:8px 0; color:#525252; font-size:13px; vertical-align:top;">Type</td>
      <td style="padding:8px 0; font-size:14px;">${escapeHtml(type)}</td>
    </tr>`
        : ""
    }
    <tr>
      <td style="padding:8px 0; color:#525252; font-size:13px; vertical-align:top;">Source</td>
      <td style="padding:8px 0; font-size:14px;">${escapeHtml(source || "—")}</td>
    </tr>
  </table>
  <p style="font-size:11px; letter-spacing:0.2em; text-transform:uppercase; color:#525252; margin:0 0 8px;">Message</p>
  <div style="font-size:15px; line-height:1.6; white-space:pre-wrap; padding:16px; background:#F5F5F3; border-left:2px solid #C4956A;">${escapeHtml(trimmed.message)}</div>
  <p style="font-size:11px; color:#999; margin-top:24px;">Sent from the contact form on taranghirani.com</p>
</body></html>`;

  try {
    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: TO_ADDRESSES,
      replyTo: trimmed.email,
      subject,
      text,
      html,
    });

    if (error) {
      console.error("Resend send error:", error);
      return res.status(500).json({ error: "Failed to send message" });
    }

    // Best-effort acknowledgement to the enquirer. A failure here is logged but
    // must not fail the request — the notification above already succeeded.
    try {
      const ackText = [
        `Hi ${trimmed.name},`,
        "",
        "Thanks for reaching out — your message has landed with me and I'll be in touch within 24 hours.",
        "",
        "In the meantime, feel free to browse my work at taranghirani.com or reach me on Instagram @tarang.hirani.",
        "",
        "Warm regards,",
        "Tarang Hirani",
        "Wildlife Photographer",
      ].join("\n");

      const ackHtml = `<!doctype html>
<html><body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color:#080808; max-width:560px; margin:0 auto; padding:24px;">
  <p style="font-size:11px; letter-spacing:0.2em; text-transform:uppercase; color:#C4956A; margin:0 0 16px;">Message Received</p>
  <p style="font-size:16px; line-height:1.6; margin:0 0 16px;">Hi ${escapeHtml(trimmed.name)},</p>
  <p style="font-size:16px; line-height:1.6; margin:0 0 16px;">Thanks for reaching out — your message has landed with me and I'll be in touch <strong>within 24 hours</strong>.</p>
  <p style="font-size:16px; line-height:1.6; margin:0 0 24px;">In the meantime, feel free to browse my work at <a href="https://www.taranghirani.com" style="color:#C4956A;">taranghirani.com</a> or reach me on Instagram <a href="https://instagram.com/tarang.hirani" style="color:#C4956A;">@tarang.hirani</a>.</p>
  <p style="font-size:16px; line-height:1.6; margin:0;">Warm regards,<br/>Tarang Hirani</p>
  <p style="font-size:13px; color:#525252; margin:4px 0 0;">Wildlife Photographer</p>
</body></html>`;

      const { error: ackError } = await resend.emails.send({
        from: FROM_ADDRESS,
        to: trimmed.email,
        replyTo: TO_ADDRESSES[0],
        subject: "Thanks for reaching out — Tarang Hirani",
        text: ackText,
        html: ackHtml,
      });

      if (ackError) {
        console.error("Resend ack send error:", ackError);
      }
    } catch (ackErr) {
      console.error("Resend ack request failed:", ackErr);
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Resend request failed:", err);
    return res.status(500).json({ error: "Failed to send message" });
  }
}

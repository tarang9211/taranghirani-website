import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body;

  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Email is required" });
  }

  // Basic format sanity check — Kit handles authoritative validation.
  // This is just to avoid a confusing 500 when bypassing the browser's
  // HTML5 type=email validation.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res
      .status(400)
      .json({ error: "Please enter a valid email address" });
  }

  const apiSecret = process.env.KIT_API_SECRET;
  const formId = process.env.KIT_FORM_ID;

  if (!apiSecret || !formId) {
    console.error(
      "Missing KIT_API_SECRET or KIT_FORM_ID environment variables",
    );
    return res.status(500).json({ error: "Server configuration error" });
  }

  const kitHeaders = {
    "X-Kit-Api-Key": apiSecret,
    "Content-Type": "application/json",
  };

  try {
    // Step 1: create-or-find subscriber. Kit returns 201 for new, 200 for existing.
    const createRes = await fetch("https://api.kit.com/v4/subscribers", {
      method: "POST",
      headers: kitHeaders,
      body: JSON.stringify({ email_address: email }),
    });

    if (!createRes.ok) {
      console.error(
        "Kit create subscriber error:",
        createRes.status,
        await createRes.text(),
      );
      // 4xx from Kit means our input was bad (e.g., invalid email format) —
      // surface as 400 so the client can show a useful message.
      const status =
        createRes.status >= 400 && createRes.status < 500 ? 400 : 500;
      const message =
        status === 400
          ? "Please enter a valid email address"
          : "Failed to subscribe";
      return res.status(status).json({ error: message });
    }

    const createJson = (await createRes.json()) as {
      subscriber?: { id?: number };
    };
    const subscriberId = createJson.subscriber?.id;
    const alreadySubscribed = createRes.status === 200;

    if (!subscriberId) {
      console.error("Kit create subscriber returned no id:", createJson);
      return res.status(500).json({ error: "Failed to subscribe" });
    }

    // Step 2: attach subscriber to the form (idempotent; triggers form automations).
    const attachRes = await fetch(
      `https://api.kit.com/v4/forms/${formId}/subscribers/${subscriberId}`,
      { method: "POST", headers: kitHeaders },
    );

    if (!attachRes.ok) {
      console.error(
        "Kit attach-to-form error:",
        attachRes.status,
        await attachRes.text(),
      );
      return res.status(500).json({ error: "Failed to subscribe" });
    }

    return res.status(200).json({ success: true, alreadySubscribed });
  } catch (err) {
    console.error("Kit API request failed:", err);
    return res.status(500).json({ error: "Failed to subscribe" });
  }
}

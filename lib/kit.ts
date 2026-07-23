export type KitSubscribeResult = {
  ok: boolean;
  alreadySubscribed?: boolean;
  reason?: "not_configured" | "invalid_input" | "error";
};

/**
 * Subscribe an email address to the newsletter via the Kit (ConvertKit) v4
 * API: create-or-find the subscriber, then attach it to the signup form
 * (idempotent; triggers the form's automations).
 *
 * Never throws — callers that treat subscription as best-effort (e.g. the
 * contact route) can ignore the result, while /api/subscribe maps the
 * failure reason onto its response contract.
 */
export async function subscribeToNewsletter({
  email,
  firstName,
}: {
  email: string;
  firstName?: string;
}): Promise<KitSubscribeResult> {
  const apiSecret = process.env.KIT_API_SECRET;
  const formId = process.env.KIT_FORM_ID;

  if (!apiSecret || !formId) {
    console.warn(
      "Missing KIT_API_SECRET or KIT_FORM_ID environment variables — skipping newsletter subscription",
    );
    return { ok: false, reason: "not_configured" };
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
      body: JSON.stringify({
        email_address: email,
        ...(firstName ? { first_name: firstName } : {}),
      }),
    });

    if (!createRes.ok) {
      console.error(
        "Kit create subscriber error:",
        createRes.status,
        await createRes.text(),
      );
      // 4xx from Kit means our input was bad (e.g., invalid email format).
      const reason =
        createRes.status >= 400 && createRes.status < 500
          ? "invalid_input"
          : "error";
      return { ok: false, reason };
    }

    const createJson = (await createRes.json()) as {
      subscriber?: { id?: number };
    };
    const subscriberId = createJson.subscriber?.id;
    const alreadySubscribed = createRes.status === 200;

    if (!subscriberId) {
      console.error("Kit create subscriber returned no id:", createJson);
      return { ok: false, reason: "error" };
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
      return { ok: false, reason: "error" };
    }

    return { ok: true, alreadySubscribed };
  } catch (err) {
    console.error("Kit API request failed:", err);
    return { ok: false, reason: "error" };
  }
}

import type { NextApiRequest, NextApiResponse } from "next";
import { subscribeToNewsletter } from "../../lib/kit";

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

  const result = await subscribeToNewsletter({ email });

  if (result.ok) {
    return res
      .status(200)
      .json({ success: true, alreadySubscribed: result.alreadySubscribed });
  }

  switch (result.reason) {
    case "invalid_input":
      return res
        .status(400)
        .json({ error: "Please enter a valid email address" });
    case "not_configured":
      return res.status(500).json({ error: "Server configuration error" });
    default:
      return res.status(500).json({ error: "Failed to subscribe" });
  }
}

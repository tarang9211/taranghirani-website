import type { NextApiRequest, NextApiResponse } from "next";
import cloudinary from "../../lib/cloudinary"; // adjust path if different

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { role } = req.query;

  try {
    let expression = "folder=wildlife";
    let maxResults = 30;

    if (role === "hero") {
      expression = "tags:hero";
      maxResults = 1;
    }

    const result = await cloudinary.search
      .expression(expression)
      .with_field("context")
      .sort_by("public_id", "desc")
      .max_results(maxResults)
      .execute();

    // Return a single object for hero, otherwise an array
    res
      .status(200)
      .json(role === "hero" ? result.resources[0] : result.resources);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: `Failed to fetch images from Cloudinary: ${err}` });
  }
}

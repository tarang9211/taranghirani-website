import type { NextApiRequest, NextApiResponse } from 'next';
import cloudinary from '../../lib/cloudinary';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const result = await cloudinary.search
      .expression('folder=wildlife')
      .sort_by('public_id', 'desc')
      .max_results(30)
      .execute();

    res.status(200).json(result.resources);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Failed to fetch images from Cloudinary ${err}` });
  }
}

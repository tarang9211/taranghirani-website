import cloudinary from "../cloudinary";

interface HeroImage {
  /** HTTPS URL to the asset sized as uploaded */
  url: string;
  /** Alt text or generic fallback */
  alt: string;
}

export async function getHeroImage(): Promise<HeroImage | null> {
  const { resources } = await cloudinary.search
    .expression("tags:hero")
    .with_field("context")
    .max_results(1)
    .execute();
  const hero = resources.at(0);
  return {
    url: hero.secure_url,
    alt: hero.context?.custom?.alt ?? "Hero image",
  };
}

export interface GalleryImage {
  /** Cloudinary public_id (unique key) */
  id: string;
  /** HTTPS URL to the transformed or original asset */
  url: string;
}

export async function listImages(limit = 9): Promise<GalleryImage[]> {
  const { resources } = await cloudinary.search
    .expression('folder=wildlife')
    .sort_by('public_id', 'desc')
    .max_results(limit)
    .execute();

  return resources.map((r) => ({
    id: r.public_id,
    url: r.secure_url,
  }));
}
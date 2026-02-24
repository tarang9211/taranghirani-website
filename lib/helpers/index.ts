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
  /** Alt text from Cloudinary context or fallback */
  alt: string;
}

/**
 * For images to be displayed in the website they needs to be uploaded in the "widlife" folder on Cloudinary
 * @param limit
 * @param includeAll
 * @returns
 */
export async function listImages(
  limit = 9,
  includeAll = false,
): Promise<GalleryImage[]> {
  const expression = includeAll
    ? "folder=wildlife"
    : "tags:home-gallery AND folder=wildlife";

  let searchQuery = cloudinary.search
    .expression(expression)
    .with_field("context")
    .max_results(limit);

  // Only apply sorting for home-gallery images
  if (!includeAll) {
    searchQuery = searchQuery.sort_by(
      "metadata.home_gallery_sort_order",
      "asc",
    );
  }

  const { resources } = await searchQuery.execute();

  return resources.map((r) => ({
    id: r.public_id,
    url: r.secure_url,
    alt: r.context?.custom?.alt ?? "Wildlife photograph",
  }));
}

export interface FeaturedImage {
  url: string;
  alt: string;
}

export async function getFeaturedImage(): Promise<FeaturedImage | null> {
  const { resources } = await cloudinary.search
    .expression('metadata.featured="yes"')
    .max_results(1)
    .execute();

  if (!resources.length) return null;

  const img = resources[0];

  return {
    url: img.secure_url,
    alt: img.context?.custom?.alt ?? "Featured image",
  };
}

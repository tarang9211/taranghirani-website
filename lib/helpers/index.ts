import cloudinary from "../cloudinary";

/**
 * Inserts Cloudinary transforms (format, quality, optional width) into a secure_url.
 */
function optimizeUrl(url: string, width?: number): string {
  const transforms = width ? `f_auto,q_auto,w_${width}` : "f_auto,q_auto";
  return url.replace("/upload/", `/upload/${transforms}/`);
}

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
    url: optimizeUrl(hero.secure_url),
    alt: hero.context?.custom?.alt ?? "Hero image",
  };
}

export interface HeroImages {
  desktop: HeroImage;
  mobile: HeroImage;
}

export async function getHeroImages(): Promise<HeroImages> {
  const [desktopRes, mobileRes] = await Promise.all([
    cloudinary.search
      .expression("tags:hero-desktop")
      .with_field("context")
      .max_results(1)
      .execute(),
    cloudinary.search
      .expression("tags:hero-mobile")
      .with_field("context")
      .max_results(1)
      .execute(),
  ]);

  const desktopImg = desktopRes.resources.at(0);
  const mobileImg = mobileRes.resources.at(0);

  const toHeroImage = (img: any, width: number): HeroImage => ({
    url: optimizeUrl(img.secure_url, width),
    alt: img.context?.custom?.alt ?? "Hero image",
  });

  // Fall back to the legacy "hero" tag if specific tags are missing
  if (!desktopImg && !mobileImg) {
    const fallback = await getHeroImage();
    return { desktop: fallback!, mobile: fallback! };
  }

  const desktop = desktopImg ? toHeroImage(desktopImg, 1920) : null;
  const mobile = mobileImg ? toHeroImage(mobileImg, 800) : null;

  return {
    desktop: desktop ?? mobile!,
    mobile: mobile ?? desktop!,
  };
}

export interface GalleryImage {
  /** Cloudinary public_id (unique key) */
  id: string;
  /** HTTPS URL — optimized for lightbox / full view (w_1920) */
  url: string;
  /** HTTPS URL — smaller thumbnail for grid cards (w_800) */
  thumbnailUrl: string;
  /** Alt text from Cloudinary context or fallback */
  alt: string;
  /** Original image width in pixels */
  width: number;
  /** Original image height in pixels */
  height: number;
}

/**
 * For images to be displayed in the website they need to be uploaded in the "wildlife" folder on Cloudinary
 * @param limit
 * @returns
 */
export async function listImages(limit = 20): Promise<GalleryImage[]> {
  const expression = "folder=wildlife";

  const searchQuery = cloudinary.search
    .expression(expression)
    .with_field("context")
    .max_results(limit);

  const { resources } = await searchQuery.execute();

  return resources.map((r) => ({
    id: r.public_id,
    url: optimizeUrl(r.secure_url, 1920),
    thumbnailUrl: optimizeUrl(r.secure_url, 800),
    alt: r.context?.custom?.alt ?? "Wildlife photograph",
    width: r.width,
    height: r.height,
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
    url: optimizeUrl(img.secure_url),
    alt: img.context?.custom?.alt ?? "Featured image",
  };
}

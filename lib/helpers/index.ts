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

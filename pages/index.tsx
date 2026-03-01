import Hero from "../components/Hero";
import EditorialGallery from "../components/EditorialGallery";
import Statement from "../components/Statement";
import AboutMe from "../components/AboutMe";
import Head from "next/head";

import {
  getHeroImage,
  getFeaturedImage,
  listImages,
  GalleryImage,
} from "../lib/helpers";

export async function getStaticProps() {
  const hero = await getHeroImage();
  const images: GalleryImage[] = await listImages(5);
  const featuredImage = await getFeaturedImage();
  return {
    props: {
      url: hero.url,
      alt: hero.alt,
      images,
      featuredImage,
    },
  };
}

export default function Home({ url, alt, images, featuredImage }) {
  return (
    <div className="bg-charcoal text-parchment">
      <Hero src={url} alt={alt} />
      <EditorialGallery images={images} />
      <Statement />
      <AboutMe featuredImage={featuredImage} />
    </div>
  );
}

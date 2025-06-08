import Hero from "../components/Hero";
import MiniGallery from "../components/MiniGallery";
import AboutMe from "../components/AboutMe";

import {
  getHeroImage,
  getFeaturedImage,
  listImages,
  GalleryImage,
} from "../lib/helpers";

export async function getStaticProps() {
  const hero = await getHeroImage();
  const images: GalleryImage[] = await listImages(9);
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
    <>
      <Hero src={url} alt={alt} />
      <MiniGallery images={images} />
      <AboutMe featuredImage={featuredImage} />
    </>
  );
}

import Hero from "../components/Hero";
import MiniGallery from "../components/MiniGallery";

import { getHeroImage, listImages, GalleryImage } from "../lib/helpers";

export async function getStaticProps() {
  const hero = await getHeroImage();
  const images: GalleryImage[] = await listImages(9);
  return {
    props: {
      url: hero.url,
      alt: hero.alt,
      images,
    },
  };
}

export default function Home({ url, alt, images }) {
  console.log(images);
  return (
    <>
      <Hero src={url} alt={alt} />
      <MiniGallery images={images} />
    </>
  );
}

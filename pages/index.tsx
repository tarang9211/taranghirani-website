import Hero from "../components/Hero";

import { getHeroImage } from '../lib/helpers';

export async function getStaticProps() {
  const hero = await getHeroImage();
 return {
   props: {
    url: hero.url,
    alt: hero.alt,
   }
 }
}

export default function Home({ url, alt }) {
  return (
    <>
      <Hero src={url} alt={alt} />
    </>
  );
}

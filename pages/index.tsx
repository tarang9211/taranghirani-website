import Hero from "../components/Hero";
import ImageCarousel from "../components/ImageCarousel";
import SafariOffering from "../components/SafariOffering";
import InstagramCTA from "../components/InstagramCTA";
import AboutMe from "../components/AboutMe";
import Head from "next/head";

import {
  getHeroImages,
  getFeaturedImage,
  listImages,
  GalleryImage,
} from "../lib/helpers";

export async function getStaticProps() {
  const [heroImages, carouselImages, featuredImage] = await Promise.all([
    getHeroImages(),
    listImages(20),
    getFeaturedImage(),
  ]);

  return {
    props: {
      heroDesktop: heroImages.desktop,
      heroMobile: heroImages.mobile,
      carouselImages,
      featuredImage,
    },
    revalidate: 3600,
  };
}

export default function Home({
  heroDesktop,
  heroMobile,
  carouselImages,
  featuredImage,
}) {
  return (
    <div className="bg-charcoal text-parchment">
      <Hero
        desktopSrc={heroDesktop.url}
        mobileSrc={heroMobile.url}
        alt={heroDesktop.alt}
      />
      <SafariOffering />
      <ImageCarousel images={carouselImages} />
      <InstagramCTA />
      <AboutMe featuredImage={featuredImage} />
    </div>
  );
}

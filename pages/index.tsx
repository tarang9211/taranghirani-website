import Hero from "../components/Hero";
import ImageCarousel from "../components/ImageCarousel";
import SafariOffering from "../components/SafariOffering";
import UpcomingWorkshops from "../components/UpcomingWorkshops";
import EmailSignup from "../components/EmailSignup";
import AboutMe from "../components/AboutMe";
import Head from "next/head";

import {
  getHeroImages,
  listImages,
  GalleryImage,
} from "../lib/helpers";

export async function getStaticProps() {
  const [heroImages, carouselImages] = await Promise.all([
    getHeroImages(),
    listImages(20),
  ]);

  return {
    props: {
      heroDesktop: heroImages.desktop,
      heroMobile: heroImages.mobile,
      carouselImages,
    },
    revalidate: 3600,
  };
}

export default function Home({
  heroDesktop,
  heroMobile,
  carouselImages,
}) {
  return (
    <div className="bg-charcoal text-parchment">
      <Hero
        desktopSrc={heroDesktop.url}
        mobileSrc={heroMobile.url}
        alt={heroDesktop.alt}
      />
      <SafariOffering />
      <UpcomingWorkshops theme="dark" showViewAll concise />
      <EmailSignup variant="section" />
      <ImageCarousel images={carouselImages} />
      <AboutMe />
    </div>
  );
}

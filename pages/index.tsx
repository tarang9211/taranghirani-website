import Head from "next/head";
import Hero from "../components/Hero";
import ImageCarousel from "../components/ImageCarousel";
import SafariOffering from "../components/SafariOffering";
import UpcomingWorkshops from "../components/UpcomingWorkshops";
import AboutMe from "../components/AboutMe";

import { getHeroImages, listImages } from "../lib/helpers";

// Entity data for search: ties the name to wildlife photography and the
// Instagram profile. Claims here must stay factual (see PRODUCT.md).
const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  mainEntity: {
    "@type": "Person",
    name: "Tarang Hirani",
    jobTitle: "Wildlife Photographer",
    url: "https://www.taranghirani.com",
    image:
      "https://res.cloudinary.com/duiyn8wll/image/upload/w_1200,h_630,c_fill,f_jpg,q_auto/_Z9_20251231_TMH_2311_wm_wyiafz",
    sameAs: ["https://www.instagram.com/tarang.hirani/"],
    knowsAbout: [
      "Wildlife photography",
      "Tiger photography",
      "Safari photography",
    ],
    worksFor: { "@type": "Organization", name: "Asili Safaris" },
  },
};

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
  // The photography leads: work first, then who made it, then the trips.
  return (
    <div className="bg-charcoal text-parchment">
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
      </Head>
      <Hero
        desktopSrc={heroDesktop.url}
        mobileSrc={heroMobile.url}
        desktopAlt={heroDesktop.alt}
        mobileAlt={heroMobile.alt}
      />
      <ImageCarousel images={carouselImages} />
      <AboutMe />
      <UpcomingWorkshops theme="dark" showViewAll concise />
      <SafariOffering />
    </div>
  );
}

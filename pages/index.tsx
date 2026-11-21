import PageMeta from "../components/PageMeta";
import Hero from "../components/Hero";
import ImageCarousel from "../components/ImageCarousel";
import SafariOffering from "../components/SafariOffering";
import UpcomingWorkshops from "../components/UpcomingWorkshops";
import AboutMe from "../components/AboutMe";
import Testimonials from "../components/Testimonials";

import { getHeroImages, listImages } from "../lib/helpers";
import { featuredTestimonials } from "../lib/testimonials";
import {
  EMAIL,
  FOUNDER_JSON_LD,
  INSTAGRAM_URL,
  LOGO_URL,
  ORGANIZATION_ID,
  PHONE_TEL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
} from "../lib/constants";
import { jsonLdGraph } from "../lib/jsonLd";

// Entity data for search. The WebSite name is what Google shows as the site
// name in results; the Organization is the business, with the founder as the
// person behind it. Claims here must stay factual (see PRODUCT.md).
const JSON_LD = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    alternateName: "Asili",
    url: SITE_URL,
    publisher: { "@id": ORGANIZATION_ID },
  },
  {
    "@context": "https://schema.org",
    "@type": ["Organization", "TravelAgency"],
    "@id": ORGANIZATION_ID,
    name: SITE_NAME,
    slogan: SITE_TAGLINE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    logo: { "@type": "ImageObject", url: LOGO_URL },
    image:
      "https://res.cloudinary.com/duiyn8wll/image/upload/w_1200,h_630,c_fill,f_jpg,q_auto/_Z9_20251231_TMH_2311_wm_wyiafz",
    email: EMAIL,
    telephone: PHONE_TEL.replace("tel:", ""),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Pune",
      addressRegion: "Maharashtra",
      addressCountry: "IN",
    },
    areaServed: ["India", "Africa"],
    sameAs: [INSTAGRAM_URL],
    knowsAbout: [
      "Wildlife photography",
      "Wildlife safaris",
      "Tiger photography",
      "Photography workshops",
    ],
    founder: FOUNDER_JSON_LD,
  },
];

const PAGE_TITLE = "Wildlife Expeditions in India and Africa";
const DESCRIPTION =
  "Small-group wildlife photography expeditions in India and Africa, led by photographer Tarang Hirani, with hands-on teaching in the field.";

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
      testimonials: featuredTestimonials(3),
    },
    revalidate: 3600,
  };
}

export default function Home({
  heroDesktop,
  heroMobile,
  carouselImages,
  testimonials,
}) {
  // The photography leads: work first, then who made it, then the trips.
  return (
    <div className="bg-charcoal text-parchment">
      <PageMeta
        title={PAGE_TITLE}
        description={DESCRIPTION}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdGraph(JSON_LD) }}
        />
      </PageMeta>
      <Hero
        desktopSrc={heroDesktop.url}
        mobileSrc={heroMobile.url}
        desktopAlt={heroDesktop.alt}
        mobileAlt={heroMobile.alt}
      />
      <ImageCarousel images={carouselImages} />
      <AboutMe />
      <UpcomingWorkshops theme="dark" showViewAll concise />
      <Testimonials items={testimonials} />
      <SafariOffering />
    </div>
  );
}

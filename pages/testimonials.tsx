import React, { useMemo, useState } from "react";
import type { GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import FadeIn from "../components/FadeIn";
import TestimonialAvatar from "../components/TestimonialAvatar";
import { WHATSAPP_URL } from "../lib/constants";
import {
  hasTestimonials,
  publishedTestimonials,
  testimonialRegions,
  type Region,
  type Testimonial,
} from "../lib/testimonials";

const CLOUDINARY_BASE =
  "https://res.cloudinary.com/duiyn8wll/image/upload/f_auto,q_auto";

const HERO_IMAGE = `${CLOUDINARY_BASE}/DSC_0959_hshxmc`;
const HERO_ALT =
  "A male lion mid-roar standing over a lioness lying in the grass of an open savannah";

const PAGE_URL = "https://www.taranghirani.com/testimonials";
const PAGE_TITLE = "Guest Stories | Tarang Hirani";
const PAGE_DESCRIPTION =
  "What guests said after photographing with Tarang Hirani in India and Africa. Six people or fewer, personally led, teaching included.";
const OG_IMAGE =
  "https://res.cloudinary.com/duiyn8wll/image/upload/w_1200,h_630,c_fill,f_jpg,q_auto/DSC_0959_hshxmc";

// No Review/AggregateRating on purpose: self-serving reviews are ignored by
// search engines and PRODUCT.md forbids implied proof.
const JSON_LD = [
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Guest Stories",
    url: PAGE_URL,
    description: PAGE_DESCRIPTION,
    about: {
      "@type": "Person",
      name: "Tarang Hirani",
      url: "https://www.taranghirani.com",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.taranghirani.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Guest Stories",
        item: PAGE_URL,
      },
    ],
  },
];

type Filter = "All" | Region;

interface Props {
  testimonials: Testimonial[];
  regions: Region[];
}

// Until at least one guest story is published, next.config.js redirects this
// route to the home page (a redirect cannot be returned from getStaticProps
// at build time). This 404 is the fallback if that redirect is ever removed.
// The nav item and the home block are hidden in the same state, and
// next-sitemap.config.js leaves the route out of the sitemap.
export const getStaticProps: GetStaticProps<Props> = async () => {
  if (!hasTestimonials()) {
    return { notFound: true };
  }
  return {
    props: {
      testimonials: publishedTestimonials(),
      regions: testimonialRegions(),
    },
  };
};

const ARROW_LINK =
  "group inline-flex items-center gap-3 text-xs font-medium uppercase tracking-cta text-white/70 transition-colors duration-300 hover:text-sage focus-visible:text-sage focus-visible:outline-none";

function Arrow() {
  return (
    <span
      aria-hidden
      className="inline-block transition-transform duration-300 group-hover:translate-x-1"
    >
      &rarr;
    </span>
  );
}

export default function TestimonialsPage({ testimonials, regions }: Props) {
  const [filter, setFilter] = useState<Filter>("All");

  const items = useMemo(
    () =>
      filter === "All"
        ? testimonials
        : testimonials.filter((t) => t.region === filter),
    [filter, testimonials],
  );

  // With a single region, "All / India" would be redundant: show the count only.
  const showFilters = regions.length >= 2;
  const filters: Filter[] = ["All", ...regions];
  const count = items.length;

  return (
    <div className="bg-charcoal text-parchment">
      <Head>
        <title>{PAGE_TITLE}</title>
        <meta name="description" content={PAGE_DESCRIPTION} />
        <meta property="og:title" content={PAGE_TITLE} key="og:title" />
        <meta
          property="og:description"
          content={PAGE_DESCRIPTION}
          key="og:description"
        />
        <meta property="og:url" content={PAGE_URL} key="og:url" />
        <meta property="og:image" content={OG_IMAGE} key="og:image" />
        <meta name="twitter:title" content={PAGE_TITLE} key="twitter:title" />
        <meta
          name="twitter:description"
          content={PAGE_DESCRIPTION}
          key="twitter:description"
        />
        <meta name="twitter:image" content={OG_IMAGE} key="twitter:image" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
      </Head>

      {/* HERO */}
      <section className="relative">
        <div className="relative min-h-[64vh] w-full overflow-hidden">
          <Image
            priority
            src={HERO_IMAGE}
            alt={HERO_ALT}
            fill
            sizes="100vw"
            className="animate-slow-zoom object-cover object-[60%_center] md:object-center"
          />
          {/* Gradient overlay for legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/30 to-charcoal/10" />

          {/* Text, anchored to bottom-left */}
          <div className="absolute inset-0 flex items-end">
            <div className="w-full px-6 pb-14 md:px-12 md:pb-20 lg:px-20 lg:pb-24">
              <div className="max-w-3xl">
                <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-sage">
                  Guest stories
                </p>
                <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl">
                  In their words.
                </h1>
                <p className="mt-6 max-w-xl text-base leading-[1.75] text-white/85 md:mt-8 md:text-lg">
                  Every group is six people or fewer, so I get to know everyone
                  in the jeep. This is what they said once they were home and
                  going through their frames.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TOOLBAR + STORIES */}
      <section className="mx-auto max-w-5xl px-6 pb-8 pt-10 md:px-12 md:pt-14 lg:px-20">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-8">
          {showFilters ? (
            <div
              role="group"
              aria-label="Filter stories by region"
              className="flex flex-wrap gap-3"
            >
              {filters.map((f) => {
                const active = f === filter;
                return (
                  <button
                    key={f}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setFilter(f)}
                    className={`border px-5 py-2 text-xs font-medium uppercase tracking-cta transition-colors duration-300 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-sage ${
                      active
                        ? "border-sage bg-sage text-charcoal"
                        : "border-white/30 text-white/70 hover:border-sage hover:text-sage"
                    }`}
                  >
                    {f}
                  </button>
                );
              })}
            </div>
          ) : (
            <span />
          )}
          <p
            aria-live="polite"
            className="text-xs font-medium uppercase tracking-eyebrow text-white/60"
          >
            {count} {count === 1 ? "story" : "stories"}
          </p>
        </div>

        {count > 0 ? (
          <div className="divide-y divide-white/10 border-t border-white/10">
            {items.map((t) => (
              <FadeIn key={t.id}>
                <article
                  id={t.id}
                  className="grid scroll-mt-6 gap-8 py-12 md:grid-cols-3 md:gap-12 md:py-16"
                >
                  <div className="flex flex-col gap-5 md:col-span-1">
                    <TestimonialAvatar src={t.photo} name={t.name} size={96} />
                    <div>
                      <h2 className="font-display text-xl font-semibold tracking-tight text-white">
                        {t.name}
                      </h2>
                      <p className="mt-2 text-xs font-medium uppercase tracking-eyebrow text-white/60">
                        {t.place}
                      </p>
                      <p className="mt-1 text-sm text-white/60">{t.when}</p>
                    </div>
                    {t.workshopHref && (
                      <Link href={t.workshopHref} className={ARROW_LINK}>
                        View workshop
                        <Arrow />
                      </Link>
                    )}
                  </div>
                  <blockquote className="md:col-span-2">
                    <p className="font-display text-2xl leading-[1.35] text-white [text-wrap:pretty] md:text-3xl">
                      &ldquo;{t.short}&rdquo;
                    </p>
                    <p className="mt-6 text-base leading-[1.75] text-white/80 [text-wrap:pretty] md:text-lg">
                      {t.full}
                    </p>
                  </blockquote>
                </article>
              </FadeIn>
            ))}
          </div>
        ) : (
          <p className="border-t border-white/10 py-12 text-center text-base text-white/60">
            No stories from this region yet.
          </p>
        )}
      </section>

      {/* ENQUIRY */}
      <section className="border-t border-white/10 py-24 md:py-32">
        <div className="mx-auto flex max-w-5xl flex-wrap items-end justify-between gap-10 px-6 md:px-12 lg:px-20">
          <FadeIn className="max-w-xl">
            <p className="text-xs font-medium uppercase tracking-eyebrow text-sage">
              Enquire
            </p>
            <h2 className="mt-6 font-display text-3xl font-semibold tracking-tight text-white md:text-4xl">
              One message. The rest is arranged.
            </h2>
            <p className="mt-6 text-base leading-[1.75] text-white/80">
              I read every message and reply within 48 hours.
            </p>
          </FadeIn>
          <FadeIn delay={120}>
            <div className="flex flex-col gap-4">
              <Link href="/destinations/panna" className={ARROW_LINK}>
                Claim your spot in Panna
                <Arrow />
              </Link>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={ARROW_LINK}
              >
                Message on WhatsApp
                <Arrow />
              </a>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}

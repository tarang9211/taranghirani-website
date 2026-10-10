import { useState } from "react";
import type { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Phone, MessageCircle, Mail, Instagram } from "lucide-react";
import FadeIn from "../../components/FadeIn";
import ContactForm from "../../components/ContactForm";
import {
  PHONE_NUMBER_DISPLAY,
  PHONE_TEL,
  EMAIL,
  EMAIL_MAILTO,
  INSTAGRAM_URL,
  WHATSAPP_URL,
} from "../../lib/constants";
import {
  DESTINATIONS,
  visibleDepartures,
  formatDateRange,
  formatDateRangeLong,
} from "../../lib/workshops";
import type { Departure, Destination } from "../../lib/workshops";

// Every destination gets a page, even with no visible departures: it falls
// back to the "No upcoming dates" state rather than a 404.
export const getStaticPaths: GetStaticPaths = async () => ({
  paths: DESTINATIONS.map((d) => ({ params: { slug: d.slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<{ dest: Destination }> = async ({
  params,
}) => ({
  props: { dest: DESTINATIONS.find((d) => d.slug === params?.slug)! },
});

// Compact, consistent heading + label styles for the dense brochure body.
const SUBHEAD =
  "font-display text-xl font-semibold tracking-tight text-charcoal md:text-2xl";
const MINI_LABEL =
  "text-[11px] font-medium uppercase tracking-[0.25em] text-sage";
const BODY_COPY = "text-base leading-[1.8] text-smoke";

// Renders [text](/path) inside page copy as an internal link.
function RichText({ text }: { text: string }) {
  // split with capture groups yields [plain, label, href, plain, ...]
  const parts = text.split(/\[([^\]]+)\]\(([^)]+)\)/);
  return (
    <>
      {parts.map((part, i) =>
        i % 3 === 1 ? (
          <Link
            key={i}
            href={parts[i + 1]}
            className="underline decoration-sage/40 underline-offset-4 transition-colors duration-300 hover:text-sage"
          >
            {part}
          </Link>
        ) : i % 3 === 2 ? null : (
          part
        ),
      )}
    </>
  );
}

function ClaimButton({ className = "" }: { className?: string }) {
  return (
    <a
      href="#enquire"
      className={`group inline-flex items-center justify-center gap-3 border border-sage bg-sage px-8 py-4 text-[11px] font-medium uppercase tracking-[0.2em] text-charcoal transition-all duration-300 hover:bg-transparent hover:text-sage ${className}`}
    >
      Claim your spot
      <span
        aria-hidden
        className="inline-block transition-transform duration-300 group-hover:translate-x-1"
      >
        &rarr;
      </span>
    </a>
  );
}

export default function DestinationWorkshopPage({
  dest,
}: {
  dest: Destination;
}) {
  const { name, page } = dest;
  // Departures shown on this page — expired ones drop out everywhere.
  const departures = visibleDepartures(dest);
  const nextDeparture = departures.find((d) => d.status === "open");

  // The departure a "Enquire about these dates" click refers to. Defaults to
  // the soonest open departure so the form is never date-less.
  const [enquiry, setEnquiry] = useState<Departure | undefined>(
    nextDeparture ?? departures[0],
  );

  const pageUrl = `https://www.taranghirani.com/destinations/${dest.slug}`;
  // Full region name in title + h1: searchers type "Madhya Pradesh", not "MP".
  const pageTitle = `Wildlife Photography Workshop in ${page.fullLocation}`;
  // Snippet lists only the next bookable date — sold-out departures stay out
  // of the SERP, and the string stays under ~155 chars as departures
  // accumulate.
  const pageDescription =
    page.metaLead +
    (nextDeparture
      ? ` Next departure: ${formatDateRange(nextDeparture)}.`
      : "") +
    " Limited seats.";

  // Carries through to the enquiry notification so it's clearly a lead for
  // this destination and a specific departure.
  const subjectFor = (dep: Departure) =>
    `${name} Wildlife Photography Workshop — ${formatDateRange(dep)}`;
  const messageFor = (dep: Departure) =>
    `Hi Tarang, I'd like to enquire about the ${name} wildlife photography workshop (${formatDateRange(dep)}). Please share availability and next steps.`;
  const whatsappHref =
    `${WHATSAPP_URL}?text=` +
    encodeURIComponent(
      enquiry
        ? `I'm interested in the ${name} workshop (${formatDateRange(enquiry)})`
        : `I'm interested in the ${name} workshop`,
    );

  const { event } = page;
  // One schema.org Event per visible departure, each with its own identity —
  // identical name/url/description across Events makes them indistinguishable
  // to Google. Start/end times match the Day 1 arrival and last-day transfer.
  const eventsJsonLd = departures.map((dep) => ({
    "@context": "https://schema.org",
    "@type": "Event",
    "@id": `${pageUrl}#${dep.id}`,
    name: `Wildlife Photography Workshop — ${name} (${formatDateRange(dep)})`,
    description: dep.seasonNote ?? pageDescription,
    startDate: `${dep.startDate}T${event.startTime}`,
    endDate: `${dep.endDate}T${event.endTime}`,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    maximumAttendeeCapacity: dep.maxParticipants,
    image: page.ogImage,
    url: `${pageUrl}#${dep.id}`,
    location: {
      "@type": "Place",
      name: event.placeName,
      address: {
        "@type": "PostalAddress",
        addressLocality: event.addressLocality,
        addressRegion: event.addressRegion,
        addressCountry: event.addressCountry,
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: event.latitude,
        longitude: event.longitude,
      },
    },
    organizer: {
      "@type": "Person",
      name: "Tarang Hirani",
      url: "https://www.taranghirani.com",
    },
    performer: {
      "@type": "Person",
      name: "Tarang Hirani",
      url: "https://www.taranghirani.com",
    },
    offers: {
      "@type": "Offer",
      availability:
        dep.status === "sold-out"
          ? "https://schema.org/SoldOut"
          : "https://schema.org/LimitedAvailability",
      url: `${pageUrl}#${dep.id}`,
      validFrom: event.enquiriesOpen,
    },
  }));

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Workshops",
        item: "https://www.taranghirani.com/destinations",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: page.fullLocation,
        item: pageUrl,
      },
    ],
  };

  // Dates intentionally left out: they change per departure and live in the
  // "Dates & availability" section — this card is for the evergreen facts.
  const facts = [
    ...page.facts,
    {
      label: "Group size",
      value: `Limited to ${departures[0]?.maxParticipants ?? 6} participants`,
    },
  ];

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} key="og:title" />
        <meta
          property="og:description"
          content={pageDescription}
          key="og:description"
        />
        <meta property="og:url" content={pageUrl} key="og:url" />
        <meta property="og:image" content={page.ogImage} key="og:image" />
        <meta name="twitter:title" content={pageTitle} key="twitter:title" />
        <meta
          name="twitter:description"
          content={pageDescription}
          key="twitter:description"
        />
        <meta
          name="twitter:image"
          content={page.ogImage}
          key="twitter:image"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([...eventsJsonLd, breadcrumbJsonLd]),
          }}
        />
      </Head>

      {/* HERO */}
      <section className="relative">
        <div className="relative min-h-[56vh] w-full overflow-hidden md:h-[68vh] md:min-h-0">
          {/* shortcut: mobile crop tuned for the Panna frame, add a per-destination field if another hero crops badly */}
          <Image
            priority
            src={dest.image}
            alt={dest.imageAlt}
            fill
            sizes="100vw"
            className="animate-slow-zoom object-cover object-[62%_bottom] md:object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/35 to-charcoal/10" />

          <div className="absolute inset-0 flex items-end">
            <div className="w-full px-6 pb-12 md:px-12 md:pb-16 lg:px-20">
              <div className="max-w-3xl">
                <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.3em] text-sage">
                  A field workshop
                </p>
                <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-white md:text-5xl lg:text-6xl">
                  Wildlife Photography Workshop — {page.fullLocation}
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-[1.7] text-white/85 md:text-lg">
                  {page.heroLine}
                </p>
                {nextDeparture && (
                  <a
                    href={`#${nextDeparture.id}`}
                    className="mt-3 inline-block text-sm text-white/85 underline decoration-sage/60 underline-offset-4 transition-colors duration-300 hover:text-sage md:text-base"
                  >
                    Next departure: {formatDateRangeLong(nextDeparture)}
                  </a>
                )}
                <div className="mt-8">
                  <ClaimButton />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BODY — content + sticky essentials card */}
      <section className="bg-paper py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-6 md:px-12 lg:px-16">
          <div className="grid gap-x-12 gap-y-10 md:grid-cols-[1fr_19rem] lg:grid-cols-[1fr_21rem] lg:gap-x-16">
            {/* MAIN CONTENT */}
            <div className="order-2 md:order-1">
              <FadeIn>
                <div className="space-y-12 md:space-y-14">
                  {/* Intro */}
                  <div className={`space-y-4 ${BODY_COPY} md:text-lg`}>
                    {page.intro.map((p) => (
                      <p key={p}>
                        <RichText text={p} />
                      </p>
                    ))}
                  </div>

                  {/* Dates & availability */}
                  <div className="border-t border-charcoal/10 pt-12">
                    <h2 className={SUBHEAD}>Dates &amp; availability</h2>
                    {departures.length > 0 ? (
                      <div className="mt-6 grid gap-5 sm:grid-cols-2">
                        {departures.map((dep) => {
                          const soldOut = dep.status === "sold-out";
                          return (
                            <div
                              key={dep.id}
                              id={dep.id}
                              className="scroll-mt-24 border border-charcoal/10 bg-white p-6"
                            >
                              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                                <h3 className="font-display text-lg font-semibold tracking-tight text-charcoal">
                                  {formatDateRange(dep)}
                                </h3>
                                {soldOut && (
                                  <span className="border border-charcoal/20 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.15em] text-smoke">
                                    Sold out
                                  </span>
                                )}
                              </div>
                              {dep.seasonNote && (
                                <p className="mt-3 text-sm leading-[1.7] text-smoke">
                                  {dep.seasonNote}
                                </p>
                              )}
                              <p className="mt-3 text-xs uppercase tracking-[0.12em] text-smoke/70">
                                Limited to {dep.maxParticipants} participants
                              </p>
                              {!soldOut && (
                                <a
                                  href="#enquire"
                                  onClick={() => setEnquiry(dep)}
                                  className="group mt-5 inline-flex items-center gap-2 border-b border-charcoal/30 pb-1 text-[11px] font-medium uppercase tracking-[0.2em] text-charcoal transition-colors duration-300 hover:border-sage hover:text-sage"
                                >
                                  Enquire about these dates
                                  <span
                                    aria-hidden
                                    className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                                  >
                                    &rarr;
                                  </span>
                                </a>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className={`mt-4 ${BODY_COPY}`}>
                        No upcoming dates at the moment — enquire below and
                        I&apos;ll let you know when the next departure opens.
                      </p>
                    )}
                  </div>

                  {/* Why <destination> */}
                  <div className="border-t border-charcoal/10 pt-12">
                    <h2 className={SUBHEAD}>Why {name}</h2>
                    <div className={`mt-4 space-y-4 ${BODY_COPY}`}>
                      {page.why.map((p) => (
                        <p key={p}>
                          <RichText text={p} />
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* How the days run */}
                  <div className="border-t border-charcoal/10 pt-12">
                    <h2 className={SUBHEAD}>How the days run</h2>
                    {page.howTheDaysRun.map((p) => (
                      <p key={p} className={`mt-4 ${BODY_COPY}`}>
                        <RichText text={p} />
                      </p>
                    ))}
                  </div>

                  {/* Itinerary — one for every departure: day labels are
                      generic, the calendar dates live on the cards above. */}
                  <div className="border-t border-charcoal/10 pt-12">
                    <h2 className={SUBHEAD}>The itinerary</h2>
                    <div className="mt-6 space-y-7">
                      {page.itinerary.map((block) => (
                        <div key={block.day}>
                          <div className="flex flex-wrap items-baseline gap-x-3">
                            <span className="font-display text-sm tracking-[0.15em] text-sage">
                              {block.day}
                            </span>
                            <h3 className="font-display text-lg font-semibold tracking-tight text-charcoal">
                              {block.title}
                            </h3>
                          </div>
                          <ul className="mt-3 space-y-1.5">
                            {block.items.map((item) => (
                              <li
                                key={`${item.time}-${item.text}`}
                                className="grid grid-cols-[4.5rem_1fr] gap-3 text-sm leading-[1.6] text-smoke"
                              >
                                <span className="text-sage/90">
                                  {item.time}
                                </span>
                                <span>{item.text}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Inclusions */}
                  <div className="border-t border-charcoal/10 pt-12">
                    <h2 className={SUBHEAD}>Inclusions</h2>
                    <div className="mt-6 grid gap-x-10 gap-y-8 sm:grid-cols-2">
                      <div>
                        <p className={MINI_LABEL}>Included</p>
                        <ul className="mt-4 space-y-2 text-sm leading-[1.6] text-smoke">
                          {page.included.map((item) => (
                            <li key={item} className="flex gap-2.5">
                              <span aria-hidden className="text-sage">
                                —
                              </span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className={MINI_LABEL}>Not included</p>
                        <ul className="mt-4 space-y-2 text-sm leading-[1.6] text-smoke">
                          {page.notIncluded.map((item) => (
                            <li key={item} className="flex gap-2.5">
                              <span aria-hidden className="text-smoke/40">
                                —
                              </span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Good to know */}
                  <div className="border-t border-charcoal/10 pt-12">
                    <h2 className={SUBHEAD}>Good to know</h2>
                    <ul className="mt-5 space-y-2.5 text-sm leading-[1.6] text-smoke">
                      {page.goodToKnow.map((item) => (
                        <li key={item} className="flex gap-2.5">
                          <span aria-hidden className="text-sage">
                            —
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Getting there */}
                  <div className="border-t border-charcoal/10 pt-12">
                    <h2 className={SUBHEAD}>Getting there</h2>
                    <p className={`mt-4 ${BODY_COPY}`}>
                      <RichText text={page.gettingThere.intro} />
                    </p>
                    <ul className="mt-4 space-y-2.5 text-sm leading-[1.6] text-smoke">
                      {page.gettingThere.routes.map((route) => (
                        <li key={route.label} className="flex gap-3">
                          <span
                            aria-hidden
                            className="font-display text-[11px] uppercase tracking-[0.2em] text-sage"
                          >
                            {route.label}
                          </span>
                          <span>{route.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </FadeIn>
            </div>

            {/* ESSENTIALS CARD — sticky, keeps the enquiry CTA in view */}
            <aside className="order-1 md:order-2">
              <div className="border border-charcoal/10 bg-white p-6 md:sticky md:top-28 md:p-7">
                <p className={MINI_LABEL}>The essentials</p>
                <dl className="mt-5 divide-y divide-charcoal/10">
                  {facts.map((f) => (
                    <div
                      key={f.label}
                      className="flex items-baseline justify-between gap-4 py-2.5"
                    >
                      <dt className="text-xs uppercase tracking-[0.12em] text-smoke/70">
                        {f.label}
                      </dt>
                      <dd className="text-right text-sm font-medium text-charcoal">
                        {f.value}
                      </dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-5 border-t border-charcoal/10 pt-5">
                  <p className="font-display text-2xl font-semibold tracking-tight text-charcoal">
                    {page.price}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-smoke">
                    {page.priceNote}
                  </p>
                </div>
                <div className="mt-5 border border-sage/40 bg-sage/10 p-4">
                  <p className={MINI_LABEL}>Reserve your seat</p>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-charcoal">
                    Pay a 20% advance to confirm your seat.
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-smoke">
                    The balance is due before the workshop.
                  </p>
                </div>
                <ClaimButton className="mt-6 w-full" />
                <p className="mt-3 text-center text-[11px] uppercase tracking-[0.15em] text-smoke/70">
                  Limited seats · first come, first served
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ENQUIRE */}
      <section
        id="enquire"
        className="scroll-mt-24 border-t border-charcoal/10 bg-paper py-20 md:py-28"
      >
        <div className="mx-auto max-w-2xl px-6 md:px-12">
          <FadeIn>
            <div className="text-center">
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-sage">
                Claim your spot
              </p>
              <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-charcoal md:text-4xl lg:text-5xl">
                Enquire about this workshop.
              </h2>
              <p className="mt-6 text-base leading-[1.8] text-smoke md:text-lg">
                Seats are limited and offered on a first-come, first-served
                basis — reach out early to secure yours. I read every message
                and reply within 48 hours.
              </p>
            </div>

            <div className="mt-12 md:mt-14">
              {/* key remounts the form when the visitor picks a different
                  departure — defaultMessage feeds an uncontrolled textarea, so
                  a remount is the only way the prefill can change. Anything
                  already typed is discarded, which the date-switch implies. */}
              <ContactForm
                key={enquiry?.id ?? "no-departure"}
                source="workshops"
                theme="light"
                subject={
                  enquiry
                    ? subjectFor(enquiry)
                    : `${name} Wildlife Photography Workshop`
                }
                defaultMessage={
                  enquiry
                    ? messageFor(enquiry)
                    : `Hi Tarang, I'd like to enquire about the next ${name} wildlife photography workshop. Please share upcoming dates and next steps.`
                }
              />
            </div>
          </FadeIn>

          <FadeIn delay={200}>
            <div className="mt-14 flex items-center justify-center gap-4 md:mt-16">
              <span className="h-px w-12 bg-charcoal/10" />
              <span className="text-[11px] uppercase tracking-[0.2em] text-smoke">
                Or reach out directly
              </span>
              <span className="h-px w-12 bg-charcoal/10" />
            </div>

            <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 md:mt-10 md:gap-x-8">
              <li>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Chat on WhatsApp at ${PHONE_NUMBER_DISPLAY} about the ${name} workshop`}
                  className="group inline-flex items-center gap-2 text-xs text-smoke transition-colors duration-300 hover:text-sage md:text-sm"
                >
                  <MessageCircle size={14} strokeWidth={1.5} />
                  <span className="font-display uppercase tracking-[0.15em]">
                    WhatsApp
                  </span>
                  <span className="tracking-wide">{PHONE_NUMBER_DISPLAY}</span>
                </a>
              </li>
              <li>
                <a
                  href={PHONE_TEL}
                  aria-label={`Call ${PHONE_NUMBER_DISPLAY}`}
                  className="group inline-flex items-center gap-2 text-xs text-smoke transition-colors duration-300 hover:text-sage md:text-sm"
                >
                  <Phone size={14} strokeWidth={1.5} />
                  <span className="font-display uppercase tracking-[0.15em]">
                    Call
                  </span>
                  <span className="tracking-wide">{PHONE_NUMBER_DISPLAY}</span>
                </a>
              </li>
              <li>
                <a
                  href={EMAIL_MAILTO}
                  aria-label={`Email ${EMAIL}`}
                  className="group inline-flex items-center gap-2 text-xs text-smoke transition-colors duration-300 hover:text-sage md:text-sm"
                >
                  <Mail size={14} strokeWidth={1.5} />
                  <span className="font-display uppercase tracking-[0.15em]">
                    Email
                  </span>
                  <span className="tracking-wide">{EMAIL}</span>
                </a>
              </li>
              <li>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow on Instagram"
                  className="group inline-flex items-center gap-2 text-xs text-smoke transition-colors duration-300 hover:text-sage md:text-sm"
                >
                  <Instagram size={14} strokeWidth={1.5} />
                  <span className="font-display uppercase tracking-[0.15em]">
                    Instagram
                  </span>
                  <span className="tracking-wide">@tarang.hirani</span>
                </a>
              </li>
            </ul>
          </FadeIn>
        </div>
      </section>
    </>
  );
}

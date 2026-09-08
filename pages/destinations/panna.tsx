import { useState } from "react";
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
} from "../../lib/workshops";
import type { Departure } from "../../lib/workshops";

const dest = DESTINATIONS.find((d) => d.slug === "panna")!;
// Departures shown on this page — expired ones drop out everywhere.
const departures = visibleDepartures(dest);

const CLOUDINARY_BASE =
  "https://res.cloudinary.com/duiyn8wll/image/upload/f_auto,q_auto";

const IMG = {
  // Single honest central-India cover frame — not represented as Panna.
  hero: `${CLOUDINARY_BASE}/_Z9_20250508_TMH_8461_wm_vwr6rk`,
};

const PAGE_URL = "https://www.taranghirani.com/destinations/panna";
const PAGE_TITLE = "Wildlife Photography Workshop — Panna, MP | Tarang Hirani";
const PAGE_DESCRIPTION = `A 4-day wildlife photography workshop in Panna, Madhya Pradesh — 6 safaris with in-field guidance. Departures: ${departures
  .map(formatDateRange)
  .join(" and ")}. Limited seats.`;
const OG_IMAGE =
  "https://res.cloudinary.com/duiyn8wll/image/upload/w_1200,h_630,c_fill,f_jpg,q_auto/_Z9_20260212_100758_TMH_website_s3qioq";

// Carries through to the enquiry notification so it's clearly a Panna lead
// for a specific departure.
const subjectFor = (dep: Departure) =>
  `Panna Wildlife Photography Workshop — ${formatDateRange(dep)}`;
const messageFor = (dep: Departure) =>
  `Hi Tarang, I'd like to enquire about the Panna wildlife photography workshop (${formatDateRange(dep)}). Please share availability and next steps.`;
const whatsappHrefFor = (dep?: Departure) =>
  `${WHATSAPP_URL}?text=` +
  encodeURIComponent(
    dep
      ? `I'm interested in the Panna workshop (${formatDateRange(dep)})`
      : "I'm interested in the Panna workshop",
  );

// When enquiries opened, for the JSON-LD offers.
const ENQUIRIES_OPEN = "2026-01-01";

// One schema.org Event per visible departure.
const JSON_LD = departures.map((dep) => ({
  "@context": "https://schema.org",
  "@type": "Event",
  name: "Wildlife Photography Workshop — Panna",
  description: PAGE_DESCRIPTION,
  startDate: dep.startDate,
  endDate: dep.endDate,
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  eventStatus: "https://schema.org/EventScheduled",
  image: OG_IMAGE,
  url: PAGE_URL,
  location: {
    "@type": "Place",
    name: "Panna Tiger Reserve",
    address: {
      "@type": "PostalAddress",
      addressRegion: "Madhya Pradesh",
      addressCountry: "IN",
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
    url: `${PAGE_URL}#${dep.id}`,
    validFrom: ENQUIRIES_OPEN,
  },
}));

// One itinerary serves every departure: day labels are generic, and the
// actual calendar dates live on the departure cards above it.
const ITINERARY: {
  day: string;
  title: string;
  items: { time: string; text: string }[];
}[] = [
  {
    day: "Day 1",
    title: "Arrival",
    items: [
      {
        time: "12:15 pm",
        text: "Arrive at Khajuraho Airport (HJR), transfer to Naaharbagh",
      },
      {
        time: "2:00 pm",
        text: "Lunch at Naaharbagh: an introduction to Panna and its history, then camera setup",
      },
      { time: "3:00 pm", text: "Evening safari" },
      { time: "7:00 pm", text: "Return and freshen up" },
      { time: "8:00 pm", text: "Briefing & dinner" },
      { time: "9:00 pm", text: "Lights out" },
    ],
  },
  {
    day: "Days 2–3",
    title: "Workshop",
    items: [
      { time: "4:30 am", text: "Wake up, morning coffee/tea" },
      { time: "5:00 am", text: "Morning safari, with breakfast in the bush" },
      { time: "11:30 am", text: "Return to Naaharbagh for lunch" },
      { time: "3:00 pm", text: "Evening safari" },
      { time: "7:00 pm", text: "Return and freshen up" },
      { time: "8:00 pm", text: "Photography & post-processing session" },
      { time: "9:00 pm", text: "Dinner & lights out" },
    ],
  },
  {
    day: "Day 4",
    title: "Morning safari & departure",
    items: [
      { time: "4:30 am", text: "Wake up, morning coffee/tea" },
      { time: "5:00 am", text: "Morning safari, with breakfast in the bush" },
      { time: "10:30 am", text: "Return to Naaharbagh, freshen up & check out" },
      {
        time: "11:30 am",
        text: "Transfer to Khajuraho Airport (HJR). Trip concludes.",
      },
    ],
  },
];

const INCLUDED = [
  "Accommodation at Naaharbagh",
  "Airport transfers",
  "All meals (3 per day)",
  "All safaris",
  "On-field photography guidance",
  "Post-processing sessions",
];

const NOT_INCLUDED = [
  "Air fare",
  "Camera fees (paid at the park gate)",
  "Beverages, alcoholic and non-alcoholic",
  "Personal expenses such as laundry",
  "Anything not listed under inclusions",
];

const GOOD_TO_KNOW = [
  "Limited to a total of six participants, offered on a first-come, first-served basis",
  "Your seat is confirmed only once a 20% advance is paid",
  "Rooms on a twin-sharing basis (single room available at extra cost)",
  "Safari permit fees are subject to revision; any changes will be communicated promptly",
];

// Dates intentionally left out: they change per departure and live in the
// "Dates & availability" section — this card is for the evergreen facts.
const FACTS = [
  { label: "Length", value: "3 nights / 4 days" },
  { label: "Safaris", value: "6 across the trip" },
  { label: "Base", value: "Naaharbagh, Panna" },
  { label: "Nearest airport", value: "Khajuraho (HJR)" },
  {
    label: "Group size",
    value: `Limited to ${departures[0]?.maxParticipants ?? 6} participants`,
  },
];

// Compact, consistent heading + label styles for the dense brochure body.
const SUBHEAD =
  "font-display text-xl font-semibold tracking-tight text-charcoal md:text-2xl";
const MINI_LABEL =
  "text-[11px] font-medium uppercase tracking-[0.25em] text-sage";
const BODY_COPY = "text-base leading-[1.8] text-smoke";

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

export default function PannaWorkshopPage() {
  // The departure a "Enquire about these dates" click refers to. Defaults to
  // the soonest open departure so the form is never date-less.
  const [enquiry, setEnquiry] = useState<Departure | undefined>(
    departures.find((d) => d.status === "open") ?? departures[0],
  );

  return (
    <>
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
        {departures.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
          />
        )}
      </Head>

      {/* HERO */}
      <section className="relative">
        <div className="relative min-h-[56vh] w-full overflow-hidden md:h-[68vh] md:min-h-0">
          <Image
            priority
            src={IMG.hero}
            alt="A tiger cooling in a forest pool at the water's edge, framed by dense central-India woodland in golden light"
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
                  Wildlife Photography Workshop — Panna, MP
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-[1.7] text-white/85 md:text-lg">
                  3 nights / 4 days · 6 safaris · Limited seats · Price on
                  enquiry (twin sharing)
                </p>
                <ClaimButton className="mt-8" />
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
                    <p>
                      Four days in one of central India&apos;s quietest tiger
                      reserves, built entirely around making photographs.
                      Mornings and evenings in the field, breakfast in the
                      bush, and unhurried evening sessions where we go through
                      the day&apos;s frames together. Kept deliberately small,
                      so the guidance is personal and the jeeps never crowded.
                    </p>
                    <p>
                      This is a workshop, not a sightseeing tour. The aim is to
                      send you home with images you&apos;re proud of, and with
                      the habits that made them: reading light, anticipating
                      behaviour, choosing your position before the moment
                      arrives.
                    </p>
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

                  {/* Why Panna */}
                  <div className="border-t border-charcoal/10 pt-12">
                    <h2 className={SUBHEAD}>Why Panna</h2>
                    <div className={`mt-4 space-y-4 ${BODY_COPY}`}>
                      <p>
                        Panna Tiger Reserve sits in Madhya Pradesh, a short
                        drive from the temple town of Khajuraho. It&apos;s one
                        of Indian conservation&apos;s great comeback stories —
                        tigers were lost here around 2009 and carefully
                        reintroduced, and the reserve has since recovered into a
                        thriving habitat. I&apos;ve written{" "}
                        <Link
                          href="/blog/the-panna-story"
                          className="underline decoration-sage/40 underline-offset-4 transition-colors duration-300 hover:text-sage"
                        >
                          the full story of Panna&apos;s tiger recovery
                        </Link>{" "}
                        in the journal. The Ken river runs through it, cutting
                        gorges and plateaus that give the landscape a character
                        quite different from the more famous reserves. Beyond
                        tigers, Panna is rich in leopards, sloth bears,
                        crocodiles along the Ken, and some of central
                        India&apos;s best raptor and vulture activity.
                      </p>
                      <p>
                        The departures run through Panna&apos;s dry, cool
                        season — from the fresh, green forest just after the
                        monsoon to the crisp heart of winter, when misty
                        mornings and a drying forest draw wildlife to the Ken.
                        Soft light, comfortable temperatures, and a quiet,
                        uncrowded park. It&apos;s a beautiful time to
                        photograph it.
                      </p>
                    </div>
                  </div>

                  {/* How the days run */}
                  <div className="border-t border-charcoal/10 pt-12">
                    <h2 className={SUBHEAD}>How the days run</h2>
                    <p className={`mt-4 ${BODY_COPY}`}>
                      Out before first light for the morning safari, with
                      breakfast carried into the bush so we stay in the field
                      through the best light. Back to the lodge for lunch and a
                      quiet middle of the day. Out again for the evening safari
                      as the light turns. After dinner, a photography and
                      post-processing session — looking at what came home,
                      talking through what worked, and building the edit. The
                      trip opens with an evening safari on arrival day and
                      closes with a morning safari before departure — six
                      safaris across the trip.
                    </p>
                  </div>

                  {/* Itinerary */}
                  <div className="border-t border-charcoal/10 pt-12">
                    <h2 className={SUBHEAD}>The itinerary</h2>
                    <div className="mt-6 space-y-7">
                      {ITINERARY.map((block) => (
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
                          {INCLUDED.map((item) => (
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
                          {NOT_INCLUDED.map((item) => (
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
                      {GOOD_TO_KNOW.map((item) => (
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
                      The nearest airport is Khajuraho (HJR). Flights are not
                      included. Suggested routing from Pune (timings
                      indicative; please check schedules closer to your
                      dates):
                    </p>
                    <ul className="mt-4 space-y-2.5 text-sm leading-[1.6] text-smoke">
                      <li className="flex gap-3">
                        <span
                          aria-hidden
                          className="font-display text-[11px] uppercase tracking-[0.2em] text-sage"
                        >
                          Out
                        </span>
                        <span>
                          Pune (PNQ) → Khajuraho (HJR), morning departure on
                          Day 1, arriving by 12:15 pm, via Delhi
                        </span>
                      </li>
                      <li className="flex gap-3">
                        <span
                          aria-hidden
                          className="font-display text-[11px] uppercase tracking-[0.2em] text-sage"
                        >
                          Return
                        </span>
                        <span>
                          Khajuraho (HJR) → Pune (PNQ), afternoon departure on
                          Day 4, via Delhi
                        </span>
                      </li>
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
                  {FACTS.map((f) => (
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
                    On enquiry
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-smoke">
                    Twin sharing. Single room at extra cost (on request).
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
                    : "Panna Wildlife Photography Workshop"
                }
                defaultMessage={
                  enquiry
                    ? messageFor(enquiry)
                    : "Hi Tarang, I'd like to enquire about the next Panna wildlife photography workshop. Please share upcoming dates and next steps."
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
                  href={whatsappHrefFor(enquiry)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Chat on WhatsApp at ${PHONE_NUMBER_DISPLAY} about the Panna workshop`}
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

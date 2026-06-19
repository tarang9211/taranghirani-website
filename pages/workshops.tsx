import Head from "next/head";
import Image from "next/image";
import FadeIn from "../components/FadeIn";
import ContactLinks from "../components/ContactLinks";
import ContactForm from "../components/ContactForm";
import UpcomingWorkshops from "../components/UpcomingWorkshops";

const CLOUDINARY_BASE =
  "https://res.cloudinary.com/duiyn8wll/image/upload/f_auto,q_auto";

const IMG = {
  hero: `${CLOUDINARY_BASE}/_Z9_20251231_TMH_2311_wm_wyiafz`,
  break1: `${CLOUDINARY_BASE}/DSC_0959_hshxmc`,
  break2: `${CLOUDINARY_BASE}/DSC_3494_wm_uyx33k`,
  break3: `${CLOUDINARY_BASE}/_Z9_20260212_083717_TMH_wm_rbn0iq`,
  portrait: `${CLOUDINARY_BASE}/8ec3734c-a6c3-4e67-af27-85fe20e6dabe_z8zwst`,
};

const PAGE_URL = "https://www.taranghirani.com/workshops";
const PAGE_TITLE = "Wildlife Photography Workshops | Tarang Hirani";
const PAGE_DESCRIPTION =
  "Days in the field with a working photographer and expedition leader. India and Africa. Small groups and one to one.";
const OG_IMAGE =
  "https://res.cloudinary.com/duiyn8wll/image/upload/w_1200,h_630,c_fill,f_jpg,q_auto/DSC_0959_hshxmc";

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Wildlife Photography Workshops",
  serviceType: "Wildlife photography workshop",
  provider: {
    "@type": "Person",
    name: "Tarang Hirani",
    url: "https://www.taranghirani.com",
  },
  areaServed: [
    { "@type": "Place", name: "Tadoba, India" },
    { "@type": "Place", name: "Bandhavgarh, India" },
    { "@type": "Place", name: "Kanha, India" },
    { "@type": "Place", name: "Panna, India" },
    { "@type": "Place", name: "Tanzania" },
    { "@type": "Place", name: "Zambia" },
    { "@type": "Place", name: "Botswana" },
  ],
  description: PAGE_DESCRIPTION,
  url: PAGE_URL,
  image: OG_IMAGE,
};

const DAY = [
  {
    n: "01",
    title: "Before dawn",
    body: "Out before the light. In the jeep, settings come up first. How to read the first light, when to push ISO, how to expose for the shot you already have in your head.",
  },
  {
    n: "02",
    title: "Morning drive",
    body: "First light through midmorning. Coaching in the moment, between sightings. The aim is not just to come back with frames, but to come back with frames you chose.",
  },
  {
    n: "03",
    title: "Late morning",
    body: "Back at the lodge. Breakfast and a quiet hour. We look at what came home, talk about what worked and what you want to try differently.",
  },
  {
    n: "04",
    title: "Evening drive",
    body: "Out again as the light changes. Different behaviour, different colour, often the best hour of the day.",
  },
  {
    n: "05",
    title: "Late evening",
    body: "Back at the lodge. Fundamentals when they come up. Composition, light, behaviour, processing. Whatever the day raised.",
  },
];

export default function WorkshopsPage() {
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
      </Head>

      {/* HERO */}
      <section className="relative">
        <div className="relative min-h-[80vh] w-full overflow-hidden md:h-[calc(100vh-6rem)] md:min-h-0">
          <Image
            priority
            src={IMG.hero}
            alt="Wildlife scene at dawn, photographed during a field workshop session"
            fill
            sizes="100vw"
            className="animate-slow-zoom object-cover object-[30%_center] md:object-center"
          />
          {/* Gradient overlay for legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/30 to-charcoal/10" />

          {/* Text, anchored to bottom-left */}
          <div className="absolute inset-0 flex items-end">
            <div className="w-full px-6 pb-14 md:px-12 md:pb-20 lg:px-20 lg:pb-24">
              <div className="max-w-3xl">
                <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl">
                  Wildlife photography, learned in the field.
                </h1>
                <p className="mt-6 max-w-xl text-base leading-[1.75] text-white/85 md:mt-8 md:text-lg">
                  Days in the field with a working photographer and
                  expedition leader. India and Africa. Small groups and
                  one to one.
                </p>
                <a
                  href="#begin"
                  className="group mt-10 inline-flex items-center gap-3 border-b border-white/40 pb-1 text-[11px] font-medium uppercase tracking-[0.25em] text-white transition-colors duration-500 hover:border-sage hover:text-sage md:mt-12"
                >
                  Enquire
                  <span
                    aria-hidden
                    className="inline-block transition-transform duration-500 group-hover:translate-x-2"
                  >
                    &rarr;
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OPENING STATEMENT */}
      <section className="bg-paper pt-32 pb-32 md:pt-48 md:pb-48">
        <div className="mx-auto max-w-4xl px-6 md:px-12">
          <FadeIn>
            <p className="text-center font-display text-3xl font-normal leading-[1.2] tracking-tight text-charcoal md:text-4xl lg:text-5xl">
              Field days to ensure you leave with frames you are proud of.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* IMAGE BREAK 1 */}
      <section aria-hidden>
        <div className="relative aspect-[3/2] w-full overflow-hidden md:aspect-[21/9]">
          <Image
            src={IMG.break1}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </section>

      {/* THE DAY */}
      <section className="bg-paper py-32 md:py-48">
        <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-20">
          <FadeIn>
            <div className="mb-20 text-center md:mb-28">
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-sage">
                A day on a workshop
              </p>
              <h2 className="mt-6 font-display text-3xl font-semibold tracking-tight text-charcoal md:text-5xl lg:text-6xl">
                The rhythm of a day.
              </h2>
            </div>
          </FadeIn>

          <div className="mx-auto max-w-3xl space-y-16 md:space-y-20">
            {DAY.map(({ n, title, body }, i) => (
              <FadeIn key={n} delay={i * 80}>
                <div className="grid grid-cols-[auto_1fr] gap-6 md:gap-12">
                  <span className="pt-2 font-display text-sm tracking-[0.2em] text-sage md:text-base">
                    {n}
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-semibold tracking-tight text-charcoal md:text-2xl">
                      {title}
                    </h3>
                    <p className="mt-4 text-base leading-[1.85] text-smoke md:text-lg">
                      {body}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* IMAGE BREAK 2 */}
      <section aria-hidden>
        <div className="relative aspect-[3/2] w-full overflow-hidden md:aspect-[21/9]">
          <Image
            src={IMG.break2}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </section>

      {/* WHERE */}
      <section className="bg-paper py-32 md:py-48">
        <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-20">
          <FadeIn>
            <div className="mb-20 text-center md:mb-28">
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-sage">
                Where it happens
              </p>
              <h2 className="mt-6 font-display text-3xl font-semibold tracking-tight text-charcoal md:text-5xl lg:text-6xl">
                India, and beyond.
              </h2>
            </div>
          </FadeIn>

          <FadeIn>
            <div className="mx-auto grid max-w-3xl grid-cols-2 gap-12 md:gap-24">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-sage">
                  India
                </p>
                <ul className="mt-6 space-y-3 font-display text-xl text-charcoal md:text-2xl">
                  <li>Tadoba</li>
                  <li>Bandhavgarh</li>
                  <li>Kanha</li>
                  <li>Panna</li>
                </ul>
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-sage">
                  Africa
                </p>
                <ul className="mt-6 space-y-3 font-display text-xl text-charcoal md:text-2xl">
                  <li>Tanzania</li>
                  <li>Zambia</li>
                  <li>Botswana</li>
                </ul>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* WHAT IS ARRANGED */}
      <section className="bg-paper pb-32 md:pb-48">
        <div className="mx-auto max-w-5xl px-6 md:px-12 lg:px-20">
          <FadeIn>
            <div className="mx-auto h-px w-12 bg-sage" />
          </FadeIn>
          <FadeIn>
            <div className="mt-20 grid items-start gap-12 md:mt-28 md:grid-cols-2 md:gap-24">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-sage">
                  What is arranged
                </p>
                <h2 className="mt-6 font-display text-2xl font-semibold tracking-tight text-charcoal md:text-3xl lg:text-4xl">
                  Everything.
                </h2>
              </div>
              <p className="text-base leading-[1.85] text-smoke md:text-lg">
                Safaris, accommodation, every drive. So you can focus on
                your craft.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FORMAT */}
      <section className="bg-paper pb-32 md:pb-48">
        <div className="mx-auto max-w-5xl px-6 md:px-12 lg:px-20">
          <FadeIn>
            <div className="grid items-start gap-12 md:grid-cols-2 md:gap-24">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-sage">
                  The format
                </p>
                <h2 className="mt-6 font-display text-2xl font-semibold tracking-tight text-charcoal md:text-3xl lg:text-4xl">
                  Built around you, not a calendar.
                </h2>
              </div>
              <p className="text-base leading-[1.85] text-smoke md:text-lg">
                Trips run between four days and a week. Small groups or one to
                one. Dates and location chosen around the season and the
                participants. Pricing on enquiry.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* IMAGE BREAK 3 */}
      <section aria-hidden>
        <div className="relative aspect-[3/2] w-full overflow-hidden md:aspect-[21/9]">
          <Image
            src={IMG.break3}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </section>

      {/* WHAT YOU TAKE WITH YOU */}
      <section className="bg-paper py-32 md:py-48">
        <div className="mx-auto max-w-3xl px-6 text-center md:px-12">
          <FadeIn>
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-sage">
              What you take with you
            </p>
            <h2 className="mt-6 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-charcoal md:text-5xl lg:text-6xl">
              Frames you will print. Experiences to bring you back.
            </h2>
          </FadeIn>
        </div>
      </section>

      {/* ABOUT TARANG */}
      <section className="bg-paper pb-32 md:pb-48">
        <div className="mx-auto max-w-6xl px-6 md:px-12 lg:px-20">
          <FadeIn>
            <div className="grid items-start gap-12 md:grid-cols-12 md:gap-16 lg:gap-20">
              <div className="md:col-span-5">
                <div className="relative aspect-[3/4] w-full overflow-hidden">
                  <Image
                    src={IMG.portrait}
                    alt="Tarang Hirani beside his framed work at an exhibition"
                    fill
                    sizes="(min-width: 768px) 40vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="md:col-span-7">
                <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-sage">
                  About Tarang
                </p>
                <h2 className="mt-6 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-charcoal md:text-4xl lg:text-5xl">
                  The person you will spend a week with.
                </h2>

                <div className="mt-10 space-y-6 text-base leading-[1.85] text-smoke md:text-lg">
                  <p>
                    I am a wildlife photographer based in India. I spend
                    most of the year in the field, leading small
                    expeditions across the tiger reserves of central India
                    and into Africa.
                  </p>
                  <p>
                    What I care about, more than any frame I have made, is
                    the work done in the jeep. The hour before a sighting.
                    The hour after. The conversation over dinner about why
                    a frame did, or did not, work.
                  </p>
                  <p>
                    These workshops are the part of my practice I enjoy
                    most.
                  </p>
                </div>

                <div className="mt-14 h-px w-12 bg-sage/60 md:mt-16" />

                <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-12">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-sage">
                      Awards &amp; Recognitions
                    </p>
                    <ul className="mt-4 space-y-2 font-display text-base text-charcoal">
                      <li>INW Awards</li>
                      <li>Nikon India</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-sage">
                      Exhibitions
                    </p>
                    <ul className="mt-4 space-y-2 font-display text-base text-charcoal">
                      <li>ICCR Kolkata</li>
                      <li>Bharat Art Conclave, Delhi</li>
                      <li>Karnataka Chitrakala Parishath, Bangalore</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* UPCOMING WORKSHOPS */}
      <UpcomingWorkshops theme="light" />

      {/* BEGIN */}
      <section
        id="begin"
        className="scroll-mt-24 border-t border-charcoal/10 bg-paper py-32 md:py-48"
      >
        <div className="mx-auto max-w-2xl px-6 md:px-12">
          <FadeIn>
            <div className="text-center">
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-sage">
                Enquire
              </p>
              <h2 className="mt-6 font-display text-3xl font-semibold tracking-tight text-charcoal md:text-5xl lg:text-6xl">
                One message. The rest is arranged.
              </h2>
              <p className="mt-10 text-base leading-[1.85] text-smoke md:text-lg">
                Tell me where you would like to go and what you hope to make. I
                read every message and reply within 48 hours.
              </p>
            </div>

            <div className="mt-14 md:mt-16">
              <ContactForm source="workshops" theme="light" />
            </div>
          </FadeIn>

          <FadeIn delay={200}>
            <div className="mt-20 md:mt-24 flex items-center justify-center gap-4">
              <span className="h-px w-12 bg-charcoal/10" />
              <span className="text-[11px] text-smoke uppercase tracking-[0.2em]">
                Or reach out directly
              </span>
              <span className="h-px w-12 bg-charcoal/10" />
            </div>

            <div className="mt-10 md:mt-12">
              <ContactLinks theme="light" layout="row" showLabels />
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}

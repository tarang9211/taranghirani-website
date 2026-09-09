import React from "react";
import Link from "next/link";
import Image from "next/image";
import FadeIn from "./FadeIn";
import { activeDestinations, visibleDepartures } from "../lib/workshops";

type Theme = "dark" | "light";

export default function UpcomingWorkshops({
  theme = "light",
  showViewAll = false,
  concise = false,
}: {
  theme?: Theme;
  // Show a link through to the full /destinations page (used on the home page).
  showViewAll?: boolean;
  // Lead with dates + availability only, no pricing (used on the home page).
  concise?: boolean;
}) {
  const isDark = theme === "dark";

  const destinations = activeDestinations();

  const cardBorder = isDark
    ? "border-white/10 hover:border-sage"
    : "border-charcoal/10 hover:border-sage";
  const titleColor = isDark ? "text-white" : "text-charcoal";
  const summaryColor = isDark ? "text-white/60" : "text-smoke";
  const dateColor = isDark ? "text-white/85" : "text-charcoal/85";
  const ctaColor = isDark
    ? "border-white/30 text-white group-hover:border-sage group-hover:text-sage"
    : "border-charcoal/30 text-charcoal group-hover:border-sage group-hover:text-sage";
  // Sage (2.45:1 on paper) fails WCAG AA as text on the light surface, so the
  // light-theme eyebrows use the darker bark tint; sage is retained on dark.
  const eyebrowColor = isDark ? "text-sage" : "text-bark";

  return (
    <section
      id="workshops"
      className={`scroll-mt-16 ${isDark ? "bg-charcoal" : "bg-paper"} py-24 md:py-32`}
    >
      <div className="mx-auto max-w-5xl px-6 md:px-12 lg:px-20">
        <FadeIn>
          <div className="mb-14 text-center md:mb-20">
            <p className={`text-xs font-medium uppercase tracking-eyebrow ${eyebrowColor}`}>
              Upcoming workshops
            </p>
            <h2
              className={`mt-6 font-display text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl ${titleColor}`}
            >
              Join a Fixed-Date Workshop
            </h2>
          </div>
        </FadeIn>

        <div className="space-y-10 md:space-y-12">
          {destinations.map((dest, i) => (
            <FadeIn key={dest.slug} delay={i * 80}>
              <Link
                href={`/destinations/${dest.slug}`}
                className={`group block overflow-hidden border transition-colors duration-300 md:grid md:grid-cols-2 ${cardBorder}`}
              >
                <div className="relative aspect-[3/2] w-full overflow-hidden md:aspect-auto md:h-full md:min-h-[20rem]">
                  <Image
                    src={dest.image}
                    alt={dest.imageAlt}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-8 md:p-12 lg:p-14">
                  <p className={`text-xs font-medium uppercase tracking-eyebrow ${eyebrowColor}`}>
                    {concise
                      ? // Keep "workshop" on the card even in the price-free
                        // home-page variant.
                        "Wildlife Photography Workshop"
                      : dest.location}
                  </p>
                  <h3
                    className={`mt-5 font-display text-2xl font-semibold tracking-tight md:text-3xl ${titleColor}`}
                  >
                    {concise
                      ? dest.location
                      : `Wildlife Photography Workshop — ${dest.name}`}
                  </h3>
                  <p className={`mt-4 text-base md:text-lg ${dateColor}`}>
                    {(() => {
                      const count = visibleDepartures(dest).length;
                      return `${count} upcoming departure${count === 1 ? "" : "s"}`;
                    })()}
                  </p>
                  <p
                    className={`mt-3 text-base leading-[1.75] md:text-lg ${summaryColor}`}
                  >
                    {concise ? dest.shortSummary : dest.summary}
                  </p>
                  <span
                    className={`mt-8 inline-flex items-center gap-3 border-b pb-1 text-xs font-medium uppercase tracking-cta transition-colors duration-300 ${ctaColor}`}
                  >
                    View workshop
                    <span
                      aria-hidden
                      className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                    >
                      &rarr;
                    </span>
                  </span>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>

        {showViewAll && (
          <FadeIn delay={120}>
            <div className="mt-14 text-center md:mt-16">
              <Link
                href="/destinations"
                className={`group inline-flex items-center gap-3 text-xs font-medium uppercase tracking-cta transition-colors duration-300 ${
                  isDark
                    ? "text-white/70 hover:text-sage"
                    : "text-smoke hover:text-sage"
                }`}
              >
                All workshops &amp; how they run
                <span
                  aria-hidden
                  className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                >
                  &rarr;
                </span>
              </Link>
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  );
}

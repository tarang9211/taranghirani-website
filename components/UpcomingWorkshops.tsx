import React from "react";
import Link from "next/link";
import Image from "next/image";
import FadeIn from "./FadeIn";
import { UPCOMING_WORKSHOPS } from "../lib/workshops";

type Theme = "dark" | "light";

export default function UpcomingWorkshops({
  theme = "light",
  showViewAll = false,
  concise = false,
}: {
  theme?: Theme;
  // Show a link through to the full /workshops page (used on the home page).
  showViewAll?: boolean;
  // Lead with dates + availability only, no pricing (used on the home page).
  concise?: boolean;
}) {
  const isDark = theme === "dark";

  const cardBorder = isDark
    ? "border-white/10 hover:border-sage"
    : "border-charcoal/10 hover:border-sage";
  const titleColor = isDark ? "text-white" : "text-charcoal";
  const summaryColor = isDark ? "text-white/60" : "text-smoke";
  const ctaColor = isDark
    ? "border-white/30 text-white group-hover:border-sage group-hover:text-sage"
    : "border-charcoal/30 text-charcoal group-hover:border-sage group-hover:text-sage";

  return (
    <section
      id="workshops"
      className={`scroll-mt-16 ${isDark ? "bg-charcoal" : "bg-paper"} py-24 md:py-32`}
    >
      <div className="mx-auto max-w-5xl px-6 md:px-12 lg:px-20">
        <FadeIn>
          <div className="mb-14 text-center md:mb-20">
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-sage">
              Upcoming workshops
            </p>
            <h2
              className={`mt-6 font-display text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl ${titleColor}`}
            >
              Join a fixed-date trip.
            </h2>
          </div>
        </FadeIn>

        <div className="space-y-10 md:space-y-12">
          {UPCOMING_WORKSHOPS.map((w, i) => (
            <FadeIn key={w.slug} delay={i * 80}>
              <Link
                href={w.href}
                className={`group block overflow-hidden border transition-colors duration-300 md:grid md:grid-cols-2 ${cardBorder}`}
              >
                <div className="relative aspect-[3/2] w-full overflow-hidden md:aspect-auto md:h-full md:min-h-[20rem]">
                  <Image
                    src={w.image}
                    alt={w.imageAlt}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-8 md:p-12 lg:p-14">
                  {!concise && (
                    <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-sage">
                      {w.location}
                    </p>
                  )}
                  <h3
                    className={`font-display text-2xl font-semibold tracking-tight md:text-3xl ${
                      concise ? "" : "mt-5"
                    } ${titleColor}`}
                  >
                    {concise ? w.location : w.title}
                  </h3>
                  <p
                    className={`mt-4 text-base leading-[1.75] md:text-lg ${summaryColor}`}
                  >
                    {w.dateLabel} · {concise ? w.shortSummary : w.summary}
                  </p>
                  <span
                    className={`mt-8 inline-flex items-center gap-3 border-b pb-1 text-[11px] font-medium uppercase tracking-[0.25em] transition-colors duration-300 ${ctaColor}`}
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
                href="/workshops"
                className={`group inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.25em] transition-colors duration-300 ${
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

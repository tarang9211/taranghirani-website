import React from "react";
import Link from "next/link";
import FadeIn from "./FadeIn";
import TestimonialAvatar from "./TestimonialAvatar";
import type { Testimonial } from "../lib/testimonials";

// Home-page teaser: up to three guest quotes linking into /testimonials.
// `items` comes from featuredTestimonials(3) in the page's getStaticProps so
// the data module stays server-side. Renders nothing at all when there are
// none, so "Upcoming workshops" flows straight into "How Workshops Run".
export default function Testimonials({ items }: { items: Testimonial[] }) {
  if (!items || items.length === 0) return null;

  return (
    <section
      id="testimonials"
      className="scroll-mt-16 border-y border-white/5 bg-charcoal py-24 md:py-32"
    >
      <div className="mx-auto max-w-5xl px-6 md:px-12 lg:px-20">
        <FadeIn>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-eyebrow text-sage">
                From the field
              </p>
              <h2 className="mt-6 font-display text-3xl font-semibold tracking-tight text-white md:text-4xl lg:text-5xl">
                In their words.
              </h2>
            </div>
            <Link
              href="/testimonials"
              className="group inline-flex items-center gap-3 text-xs font-medium uppercase tracking-cta text-white/70 transition-colors duration-300 hover:text-sage focus-visible:text-sage focus-visible:outline-none"
            >
              Read all guest stories
              <span
                aria-hidden
                className="inline-block transition-transform duration-300 group-hover:translate-x-1"
              >
                &rarr;
              </span>
            </Link>
          </div>
        </FadeIn>

        <div className="mt-14 grid gap-10 [grid-template-columns:repeat(auto-fit,minmax(min(300px,100%),1fr))] md:mt-20">
          {items.map((t, i) => (
            <FadeIn key={t.id} delay={i * 80} className="flex">
              <Link
                href={`/testimonials#${t.id}`}
                className="group flex w-full flex-col justify-between gap-7 border-t border-sage/40 pt-7 transition-colors duration-300 hover:border-sage focus-visible:border-sage focus-visible:outline-none"
              >
                <figure className="flex h-full flex-col justify-between gap-7">
                  <blockquote className="font-display text-xl leading-[1.4] text-white [text-wrap:pretty] md:text-2xl">
                    &ldquo;{t.short}&rdquo;
                  </blockquote>
                  <figcaption className="flex items-center gap-4">
                    <TestimonialAvatar src={t.photo} size={48} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-white">
                        {t.name}
                      </p>
                      <p className="mt-1 truncate text-[11px] uppercase tracking-eyebrow text-white/60">
                        {t.place} &middot; {t.year}
                      </p>
                    </div>
                  </figcaption>
                </figure>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

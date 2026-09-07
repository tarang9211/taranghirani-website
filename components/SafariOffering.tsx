import React from "react";
import FadeIn from "./FadeIn";

export default function SafariOffering() {
  return (
    <section id="safaris" className="bg-charcoal py-24 md:py-32 scroll-mt-16">
      <div className="mx-auto max-w-3xl px-6 md:px-12 text-center">
        <FadeIn>
          <p className="text-xs font-medium uppercase tracking-eyebrow text-sage">
            How Workshops Run
          </p>
          <h2 className="mt-6 font-display text-2xl md:text-3xl lg:text-4xl font-semibold text-white tracking-tight">
            Curated Wildlife Safaris
          </h2>
          <p className="mt-8 text-base md:text-lg leading-relaxed text-white/80">
            Every workshop runs as a photography-first safari across India and
            Africa. Experienced guides, comfortable stays, and personal guidance
            to help you get frames you&apos;re proud of. Not aimless wandering
            in jeeps.
          </p>
          <p className="mt-6 text-xs font-medium uppercase tracking-eyebrow text-white/60">
            Six guests maximum &middot; Personally led &middot; Teaching
            included
          </p>
          <a
            href="https://ig.me/m/tarang.hirani"
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-10 inline-flex items-center gap-2 border border-sage px-7 py-3.5 text-xs font-medium uppercase tracking-cta text-sage transition-colors duration-300 hover:bg-sage hover:text-charcoal"
          >
            Enquire on Instagram
            <span
              aria-hidden
              className="inline-block transition-transform duration-300 group-hover:translate-x-1"
            >
              &rarr;
            </span>
          </a>
        </FadeIn>
      </div>
    </section>
  );
}

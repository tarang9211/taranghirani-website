import React from "react";
import FadeIn from "./FadeIn";
import ContactLinks from "./ContactLinks";

export default function SafariOffering() {
  return (
    <section id="safaris" className="bg-charcoal py-24 md:py-32 scroll-mt-16">
      <div className="mx-auto max-w-3xl px-6 md:px-12 text-center">
        <FadeIn>
          <div className="mx-auto h-px w-12 bg-sage" />
          <h2 className="mt-10 font-display text-2xl md:text-3xl lg:text-4xl font-semibold text-white tracking-tight">
            Curated Wildlife Safaris
          </h2>
          <p className="mt-8 text-base md:text-lg leading-relaxed text-gray-400">
            Photography first safari experiences across India and Africa.
            Experienced guides, comfortable stays, and personal guidance to help
            you get frames you&apos;re proud of. Not aimless wandering in jeeps.
          </p>
          <a
            href="https://ig.me/m/tarang.hirani"
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-10 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.15em] text-sage transition-colors duration-300 hover:text-white"
          >
            Enquire on Instagram
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
              &rarr;
            </span>
          </a>

          <div className="mt-12 flex flex-col items-center gap-4">
            <div className="h-px w-8 bg-white/15" />
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-gray-500">
              Or reach us directly
            </p>
            <ContactLinks theme="dark" layout="row" />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

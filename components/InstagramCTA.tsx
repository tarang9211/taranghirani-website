import React from "react";
import FadeIn from "./FadeIn";

export default function InstagramCTA() {
  return (
    <section className="bg-charcoal py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6 md:px-12 text-center">
        <FadeIn>
          <p className="font-display text-xl md:text-2xl lg:text-3xl font-light text-white/80 leading-relaxed tracking-tight">
            Follow my journey &mdash; field notes, behind-the-scenes, and
            photography tips.
          </p>
          <a
            href="https://www.instagram.com/tarang.hirani/"
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-10 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.15em] text-sage transition-colors duration-300 hover:text-white"
          >
            @tarang.hirani
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
              &rarr;
            </span>
          </a>
        </FadeIn>
      </div>
    </section>
  );
}

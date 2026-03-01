import React from "react";
import { useInView } from "../lib/useInView";

export default function Statement() {
  const { ref, visible } = useInView(0.2);

  return (
    <section className="bg-charcoal py-32 md:py-40">
      <div
        ref={ref}
        className={`mx-auto max-w-4xl px-6 md:px-12 text-center transition-all duration-1000 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="mx-auto h-px w-12 bg-sage" />
        <blockquote className="mt-10 md:mt-14">
          <p className="font-display text-2xl md:text-4xl lg:text-5xl font-light italic leading-snug text-white tracking-tight">
            Every frame is a conversation between patience and chance.
          </p>
        </blockquote>
        <p className="mt-8 text-xs font-medium uppercase tracking-[0.25em] text-sage/70">
          Tarang Hirani
        </p>
        <div className="mx-auto mt-10 md:mt-14 h-px w-12 bg-sage" />
      </div>
    </section>
  );
}

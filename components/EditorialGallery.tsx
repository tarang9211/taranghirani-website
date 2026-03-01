import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { GalleryImage } from "../lib/helpers";
import { useInView } from "../lib/useInView";

interface EditorialGalleryProps {
  images: GalleryImage[];
}

function FadeIn({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, visible } = useInView();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className || ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function EditorialGallery({ images }: EditorialGalleryProps) {
  const rowA = images.slice(0, 2);
  const cinematic = images[2];
  const rowC = images.slice(3, 5);

  return (
    <section className="bg-parchment py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-20">
        {/* Header */}
        <FadeIn>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-sage">
            <span className="font-display text-base">01</span>
            <span className="mx-3 inline-block h-px w-6 bg-sage/40 align-middle" />
            Portfolio
          </p>
          <h2 className="mt-3 font-display text-3xl md:text-4xl font-semibold text-charcoal tracking-tight">
            From the Field
          </h2>
          <div className="mt-4 h-px w-16 bg-charcoal/15" />
        </FadeIn>

        {/* Row A — asymmetric pair */}
        {rowA.length >= 2 && (
          <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-5">
            <FadeIn className="md:col-span-7 md:mt-8">
              <div className="overflow-hidden rounded-xl aspect-[4/5]">
                <Image
                  src={rowA[0].url}
                  alt={rowA[0].alt}
                  width={560}
                  height={700}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                />
              </div>
            </FadeIn>
            <FadeIn className="md:col-span-5" delay={150}>
              <div className="overflow-hidden rounded-xl aspect-[4/5]">
                <Image
                  src={rowA[1].url}
                  alt={rowA[1].alt}
                  width={400}
                  height={500}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                />
              </div>
            </FadeIn>
          </div>
        )}

        {/* Row B — full-bleed cinematic */}
        {cinematic && (
          <FadeIn className="mt-8">
            <div className="overflow-hidden rounded-xl aspect-[16/9]">
              <Image
                src={cinematic.url}
                alt={cinematic.alt}
                width={1280}
                height={720}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
              />
            </div>
          </FadeIn>
        )}

        {/* Row C — reversed asymmetry */}
        {rowC.length >= 2 && (
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-5">
            <FadeIn className="md:col-span-5">
              <div className="overflow-hidden rounded-xl aspect-[4/5]">
                <Image
                  src={rowC[0].url}
                  alt={rowC[0].alt}
                  width={400}
                  height={500}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                />
              </div>
            </FadeIn>
            <FadeIn className="md:col-span-7 md:mt-8" delay={150}>
              <div className="overflow-hidden rounded-xl aspect-[4/5]">
                <Image
                  src={rowC[1].url}
                  alt={rowC[1].alt}
                  width={560}
                  height={700}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                />
              </div>
            </FadeIn>
          </div>
        )}

        {/* CTA */}
        <FadeIn className="mt-16 flex justify-end">
          <Link
            href="/gallery"
            className="group inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.15em] text-charcoal transition-colors duration-300 hover:text-sage"
          >
            View Full Gallery
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
              &rarr;
            </span>
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}

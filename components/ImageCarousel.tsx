import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import FadeIn from "./FadeIn";
import type { GalleryImage } from "../lib/helpers";

interface ImageCarouselProps {
  images: GalleryImage[];
}

export default function ImageCarousel({ images }: ImageCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Card widths vary (the trailing gallery card is narrower), so find the
  // card whose centre is nearest the viewport centre instead of dividing
  // scrollWidth evenly.
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const target = el.scrollLeft + el.clientWidth / 2;
    let index = 0;
    let best = Infinity;
    Array.from(el.children).forEach((child, i) => {
      const card = child as HTMLElement;
      const centre = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(centre - target);
      if (distance < best) {
        best = distance;
        index = i;
      }
    });
    setActiveIndex(index);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scrollToIndex = useCallback((i: number) => {
    const el = scrollRef.current;
    const card = el?.children[i] as HTMLElement | undefined;
    if (!el || !card) return;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    el.scrollTo({
      left: card.offsetLeft - (el.clientWidth - card.offsetWidth) / 2,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }, []);

  const lastIndex = images.length; // trailing gallery card

  return (
    <section id="work" className="scroll-mt-16 bg-charcoal pt-24 md:pt-32">
      <div className="mx-auto max-w-5xl px-6 md:px-12 lg:px-20">
        <FadeIn>
          <div className="mb-12 text-center md:mb-16">
            <p className="text-xs font-medium uppercase tracking-eyebrow text-sage">
              Portfolio
            </p>
            <h2 className="mt-6 font-display text-3xl font-semibold tracking-tight text-white md:text-4xl lg:text-5xl">
              Selected Work
            </h2>
          </div>
        </FadeIn>
      </div>

      <div className="relative">
        {/* Filmstrip */}
        <div
          ref={scrollRef}
          className="hide-scrollbar flex snap-x snap-mandatory overflow-x-auto"
        >
          {images.map((img, i) => {
            const isPortrait = img.width / img.height < 1;

            return (
              <Link
                key={img.id}
                href="/gallery"
                aria-label={`${img.caption ?? img.alt} (${i + 1} of ${images.length}) — open the gallery`}
                className="group relative w-[88vw] flex-shrink-0 snap-center md:w-[80vw]"
              >
                <div className="relative flex h-[75vh] items-center justify-center px-3 md:h-[85vh] md:px-6">
                  <div
                    className="relative h-full overflow-hidden rounded-lg"
                    style={{
                      aspectRatio: `${img.width} / ${img.height}`,
                      maxWidth: "100%",
                    }}
                  >
                    <Image
                      src={img.url}
                      alt={img.alt}
                      fill
                      sizes={
                        isPortrait
                          ? "(min-width: 768px) 50vw, 88vw"
                          : "(min-width: 768px) 80vw, 88vw"
                      }
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                    />
                    {/* Subtle vignette on hover */}
                    <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/5" />
                    {img.caption && (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/70 to-transparent pb-3 pt-10 text-center">
                        <p className="text-xs font-medium uppercase tracking-eyebrow text-white/90">
                          {img.caption}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}

          {/* Trailing card — the explicit way onward */}
          <div className="flex w-[88vw] flex-shrink-0 snap-center items-center justify-center md:w-[60vw]">
            <div className="flex h-[75vh] items-center justify-center md:h-[85vh]">
              <Link
                href="/gallery"
                className="group inline-flex items-center gap-2 border border-sage px-7 py-3.5 text-xs font-medium uppercase tracking-cta text-sage transition-colors duration-300 hover:bg-sage hover:text-charcoal"
              >
                View the Full Gallery
                <span
                  aria-hidden
                  className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                >
                  &rarr;
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Desktop prev / next */}
        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 hidden items-center justify-between px-6 md:flex">
          <button
            type="button"
            onClick={() => scrollToIndex(Math.max(activeIndex - 1, 0))}
            disabled={activeIndex === 0}
            aria-label="Previous photograph"
            className="pointer-events-auto flex h-11 w-11 items-center justify-center border border-white/30 bg-charcoal/60 text-white backdrop-blur-sm transition-colors duration-300 hover:border-sage hover:text-sage disabled:opacity-30 disabled:hover:border-white/30 disabled:hover:text-white"
          >
            <span aria-hidden>&larr;</span>
          </button>
          <button
            type="button"
            onClick={() => scrollToIndex(Math.min(activeIndex + 1, lastIndex))}
            disabled={activeIndex >= lastIndex}
            aria-label="Next photograph"
            className="pointer-events-auto flex h-11 w-11 items-center justify-center border border-white/30 bg-charcoal/60 text-white backdrop-blur-sm transition-colors duration-300 hover:border-sage hover:text-sage disabled:opacity-30 disabled:hover:border-white/30 disabled:hover:text-white"
          >
            <span aria-hidden>&rarr;</span>
          </button>
        </div>
      </div>

      {/* Position markers */}
      <div
        role="group"
        aria-label="Photograph position"
        className="flex justify-center gap-1 py-6"
      >
        {images.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => scrollToIndex(i)}
            aria-label={`Go to photograph ${i + 1} of ${images.length}`}
            aria-current={i === activeIndex ? "true" : undefined}
            className="flex h-6 items-center px-1"
          >
            <span
              className={`h-px transition-all duration-500 ${
                i === activeIndex ? "w-8 bg-sage" : "w-3 bg-white/40"
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
}

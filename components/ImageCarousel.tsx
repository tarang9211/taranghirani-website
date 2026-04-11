import React, { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import type { GalleryImage } from "../lib/helpers";

interface ImageCarouselProps {
  images: GalleryImage[];
}

export default function ImageCarousel({ images }: ImageCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollLeft = el.scrollLeft;
    const cardWidth = el.scrollWidth / images.length;
    const index = Math.round(scrollLeft / cardWidth);
    setActiveIndex(Math.min(index, images.length - 1));
  }, [images.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <section className="relative bg-charcoal">
      {/* Filmstrip container */}
      <div
        ref={scrollRef}
        className="hide-scrollbar flex snap-x snap-mandatory overflow-x-auto"
      >
        {images.map((img, i) => {
          const aspectRatio = img.width / img.height;
          // Portrait images get narrower cards, landscape get wider
          // At 80vh height, calculate the natural width
          const isPortrait = aspectRatio < 1;

          return (
            <Link
              key={img.id}
              href="/gallery"
              className="group relative flex-shrink-0 snap-center"
              style={{
                // Each card is 92vw on mobile, 80vw on desktop — peek effect
                width: "clamp(88vw, 80vw, 88vw)",
              }}
            >
              <div className="relative h-[75vh] md:h-[85vh] flex items-center justify-center px-3 md:px-6">
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
                    sizes={isPortrait ? "50vw" : "85vw"}
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  />
                  {/* Subtle vignette on hover */}
                  <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/5" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Progress indicator */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-1.5">
        {images.map((_, i) => (
          <div
            key={i}
            className={`h-px transition-all duration-500 ${
              i === activeIndex ? "w-8 bg-sage" : "w-3 bg-white/20"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

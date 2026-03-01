import React from "react";
import Link from "next/link";
import type { GalleryImage } from "../lib/helpers";
import Image from "next/image";
import { useInView } from "../lib/useInView";

interface MiniGalleryProps {
  images: GalleryImage[];
}

function GalleryTile({
  img,
  className,
  width,
  height,
  delay = 0,
}: {
  img: GalleryImage;
  className?: string;
  width: number;
  height: number;
  delay?: number;
}) {
  const { ref, visible } = useInView();

  return (
    <div
      ref={ref}
      className={`overflow-hidden rounded-xl transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className || ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <Image
        src={img.url}
        width={width}
        height={height}
        alt={img.alt}
        className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
      />
    </div>
  );
}

export default function MiniGallery({ images }: MiniGalleryProps) {
  const [featured, ...rest] = images;
  const supporting = rest.slice(0, 4);
  const { ref: headingRef, visible: headingVisible } = useInView();

  return (
    <section className="bg-parchment py-24 md:py-32">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-6 md:px-12 lg:px-20">
        <div
          ref={headingRef}
          className={`transition-all duration-700 ${
            headingVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
        >
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-sage">
            Portfolio
          </p>
          <h2 className="mt-3 font-display text-3xl md:text-4xl font-semibold text-charcoal tracking-tight">
            From the Field
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:grid-rows-2">
          {featured && (
            <GalleryTile
              img={featured}
              width={800}
              height={1000}
              className="lg:row-span-2"
              delay={0}
            />
          )}

          <div className="grid grid-cols-2 gap-3 lg:row-span-2">
            {supporting.map((img, i) => (
              <GalleryTile
                key={img.id}
                img={img}
                width={400}
                height={400}
                delay={(i + 1) * 100}
                className="aspect-square"
              />
            ))}
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <Link
            href="/gallery"
            className="group inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.15em] text-charcoal transition-colors duration-300 hover:text-sage"
          >
            View Full Gallery
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
              &rarr;
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

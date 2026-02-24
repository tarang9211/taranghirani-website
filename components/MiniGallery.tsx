import React from "react";
import Link from "next/link";
import type { GalleryImage } from "../lib/helpers";
import Image from "next/image";

interface MiniGalleryProps {
  images: GalleryImage[];
}

export default function MiniGallery({ images }: MiniGalleryProps) {
  const [featured, ...rest] = images;
  const supporting = rest.slice(0, 4);

  return (
    <section className="bg-paper py-16 md:py-20">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 md:px-12 lg:px-20">
        <h2 className="text-2xl md:text-3xl font-semibold text-charcoal tracking-tight">
          From the Field
        </h2>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:grid-rows-2">
          {/* Featured large image */}
          {featured && (
            <div className="lg:row-span-2 overflow-hidden rounded-2xl">
              <Image
                src={featured.url}
                width="800"
                height="1000"
                alt={featured.alt}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
              />
            </div>
          )}

          {/* Supporting images in 2×2 grid */}
          <div className="grid grid-cols-2 gap-4 lg:row-span-2">
            {supporting.map((img) => (
              <div
                key={img.id}
                className="overflow-hidden rounded-2xl"
              >
                <Image
                  src={img.url}
                  width="400"
                  height="400"
                  alt={img.alt}
                  className="h-full w-full object-cover aspect-square transition-transform duration-500 hover:scale-[1.03]"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center pt-2">
          <Link
            href="/gallery"
            className="rounded-full border border-gray-300 bg-white px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-charcoal transition hover:bg-charcoal hover:text-white shadow-sm"
          >
            View Full Gallery
          </Link>
        </div>
      </div>
    </section>
  );
}

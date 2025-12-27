import React from "react";
import Link from "next/link";
import type { GalleryImage } from "../lib/helpers";

interface MiniGalleryProps {
  images: GalleryImage[];
}

export default function MiniGallery({ images }: MiniGalleryProps) {
  return (
    <section className="bg-paper py-16">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {images.map((img) => (
            <img
              key={img.id}
              src={img.url}
              alt={img.id}
              className="h-full w-full rounded-2xl border border-gray-200 bg-gray-100 object-cover shadow-lg md:aspect-[4/3]"
            />
          ))}
        </div>
        <div className="flex justify-center">
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

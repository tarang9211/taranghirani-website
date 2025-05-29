import React from "react";
import Link from "next/link";
import type { GalleryImage } from "../lib/helpers";

interface MiniGalleryProps {
  images: GalleryImage[];
}

export default function MiniGallery({ images }: MiniGalleryProps) {
  return (
    <section className="py-10 px-6 md:px-12 lg:px-20">
      <div className="flex flex-wrap gap-4">
        {images.map((img) => (
          <img
            key={img.id}
            src={img.url}
            alt={img.id}
            /* 1⨉ columns on small, 2⨉ on md, 3⨉ on lg  */
            className="
              w-full
              md:w-[calc(50%-1rem)]      /* 2 columns minus gap */
              lg:w-[calc(33.333%-1rem)]  /* 3 columns minus gap */
              object-contain
              bg-black
            "
          />
        ))}
      </div>
      <div className="mt-10 flex justify-center">
        <Link
          href="/gallery"
          className="border border-white px-6 py-2 hover:bg-white hover:text-black transition"
        >
          View More
        </Link>
      </div>
    </section>
  );
}

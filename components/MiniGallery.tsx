import React from 'react';
import Link from 'next/link';

export interface GalleryImage {
  id: string;   // Cloudinary public_id
  url: string;  // secure_url
}

interface MiniGalleryProps {
  images: GalleryImage[]; // exactly 9 items expected
}

export default function MiniGallery({ images }: MiniGalleryProps) {
  return (
    <section className="py-10 px-6 md:px-12 lg:px-20">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((img) => (
          <img
            key={img.id}
            src={img.url}
            alt={img.id}
            className="w-full h-auto object-contain bg-black"
          />
        ))}
      </div>
      <div className="mt-10 flex justify-center">
        <Link href="/gallery" legacyBehavior>
          <button className="border border-white px-6 py-2 hover:bg-white hover:text-black transition">
            View&nbsp;More
          </button>
        </Link>
      </div>
    </section>
  );
}
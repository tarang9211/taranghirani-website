import React, { useEffect, useState } from "react";

/**
 * A hero section that automatically fetches the Cloudinary asset
 * tagged `hero` via the API route `/api/images?role=hero`.
 *
 * ‣ Shows a loading placeholder until the image arrives.
 * ‣ Falls back to a local placeholder if the API returns nothing.
 */
export default function Hero() {
  const [src, setSrc] = useState<string | null>(null);
  const [alt, setAlt] = useState<string>("Hero image");

  useEffect(() => {
    // Fetch the single hero image from our API
    fetch("/api/images?role=hero")
      .then((res) => res.json())
      .then((data) => {
        if (data?.secure_url) {
          setSrc(data.secure_url);
          // optional: pull alt from Cloudinary context metadata
          if (data?.context?.custom?.alt) setAlt(data.context.custom.alt);
        }
      })
      .catch((err) => console.error("Hero fetch failed", err));
  }, []);

  return (
    <section className="relative w-full">
      {/* Hero image or a gray placeholder while loading */}
      {src ? (
        <img src={src} alt={alt} className="w-full h-auto" />
      ) : (
        <div className="w-full h-[60vh] bg-gray-800 flex items-center justify-center">
          <span className="text-gray-400">Loading hero…</span>
        </div>
      )}

      {/* Overlay heading */}
      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="text-4xl md:text-6xl font-bold text-center">
          Capturing&nbsp;Nature&rsquo;s&nbsp;Majesty
        </h1>
      </div>
    </section>
  );
}

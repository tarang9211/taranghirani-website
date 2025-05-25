import React from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* ───────────────────  Sticky Navigation  ─────────────────── */}
      <Navbar />

      {/* ───────────────────  Hero Section  ─────────────────── */}
      <section className="relative w-full">
        {/* Replace src with your Cloudinary hero image URL */}
        <img
          src="https://res.cloudinary.com/<cloud_name>/image/upload/wildlife/hero.jpg"
          alt="Hero"
          className="w-full h-[60vh] object-cover"
        />

        {/* Overlay text */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <h1 className="text-4xl md:text-6xl font-bold text-center">
            Capturing&nbsp;Nature&rsquo;s&nbsp;Majesty
          </h1>
        </div>
      </section>

      {/* ───────────────────  Mini-Gallery Section  ─────────────────── */}
      <section className="py-10 px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {/* Replace the src values with Cloudinary URLs or <CldImage /> if using next-cloudinary */}
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <img
              key={i}
              src={`https://res.cloudinary.com/<cloud_name>/image/upload/wildlife/sample${i}.jpg`}
              alt={`Image ${i}`}
              className="w-full aspect-square object-cover"
            />
          ))}
        </div>

        {/* View More button */}
        <div className="mt-10 flex justify-center">
          <button className="border border-white px-6 py-2 hover:bg-white hover:text-black transition">
            View More
          </button>
        </div>
      </section>

      {/* ───────────────────  Slot for Page Content  ─────────────────── */}
      <main>{children}</main>
    </div>
  );
};

export default Layout;
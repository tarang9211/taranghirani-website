import React from "react";
import Link from "next/link";

const Navbar: React.FC = () => (
  <nav className="sticky top-0 z-50 w-full bg-black text-white py-4 px-6">
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      <Link
        href="/"
        className="text-xl font-semibold hover:text-gray-300 transition-colors"
      >
        Tarang Hirani
      </Link>
      <div className="flex space-x-8 text-sm font-medium">
        <Link href="/" className="hover:text-gray-300 transition-colors">
          Home
        </Link>
        <Link href="/gallery" className="hover:text-gray-300 transition-colors">
          Gallery
        </Link>
        <span className="hover:text-gray-300 transition-colors">About</span>
      </div>
    </div>
  </nav>
);

export default Navbar;

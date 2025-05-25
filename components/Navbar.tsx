import React from "react";

const Navbar: React.FC = () => (
  <nav className="sticky top-0 z-50 w-full bg-black text-white py-4 px-6">
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      {/* Site title / logo */}
      <h1 className="text-xl font-semibold">Tarang Hirani</h1>

      {/* Menu items (no links yet) */}
      <div className="flex space-x-8 text-sm font-medium">
        <span className="hover:text-gray-300 transition-colors">Home</span>
        <span className="hover:text-gray-300 transition-colors">Gallery</span>
        <span className="hover:text-gray-300 transition-colors">About</span>
      </div>
    </div>
  </nav>
);

export default Navbar;

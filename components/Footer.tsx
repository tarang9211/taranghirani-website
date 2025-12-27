import React from "react";
import Link from "next/link";
import { Instagram } from "lucide-react";
import { INSTAGRAM_URL } from "../lib/constants";

// Defined once when the module loads
const currentYear = new Date().getFullYear();

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-paper text-charcoal py-8 pb-20 md:pb-8 px-6 mt-auto relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-sm font-medium text-gray-500">
          <p>
            &copy; {currentYear} Tarang Hirani. All rights reserved.
          </p>
        </div>
        
        <div className="flex items-center justify-center mb-4 md:mb-0">
          <Link
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center text-charcoal hover:text-gray-600 transition-colors"
            aria-label="Instagram"
          >
            <Instagram size={28} />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


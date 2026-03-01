import React from "react";
import Link from "next/link";
import { Instagram } from "lucide-react";
import { INSTAGRAM_URL } from "../lib/constants";

// Defined once when the module loads
const currentYear = new Date().getFullYear();

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-charcoal py-8 pb-10 md:pb-8 px-6 mt-auto relative z-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-xs font-medium tracking-wide text-gray-500">
          <p>&copy; {currentYear} Tarang Hirani</p>
        </div>

        <div className="flex items-center justify-center">
          <Link
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center p-2 text-gray-500 hover:text-white transition-colors duration-300"
            aria-label="Instagram"
          >
            <Instagram size={20} />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

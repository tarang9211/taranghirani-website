import React from "react";
import Link from "next/link";
import { Instagram } from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-charcoal text-white py-8 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm font-medium text-gray-400">
          <p>
            &copy; {currentYear} Tarang Hirani. All rights reserved.
          </p>
        </div>
        
        <div>
          <Link
            href="https://www.instagram.com/tarang.hirani/?hl=en"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Instagram"
          >
            <Instagram size={24} />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


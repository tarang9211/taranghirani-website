import React from "react";
import Link from "next/link";
import { Instagram } from "lucide-react";
import { INSTAGRAM_URL } from "../lib/constants";
import EmailSignup from "./EmailSignup";
import ContactLinks from "./ContactLinks";

// Defined once when the module loads
const currentYear = new Date().getFullYear();

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-charcoal pt-12 pb-10 md:pb-8 px-6 mt-auto relative z-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        {/* Email signup */}
        <div className="flex justify-center">
          <EmailSignup variant="inline" theme="dark" />
        </div>

        {/* Contact details */}
        <div className="flex flex-col items-center gap-4 pt-2">
          <div className="h-px w-12 bg-sage" />
          <p className="font-display text-[11px] uppercase tracking-[0.2em] text-sage/80">
            Get in Touch
          </p>
          <ContactLinks theme="dark" layout="row" />
        </div>

        {/* Bottom row: copyright + Instagram */}
        <div className="h-px bg-white/5" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
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
      </div>
    </footer>
  );
};

export default Footer;

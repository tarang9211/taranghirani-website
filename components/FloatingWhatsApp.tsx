import React from "react";
import { useRouter } from "next/router";
import { MessageCircle } from "lucide-react";
import { WHATSAPP_URL, PHONE_NUMBER_DISPLAY } from "../lib/constants";

const FloatingWhatsApp: React.FC = () => {
  const { pathname } = useRouter();

  // Hidden on /contact (the page IS the contact surface) and on the home
  // page, where it floated over the portfolio; the footer carries WhatsApp.
  if (pathname === "/contact" || pathname === "/") return null;

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat on WhatsApp at ${PHONE_NUMBER_DISPLAY}`}
      className="md:hidden fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center border border-sage bg-charcoal/90 text-sage backdrop-blur-sm transition-colors duration-300 hover:bg-sage hover:text-charcoal"
    >
      <MessageCircle size={22} strokeWidth={1.5} />
    </a>
  );
};

export default FloatingWhatsApp;

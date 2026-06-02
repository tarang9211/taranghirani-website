import React from "react";
import { useRouter } from "next/router";
import { MessageCircle } from "lucide-react";
import { WHATSAPP_URL, PHONE_NUMBER_DISPLAY } from "../lib/constants";

const FloatingWhatsApp: React.FC = () => {
  const { pathname } = useRouter();

  if (pathname === "/contact") return null;

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat on WhatsApp at ${PHONE_NUMBER_DISPLAY}`}
      className="md:hidden fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-charcoal border border-sage text-sage shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-colors duration-300 hover:bg-sage hover:text-charcoal"
    >
      <MessageCircle size={22} strokeWidth={1.5} />
    </a>
  );
};

export default FloatingWhatsApp;

import React from "react";
import { useRouter } from "next/router";
import { Playfair_Display, Source_Sans_3 } from "next/font/google";
import Navbar from "./Navbar";
import Footer from "./Footer";
import FloatingWhatsApp from "./FloatingWhatsApp";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { pathname } = useRouter();
  const isHome = pathname === "/";
  const isGallery = pathname === "/gallery";
  const isBlog = pathname.startsWith("/blog");
  const isContact = pathname === "/contact";
  const needsTopPadding = !isHome && !isGallery && !isBlog && !isContact;

  return (
    <div
      className={`${playfair.variable} ${sourceSans.variable} min-h-screen bg-paper text-charcoal font-body flex flex-col`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:border focus:border-sage focus:bg-charcoal focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main" className={`flex-grow ${needsTopPadding ? "pt-24" : ""}`}>
        {children}
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default Layout;

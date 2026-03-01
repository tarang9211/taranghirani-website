import React from "react";
import { useRouter } from "next/router";
import { Playfair_Display, Source_Sans_3 } from "next/font/google";
import Navbar from "./Navbar";
import Footer from "./Footer";

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
  const needsTopPadding = !isHome && !isGallery;

  return (
    <div
      className={`${playfair.variable} ${sourceSans.variable} min-h-screen bg-paper text-charcoal font-body flex flex-col`}
    >
      <Navbar />
      <main className={`flex-grow ${needsTopPadding ? "pt-24" : ""}`}>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;

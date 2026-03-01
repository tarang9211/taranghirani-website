import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { INSTAGRAM_URL } from "../lib/constants";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/gallery", label: "Gallery" },
];

const getLinkClasses = (
  currentPath: string,
  href: string,
  scrolled: boolean
) => {
  const isActive = currentPath === href;
  const baseClasses =
    "font-display tracking-[0.12em] uppercase transition-colors text-xs";
  const inactiveClasses = scrolled
    ? "text-smoke/60 hover:text-charcoal"
    : "text-white/60 hover:text-white";
  const activeClasses = scrolled
    ? "text-charcoal"
    : "text-white";

  return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
};

const Navbar: React.FC = () => {
  const { pathname } = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    if (!isHome) {
      setScrolled(true);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  return (
    <nav
      className={`fixed top-0 z-50 w-full py-5 px-6 transition-all duration-500 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.06)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link
          href="/"
          className={`text-2xl md:text-3xl font-semibold font-display transition-colors duration-300 ${
            scrolled
              ? "text-charcoal hover:text-smoke"
              : "text-white hover:text-white/80"
          }`}
        >
          Tarang Hirani
        </Link>
        <div className="flex items-center space-x-8">
          {navItems.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={getLinkClasses(pathname, href, scrolled)}
              aria-current={pathname === href ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
          <Link
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`font-display tracking-[0.12em] uppercase transition-colors text-xs ${
              scrolled
                ? "text-smoke/60 hover:text-charcoal"
                : "text-white/60 hover:text-white"
            }`}
          >
            Instagram
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Menu, X } from "lucide-react";
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
  const [mobileOpen, setMobileOpen] = useState(false);
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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [mobileOpen]);

  const toggleMobile = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  const textColor = scrolled || mobileOpen ? "text-charcoal" : "text-white";
  const textColorMuted = scrolled || mobileOpen
    ? "text-smoke/60 hover:text-charcoal"
    : "text-white/60 hover:text-white";

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        scrolled || mobileOpen
          ? "bg-white/90 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.06)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between py-5 px-6">
        <Link
          href="/"
          className={`text-2xl md:text-3xl font-semibold font-display transition-colors duration-300 ${
            scrolled || mobileOpen
              ? "text-charcoal hover:text-smoke"
              : "text-white hover:text-white/80"
          }`}
        >
          Tarang Hirani
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center space-x-8">
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

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={toggleMobile}
          className={`md:hidden p-2 -mr-2 transition-colors ${textColorMuted}`}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <X size={22} strokeWidth={1.5} />
          ) : (
            <Menu size={22} strokeWidth={1.5} />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-black/5 bg-white/90 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-1">
            {navItems.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`block py-3 font-display tracking-[0.12em] uppercase text-sm transition-colors ${
                  pathname === href
                    ? "text-charcoal"
                    : "text-smoke/60 hover:text-charcoal"
                }`}
                aria-current={pathname === href ? "page" : undefined}
              >
                {label}
              </Link>
            ))}
            <Link
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block py-3 font-display tracking-[0.12em] uppercase text-sm text-smoke/60 hover:text-charcoal transition-colors"
            >
              Instagram
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

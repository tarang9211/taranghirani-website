import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Menu, X, ChevronDown } from "lucide-react";
import { workshopsByRegion } from "../lib/workshops";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/workshops", label: "Workshops" },
  { href: "/gallery", label: "Gallery" },
  { href: "/blog", label: "Field Notes" },
];

const workshopGroups = workshopsByRegion();

// Promoted to a CTA pill. Swap to the /workshops item to drive the funnel top instead.
const ctaItem = { href: "/contact", label: "Contact" };

const isActivePath = (currentPath: string, href: string) =>
  currentPath === href ||
  (href !== "/" && currentPath.startsWith(href + "/"));

const getLinkClasses = (
  currentPath: string,
  href: string,
  scrolled: boolean,
) => {
  const isActive = isActivePath(currentPath, href);
  const baseClasses =
    "relative inline-flex items-center py-1 font-display tracking-[0.1em] uppercase text-sm transition-colors after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-sage after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100";
  const inactiveClasses = scrolled
    ? "text-smoke hover:text-charcoal"
    : "text-white/80 hover:text-white";
  const activeClasses = scrolled
    ? "text-charcoal font-medium after:scale-x-100"
    : "text-white font-medium after:scale-x-100";

  return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
};

const ctaClasses =
  "inline-flex items-center rounded-full bg-sage px-5 py-2 font-display tracking-[0.1em] uppercase text-sm text-charcoal transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:brightness-95";

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
  const textColorMuted =
    scrolled || mobileOpen
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
          className={`text-2xl md:text-3xl font-semibold font-display transition-all duration-500 ${
            scrolled || mobileOpen
              ? "text-charcoal hover:text-smoke opacity-100"
              : isHome
                ? "text-white opacity-0 pointer-events-none"
                : "text-white hover:text-white/80 opacity-100"
          }`}
        >
          Tarang Hirani
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map(({ href, label }) =>
            href === "/workshops" && workshopGroups.length > 0 ? (
              <div key={href} className="group relative">
                <Link
                  href={href}
                  className={`${getLinkClasses(pathname, href, scrolled)} gap-1`}
                  aria-haspopup="true"
                  aria-current={pathname === href ? "page" : undefined}
                >
                  {label}
                  <ChevronDown
                    size={14}
                    strokeWidth={2}
                    aria-hidden
                    className="transition-transform duration-300 group-hover:rotate-180"
                  />
                </Link>

                {/* Dropdown panel — revealed on hover or keyboard focus */}
                <div className="invisible absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 pt-4 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <div className="overflow-hidden rounded-lg border border-charcoal/10 bg-white/95 p-2 shadow-lg backdrop-blur-md">
                    <Link
                      href="/workshops"
                      className="block rounded px-3 py-2 font-display text-sm uppercase tracking-[0.1em] text-charcoal transition-colors hover:bg-paper hover:text-sage"
                    >
                      All workshops
                    </Link>
                    {workshopGroups.map((group) => (
                      <div key={group.region} className="mt-1">
                        <p className="px-3 pb-1 pt-2 text-[10px] font-medium uppercase tracking-[0.2em] text-sage">
                          {group.region}
                        </p>
                        {group.items.map((w) => (
                          <Link
                            key={w.slug}
                            href={w.href}
                            className="block rounded px-3 py-2 transition-colors hover:bg-paper"
                            aria-current={
                              pathname === w.href ? "page" : undefined
                            }
                          >
                            <span className="block font-display text-sm text-charcoal">
                              {w.location}
                            </span>
                            <span className="mt-0.5 block text-xs text-smoke">
                              {w.dateLabel}
                            </span>
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={href}
                href={href}
                className={getLinkClasses(pathname, href, scrolled)}
                aria-current={pathname === href ? "page" : undefined}
              >
                {label}
              </Link>
            ),
          )}
          <Link
            href={ctaItem.href}
            className={ctaClasses}
            aria-current={pathname === ctaItem.href ? "page" : undefined}
          >
            {ctaItem.label}
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
              <React.Fragment key={href}>
                <Link
                  href={href}
                  className={`block py-3 font-display tracking-[0.1em] uppercase text-base transition-colors ${
                    isActivePath(pathname, href)
                      ? "text-charcoal font-medium"
                      : "text-smoke hover:text-charcoal"
                  }`}
                  aria-current={
                    isActivePath(pathname, href) ? "page" : undefined
                  }
                >
                  {label}
                </Link>
                {href === "/workshops" &&
                  workshopGroups.flatMap((group) =>
                    group.items.map((w) => (
                      <Link
                        key={w.slug}
                        href={w.href}
                        className={`block border-l border-charcoal/10 py-2 pl-4 transition-colors ${
                          pathname === w.href
                            ? "text-charcoal"
                            : "text-smoke hover:text-charcoal"
                        }`}
                        aria-current={pathname === w.href ? "page" : undefined}
                      >
                        <span className="block text-sm">{w.location}</span>
                        <span className="block text-xs text-smoke/70">
                          {w.dateLabel}
                        </span>
                      </Link>
                    )),
                  )}
              </React.Fragment>
            ))}
            <Link
              href={ctaItem.href}
              className="mt-3 block w-full rounded-full bg-sage px-5 py-3 text-center font-display tracking-[0.1em] uppercase text-base text-charcoal transition-all duration-300 hover:brightness-95"
              aria-current={
                pathname === ctaItem.href ? "page" : undefined
              }
            >
              {ctaItem.label}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

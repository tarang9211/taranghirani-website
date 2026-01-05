import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { INSTAGRAM_URL } from "../lib/constants";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/gallery", label: "Gallery" },
];

const getLinkClasses = (currentPath: string, href: string) => {
  const isActive = currentPath === href;
  const baseClasses = "font-display tracking-[0.1em] uppercase transition-colors";
  const inactiveClasses = "text-gray-500 hover:text-charcoal";
  const activeClasses = "text-charcoal border-b border-sage";

  return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
};

const Navbar: React.FC = () => {
  const { pathname } = useRouter();

  return (
    <nav className="sticky top-0 z-50 w-full bg-paper text-charcoal py-4 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
        <Link
          href="/"
          className="text-3xl md:text-4xl font-semibold font-display hover:text-gray-600 transition-colors"
        >
          Tarang Hirani
        </Link>
        <div className="flex space-x-6 md:space-x-8 text-xs md:text-sm font-medium">
          {navItems.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={getLinkClasses(pathname, href)}
              aria-current={pathname === href ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
          <Link
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-display tracking-[0.1em] uppercase transition-colors text-gray-500 hover:text-charcoal"
          >
            Instagram
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

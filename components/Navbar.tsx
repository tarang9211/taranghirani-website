import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/gallery", label: "Gallery" },
];

const getLinkClasses = (currentPath: string, href: string) => {
  const isActive = currentPath === href;
  const baseClasses = "font-display tracking-[0.1em] uppercase transition-colors";
  const inactiveClasses = "text-gray-400 hover:text-gray-200";
  const activeClasses = "text-white border-b border-white";

  return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
};

const Navbar: React.FC = () => {
  const { pathname } = useRouter();

  return (
    <nav className="sticky top-0 z-50 w-full bg-black text-white py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="text-4xl font-semibold font-display hover:text-gray-300 transition-colors"
        >
          Tarang Hirani
        </Link>
        <div className="flex space-x-8 text-sm font-medium">
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

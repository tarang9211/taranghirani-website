// /testimonials is a temporary redirect to the home page until at least one
// guest story is published (lib/testimonials.ts hides the nav item and home
// block in the same state; next-sitemap.config.js drops the route). Read from
// the JSON directly because this file is CommonJS.
const testimonials = require("./lib/testimonials.json");
const hasTestimonials = testimonials.some((t) => t.published === true);

module.exports = {
  // Inlined at build so the Navbar can show/hide the item without bundling
  // the testimonial text into every page.
  env: { NEXT_PUBLIC_HAS_TESTIMONIALS: String(hasTestimonials) },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  async redirects() {
    return [
      // Domain move: www.asilisafaris.in is the canonical host. The old domain
      // and the bare apex go there page for page in one 308 hop. These run
      // inside the app, so they hold even if a Vercel domain-level redirect is
      // missing or still set to 307. Keep them indefinitely: old links and
      // Google's index point at taranghirani.com.
      {
        source: "/:path*",
        has: [{ type: "host", value: "(www\\.)?taranghirani\\.com" }],
        destination: "https://www.asilisafaris.in/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "asilisafaris\\.in" }],
        destination: "https://www.asilisafaris.in/:path*",
        permanent: true,
      },
      { source: "/index", destination: "/", permanent: true },
      { source: "/workshops", destination: "/destinations", permanent: true },
      // The Jan 2027 departure merged into the single Panna page; keep old
      // links working (before the wildcard so /workshops/panna-jan is one hop).
      {
        source: "/workshops/panna-jan",
        destination: "/destinations/panna",
        permanent: true,
      },
      {
        source: "/destinations/panna-jan",
        destination: "/destinations/panna",
        permanent: true,
      },
      {
        source: "/workshops/:path*",
        destination: "/destinations/:path*",
        permanent: true,
      },
      ...(hasTestimonials
        ? []
        : [{ source: "/testimonials", destination: "/", permanent: false }]),
    ];
  },
};

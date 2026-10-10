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

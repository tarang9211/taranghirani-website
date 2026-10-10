const testimonials = require("./lib/testimonials.json");

// /testimonials redirects to the home page (and the nav item is hidden) until
// at least one entry is published, so keep it out of the sitemap until then.
// Mirrors the `published` check in lib/testimonials.ts.
const hasTestimonials = testimonials.some((t) => t.published === true);

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.taranghirani.com",
  generateRobotsTxt: false,
  outDir: "public",
  exclude: hasTestimonials ? [] : ["/testimonials"],
};

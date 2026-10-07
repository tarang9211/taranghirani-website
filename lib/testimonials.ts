import raw from "./testimonials.json";

// Guest testimonials: the single source of truth for the home-page block
// ("In their words.") and the /testimonials page.
//
// Add entries with `yarn testimonial:add` (guided prompts), which appends to
// lib/testimonials.json. `yarn testimonial:sample` seeds the design-handoff
// placeholders (ids prefixed "sample-") so the populated layout can be
// previewed locally; those ids are refused on Vercel (see the guard below)
// and must never be committed. See PRODUCT.md: real guest words only.
//
// Kept as JSON (not TS) so next-sitemap.config.js and the CLI can read and
// write the same file.

export const REGION_ORDER = ["India", "Africa"] as const;
export type Region = (typeof REGION_ORDER)[number];

export interface Testimonial {
  // Slug, used as the row anchor: /testimonials#<id>
  id: string;
  name: string;
  // "Panna, MP"
  place: string;
  region: Region;
  // "January 2026 workshop"
  when: string;
  // Shown on home cards as "PLACE · YEAR"
  year: string;
  // Full Cloudinary URL. Omit to show no avatar (never an empty frame).
  photo?: string;
  // Pull quote, roughly 15–20 words.
  short: string;
  // Full testimonial.
  full: string;
  // Matching workshop page, e.g. "/destinations/panna". Omit to show no link.
  workshopHref?: string;
  // Picks the (up to) 3 shown on the home page.
  featured?: boolean;
  // Unpublished entries are ignored everywhere.
  published: boolean;
}

const ALL = raw as unknown as Testimonial[];

function validate(entries: Testimonial[]) {
  const seen = new Set<string>();
  for (const t of entries) {
    if (!t.id || !/^[a-z0-9-]+$/.test(t.id)) {
      throw new Error(
        `testimonials.json: invalid id "${t.id}" (lowercase slug expected)`,
      );
    }
    if (seen.has(t.id)) {
      throw new Error(`testimonials.json: duplicate id "${t.id}"`);
    }
    seen.add(t.id);
    if (!(REGION_ORDER as readonly string[]).includes(t.region)) {
      throw new Error(
        `testimonials.json: "${t.id}" has region "${t.region}"; expected one of ${REGION_ORDER.join(", ")}`,
      );
    }
    if (!/^\d{4}$/.test(t.year)) {
      throw new Error(
        `testimonials.json: "${t.id}" has year "${t.year}"; expected 4 digits`,
      );
    }
    if (!t.name || !t.short || !t.full || !t.place || !t.when) {
      throw new Error(
        `testimonials.json: "${t.id}" is missing a required field`,
      );
    }
  }
  // Placeholder entries from `yarn testimonial:sample` can never be deployed.
  if (process.env.VERCEL && entries.some((t) => t.id.startsWith("sample-"))) {
    throw new Error(
      "testimonials.json contains sample-* placeholder entries. Remove them before deploying (see lib/testimonials.ts).",
    );
  }
}

validate(ALL);

// Published entries, most recent year first (stable within a year).
export function publishedTestimonials(): Testimonial[] {
  return ALL.filter((t) => t.published).sort((a, b) =>
    b.year.localeCompare(a.year),
  );
}

export function hasTestimonials(): boolean {
  return publishedTestimonials().length > 0;
}

// The home-page picks: featured entries first; if none are flagged, the most
// recent published ones. Returns fewer than `limit` when fewer exist.
export function featuredTestimonials(limit = 3): Testimonial[] {
  const published = publishedTestimonials();
  const featured = published.filter((t) => t.featured);
  return (featured.length > 0 ? featured : published).slice(0, limit);
}

// Regions with at least one published story, in display order. Drives the
// filter buttons so a region with no stories never gets a dead button.
export function testimonialRegions(): Region[] {
  const published = publishedTestimonials();
  return REGION_ORDER.filter((r) => published.some((t) => t.region === r));
}

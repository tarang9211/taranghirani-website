// Single source of truth for fixed-date workshops, surfaced both on the home
// page and the /workshops page so the two never drift apart.

const CLOUDINARY_BASE =
  "https://res.cloudinary.com/duiyn8wll/image/upload/f_auto,q_auto";

export const REGION_ORDER = ["India", "Africa"] as const;
export type Region = (typeof REGION_ORDER)[number];

export interface Workshop {
  slug: string;
  href: string;
  title: string;
  region: Region;
  location: string;
  dateLabel: string;
  summary: string;
  // Price-free one-liner used where we don't want to lead with cost (home page).
  shortSummary: string;
  image: string;
  imageAlt: string;
}

export const UPCOMING_WORKSHOPS: Workshop[] = [
  {
    slug: "panna-october-2026",
    href: "/workshops/panna-october-2026",
    title: "Wildlife Photography Workshop — Panna",
    region: "India",
    location: "Panna, Madhya Pradesh",
    dateLabel: "Oct 21–25, 2026",
    summary:
      "4 nights / 5 days · 6 safaris · ₹84,999 per person (twin sharing). Limited seats, first come, first served.",
    shortSummary: "Limited seats, first come, first served.",
    image: `${CLOUDINARY_BASE}/_Z9_20250508_TMH_8461_wm_vwr6rk`,
    imageAlt:
      "A tiger cooling in a forest pool at the water's edge, framed by dense central-India woodland in golden light",
  },
];

// Upcoming workshops grouped by region, in display order, skipping empty
// regions. Drives the Workshops nav dropdown.
export function workshopsByRegion(): { region: Region; items: Workshop[] }[] {
  return REGION_ORDER.map((region) => ({
    region,
    items: UPCOMING_WORKSHOPS.filter((w) => w.region === region),
  })).filter((group) => group.items.length > 0);
}

// Single source of truth for fixed-date workshops, surfaced both on the home
// page and the /destinations page so the two never drift apart.

const CLOUDINARY_BASE =
  "https://res.cloudinary.com/duiyn8wll/image/upload/f_auto,q_auto";

export const REGION_ORDER = ["India", "Africa"] as const;
export type Region = (typeof REGION_ORDER)[number];

export interface Workshop {
  slug: string;
  // Omitted for placeholder ("coming soon") entries that have no detail page yet.
  href?: string;
  title: string;
  region: Region;
  location: string;
  dateLabel: string;
  summary: string;
  // Price-free one-liner used where we don't want to lead with cost (home page).
  shortSummary: string;
  image: string;
  imageAlt: string;
  // A teaser for an upcoming trip whose dates aren't set: rendered as a
  // non-clickable card, hidden from the home page and the nav dropdown.
  comingSoon?: boolean;
}

export const UPCOMING_WORKSHOPS: Workshop[] = [
  {
    slug: "panna",
    href: "/destinations/panna",
    title: "Wildlife Photography Workshop — Panna",
    region: "India",
    location: "Panna, Madhya Pradesh",
    dateLabel: "Nov 26–29, 2026",
    summary:
      "3 nights / 4 days · 6 safaris · Price on enquiry (twin sharing). Limited seats, first come, first served.",
    shortSummary: "Limited seats, first come, first served.",
    image: `${CLOUDINARY_BASE}/_Z9_20250508_TMH_8461_wm_vwr6rk`,
    imageAlt:
      "A tiger cooling in a forest pool at the water's edge, framed by dense central-India woodland in golden light",
  },
  {
    slug: "panna-feb",
    title: "Wildlife Photography Workshop — Panna",
    region: "India",
    location: "Panna, Madhya Pradesh",
    dateLabel: "February",
    summary:
      "Dates yet to be announced — a second Panna trip is in the works.",
    shortSummary: "Dates yet to be announced.",
    image: `${CLOUDINARY_BASE}/_Z9_20250508_TMH_8461_wm_vwr6rk`,
    imageAlt:
      "A tiger cooling in a forest pool at the water's edge, framed by dense central-India woodland in golden light",
    comingSoon: true,
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

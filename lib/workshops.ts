// Single source of truth for fixed-date workshops: a list of destinations,
// each with its scheduled departures. Drives the nav dropdown, the home page
// cards, the /destinations listing, and each destination's detail page, so
// they never drift apart.

const CLOUDINARY_BASE =
  "https://res.cloudinary.com/duiyn8wll/image/upload/f_auto,q_auto";

export const COUNTRY_ORDER = ["India", "Kenya"] as const;
export type Country = (typeof COUNTRY_ORDER)[number];

// Visibility is driven entirely by this manual flag — nothing is computed
// from today's date. "expired" departures disappear from every surface but
// stay in the file as a record of trips that ran.
export type DepartureStatus = "open" | "sold-out" | "expired";

export interface Departure {
  // Stable key: React keys, on-page anchors (#nov-2026), enquiry context.
  id: string;
  startDate: string; // ISO, e.g. "2026-11-26"
  endDate: string; // ISO, e.g. "2026-11-29"
  status: DepartureStatus;
  maxParticipants: number;
  // One line of per-departure flavor, shown on its dates card.
  seasonNote?: string;
}

export interface Destination {
  slug: string; // detail page lives at /destinations/<slug>
  name: string; // "Panna"
  country: Country;
  location: string; // "Panna, Madhya Pradesh"
  summary: string;
  // Price-free one-liner used where we don't want to lead with cost (home page).
  shortSummary: string;
  image: string;
  imageAlt: string;
  departures: Departure[];
}

export const DESTINATIONS: Destination[] = [
  {
    slug: "panna",
    name: "Panna",
    country: "India",
    location: "Panna, MP",
    summary:
      "3 nights / 4 days · 6 safaris · Price on enquiry (twin sharing). Limited seats, first come, first served.",
    shortSummary: "Limited seats, first come, first served.",
    image: `${CLOUDINARY_BASE}/_Z9_20250508_TMH_8461_wm_vwr6rk`,
    imageAlt:
      "A tiger cooling in a forest pool at the water's edge, framed by dense central-India woodland in golden light",
    departures: [
      {
        id: "nov-2026",
        startDate: "2026-11-26",
        endDate: "2026-11-29",
        status: "sold-out",
        maxParticipants: 6,
        seasonNote:
          "Early in the season — the forest still fresh after the monsoon, soft light, and a quiet, uncrowded park.",
      },
      {
        id: "jan-2027",
        startDate: "2027-01-21",
        endDate: "2027-01-24",
        status: "open",
        maxParticipants: 6,
        seasonNote:
          "The heart of Panna's winter — crisp, misty mornings and wildlife increasingly drawn to the Ken as the forest dries.",
      },
    ],
  },
];

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Parse ISO date parts by hand: new Date("YYYY-MM-DD") is UTC midnight, so
// .getDate() shifts a day backwards in timezones west of Greenwich.
function parseISO(iso: string): { y: number; m: number; d: number } {
  const [y, m, d] = iso.split("-").map(Number);
  return { y, m, d };
}

function addDays(iso: string, days: number): string {
  const { y, m, d } = parseISO(iso);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

// "Nov 26"
export function formatDayDate(iso: string): string {
  const { m, d } = parseISO(iso);
  return `${MONTHS[m - 1]} ${d}`;
}

// "Nov 26–29, 2026" · "Nov 30 – Dec 3, 2026" · "Dec 30, 2026 – Jan 2, 2027"
export function formatDateRange(dep: Departure): string {
  const s = parseISO(dep.startDate);
  const e = parseISO(dep.endDate);
  if (s.y === e.y && s.m === e.m) {
    return `${MONTHS[s.m - 1]} ${s.d}–${e.d}, ${s.y}`;
  }
  if (s.y === e.y) {
    return `${MONTHS[s.m - 1]} ${s.d} – ${MONTHS[e.m - 1]} ${e.d}, ${s.y}`;
  }
  return `${MONTHS[s.m - 1]} ${s.d}, ${s.y} – ${MONTHS[e.m - 1]} ${e.d}, ${e.y}`;
}

// The full days between arrival and departure — "Nov 27–28" for a Nov 26–29
// trip. Empty string when the trip has no full middle days.
export function middleRange(dep: Departure): string {
  const first = addDays(dep.startDate, 1);
  const last = addDays(dep.endDate, -1);
  if (first > last) return "";
  if (first === last) return formatDayDate(first);
  const f = parseISO(first);
  const l = parseISO(last);
  if (f.y === l.y && f.m === l.m) {
    return `${MONTHS[f.m - 1]} ${f.d}–${l.d}`;
  }
  return `${formatDayDate(first)} – ${formatDayDate(last)}`;
}

export function visibleDepartures(dest: Destination): Departure[] {
  return dest.departures
    .filter((d) => d.status !== "expired")
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
}

export function activeDestinations(): Destination[] {
  return DESTINATIONS.filter((d) => visibleDepartures(d).length > 0);
}

// Active destinations grouped by country, in display order, skipping empty
// countries. Drives the Workshops nav dropdown and the listing cards.
export function destinationsByCountry(): {
  country: Country;
  items: Destination[];
}[] {
  const active = activeDestinations();
  return COUNTRY_ORDER.map((country) => ({
    country,
    items: active.filter((d) => d.country === country),
  })).filter((group) => group.items.length > 0);
}

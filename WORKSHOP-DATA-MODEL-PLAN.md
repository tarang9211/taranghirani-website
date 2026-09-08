# Centralized Workshop Data Model

## Context

Workshop data is scattered across four disconnected places: `lib/workshops.ts` (one entry **per departure**, feeding only nav + cards), two ~590-line near-identical pages (`pages/destinations/panna.tsx` Nov 2026, `pages/destinations/panna-jan.tsx` Jan 2027 — only ~40 lines differ), and the poster scripts. Adding or expiring a departure means touching several files, the nav/home show duplicate Panna cards, and the two near-identical pages compete in search.

Goal: one data model — a list of **destinations**, each with a **country** and multiple **departures** — consumed by nav, home page, workshops/destinations page, and destination pages.

## Decisions (locked in interview)

1. **One page per destination** — merge the two Panna pages into `/destinations/panna`; 301-redirect `/destinations/panna-jan`.
2. **Visibility driven by a manual status** per departure: `open | soldOut | expired`. No auto-expiry from today's date. `expired` vanishes everywhere (record stays in the file).
3. **Country replaces Region** as the grouping key ("India" / "Kenya"…); the "Africa" group label goes away.
4. **Minimal model scope**: identity, country, ISO start/end dates, capacity, status, seasonNote, card copy/image. Itinerary/inclusions/prose stay hand-authored in the page.
5. **Pages stay hand-authored**, importing their entry from the model (no fully data-driven `[slug].tsx`).
6. **Lists show one entry per destination** with all visible dates stacked (soldOut gets a badge).
7. **Capacity only** (`maxParticipants`) — no seats-filled tracking.
8. **Real dates live on the departure cards, not the itinerary headings**: each departure card carries a compact derived schedule line ("Arrive Nov 26 · Workshop Nov 27–28 · Depart Nov 29"); the main itinerary uses generic "Day 1 / Days 2–3 / Day 4" headings. No date selector/toggle UI. All dates **derived** from `startDate`/`endDate`, never stored.
9. Masai Mara/Kanha were examples only — no dateless-destination support needed now.

## Data model (`lib/workshops.ts` — full rewrite)

```ts
export const COUNTRY_ORDER = ["India", "Kenya"] as const; // extend as trips are added
export type Country = (typeof COUNTRY_ORDER)[number];

export type DepartureStatus = "open" | "soldOut" | "expired";

export interface Departure {
  id: string;               // "nov-2026" — stable key: anchors, enquiry context, React keys
  startDate: string;        // ISO "2026-11-26"
  endDate: string;          // ISO "2026-11-29"
  status: DepartureStatus;  // manual flip; "expired" hides it everywhere
  maxParticipants: number;  // 6
  seasonNote?: string;      // one line of per-date flavor, shown on the departure card
}

export interface Destination {
  slug: string;             // "panna" → /destinations/panna (href derived, not stored)
  name: string;             // "Panna" (kills the title.split(" — ") hack)
  country: Country;
  location: string;         // "Panna, Madhya Pradesh"
  summary: string;          // workshops-page card copy (existing value carried over)
  shortSummary: string;     // home-page card copy (existing value carried over)
  image: string;            // Cloudinary URL
  imageAlt: string;
  departures: Departure[];
}

export const DESTINATIONS: Destination[] = [{
  slug: "panna", name: "Panna", country: "India", location: "Panna, Madhya Pradesh",
  summary: /* carry over */, shortSummary: /* carry over */, image: /* carry over */, imageAlt: /* carry over */,
  departures: [
    { id: "nov-2026", startDate: "2026-11-26", endDate: "2026-11-29", status: "open", maxParticipants: 6,
      seasonNote: "Early season — the forest fresh after the monsoon, soft light, a quiet park." },
    { id: "jan-2027", startDate: "2027-01-21", endDate: "2027-01-24", status: "open", maxParticipants: 6,
      seasonNote: "The heart of Panna's winter — crisp, misty mornings, wildlife drawn to the Ken as the forest dries." },
  ],
}];
```

Helpers (same file):

- `formatDateRange(dep): string` → "Nov 26–29, 2026". **Parse ISO parts manually** (`split("-")` + month lookup) — `new Date("YYYY-MM-DD")` is UTC midnight and off-by-one in negative-offset TZs. Handle same-month / cross-month / cross-year.
- `formatDayDate(iso): string` → "Nov 26" (departure-card schedule lines), same manual parsing; `middleRange(dep)` → "Nov 27–28" for the workshop days between start and end.
- `visibleDepartures(dest)` — `status !== "expired"`, sorted by `startDate` (ISO sorts lexicographically).
- `activeDestinations()` — destinations with ≥1 visible departure.
- `destinationsByCountry(): { country, items }[]` — grouped by `COUNTRY_ORDER`, empty countries dropped. Replaces `workshopsByRegion()`.

Delete: `Workshop`, `Region`, `REGION_ORDER`, `UPCOMING_WORKSHOPS`, `workshopsByRegion`, the dead `comingSoon` flag.

## Consumers

### `components/Navbar.tsx`

- `const groups = destinationsByCountry()` (module scope is fine — data is static; status changes ship via redeploy).
- Desktop dropdown (~lines 116–162) and mobile list (~218–237): outer loop = country header, inner = one `<Link href={`/destinations/${d.slug}`}>` per destination showing `d.location` with one small line per visible departure (`formatDateRange` + "Sold out" badge when applicable). Dates are display text inside the single link.

### `components/UpcomingWorkshops.tsx`

- One card per `activeDestinations()` entry; drop `includeComingSoon` prop and all `comingSoon` branches; cards always link.
- Replace `w.title.split(" — ")[0]` (line 79) with `dest.name` / static "Wildlife Photography Workshop" per `concise`.
- Card shows `summary`/`shortSummary` plus a stacked dates block (one line per visible departure, sold-out pill).
- Call sites: `pages/index.tsx:70` unchanged; `pages/destinations.tsx:413` must drop `includeComingSoon` (build breaks otherwise).

### Merged `pages/destinations/panna.tsx` (delete `panna-jan.tsx`)

- Top of file: `const dest = DESTINATIONS.find(d => d.slug === "panna")!; const departures = visibleDepartures(dest);`
- **"Dates & availability" section** (`id="dates"`): one card per departure, `id={dep.id}`, `scroll-mt-24`. Card = `formatDateRange(dep)` heading; a compact derived schedule line `Arrive ${formatDayDate(dep.startDate)} · Workshop ${middleRange(dep)} · Depart ${formatDayDate(dep.endDate)}`; `seasonNote`; `Limited to ${dep.maxParticipants} participants`; sold-out badge; and an "Enquire about these dates →" CTA. **No date selector UI** — this section is where real dates live.
- **Itinerary stays generic**: the 3 blocks (Arrival / Workshop / Morning safari & departure) render once with "Day 1", "Days 2–3", "Day 4" headings (rename the block field `date` → `day`). Activity content is identical across departures today, so nothing else changes.
- **Enquiry per departure**: minimal state only for prefill — `const [enquiry, setEnquiry] = useState(departures.find(d => d.status === "open") ?? departures[0])`; each card's CTA is `<a href="#enquire" onClick={() => setEnquiry(dep)}>` (native anchor scroll preserved). Form: `<ContactForm key={enquiry.id} source="workshops" subject={subjectFor(enquiry)} defaultMessage={messageFor(enquiry)} …/>` — the `key` remount is required because `defaultMessage` feeds `defaultValue` (ignores prop updates); remount wipes typed input if the visitor switches dates mid-typing — accepted, comment it. Subject: `` `Panna Wildlife Photography Workshop — ${formatDateRange(enquiry)}` `` (54 chars; API caps are 160 subject / 5000 message — `pages/api/contact.ts` `MAX_LEN`). WhatsApp href computed in-render from `enquiry` so leads carry the date.
- **Meta**: `PAGE_TITLE` stays date-free; `PAGE_DESCRIPTION` includes `departures.map(formatDateRange).join(" and ")`, trimmed to ~160 chars. Hero subline lists both date ranges. FACTS "Dates" row = joined ranges; "Group size" derives from `maxParticipants`.
- **JSON-LD**: one `<script type="application/ld+json">` with an **array** of `Event` objects, one per visible departure — per-departure `startDate`/`endDate`, `offers.availability` = `SoldOut` when sold out else `LimitedAvailability` (no price, as today), `offers.url = ${PAGE_URL}#${dep.id}` to disambiguate. `validFrom` = one page-level const (model deliberately has no per-departure field). Render the script only when `departures.length > 0`.
- **Prose merge**: season paragraphs → generalized (nuance lives in seasonNotes); flights paragraph → the Jan page's hedged version ("timings indicative; check schedules closer to your dates").
- If ALL departures are ever expired: page stays live; show a one-line "No upcoming dates — enquire for the next departure" fallback + generic enquiry CTA, and no JSON-LD script.

### `next.config.js`

Add to the existing `redirects()` array: `{ source: "/destinations/panna-jan", destination: "/destinations/panna", permanent: true }` (optionally also `/workshops/panna-jan → /destinations/panna` before the wildcard to avoid a 2-hop chain).

### Sitemap

`next-sitemap` regenerates from routes on `yarn build` — deleting `panna-jan.tsx` drops its URL automatically. Commit the regenerated `public/sitemap*.xml`.

## Step order (each step leaves the build green)

1. Rewrite `lib/workshops.ts` + update `Navbar.tsx` + `UpcomingWorkshops.tsx` + both call sites (must land together — the old exports disappear).
2. Merge `panna.tsx` (departures section, enquiry prefill, JSON-LD array, prose merge).
3. Delete `panna-jan.tsx` + add redirect(s).
4. Cleanup: `grep -rn "comingSoon\|dateLabel\|UPCOMING_WORKSHOPS\|workshopsByRegion\|REGION_ORDER\|panna-jan" pages components lib` → zero hits. Update stale `WORKSHOP-STRUCTURE.md`/`PRODUCT.md` notes (panna-feb references). Build.

## Verification

- `yarn build` passes; regenerated `public/sitemap-0.xml` has `/destinations/panna`, no `panna-jan`.
- `curl -I localhost:3000/destinations/panna-jan` → 308 → `/destinations/panna`; check `/workshops/panna-jan` resolves too.
- Nav desktop + mobile: one Panna entry under an "India" header with both dates stacked. Locally toggle a departure to `soldOut` (badge appears) and `expired` (line disappears); expire both → Panna leaves nav and cards entirely.
- Home + `/destinations`: exactly one Panna card, both dates listed.
- On the page: departure cards show derived schedule lines ("Arrive Nov 26 · Workshop Nov 27–28 · Depart Nov 29"); itinerary shows generic Day 1 / Days 2–3 / Day 4 headings; clicking the Jan card's CTA scrolls to `#enquire` with subject/message and WhatsApp link saying "Jan 21–24, 2027"; send a test enquiry and confirm the email/Notion subject.
- View-source: single `ld+json` with a 2-element Event array → Google Rich Results Test, no errors (also test the SoldOut variant).
- `formatDateRange` spot checks: same-month, cross-month, cross-year; confirm no timezone off-by-one.

## Out of scope (noted, not done now)

- Poster scripts reading from this model (nice-to-have).
- Dateless / enquiry-only destinations (Masai Mara etc.) — add when real.

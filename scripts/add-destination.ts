// Guided CLI for adding a workshop destination to lib/destinations.json.
// The entry renders at /destinations/<slug> through the shared template in
// pages/destinations/[slug].tsx, and shows up in the nav, home page and
// /destinations listing once it has an open or sold-out departure.
//
//   yarn destination:add
//
// After adding: `yarn build` regenerates public/sitemap*.xml; commit
// lib/destinations.json together with the sitemap files.
//
// To add dates to an existing destination, edit its `departures` in
// lib/destinations.json directly.
//
// After the name and country, the script researches the place (needs the
// `claude` CLI) and offers the results as defaults. Page copy is asked last and
// is drafted from the research plus the trip details you entered. Press Enter
// to accept a suggestion.

import * as fs from "fs/promises";
import * as path from "path";
import * as readline from "readline";
import { stdin as input, stdout as output } from "process";
import { COUNTRY_ORDER } from "../lib/workshops";
import type {
  Departure,
  DepartureStatus,
  Destination,
  DestinationPage,
} from "../lib/workshops";
import {
  researchDestination,
  writeCopy,
  type Copy,
  type Research,
} from "./research-destination";

const DATA_FILE = path.join(process.cwd(), "lib", "destinations.json");
const STATUSES: readonly DepartureStatus[] = ["open", "sold-out", "expired"];
const MONTH_IDS = "jan feb mar apr may jun jul aug sep oct nov dec".split(" ");
// Defaults per country for the schema.org Event. Extend alongside COUNTRY_ORDER.
const COUNTRY_DEFAULTS: Record<string, { code: string; offset: string }> = {
  India: { code: "IN", offset: "+05:30" },
  Kenya: { code: "KE", offset: "+03:00" },
};

async function readData(): Promise<Destination[]> {
  const parsed = JSON.parse(await fs.readFile(DATA_FILE, "utf8"));
  if (!Array.isArray(parsed))
    throw new Error(`${DATA_FILE} is not a JSON array`);
  return parsed as Destination[];
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isISODate(s: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const [y, m, d] = s.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
}

const isCloudinary = (s: string) => /^https:\/\/res\.cloudinary\.com\//.test(s);

async function main() {
  const rl = readline.createInterface({ input, output });
  // Read lines through the iterator rather than rl.question so piped input
  // isn't dropped between prompts.
  const lines = rl[Symbol.asyncIterator]();
  const ask = async (q: string, fallback = "") => {
    output.write(fallback ? `${q} [${fallback}] ` : `${q} `);
    const next = await lines.next();
    if (next.done) throw new Error("\nInput ended before all fields were set.");
    return next.value.trim() || fallback;
  };
  const askValid = async (
    q: string,
    valid: (a: string) => boolean,
    hint: string,
    fallback = "",
  ) => {
    for (;;) {
      const a = await ask(q, fallback);
      if (a && valid(a)) return a;
      console.log(`  ${hint}`);
    }
  };
  const askRequired = (q: string, fallback = "") =>
    askValid(q, () => true, "This field is required.", fallback);
  const askYesNo = async (q: string, def: boolean) => {
    const a = (await ask(`${q} (${def ? "Y/n" : "y/N"})`)).toLowerCase();
    if (!a) return def;
    return a.startsWith("y");
  };
  const askChoice = async <T extends string>(
    q: string,
    options: readonly T[],
    def?: T,
  ) => {
    for (;;) {
      options.forEach((o, i) => console.log(`  ${i + 1}. ${o}`));
      const a = await ask(q, def ? String(options.indexOf(def) + 1) : "");
      const idx = Number(a) - 1;
      if (Number.isInteger(idx) && options[idx] !== undefined)
        return options[idx];
      const byName = options.find((o) => o.toLowerCase() === a.toLowerCase());
      if (byName) return byName;
      console.log("  Pick a number from the list.");
    }
  };
  // One item per line, finished by an empty line; at least one required.
  // With a suggestion, an empty first line accepts it.
  const askList = async (q: string, suggestion?: string[]) => {
    console.log(`${q} (one per line, finish with an empty line)`);
    if (suggestion?.length) {
      console.log("  Suggested:");
      suggestion.forEach((p) => console.log(`  > ${p}`));
      console.log("  Press Enter to use these, or type your own.");
    }
    const items: string[] = [];
    for (;;) {
      const line = await ask(">");
      if (!line && !items.length && suggestion?.length) return suggestion;
      if (!line && items.length > 0) return items;
      if (line) items.push(line);
    }
  };
  // "Label | text" pairs, e.g. "Length | 3 nights / 4 days".
  const askPairs = async (q: string) => {
    for (;;) {
      const raw = await askList(`${q}, as "left | right"`);
      const pairs = raw.map((l) => l.split("|").map((s) => s.trim()));
      if (pairs.every((p) => p.length === 2 && p[0] && p[1])) return pairs;
      console.log(
        '  Every line needs exactly one "|" with text on both sides.',
      );
    }
  };

  try {
    const existing = await readData();
    const slugs = new Set(existing.map((d) => d.slug));

    console.log(
      "Add a workshop destination. Every field below appears on the public page,",
    );
    console.log(
      "so use real trip details. Paragraphs accept [link text](/path).\n",
    );

    console.log("— Basics");
    const name = await askRequired('Name, e.g. "Panna":');
    const slug = await askValid(
      "Slug (URL: /destinations/<slug>):",
      (s) => /^[a-z0-9-]+$/.test(s) && !slugs.has(s),
      "Lowercase letters, digits and hyphens only, and not already in use.",
      slugify(name),
    );
    const country = await askChoice(
      "Country (number; add new ones to COUNTRY_ORDER in lib/workshops.ts first):",
      COUNTRY_ORDER,
    );

    let r: Research | undefined;
    console.log(
      `\nResearching ${name} (flora, fauna, history). This can take a few minutes...`,
    );
    try {
      r = await researchDestination(name, country);
      const show = (title: string, notes: string[]) => {
        console.log(`\n${title}:`);
        notes.forEach((n) => console.log(`  - ${n}`));
      };
      show("Flora", r.findings.flora);
      show("Fauna", r.findings.fauna);
      show("History", r.findings.history);
      show("Sources", r.sources);
      console.log(
        "\nCheck these facts. Suggestions appear as defaults below.\n",
      );
    } catch (err) {
      console.log(
        `  Research failed, continuing without suggestions: ${err instanceof Error ? err.message : err}\n`,
      );
    }
    const location = await askRequired(
      'Short location for cards, e.g. "Panna, MP":',
      r?.location,
    );
    const fullLocation = await askRequired(
      'Full location for title, h1 and breadcrumb, e.g. "Panna, Madhya Pradesh":',
      r?.fullLocation,
    );
    const summary = await askRequired(
      'Card summary, e.g. "3 nights / 4 days · 6 safaris · Price on enquiry (twin sharing). Limited seats, first come, first served.":',
    );
    const shortSummary = await askRequired(
      "Price-free one-liner for the home page:",
      "Limited seats, first come, first served.",
    );

    console.log("\n— Images (res.cloudinary.com URLs)");
    const image = await askValid(
      "Hero image URL:",
      isCloudinary,
      "Must be an https://res.cloudinary.com/ URL.",
    );
    const imageAlt = await askRequired(
      "Hero image alt text (what's in the frame):",
    );
    const ogDefault = image.includes("/upload/f_auto,q_auto/")
      ? image.replace(
          "/upload/f_auto,q_auto/",
          "/upload/w_1200,h_630,c_fill,f_jpg,q_auto/",
        )
      : "";
    const ogImage = await askValid(
      "Social share image URL (1200×630):",
      isCloudinary,
      "Must be an https://res.cloudinary.com/ URL.",
      ogDefault,
    );

    console.log(
      '\n— Itinerary (one block per day or day range, e.g. "Day 1" / "Days 2–3")',
    );
    const itinerary: DestinationPage["itinerary"] = [];
    for (;;) {
      const day = await ask(
        itinerary.length
          ? "Next block label (Enter to finish):"
          : "Block label:",
      );
      if (!day) {
        if (itinerary.length) break;
        console.log("  Add at least one block.");
        continue;
      }
      const title = await askRequired('Block title, e.g. "Arrival":');
      const items = (
        await askPairs("Schedule, e.g. 3:00 pm | Evening safari")
      ).map(([time, text]) => ({ time, text }));
      itinerary.push({ day, title, items });
    }

    console.log("\n— Lists");
    const included = await askList("Included");
    const notIncluded = await askList("Not included");
    const goodToKnow = await askList("Good to know");
    const facts = (
      await askPairs(
        "Essentials card facts, e.g. Length | 3 nights / 4 days (group size is added from the departures)",
      )
    ).map(([label, value]) => ({ label, value }));
    const price = await askRequired("Price shown on the card:", "On enquiry");
    const priceNote = await askRequired(
      "Price note:",
      "Twin sharing. Single room at extra cost (on request).",
    );

    console.log("\n— Getting there");
    const gettingIntro = await askRequired(
      "Intro (nearest airport, suggested routing):",
      r?.gettingThereIntro,
    );
    const routes = (
      await askPairs(
        "Routes, e.g. Out | Pune (PNQ) → Khajuraho (HJR), via Delhi",
      )
    ).map(([label, text]) => ({ label, text }));

    console.log("\n— Search listing details (schema.org Event)");
    const defaults = COUNTRY_DEFAULTS[country] ?? { code: "", offset: "" };
    const time = (q: string) =>
      askValid(q, (s) => /^([01]\d|2[0-3]):[0-5]\d$/.test(s), "Use 24h HH:MM.");
    const startClock = await time("Day 1 arrival time (24h HH:MM):");
    const endClock = await time("Last-day departure time (24h HH:MM):");
    const offset = await askValid(
      "UTC offset:",
      (s) => /^[+-]\d{2}:\d{2}$/.test(s),
      'Use the form "+05:30".',
      defaults.offset,
    );
    const enquiriesOpen = await askValid(
      "Enquiries open from (YYYY-MM-DD):",
      isISODate,
      "Use a real YYYY-MM-DD date.",
      new Date().toISOString().slice(0, 10),
    );
    const placeName = await askRequired(
      'Place name, e.g. "Panna Tiger Reserve":',
      r?.placeName,
    );
    const addressLocality = await askRequired(
      "Town / locality:",
      r?.addressLocality,
    );
    const addressRegion = await askRequired(
      "State / region:",
      r?.addressRegion,
    );
    const addressCountry = await askValid(
      "Country code (2 letters):",
      (s) => /^[A-Z]{2}$/.test(s),
      'Two capital letters, e.g. "IN".',
      defaults.code,
    );
    const coord = (q: string, max: number, suggested?: number) =>
      askValid(
        q,
        (s) => s.trim() !== "" && Math.abs(Number(s)) <= max,
        `A number between -${max} and ${max}.`,
        suggested === undefined ? "" : String(suggested),
      ).then(Number);
    const latitude = await coord("Latitude:", 90, r?.latitude);
    const longitude = await coord("Longitude:", 180, r?.longitude);

    console.log("\n— Departures");
    const departures: Departure[] = [];
    for (;;) {
      const startDate = await askValid(
        "Start date (YYYY-MM-DD):",
        isISODate,
        "Use a real YYYY-MM-DD date.",
      );
      const endDate = await askValid(
        "End date (YYYY-MM-DD):",
        (s) => isISODate(s) && s >= startDate,
        "Use a real YYYY-MM-DD date on or after the start date.",
      );
      const status = await askChoice("Status (number):", STATUSES, "open");
      const maxParticipants = Number(
        await askValid(
          "Max participants:",
          (s) => /^[1-9]\d*$/.test(s),
          "A whole number.",
          "6",
        ),
      );
      const seasonNote = await ask(
        "Season note for the dates card (Enter to skip):",
      );
      const ids = new Set(departures.map((d) => d.id));
      const id = await askValid(
        "Departure id (page anchor):",
        (s) => /^[a-z0-9-]+$/.test(s) && !ids.has(s),
        "Lowercase letters, digits and hyphens only, unique per destination.",
        `${MONTH_IDS[Number(startDate.slice(5, 7)) - 1]}-${startDate.slice(0, 4)}`,
      );
      departures.push({
        id,
        startDate,
        endDate,
        status,
        maxParticipants,
        ...(seasonNote ? { seasonNote } : {}),
      });
      if (!(await askYesNo("Add another departure?", false))) break;
    }

    console.log("\n— Page copy");
    let copy: Copy | undefined;
    console.log("Writing suggested copy from your trip details...");
    try {
      copy = await writeCopy({
        research: r,
        trip: {
          name,
          country,
          fullLocation,
          summary,
          shortSummary,
          itinerary,
          included,
          notIncluded,
          goodToKnow,
          facts,
          price,
          priceNote,
          departures,
        },
        toneExamples: existing.map((d) => ({
          name: d.name,
          intro: d.page.intro,
          why: d.page.why,
          howTheDaysRun: d.page.howTheDaysRun,
        })),
      });
    } catch (err) {
      console.log(
        `  Copy suggestions failed, continuing without them: ${err instanceof Error ? err.message : err}`,
      );
    }
    const metaLead = await askRequired(
      'Meta description lead, ~100 chars, e.g. "A 4-day wildlife photography workshop in Panna, Madhya Pradesh, with 6 safaris and in-field guidance.":',
      copy?.metaLead,
    );
    if (metaLead.length > 110)
      console.log(
        "  Note: the next-departure line is appended; keep the lead under ~110 characters.",
      );
    const heroLine = await askRequired(
      'Hero line, e.g. "3 nights / 4 days · 6 safaris · Limited seats · Price on enquiry (twin sharing)":',
      copy?.heroLine,
    );
    const intro = await askList("Intro paragraphs", copy?.intro);
    const why = await askList(`"Why ${name}" paragraphs`, copy?.why);
    const howTheDaysRun = await askList(
      '"How the days run" paragraphs',
      copy?.howTheDaysRun,
    );

    const entry: Destination = {
      slug,
      name,
      country,
      location,
      summary,
      shortSummary,
      image,
      imageAlt,
      departures,
      page: {
        fullLocation,
        metaLead,
        ogImage,
        heroLine,
        intro,
        why,
        howTheDaysRun,
        itinerary,
        included,
        notIncluded,
        goodToKnow,
        facts,
        price,
        priceNote,
        gettingThere: { intro: gettingIntro, routes },
        event: {
          startTime: `${startClock}:00${offset}`,
          endTime: `${endClock}:00${offset}`,
          enquiriesOpen,
          placeName,
          addressLocality,
          addressRegion,
          addressCountry,
          latitude,
          longitude,
        },
      },
    };

    console.log("\n" + JSON.stringify(entry, null, 2) + "\n");
    if (!(await askYesNo("Append this to lib/destinations.json?", true))) {
      console.log("Nothing written.");
      return;
    }

    await fs.writeFile(
      DATA_FILE,
      JSON.stringify([...existing, entry], null, 2) + "\n",
      "utf8",
    );
    console.log(`\nAdded "${slug}" to lib/destinations.json.`);
    console.log(
      "Next: yarn build (regenerates the sitemap), then commit lib/destinations.json and public/sitemap*.xml.",
    );
  } finally {
    rl.close();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});

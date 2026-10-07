// Guided CLI for adding a guest testimonial to lib/testimonials.json.
//
//   yarn testimonial:add      prompts for each field, validates, appends
//   yarn testimonial:sample   seeds the design-handoff placeholders (ids
//                             prefixed "sample-") for local preview only
//
// After adding: `yarn build` regenerates public/sitemap*.xml; commit
// lib/testimonials.json together with the sitemap files.

import * as fs from "fs/promises";
import * as path from "path";
import * as readline from "readline/promises";
import { stdin as input, stdout as output } from "process";
import { DESTINATIONS } from "../lib/workshops";

const DATA_FILE = path.join(process.cwd(), "lib", "testimonials.json");
const SAMPLE_FILE = path.join(process.cwd(), "lib", "testimonials.sample.json");
const REGIONS = ["India", "Africa"] as const;

type Entry = {
  id: string;
  name: string;
  place: string;
  region: (typeof REGIONS)[number];
  when: string;
  year: string;
  photo?: string;
  short: string;
  full: string;
  workshopHref?: string;
  featured?: boolean;
  published: boolean;
};

async function readData(): Promise<Entry[]> {
  const text = await fs.readFile(DATA_FILE, "utf8");
  const parsed = JSON.parse(text);
  if (!Array.isArray(parsed))
    throw new Error(`${DATA_FILE} is not a JSON array`);
  return parsed as Entry[];
}

async function writeData(entries: Entry[]) {
  await fs.writeFile(
    DATA_FILE,
    JSON.stringify(entries, null, 2) + "\n",
    "utf8",
  );
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function uniqueId(base: string, existing: Set<string>) {
  let id = base;
  let n = 2;
  while (existing.has(id)) id = `${base}-${n++}`;
  return id;
}

async function seedSample() {
  const existing = await readData();
  const sample = JSON.parse(await fs.readFile(SAMPLE_FILE, "utf8")) as Entry[];
  const ids = new Set(existing.map((e) => e.id));
  const added = sample.filter((e) => !ids.has(e.id));
  await writeData([...existing, ...added]);
  console.log(
    `Seeded ${added.length} sample entr${added.length === 1 ? "y" : "ies"} into lib/testimonials.json.`,
  );
  console.log("");
  console.log(
    "These are PLACEHOLDERS from the design handoff, not real guests.",
  );
  console.log("Do not commit them. Builds on Vercel refuse sample-* ids.");
  console.log(
    "Revert with: git checkout lib/testimonials.json public/sitemap-0.xml",
  );
}

async function main() {
  if (process.argv.includes("--sample")) {
    await seedSample();
    return;
  }

  const rl = readline.createInterface({ input, output });
  const ask = async (q: string, fallback = "") => {
    const a = (
      await rl.question(fallback ? `${q} [${fallback}] ` : `${q} `)
    ).trim();
    return a || fallback;
  };
  const askRequired = async (q: string) => {
    for (;;) {
      const a = await ask(q);
      if (a) return a;
      console.log("  This field is required.");
    }
  };
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
  const askMultiline = async (q: string) => {
    console.log(`${q} (finish with an empty line)`);
    const lines: string[] = [];
    for (;;) {
      const line = await rl.question("> ");
      if (!line.trim() && lines.length > 0) break;
      if (line.trim()) lines.push(line.trim());
    }
    return lines.join(" ");
  };

  try {
    const existing = await readData();
    const ids = new Set(existing.map((e) => e.id));

    console.log(
      "Add a guest testimonial. Real guest words only (see PRODUCT.md).\n",
    );

    const name = await askRequired("Guest name:");
    const place = await askRequired('Place, e.g. "Panna, MP" or "Tanzania":');
    const region = await askChoice("Region (number):", REGIONS);
    const when = await askRequired('When, e.g. "January 2026 workshop":');
    let year = "";
    for (;;) {
      year = await askRequired("Year (4 digits):");
      if (/^\d{4}$/.test(year)) break;
      console.log("  Enter a 4-digit year.");
    }
    const short = await askRequired(
      "Pull quote (one or two sentences, ~15–20 words):",
    );
    if (short.length > 200) {
      console.log(
        "  Note: that pull quote is long; home cards read best under ~200 characters.",
      );
    }
    const full = await askMultiline("Full testimonial:");

    const workshopOptions = [
      ...DESTINATIONS.map((d) => `/destinations/${d.slug}  (${d.name})`),
      "none",
      "custom path",
    ] as const;
    const workshopPick = await askChoice(
      "Link to a workshop page?",
      workshopOptions,
      "none",
    );
    let workshopHref: string | undefined;
    if (workshopPick === "custom path") {
      const custom = await ask("Path (must start with /):");
      if (custom.startsWith("/")) workshopHref = custom;
      else console.log("  Ignored: path must start with /.");
    } else if (workshopPick !== "none") {
      workshopHref = workshopPick.split("  ")[0];
    }

    let photo: string | undefined;
    const photoInput = await ask(
      "Photo URL on res.cloudinary.com (Enter to skip):",
    );
    if (photoInput) {
      if (/^https:\/\/res\.cloudinary\.com\//.test(photoInput))
        photo = photoInput;
      else
        console.log(
          "  Ignored: photo must be an https://res.cloudinary.com/ URL.",
        );
    }

    const featured = await askYesNo("Feature on the home page?", false);
    const published = await askYesNo("Publish now?", true);

    const suggestedId = uniqueId(slugify(`${name} ${year}`), ids);
    let id = "";
    for (;;) {
      id = await ask("Id (slug, used in the URL):", suggestedId);
      if (!/^[a-z0-9-]+$/.test(id)) {
        console.log("  Lowercase letters, digits and hyphens only.");
        continue;
      }
      if (ids.has(id)) {
        console.log("  That id already exists.");
        continue;
      }
      break;
    }

    const entry: Entry = {
      id,
      name,
      place,
      region,
      when,
      year,
      ...(photo ? { photo } : {}),
      short,
      full,
      ...(workshopHref ? { workshopHref } : {}),
      ...(featured ? { featured: true } : {}),
      published,
    };

    console.log("\n" + JSON.stringify(entry, null, 2) + "\n");
    const ok = await askYesNo("Append this to lib/testimonials.json?", true);
    if (!ok) {
      console.log("Nothing written.");
      return;
    }

    await writeData([...existing, entry]);
    console.log(`\nAdded "${id}" to lib/testimonials.json.`);
    console.log(
      "Next: yarn build (regenerates the sitemap), then commit lib/testimonials.json and public/sitemap*.xml.",
    );
  } finally {
    rl.close();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});

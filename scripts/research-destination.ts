// Drafts suggestions for add-destination.ts with the Claude Code CLI
// (`claude -p`). researchDestination searches the web for place facts;
// writeCopy turns those facts and the trip details the user typed into page
// copy. Trip facts (dates, price, itinerary) are never invented.

import { spawn } from "child_process";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

export type Research = {
  findings: { flora: string[]; fauna: string[]; history: string[] };
  sources: string[];
  location: string;
  fullLocation: string;
  gettingThereIntro: string;
  placeName: string;
  addressLocality: string;
  addressRegion: string;
  latitude: number;
  longitude: number;
};

export type Copy = {
  metaLead: string;
  heroLine: string;
  intro: string[];
  why: string[];
  howTheDaysRun: string[];
};

const str = { type: "string" };
const strs = { type: "array", items: str };
const object = (properties: Record<string, unknown>) => ({
  type: "object",
  properties,
  required: Object.keys(properties),
});

const RESEARCH_SCHEMA = object({
  findings: object({ flora: strs, fauna: strs, history: strs }),
  sources: strs,
  location: str,
  fullLocation: str,
  gettingThereIntro: str,
  placeName: str,
  addressLocality: str,
  addressRegion: str,
  latitude: { type: "number" },
  longitude: { type: "number" },
});

const COPY_SCHEMA = object({
  metaLead: str,
  heroLine: str,
  intro: strs,
  why: strs,
  howTheDaysRun: strs,
});

const RULES = `
Write all text in ASD-STE100 Simplified Technical English:
- Sentences of 20 words or fewer. One idea in each sentence.
- Active voice. Simple, common words. Use the same word for the same thing.
- No em dashes and no en dashes. Use "to" for ranges.
- Plain and factual. No marketing words such as "nestled", "breathtaking",
  "hidden gem", "tapestry", "symphony", "testament", "boasts", "vibrant",
  "unforgettable", "immersive", "elevate". No "not only X but also Y".
  No "This is not X, it is Y" patterns. No lists of three for rhythm.
- Do not invent what the photographer has done or seen there.

The reader is new to this website and may be a beginner in wildlife
photography. Do not assume they know the place or the jargon. Explain terms
such as "buffer zone", "conservancy" or "the Big Five" in a few plain words
the first time you use them. Tell them what they can expect to see and why
the place is good for photographs.
`;

const researchPrompt = (name: string, country: string) => `
Research the wildlife destination "${name}" in ${country} on the web. Find its
flora, fauna and history (protected-area status, conservation events, people
and culture). Use reliable sources: the park authority, government, IUCN,
scientific papers, respected news. Do not guess. If you cannot confirm a fact,
leave it out.

Then fill the fields for a wildlife photography workshop page:
- findings: short factual notes, 3 to 6 each for flora, fauna, history.
- sources: the URLs you used.
- location: short form for cards, e.g. "Panna, MP".
- fullLocation: e.g. "Panna, Madhya Pradesh".
- gettingThereIntro: the nearest airport with its IATA code and the drive time
  to the park. One or two sentences.
- placeName: the official name of the park or reserve.
- addressLocality, addressRegion: the town and the state or region.
- latitude, longitude: the park centre, 2 decimal places.
${RULES}
Do not write in the first person.
`;

const copyPrompt = (input: unknown) => `
Write the page copy for a wildlife photography workshop by Tarang Hirani, a
wildlife photographer. The JSON below has the trip details Tarang entered
("trip"), place research ("research", may be missing), and copy from other
destination pages ("toneExamples").

Use only facts from "trip" and "research". Do not invent numbers, dates,
prices, lodges, activities or wildlife sightings. If a fact is not there,
leave it out.

Match the voice of "toneExamples": warm, personal, written by Tarang to a
guest, "I" for Tarang and "we" for the group. The rules below win over the
examples where they differ.

Fields:
- metaLead: the search result description, 110 characters or fewer. Name the
  trip length, the place and the main draw, e.g. "A 4-day wildlife photography
  workshop in Panna, Madhya Pradesh, with 6 safaris and in-field guidance."
- heroLine: short facts joined with " · ", e.g. "3 nights / 4 days · 6
  safaris · Limited seats · Price on enquiry (twin sharing)". Take it from the
  trip summary and price.
- intro: 2 paragraphs. What the workshop is, who it is for, how it helps a
  beginner make better photographs.
- why: 2 paragraphs about the place: landscape, flora, fauna, history, and
  why the season of the departures is good for photographs. Name months or
  seasons only. Do not name departure dates or say which are sold out, as
  dates change.
- howTheDaysRun: 1 paragraph. The rhythm of a typical day, from the
  itinerary. Do not repeat clock times; the itinerary table shows them.
${RULES}
${JSON.stringify(input, null, 2)}
`;

// Belt and braces for the style rule: no em dashes reach the page.
const scrub = (v: unknown): unknown =>
  typeof v === "string"
    ? v.replace(/\s*—\s*/g, ", ")
    : Array.isArray(v)
      ? v.map(scrub)
      : v && typeof v === "object"
        ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, scrub(x)]))
        : v;

// stdout goes to a temp file, not a pipe: a piped `claude -p` result was cut
// off at 8 KB when the CLI exited before the pipe drained.
function runClaude<T>(prompt: string, schema: object, tools: string[]) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "destination-"));
  const outFile = path.join(dir, "out.json");
  const fd = fs.openSync(outFile, "w");
  return new Promise<T>((resolve, reject) => {
    const child = spawn(
      "claude",
      [
        "-p",
        prompt,
        "--output-format",
        "json",
        "--json-schema",
        JSON.stringify(schema),
        "--tools",
        tools.join(","),
        ...(tools.length ? ["--allowedTools", ...tools] : []),
      ],
      { stdio: ["ignore", fd, "inherit"], timeout: 10 * 60 * 1000 },
    );
    child.on("error", reject);
    child.on("close", (code, signal) => {
      try {
        if (code !== 0)
          throw new Error(`claude exited with ${signal ?? `code ${code}`}`);
        const out = JSON.parse(fs.readFileSync(outFile, "utf8"));
        if (out.is_error || !out.structured_output)
          throw new Error(out.result || "No structured output");
        resolve(scrub(out.structured_output) as T);
      } catch (e) {
        reject(e);
      }
    });
  }).finally(() => {
    fs.closeSync(fd);
    fs.rmSync(dir, { recursive: true, force: true });
  });
}

export const researchDestination = (name: string, country: string) =>
  runClaude<Research>(researchPrompt(name, country), RESEARCH_SCHEMA, [
    "WebSearch",
    "WebFetch",
  ]);

export const writeCopy = (input: {
  research?: Research;
  trip: Record<string, unknown>;
  toneExamples: unknown[];
}) => runClaude<Copy>(copyPrompt(input), COPY_SCHEMA, []);

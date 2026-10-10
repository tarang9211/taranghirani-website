---
name: project-workshop-data-model
description: Workshops are destinations-with-departures in lib/workshops.ts; dates are deliberately confined to the "Dates & availability" section, so date-less heroes/nav/cards are intentional
metadata:
  type: project
---

Workshops are modelled in `lib/workshops.ts` as one `Destination` per place (page at `/destinations/<slug>`) with an array of `Departure`s (`status: open | sold-out | expired`, visibility driven by that manual flag, never by today's date). Departure dates render in exactly one place: the "Dates & availability" section of the destination page. The hero subline, Essentials sidebar, nav dropdown, and the home / `/destinations` cards intentionally show no dates (cards show a departure count).

**Why:** Before this model each departure shipped as its own near-duplicate page (`/destinations/panna` and `/destinations/panna-jan`), which cannibalised the same query and split link equity. Confining dates to one section is what lets a single evergreen URL serve every departure, and the owner chose it deliberately.

**How to apply:** Do not report the date-less hero/nav/cards as a metadata or content regression — it is the intended design. Do still recommend *one* date-bearing, above-the-fold pointer (e.g. "Next departure: …" linking to the departure anchor) since that costs nothing and helps date-qualified queries. When a new destination or departure is added, check: one `Event` JSON-LD object per visible departure, per-departure `availability`, sitemap regenerated, and a 301 in `next.config.js` for any slug that disappears. Related: [[project-head-defaults]].

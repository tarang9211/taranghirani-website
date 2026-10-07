# taranghirani.com

Personal site and workshop pages for Tarang Hirani, wildlife photographer. Next.js 14 (Pages Router), Tailwind, Cloudinary, deployed on Vercel. See `ARCHITECTURE.md` for infrastructure and `docs/DESIGN.md` for the design system.

## Running locally

Requires Node 22 and Yarn.

```bash
nvm use 22
yarn
yarn dev        # http://localhost:4000
yarn build      # production build; also regenerates public/sitemap*.xml
```

## Adding a guest testimonial

Testimonials live in `lib/testimonials.json`. They appear in three places once at least one entry is published: a three-card block on the home page, the "Testimonials" item in the navigation, and the full `/testimonials` page with India and Africa filters. While the file is empty, all three are hidden and `/testimonials` redirects to the home page.

Only publish real guest words, with their permission. Never invent or embellish a testimonial.

### 1. Add the entry

```bash
yarn testimonial:add
```

The command asks for each field and appends the entry to `lib/testimonials.json`:

| Field | What to enter |
|---|---|
| Guest name | As they want it shown, e.g. `Priya Mehta` |
| Place | Where the trip was, e.g. `Panna, MP` or `Tanzania` |
| Region | `India` or `Africa`, used by the page filter |
| When | Shown under the name, e.g. `January 2026 workshop` |
| Year | Four digits, shown on the home card and used to sort newest first |
| Pull quote | One or two sentences, ideally under 200 characters. Shown on the home card and as the large quote on the page |
| Full testimonial | The complete text. Paste or type it, then press Enter on an empty line to finish |
| Workshop link | Pick a destination page from the list, or `none` |
| Photo URL | Optional. A `https://res.cloudinary.com/...` URL of the guest's photo, or Enter to skip (no placeholder is shown without one) |
| Feature on the home page | `y` to include it in the home block. The three most recent featured entries are shown; if none are featured, the three most recent published ones are used |
| Publish now | `n` keeps the entry in the file but hides it everywhere |
| Id | Accept the suggested slug. It becomes the anchor in `/testimonials#<id>` |

You can also edit `lib/testimonials.json` by hand with the same fields. The build fails with a clear message if an id is duplicated, a region is unknown, or a required field is missing.

### 2. Check it

```bash
yarn dev
```

Open http://localhost:4000 for the home block and http://localhost:4000/testimonials for the full page.

### 3. Publish

```bash
yarn build
git add lib/testimonials.json public/sitemap.xml public/sitemap-0.xml
git commit -m "Add testimonial from <name>"
git push
```

`yarn build` regenerates the sitemap so the `/testimonials` page is listed once it has content. Vercel deploys on push to `main`.

### Previewing with placeholder data

`lib/testimonials.sample.json` holds four made-up entries from the design handoff. To see the populated layout without real data:

```bash
yarn testimonial:sample && yarn dev
```

Reset the data file before committing:

```bash
echo '[]' > lib/testimonials.json
```

Sample entries have ids starting with `sample-`. A build on Vercel refuses them, so they cannot be deployed by accident.

### Removing or editing a testimonial

Edit or delete the entry in `lib/testimonials.json`, then run `yarn build` and commit the data file with the regenerated sitemap. Setting `"published": false` hides an entry without deleting it.

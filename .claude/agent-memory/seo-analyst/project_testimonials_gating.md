---
name: project-testimonials-gating
description: /testimonials is gated on published entries in lib/testimonials.json (empty by design); no Review/AggregateRating schema by owner decision
metadata:
  type: project
---

`lib/testimonials.json` ships as `[]` because no real testimonials exist yet and PRODUCT.md forbids inventing any. With zero published entries the nav item and home block are hidden, `next.config.js` 307s `/testimonials` to `/`, and `next-sitemap.config.js` excludes the route. `lib/testimonials.sample.json` is local-preview placeholder data only; Vercel builds refuse `sample-*` ids.

**Why:** Owner decision (feat/testimonials, Oct 2026): real guest words only; self-serving Review/AggregateRating markup is ignored by Google and would imply proof PRODUCT.md disallows.

**How to apply:** Don't flag the empty state, the temporary redirect, or the missing Review schema as problems. When entries are first published, check the redirect disappears, the sitemap is regenerated and committed with the data, and a link points to /testimonials from the destination pages. Related: [[project-head-defaults]], [[project-workshop-data-model]].

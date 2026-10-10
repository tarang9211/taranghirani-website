---
name: project-head-defaults
description: pages/_app.js already sets canonical, og:type, twitter:card and full default OG/Twitter meta — do not report these as missing on individual pages
metadata:
  type: project
---

`pages/_app.js` renders a global `next/head` block with: `<link rel="canonical">` computed from `router.asPath` (always `https://www.taranghirani.com` + path, query stripped), `og:type=website`, `twitter:card=summary_large_image`, plus default `title`, `description`, `og:title/description/url/image` and `twitter:title/description/image` — each keyed so per-page tags override them.

**Why:** Per-page head blocks are hand-rolled and only set the page-specific subset (title, description, og:*/twitter:* with matching `key`). Earlier reviews wasted findings reporting "missing canonical" / "missing og:type" on pages that inherit them.

**How to apply:** Only flag a missing canonical/og:type/twitter:card if `_app.js` has changed. Per-page overrides are correct *only* when they carry the same `key` as the `_app.js` tag — a page tag without a matching `key` produces a duplicate meta tag, and that IS worth flagging. Also note `_app.js` sets no `og:image:width/height/alt`, so those are legitimately absent site-wide. Related: [[project-workshop-data-model]].

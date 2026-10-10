---
name: project-terms-noindex
description: /terms (PR #129) is noindex,follow + excluded from sitemap by design; wording is owner-supplied Asili Safaris legal text and must not be edited
metadata:
  type: project
---

`/terms` is intentionally `noindex, follow` and listed in `next-sitemap.config.js` `exclude`. It is linked site-wide from the footer and from ContactForm. Body copy is Tarang's verbatim Asili Safaris terms (references asilisafaris.in, 50% advance).

**Why:** Issue #127 decided legal boilerplate should not compete in search; owner supplies legal wording (never draft or rewrite it).

**How to apply:** Do not flag /terms as missing from the sitemap or missing schema. Do flag content contradictions between /terms and commercial pages (e.g. advance % on /destinations/panna) as trust issues for the owner to resolve, not copy for us to change. Related: [[project-head-defaults]].

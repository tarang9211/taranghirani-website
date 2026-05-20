# Tarang Hirani — Brand Guidelines

A wildlife photography brand. Quiet, considered, image-led. This document defines the visual system — colors, typography, and composition principles — so any asset, in any medium, can be produced on-brand without further reference.

The brand is **monochrome with a single warm accent**. Restraint is the dominant instinct. When in doubt, use less.

---

## 1. Color Palette

Five core colors. No additional hues.

| Name       | Hex       | RGB              | Role                                                                                                  |
| ---------- | --------- | ---------------- | ----------------------------------------------------------------------------------------------------- |
| Charcoal   | `#080808` | `8, 8, 8`        | Primary dark surface. Primary text on light surfaces.                                                 |
| Parchment  | `#FFFFFF` | `255, 255, 255`  | Pure white. High-key surface; primary text on dark surfaces.                                          |
| Paper      | `#F5F5F3` | `245, 245, 243`  | Default light surface. Slightly warm off-white that reduces glare versus pure white.                  |
| Smoke      | `#525252` | `82, 82, 82`     | Secondary text on light surfaces — body copy, metadata, captions.                                     |
| Sage       | `#C4956A` | `196, 149, 106`  | Single accent. Warm tan/copper. Used sparingly for emphasis.                                          |

### Rules of Use

**Surfaces.** Every composition sits on either **Charcoal** (dark mode) or **Paper / Parchment** (light mode). Pick one and stay with it. Avoid splitting a single composition between dark and light unless the divide is intentional and clean.

**Text on light surfaces.** Charcoal for primary type. Smoke for secondary type (body paragraphs, metadata, captions). Never use Smoke on a dark surface.

**Text on dark surfaces.** Pure white (Parchment), tiered by opacity — see the ladder below. Never use Smoke here.

**Sage is never a large fill.** It carries the brand's emotional warmth *because* it appears rarely. Reserve it for:

- Hairline rules and thin dividers
- Borders on small CTAs
- Eyebrow / kicker label text (small, uppercase, tracked)
- Hover or active states on small interactive elements
- Single accent flourishes (a number, a punctuation mark, a tick)

**A safe rule of thumb:** sage should occupy no more than ~5% of any composition's visible pixels. If you find yourself filling a panel with sage, stop and rework.

**No additions.** Do not introduce new hues, gradients (other than dark-to-transparent overlays for image legibility), drop shadows, or color washes. The discipline of the palette is the brand.

### Opacity Ladder — White on Charcoal

Text and rule weight on dark surfaces is controlled by white opacity, not by introducing greys.

| Tier        | Opacity   | Role                                              |
| ----------- | --------- | ------------------------------------------------- |
| Primary     | 100%      | Headlines, important labels                       |
| Secondary   | 80%       | Subheads, lead paragraphs                         |
| Tertiary    | 45–60%    | Body paragraphs, inactive UI labels               |
| Quaternary  | 25–30%    | Fine print, placeholder text, legal               |
| Hairlines   | 5–10%     | 1px dividers and subtle separators                |

### Opacity Ladder — Charcoal on Light Surfaces

The mirror system for Paper / Parchment surfaces.

| Tier        | Treatment                          | Role                                              |
| ----------- | ---------------------------------- | ------------------------------------------------- |
| Primary     | Charcoal at 100%                   | Headlines                                         |
| Secondary   | Smoke at 100%                      | Body paragraphs, lead copy                        |
| Tertiary    | Smoke at 50–60%                    | Metadata, captions, timestamps                    |
| Hairlines   | Charcoal at 10–15%                 | Section dividers and rules                        |

---

## 2. Typography

Two typefaces. No others.

### Display — Playfair Display

A high-contrast serif. The "voice" of the brand.

- **Weights in use:** 400, 500, 600, 700
- **Default letter-spacing for headlines:** `-0.01em` (tight)
- **Use for:** all headings (H1–H4), the brand mark, hero subheads, short uppercase tracked nav-style labels.
- **Do not use for:** sustained body text, paragraphs, captions, fine print.

### Body — Source Sans 3

A clean humanist sans. Carries all information the reader actually *reads*.

- **Weights in use:** 300, 400, 500, 600, 700
- **Use for:** paragraphs, lead copy, captions, CTA button labels, eyebrow labels, fine print, any UI text.
- **Do not use for:** primary headlines or the brand mark.

### Pairing Rule

Playfair speaks. Source Sans informs. Never invert this. A serif headline followed by sans-serif body is the brand's typographic rhythm — repeated everywhere.

### Type Scale

Reference sizes assume a standard digital composition (e.g., a website page or social post viewed at roughly 1× density). Scale proportionally for large-format print, small-format icons, or other media — but preserve the **ratios** between roles within a single composition.

| Role                          | Family               | Weight | Reference size | Tracking      | Leading | Case        |
| ----------------------------- | -------------------- | ------ | -------------- | ------------- | ------- | ----------- |
| Display / Brand mark          | Playfair Display     | 600    | 72–128 px      | `-0.01em`     | 0.90    | Title Case  |
| Page H1                       | Playfair Display     | 600    | 40–60 px       | `-0.01em`     | 1.05    | Title Case  |
| Section H2                    | Playfair Display     | 600    | 28–40 px       | `-0.01em`     | 1.15    | Title Case  |
| Sub-section H3                | Playfair Display     | 600    | 20–24 px       | `-0.01em`     | 1.25    | Title Case  |
| Display subhead / pull quote  | Playfair Display     | 400    | 20–24 px       | normal        | 1.30    | Sentence    |
| Eyebrow / kicker label        | Source Sans 3        | 500    | 14 px          | `0.20em`      | 1.20    | UPPERCASE   |
| Small serif label (nav-style) | Playfair Display     | 400    | 12 px          | `0.12em`      | 1.20    | UPPERCASE   |
| CTA button label              | Source Sans 3        | 500    | 12 px          | `0.15em`      | 1.20    | UPPERCASE   |
| Body — comfortable read       | Source Sans 3        | 400    | 16–18 px       | normal        | 1.60    | Sentence    |
| Body — secondary / meta       | Source Sans 3        | 400    | 14 px          | `0.02em`      | 1.50    | Sentence    |
| Fine print                    | Source Sans 3        | 400    | 12 px          | `0.02em`      | 1.40    | Sentence    |

### Tracking Conventions

These specific tracking values are load-bearing across the system. Use them, not arbitrary in-between numbers.

- `-0.01em` — all serif headlines (tight, classical)
- `0.20em` — eyebrow / kicker labels
- `0.15em` — CTA buttons, link-style CTAs
- `0.12em` — nav-style serif labels
- `0.02em` (slight positive) — fine print and metadata
- `normal` (0) — body paragraphs

### Casing Conventions

- **Headlines:** Title Case is the default. Sentence case is allowed for editorial moments (long-form essay titles, intimate pull quotes).
- **Eyebrows, CTAs, nav-style labels:** ALL CAPS, paired with the tracking values above. Never set these in mixed case.
- **Body:** Sentence case, always. Never set paragraphs in title case or all caps.

---

## 3. Composition Principles

These are not rigid rules — they are the instincts that keep work feeling like the brand.

### The Hairline Accent

A short 1px sage rule — roughly 12–48 px long — frequently precedes a major typographic block. It signals "section here" without raising its voice. Use it above eyebrows, between groups, or as a quiet bridge between image and text. One per block; do not let hairlines stack or compete.

### The Vertical Rhythm

The brand has a repeating four-beat composition:

1. **Eyebrow** — small uppercase tracked sage label
2. **Headline** — serif, tight tracking, ample size
3. **Body** — sans-serif paragraph(s) at comfortable reading size
4. **CTA** — single thin-bordered uppercase tracked label, often with a rightward arrow

Maintain generous vertical spacing between beats. Crowding kills the brand.

### Restraint With Accent

Sage carries emotional weight precisely *because* it appears rarely. If a draft has sage in more than two or three places, remove some. If a draft has none, consider whether the composition needs a single accent moment.

### Image-Led When Image Is Present

Photography dominates. When an image is in the composition, let it occupy the majority of the space. Text overlays sit toward the lower-left of an image, or on a charcoal-to-transparent gradient wash that protects legibility along one edge. Never centre-stack large blocks of text on top of a photograph.

### No Decorative Effects

- **No drop shadows** on text, buttons, or cards.
- **No gradient fills** other than the charcoal-to-transparent overlay used for image legibility.
- **No rounded-pill buttons.** Buttons are slim rectangles with a 1px border. Corners on photographs may be subtly rounded (~8 px reference radius). Typography blocks remain flush.
- **No glow, no bevels, no textures.**

### Generous Negative Space

The brand reads as quiet and considered. Generous margins, calm rhythm, room to breathe. If a composition feels full, it is too full.

---

## 4. Photography Tone

The visual system exists to frame the photography — these are the principles the imagery itself follows, and any commissioned or generated supporting visual should respect them:

Wildlife and wild places, almost always in **natural light**. **True-to-scene colour** — no heavy saturation, no fashionable teal-and-orange grading, no surreal skies. Patience and behaviour over staged portraits. Composition should favour either intimate, observational portraits or **"small in frame"** scenes that honour how vast the animal's world is around it. The emotional register is calm and attentive, never sentimental or dramatic.

---

## 5. Quick Reference

For a designer working at speed:

- **Surfaces:** Charcoal `#080808` (dark) or Paper `#F5F5F3` (light). Pick one.
- **Headlines:** Playfair Display, 600, tracking `-0.01em`, Title Case.
- **Body:** Source Sans 3, 400, 16–18 px, leading 1.6. Smoke `#525252` on light surfaces; white at 45–60% on dark.
- **Accent:** Sage `#C4956A`. Hairlines, thin borders, small uppercase labels. Never a large fill.
- **CTAs:** Uppercase, Source Sans 500, tracking `0.15em`, thin sage border, no fill.
- **Eyebrows:** Uppercase, Source Sans 500, tracking `0.20em`, in sage.
- **Effects:** None.

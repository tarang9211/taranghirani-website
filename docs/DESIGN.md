---
name: Tarang Hirani — Wildlife Photography
colors:
  charcoal: "#080808"
  parchment: "#FFFFFF"
  paper: "#F5F5F3"
  smoke: "#525252"
  sage: "#C4956A"
typography:
  display:
    fontFamily: Playfair Display
    weights: [400, 500, 600, 700]
    tracking: "-0.01em"
    leading: 1.05
  body:
    fontFamily: Source Sans 3
    weights: [300, 400, 500, 600, 700]
    fontSize: 16px
    leading: 1.6
  eyebrow:
    fontFamily: Source Sans 3
    fontWeight: 500
    fontSize: 14px
    tracking: "0.20em"
    case: UPPERCASE
  cta:
    fontFamily: Source Sans 3
    fontWeight: 500
    fontSize: 12px
    tracking: "0.15em"
    case: UPPERCASE
rounded:
  image: 8px
  typography: 0px
motion:
  fade-up: "0.8s ease-out"
  fade-in: "1s ease-out"
  slow-zoom: "20s ease-out"
---

# Design System

## Overview
Monochrome with a single warm accent. Image-led, restrained, considered.
The system exists to frame wildlife photography — typography and layout support, never compete. Generous negative space; quiet rhythm; no decorative effects.

## Colors
- **Charcoal** (#080808): Primary dark surface; primary text on light surfaces
- **Parchment** (#FFFFFF): High-key surface; primary text on dark surfaces
- **Paper** (#F5F5F3): Default light surface — a warm off-white that reduces glare
- **Smoke** (#525252): Secondary text on light surfaces only (body, metadata, captions)
- **Sage** (#C4956A): Single accent — hairlines, thin borders, small uppercase labels. Never a large fill (≤5% of any composition)

Text hierarchy on dark uses **white opacity** (100 / 80 / 45–60 / 25–30 / 5–10), not greys.
Text hierarchy on light uses charcoal at 100% / smoke at 100% / smoke at 50–60% / charcoal at 10–15% (hairlines).

## Typography
- **Headlines**: Playfair Display, 600, tracking `-0.01em`, Title Case
- **Body**: Source Sans 3, 400, 16–18px, leading 1.6
- **Eyebrows**: Source Sans 3, 500, 14px, tracking `0.20em`, UPPERCASE, in sage
- **CTAs**: Source Sans 3, 500, 12px, tracking `0.15em`, UPPERCASE
- **Pairing rule**: Serif speaks, sans informs. Never invert.

## Components
- **Buttons**: Slim rectangles with a 1px sage border, no fill, uppercase tracked label. No rounded pills.
- **Inputs**: 1px hairline border (white/15 on dark, charcoal/15 on light), transparent fill
- **Cards / image tiles**: Subtle ~8px radius on photographs only; no shadow, no elevation
- **Hairline accent**: A 1px sage rule, 12–48px long, precedes major typographic blocks
- **Section rhythm**: Eyebrow → Headline → Body → CTA, with generous vertical spacing between beats
- **Motion**: Fade-up on scroll reveal (0.8s), fade-in for global loads (1s), slow-zoom on hero imagery (20s). No bouncy easing.

## Do's and Don'ts
- **Do** pick one surface per composition — charcoal or paper — and stay with it
- **Do** let photography occupy the majority of any composition that includes an image
- **Do** maintain generous margins and vertical breathing room
- **Do** use sage for hairlines, thin borders, and small accent labels only
- **Don't** introduce new hues, gradients (except charcoal-to-transparent overlays for image legibility), or color washes
- **Don't** use drop shadows, glows, bevels, or textures
- **Don't** use rounded-pill buttons or mix radii within a composition
- **Don't** use smoke text on dark surfaces, or white-opacity text on light surfaces
- **Don't** center-stack large text blocks on top of a photograph

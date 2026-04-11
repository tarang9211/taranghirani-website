---
name: social-carousel
description: Generate Instagram carousel post content from a blog post. Use when the user asks to create social media content, Instagram posts, carousel slides, or wants to promote a blog post on Instagram.
disable-model-invocation: true
---

You are a social media content creator for Tarang Hirani, a wildlife photographer based in India. Your goal is to transform a blog post into a polished Instagram carousel series that drives readers to the full post on the website.

## Brand Identity

**Website:** taranghirani.com | **Instagram:** @tarang.hirani

### Colors

- Background: `#F5F5F3` (paper — warm off-white)
- Primary text: `#080808` (charcoal — near black)
- Secondary text: `#525252` (smoke — mid grey)
- Accent: `#C4956A` (sage — warm bronze/tan)
- White: `#FFFFFF`

### Typography

- **Display / Headlines:** Playfair Display (serif) — elegant, editorial
- **Body / Captions:** Source Sans 3 (sans-serif) — clean, legible

### Tone

Quiet, observant, and unhurried. The writing feels like field notes — specific, sensory, and personal. Never promotional. Never loud. Avoid hashtag spam; use 3–5 targeted hashtags at most.

---

## Output Location

Generated PNG files are saved to:
`.claude/skills/social-carousel/output/YYYY-MM-DD/YYYY-MM-DD-<slug>-slide-N.png`

Run the generator with:

```bash
npm run carousel <slug>
```

---

## Task

Read the blog post at: $ARGUMENTS

If no argument is provided, ask the user which blog post to use, then read it from `lib/blog/posts.js`.

---

## Carousel Structure

Produce **4–5 carousel slides** plus a **final collage slide**. For each slide, output:

1. **Slide number and title**
2. **Visual direction** — layout, background color, what image to use (reference the Cloudinary URL from the post if applicable), text placement
3. **Headline** — short, punchy (Playfair Display style)
4. **Body copy** — 1–3 lines max (Source Sans 3 style)
5. **Caption copy** for the Instagram post itself (used on the last content slide or as the post caption)

---

### Slide Templates

**Slide 1 — Hook / Cover**

- Background: charcoal (`#080808`) or a full-bleed image from the post
- Headline: a provocative or poetic line pulled directly from the blog (Playfair Display, white, large)
- Subtext: location or date, in smoke grey or sage, small
- Goal: stop the scroll

**Slides 2–4 — Story Slides**
Each slide covers one key idea, moment, or insight from the post:

- Background: paper (`#F5F5F3`) or a relevant image
- Use the sage accent (`#C4956A`) for pull quotes, dividers, or slide numbers
- Headline: 4–8 words (Playfair Display)
- Body: 1–2 sentences pulled or paraphrased from the blog
- If the post contains a `type: "quote"` block, dedicate one slide to it — full bleed, Playfair Display italic, centered, sage accent line above/below

**Slide 5 — Photography Tip or Key Takeaway**

- Distill one actionable or memorable insight from the post
- Format as a numbered tip or standalone quote
- Background: paper or charcoal

**Final Slide — Collage + CTA**

- Arrange 3–4 images from the post in a grid layout:
  - Suggested layout: tall left column (portrait crop) + two stacked right (landscape crops)
  - Or: three equal-width horizontal panels
- Overlay a semi-transparent charcoal bar at the bottom with:
  - "Read the full story" in Playfair Display (white)
  - `taranghirani.com/blog/[slug]` in Source Sans 3 (sage)
- This is the CTA slide — make the URL prominent

---

## Layout Rules

When generating slide code in `scripts/generate-carousel.ts`, follow these spacing rules to keep the carousel visually consistent:

- **Text container:** Place the headline and body text inside a single flex-column container (`flexDirection: 'column'`) anchored to the bottom of the slide (`position: absolute, bottom: 60`). Do **not** position headline and body independently with separate absolute `top`/`bottom` values — this causes inconsistent visual gaps when headlines wrap to different line counts.
- **Heading–subheading gap:** Use `gap: 24` between the headline and body text spans inside the flex container.
- **Side padding:** `left: 60, right: 60` (or `left: 88` for slide 1 to clear the accent bar).
- **Bottom padding:** `bottom: 60` from the canvas edge.
- **No trailing periods** on headline text.
- **Accent lines must be consistent:** If a sage (`#C4956A`) accent line (horizontal or vertical) is used on one content slide, it must appear on all content slides (slides 2–5). Do not mix — some slides with accent lines and others without. Choose one style (horizontal line above the headline, or vertical bar beside the text) and apply it uniformly. The final collage/CTA slide may use its own accent rule independently.

---

## Output Format

Generate the carousel slides directly by updating `scripts/generate-carousel.ts` and running the script.

### Steps

1. **Read the post** from `lib/blog/posts.js` using the slug from `$ARGUMENTS`.
2. **Design the slides** — choose headlines, body copy, and which image to use for each slide based on the Carousel Structure above.
3. **Rewrite `scripts/generate-carousel.ts`** with slide functions that contain the copy and image choices you've designed. Follow the Layout Rules exactly. The script uses `satori` for text/overlay rendering and `sharp` for image compositing. Output dimensions are `1080×1350` (4:5 portrait). Keep the existing `loadFonts()`, `main()`, and output path logic — only replace the `generateSlideN()` functions and their registrations in the `slides` array.
4. **Run the script**: `npm run carousel <slug>`
5. **Report** the output path and output a post caption.

### Slide function structure

Each `generateSlideN` function must follow this pattern — text container anchored to bottom with `flexDirection: 'column'` and `gap: 24`, never independently positioned headline/body:

```ts
async function generateSlideN(post: any, fonts: ...): Promise<Buffer> {
  // 1. Fetch or load photo (use post image URLs from post.content)
  // 2. Resize/crop background with sharp to WIDTH × HEIGHT
  // 3. Build satori overlay object (back to front: gradient → accent line → text flex container)
  // 4. Composite overlay onto background with sharp
  // 5. Return jpeg buffer
}
```

### Post Caption

After running the script, output:

**Post Caption (Instagram)**
A 3–5 sentence caption that summarises the story, ends with a call to action ("Full story at the link in bio"), and includes 3–5 relevant hashtags (e.g. #WildlifePhotography #JimCorbett #Dhikala #BigCats #NaturePhotography).

---

## Quality Checklist

Before finalising, verify:

- [ ] `scripts/generate-carousel.ts` compiles and runs without errors
- [ ] Every slide's text container uses `flexDirection: 'column'`, `bottom: 60`, `left: 60`, `right: 60`, `gap: 24`
- [ ] No headline or body text is independently positioned with separate `top`/`bottom` values
- [ ] Sage (`#C4956A`) accent line is used consistently — either on all content slides or none
- [ ] The final collage slide uses the correct image indices from the post
- [ ] The CTA slide includes `taranghirani.com/blog/<slug>`
- [ ] No body copy exceeds 30 words
- [ ] Output files are saved to `.claude/skills/social-carousel/output/YYYY-MM-DD/`

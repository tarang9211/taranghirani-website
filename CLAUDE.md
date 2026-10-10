### Context

This is a personal website for Tarang Hirani, a wildlife photographer based in India. The purpose of this website is to showcase my work photography portfolio and provide a platform for readers to learn more about my work and connect with me.

#### Important

- Website is located at https://www.taranghirani.com
- Instagram handlie is @tarang.hirani

### Persona

You are an expert in developing marketing websites that are performant, accessible, aesthetic and user-friendly.

### Goal

Develop and maintain the website in this repository using Next.js, Cloudinary to be performant.
Ensure the user experience of the website is of high quality.

### Project Structure

Technologies Used:

- Next JS 14
- Cloudinary
- Vercel
- Yarn
- Tailwind

pages/

- index.tsx - Home page
- gallery.tsx - Gallery page
- blog.tsx - Blog page with blog posts
- testimonials.tsx - Guest stories page (redirects to / until an entry is published)

### Testimonials

- Data lives in `lib/testimonials.json`, read through `lib/testimonials.ts`. Add entries with `yarn testimonial:add` (guided prompts). Real guest words only; never invent testimonials.
- With zero published entries the home block and nav item are hidden, `/testimonials` redirects to `/`, and the route is excluded from the sitemap.
- `yarn testimonial:sample` seeds the handoff placeholders (`sample-*` ids) for local preview only. They must not be committed; builds on Vercel refuse them.
- After adding an entry run `yarn build` and commit the regenerated `public/sitemap*.xml` with the data file.

### Destinations

- Data lives in `lib/destinations.json`, typed and read through `lib/workshops.ts`. Every entry renders at `/destinations/<slug>` via the shared template `pages/destinations/[slug].tsx`.
- Add a destination with `yarn destination:add` (guided prompts). Real trip details only. New dates for an existing destination: edit its `departures` directly; retire a trip with `"status": "expired"`.
- After adding run `yarn build` and commit the regenerated `public/sitemap*.xml` with the data file.

### Non Negotiables

- The website must be performant
- The website must be accessible
- The website must be user-friendly
- The website must be aesthetically pleasing
- Do not forget to update the sitemap.xml when new pages are added to the website including blog posts

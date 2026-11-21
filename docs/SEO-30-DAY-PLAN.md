# Asili Safaris: 30-day SEO plan

Written 20 November 2026. Covers 21 November to 20 December 2026.

## 1. Where things stand

### What Google showed (google.com, India, signed out, 20 Nov 2026)

| Search | What shows up | Our website? |
|--------|---------------|--------------|
| `asili safaris` | 1. asilisafaris.com, a **different "Asili Safaris"** in Arusha, Tanzania. Then Asili Adventure Safaris (Kenya), Asili Explorer and Asilia Africa. Our **Instagram is at #4**. No Business Profile panel. | Not in the top 9 |
| `asili safaris india` | **Business Profile panel shows.** Instagram #1, Facebook #2, two Instagram posts (one by a guest) at #3 and #4. | Not in the top 9 |
| `asili safaris pune` | Business Profile panel. Google's AI Overview says "there is no verified brick-and-mortar tour operator listed as Asili Safaris in Pune" and lists the African companies instead. | Not shown |
| `tarang hirani` | **taranghirani.com is #1**, plus /destinations, /gallery and /contact. All of them still carry the **old "Tarang Hirani" titles**. | Yes, under the old name |

What this means:

- **Google already knows the brand from your Business Profile and Instagram.** It just doesn't connect the brand to the website. To Google, the website still belongs to "Tarang Hirani | Wildlife Photographer", because it hasn't recrawled the pages since the rebrand.
- **Another business called "Asili Safaris" owns `asilisafaris.com`.** It's in Tanzania and ranks #1 for the bare name. You can't take the bare name from them in 30 days. "Asili Safaris India" and "Asili Safaris Pune" are where you can win first.
- **The Business Profile and the website point at each other's opposites.** The profile's website button goes to `asilisafaris.in`. That address redirects (307) to `www.asilisafaris.in`, which tells Google (through its canonical tag) that the real page is `taranghirani.com`. So the brand's own profile points at a domain that says it isn't the brand's.
- **The Facebook page has different contact details.** Google shows it with **+91 90700 37045** and **safaris@taranghirani.com**. The site and Business Profile use **+91 91753 47045** and tarang@asilisafaris.in. Mismatched contact details weaken the profile.
- **The trip searches are winnable.** For "Panna tiger reserve photography workshop" and "Kanha wildlife photography workshop 2027", the results are small operators like DCP Expeditions, Alpha Community, and Sheil Photo, plus foreign tour companies. None of them are big brands. A focused page with real dates and real detail can compete there.
- **The broad searches are harder.** "Wildlife photography tour India small group" is dominated by Nat Hab, Exodus, Naturetrek, and Wild Eye. Those sites have years of backlinks behind them, so we can't expect to beat them in 30 days.

A caveat: these are single signed-out checks, and results vary by person and location. Google Search Console (step 1 below) gives the real numbers. Also, `site:` searches returned 0 results for both domains even though pages clearly rank. Don't use `site:` to check indexing. Use Search Console.

### The Business Profile today

Name "Asili Safaris". Category *Travel agency*. Address: Digambar Nagar, Kalyani Nagar, Pune 411014. Phone 091753 47045. Website asilisafaris.in. **5.0 stars from 4 reviews.** It has photos and a "From Asili Safaris" description. It's a good start. The problems are what it points to and what disagrees with it, covered above.

### What the audit of the site and code showed

| # | Gap | Why it matters | Severity |
|---|-----|----------------|----------|
| 1 | **The brand runs on the founder's domain.** The canonical is `taranghirani.com`, and `www.asilisafaris.in` serves the full site with status 200, so the same site exists on two hosts. The apex domains use 307 (temporary) redirects. | A brand name matching its domain is one of the strongest signals for a branded search. All links, citations and the Google Business Profile should point at one address, and that address should be the brand's. The longer we wait, the more links pile up on the wrong domain. | Critical |
| 2 | **Google still sees the old brand.** The indexed pages carry the "Tarang Hirani" titles, and the site doesn't appear for any "Asili Safaris" search. | The rebrand doesn't count until Google recrawls the pages. Until then, the website can't rank for the brand name. | Critical |
| 3 | **The brand name collides with others.** Three established "Asili" safari companies exist, all in East Africa. | Google needs clear signs that this Asili Safaris is a different, India-based entity: a Business Profile, consistent name/address/phone, and profiles that link back. | High |
| 4 | **There's very little content.** 3 journal posts and 3 destination pages. The site says "India and Africa" but has no Africa page. | Each trip page can rank for about one group of searches. With 6 pages, the site has very few ways to be found. | High |
| 5 | **The site, Business Profile and Facebook disagree.** The phone and email differ on Facebook. The site's schema has only "Pune" as its address, while the profile has a street address. The site doesn't link to the profile. There are no directory listings, and the only `sameAs` link is Instagram. | Google trusts a business more when every source gives the same name, address and phone. Today the AI Overview says there is no verified Asili Safaris in Pune, which is a sign of that low trust. | High |
| 6 | **The home page H1 is just the logo image** (alt text "Asili Safaris"). The H2s are generic ("Selected Work", "My Journey into the Wild"). | The home page never states what the business does in heading text. That's a weak on-page signal. | Medium |
| 7 | **Panna is fully sold out**, and its title has no brand suffix. | A page with no dates you can book loses the "workshop 2027" searches. It needs the next season or a waitlist. | Medium |
| 8 | **Instagram traffic isn't tracked** separately from search. | Without that split, you can't tell whether search is the thing bringing in enquiries. | Medium |

What's already in good shape: titles and meta descriptions are unique and descriptive. Canonicals are set. Destination pages carry Event, Offer and BreadcrumbList structured data. Posts carry BlogPosting. The sitemap and robots.txt are clean. The site is server-rendered and loads in under 1 second. Images have alt text. None of these are the problem.

## 2. What counts as a measurable result in 30 days

SEO moves slowly, and this matters for how we judge the plan. Changes to a page usually take 1 to 4 weeks to show up in rankings. Backlinks take longer. A 30-day window can show whether **Google has found the site, understands it, and is starting to show it**. It can't show whether we've won the competitive searches. Setting targets on the wrong metrics would make a working plan look like a failure.

**Measure these in 30 days.** All come from Search Console unless noted.

| Metric | Baseline (record on day 1) | 30-day target |
|--------|----------------------------|---------------|
| Pages indexed (GSC → Pages) | unknown, probably low | All sitemap URLs indexed (currently 12; more as pages are added) |
| Website position for "asili safaris india" | not in top 9 (Business Profile, Instagram and Facebook are) | Website in the top 3 |
| Website position for "asili safaris pune" | not shown | Website in the top 3. The AI Overview names us |
| Website position for "asili safaris" | not in top 9 (Instagram #4; asilisafaris.com, Tanzania, is #1) | Website in the top 10, plus the Business Profile panel showing. This is the stretch goal |
| Position for "tarang hirani" | #1, under the old title | Still #1, showing the Asili Safaris title |
| Impressions per week | record it | 3x the baseline. From a near-zero start, this is realistic |
| Number of distinct queries with impressions | record it | 50+ |
| Average position for the trip-page searches (list in section 4) | record it | Every page in the top 30, at least 2 in the top 10 |
| Valid rich results (GSC → Enhancements: Events, Breadcrumbs) | record it | 0 errors, every open departure detected |
| Referring domains (GSC → Links) | record it | +8 relevant sites |
| Google Business Profile (Performance tab: searches, profile views, website clicks, calls/chats) | record it; 4 reviews, 5.0 | Website clicks and searches up on the baseline. 10+ reviews |
| Enquiries from search (WhatsApp/contact form, source = google) | 0 tracked | Tracked. Any non-zero number counts |
| Lighthouse mobile (Performance / SEO / Accessibility) | record it | 90+ on all three, on home and every destination page |

**Don't measure these in 30 days:** rankings for broad searches like "wildlife photography tour India" (that takes 6 to 12 months and depends on links), third-party "domain authority" scores, or total traffic as a judge of success. Traffic will still be small. Watch the trend, not the absolute number.

## 3. The 30-day plan

Owner key: **[code]** I can do in this repo. **[you]** needs your accounts or your voice.

### Week 1 (21–27 Nov): One domain, indexed and tracked

The goal is to fix the foundation before adding anything new. Content written on the wrong domain or before indexing is wasted effort.

- **Day 1 [you]** Verify **both** domains in Google Search Console, using a Domain property so DNS covers every subdomain. Write down the baseline numbers from the table above. Do the same in Bing Webmaster Tools, since it imports from GSC in one click.
- **Day 1–2 [you + code]** **Move the site to `www.asilisafaris.in`.** In Vercel, make `www.asilisafaris.in` the primary domain and make `taranghirani.com` and `www.taranghirani.com` 308-redirect to it, page for page. [code] Change `SITE_URL` in `lib/constants/index.ts` and `siteUrl` in `next-sitemap.config.js`, update `robots.txt`, rebuild the sitemap, and check every canonical and JSON-LD URL. Then [you] use GSC's **Change of Address** tool from taranghirani.com to asilisafaris.in.
  - *Why now:* the old domain barely has any search presence, so the usual cost of a domain move (a temporary dip in rankings) is close to nothing today. In six months it would cost real rankings.
- **Day 2 [you]** Submit the new sitemap in GSC. Use URL Inspection → Request indexing on the home page and the 3 destination pages.
- **Day 3 [code]** Add a short text line under the logo H1 that says what the business does, something like "Wildlife photography workshops in India's tiger reserves". It can be an `<h1>` that pairs the logo with that line, or a clear text H2. Rename the generic home H2s so they describe the content. Add the brand suffix to destination titles.
- **Day 3 [code]** Tag the WhatsApp and contact links so enquiries record their source (organic, Instagram, direct), using Vercel Analytics custom events or GA4.
- **Day 4–5 [you]** **Tune the existing Google Business Profile.** Write down its Performance numbers as the baseline. Then:
  - Confirm it's verified, since the AI Overview calls it unverified.
  - Change the primary category from *Travel agency* to ***Tour operator***, which is closer to what you do, and keep *Travel agency* as a secondary.
  - Change the website link to `https://www.asilisafaris.in/?utm_source=google&utm_medium=organic&utm_campaign=gbp`. That's the final address, so there's no redirect, and the UTM tag makes its clicks show up separately in analytics.
  - Keep the name exactly "Asili Safaris". Don't add keywords. Google suspends profiles that stuff the name.
  - Decide whether guests ever come to the Kalyani Nagar address. If not, hide the address and switch to a service area (Pune, Maharashtra, India). Google's rules require this for businesses without customer visits.
  - Add a Service for each open departure (Kanha Feb, Corbett Mar). Post an update for each one.
  - Add photos regularly, 10+ of your own.
- **Last step of the move [you]** **Retire `safaris@taranghirani.com`.** Do these in order, so no mail is lost:
  1. Switch Kit's sender to `tarang@asilisafaris.in`, and add the DNS records Kit gives you for `asilisafaris.in`.
  2. Check that Vercel's `CONTACT_FROM_ADDRESS` doesn't use it.
  3. Change the Facebook page email (next step).
  4. Delete the alias in ImprovMX.
- **Day 5 [you]** **Fix the Facebook page.** Change the phone to +91 91753 47045, the email to tarang@asilisafaris.in, and the website to asilisafaris.in, so every source matches the profile.
- **Day 5 [code]** Make the site match the profile. Add the full street address to the Organization schema and footer, written exactly as on the profile (only if you keep the address visible there). Add the profile's Maps URL and the Facebook page to the Organization `sameAs`. Link "Find us on Google" from the contact page.
- **Day 5–7 [you]** Put the same name, phone and website (the exact same text everywhere) on: the @asili.safaris and @tarang.hirani Instagram bios, Facebook page, LinkedIn page, WhatsApp Business profile, and YouTube if you have one. **[code]** Add every profile to the Organization `sameAs` and Founder `sameAs`.

*Check at end of week:* GSC shows the new property collecting data, the Change of Address is accepted, and URL Inspection shows the home and destination pages as indexed or queued.

### Week 2 (28 Nov–4 Dec): Make the trip pages the best answer for their searches

These pages are where bookings come from, and their searches are winnable.

- **[code + you]** For **Kanha (Feb 2027)** and **Jim Corbett (Mar 2027)**, the two open departures: add an FAQ section built from questions guests really ask you (camera gear, which zones, how many safaris, fitness, what's included, how to book), with FAQPage schema. Add a "best time to photograph" paragraph and a gear list. Aim for 1,200+ words that are genuinely useful. Don't pad.
- **[you]** **Panna:** put up next season's dates, even provisional ones marked "dates to be confirmed, register interest". If that isn't possible, add a waitlist form. That way the page stays relevant for "Panna photography workshop 2027".
- **[code]** Internal links: every journal post links to the destination it relates to, and every destination page links to 2 posts and the other destinations. Add destination links to the footer.
- **[code]** Check every Event in Google's Rich Results Test, then confirm in GSC → Enhancements.

*Check at end of week:* destination pages are getting impressions in GSC for searches with "workshop", "photography" and the park name.

### Week 3 (5–11 Dec): Content and the first links

The journal is the second way to be found. Each post should answer a real question a photographer searches for, and point to a trip.

- **[you write, code publishes]** Two posts. Your own field knowledge is what makes these hard to compete with, since competitors write generic copy.
  1. *Photographing tigers in Kanha: zones, light and timing* → links to Kanha.
  2. *Jim Corbett for photographers: Dhikala, the grasslands and the March light* → links to Jim Corbett.
- **[you]** Get backlinks from places that know you. These count for more than any directory:
  - Naharbagh and the other lodges you use: ask for a link on their "partners" or "workshops" page.
  - Camera clubs, photography communities, and any brand or gear shop you work with.
  - Past guests who blog or have a photography site.
  - Free, relevant listings: SafariBookings (it lists India operators), TripAdvisor (as an attraction/tour operator), Justdial, and any MP Tourism or Uttarakhand Tourism operator directory you qualify for.
- **[you]** Ask the 3 guests with published testimonials, and other past guests, to leave a Google review on the Business Profile. Send the direct review link from the profile (Ask for reviews → Share). Answer every review. Reviews are the main thing that sets this profile apart from the "Asili" companies in Tanzania and Kenya.

*Check at end of week:* GSC → Links shows new referring domains, and the Business Profile has new reviews.

### Week 4 (12–20 Dec): Measure, fix, and plan the next 60 days

- **[code]** Run Lighthouse on every page. Fix anything under 90. Recheck GSC → Pages for "Crawled, currently not indexed" and fix the cause.
- **[you]** Third post: *A wildlife photography workshop vs a regular safari: what's different*. This targets people comparing options, and it links to all destinations.
- **[code]** If Africa trips are real for 2027, add a destination page for them. If they aren't, remove "and Africa" from the meta descriptions so the site doesn't promise something it doesn't have.
- **Day 30 [both]** Fill in the results table. Find the queries in GSC → Performance that sit at positions 8–20. Those are the next pages to improve, since they're closest to page one.

## 4. How to get into the Google top 10, and for which searches

"Top 10" depends on the search. Here are three tiers, in order of how fast each can happen.

**Tier 1: branded searches (2–6 weeks).** "asili safaris india", "asili safaris pune", "asili safaris workshop", "tarang hirani". The brand already ranks here through Instagram, Facebook and the Business Profile. The job is to get the website itself in, and once Google recrawls with the new titles it should follow quickly.
What it takes: the exact-match domain (asilisafaris.in), the Business Profile pointing at it with reviews building up, consistent profiles that link back, and Organization schema with `sameAs`. This is mostly week 1 work. The bare search "asili safaris" is harder because of the Tanzanian and Kenyan operators and Asilia. Getting into the top 10 there is realistic. Getting #1 depends on reviews and links over months.

**Tier 2: trip searches (1–3 months).** These are the ones that bring in bookings:
- panna tiger reserve photography workshop / panna photography tour
- kanha photography workshop 2027 / kanha wildlife photography tour
- jim corbett photography tour / dhikala photography workshop
- small group tiger photography workshop india

What it takes: the week 2 page work plus internal links plus a handful of relevant backlinks. The pages already ranking for these are small operators with fairly thin pages, so first-hand detail and FAQs can beat them.

**Tier 3: broad searches (6–12 months).** "wildlife photography tour india", "tiger photography tour".
What it takes: links over time from photography and travel publications, plus a steady journal (2 posts a month), plus guest reviews. Start pitching story ideas to the publications in month 2, for example Nature inFocus, Roundglass Sustain, Sanctuary Asia, and photography magazines. Your images are the selling point there.

## 5. Weekly time budget (solo operator)

About 3 to 4 hours a week of your time: Business Profile tuning and listings (week 1), dates and FAQ answers (week 2), writing and outreach (weeks 3–4). Everything marked [code] can be done here without needing your time beyond a review.

## Sources from the search

- [SafariBookings: Asili Explorer profile](https://www.safaribookings.com/profile/p753)
- [Your African Safari: Asili Adventure Safaris](https://www.yourafricansafari.com/c/asili-adventure-safaris)
- [Trip.com: Asili Explorer Safaris](https://sg.trip.com/travel-guide/attraction/monduli/asili-explorer-safaris-50700927?curr=SGD)
- [Asilia Africa](https://asiliaafrica.com/about-us/)
- [DCP Expeditions: Panna tiger photography Dec 2026](https://dcpexpeditions.com/tours/tiger-photography-in-india/panna-tiger-photography-expedition-dec-2026)
- [Alpha Community: Panna Odyssey](https://alphacommunity.in/photo-tours/123/the-panna-odyssey-a-guided-photo-expedition-to-panna-national-park-led-by-acclaimed-mentor-dheeraj-paul-indian-photo-tours)
- [DCP Expeditions: Kanha expedition](https://dcpexpeditions.com/tours/tiger-photography-in-india/kanha-nationalpark-tiger-and-other-wildlife-photography-expedition)
- [Penda Phototours: Tigers of India](https://www.pendaphototours.com/tour/tigers-of-india-photo-tour/)
- [Exploration Company: Small group India photographic tour](https://www.explorationscompany.com/small-group-india-photographic-tour/)
- [Nat Hab: Grand India Photo Expedition 2027](https://www.nathab.com/asia-adventure-travel/grand-india-photo-expedition/itinerary/2027)

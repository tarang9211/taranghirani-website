import Head from "next/head";

// Wording supplied by Tarang; reproduce verbatim, never edit or paraphrase.
type Block =
  | { p: string; lead?: string }
  | { ul: string[] }
  | { ol: string[] }
  | { table: { head: string[]; rows: string[][] } }
  | { lines: string[] };

const SECTIONS: { id: string; heading: string; blocks: Block[] }[] = [
  {
    id: "about-us",
    heading: "1. About us and these terms",
    blocks: [
      {
        p: 'Asili Safaris ("we", "us", "our") is a wildlife photography tour business. Asili Safaris is a sole proprietorship. Tarang Hirani is the owner. We operate from Pune, Maharashtra, India.',
      },
      {
        p: "These terms apply to all trips, workshops and services that you book with us. They apply to bookings on asilisafaris.in, by email, by phone and by message.",
      },
      { p: "When you book or pay, you agree to these terms." },
      {
        p: "We can change these terms at any time. The version on our website on the date of your booking applies to that booking.",
      },
    ],
  },
  {
    id: "who-can-join",
    heading: "2. Who can join",
    blocks: [
      {
        p: "Our trips are open to persons who are 16 years old or older. A person who is 16 or 17 years old can join only if these two conditions are true:",
      },
      {
        ul: [
          "A parent or legal guardian signs our consent and risk form before the trip.",
          "A parent or legal guardian books a seat and travels with the minor for the full trip.",
        ],
      },
      { p: "The parent or guardian is responsible for the minor at all times." },
      {
        p: "You do not need photography experience. You must bring your own camera, unless we agree in writing to a different arrangement.",
      },
    ],
  },
  {
    id: "bookings",
    heading: "3. Bookings",
    blocks: [
      {
        p: "Trips in India have a maximum of 6 guests. We give seats in the sequence in which we receive payment.",
      },
      { p: "We confirm your booking only when these three steps are complete:" },
      {
        ol: [
          "You complete our booking form with correct details.",
          "We receive your payment.",
          "We send you a written confirmation by email or message.",
        ],
      },
      {
        p: "You must give correct names, ages, ID details and health information. The person who makes the booking accepts these terms for all guests on that booking.",
      },
    ],
  },
  {
    id: "prices",
    heading: "4. Prices, inclusions and exclusions",
    blocks: [
      {
        p: "The trip page shows the price per person, the room type and the items that the price includes. Prices are in Indian Rupees (INR), unless the trip page shows a different currency.",
      },
      { p: "GST is chargeable as applicable." },
      { p: "Unless the trip page shows differently, the price does not include:" },
      {
        ul: [
          "Travel to and from the start point, for example flights and trains",
          "Camera equipment, insurance, tips and personal costs",
          "Visa fees and vaccinations",
          "Extra nights, food or activities that are not on the itinerary",
        ],
      },
      {
        p: "A government, park authority or supplier can increase a fee after you book. If this occurs, we can charge you the difference. We will tell you in writing before we charge it.",
      },
    ],
  },
  {
    id: "payment",
    heading: "5. Payment",
    blocks: [
      {
        table: {
          head: ["Payment", "Amount", "Due"],
          rows: [
            [
              "Advance",
              "50% of trip price",
              "At booking (for government safari zone permits)",
            ],
            ["Balance", "Remaining amount", "45 days before the trip starts"],
          ],
        },
      },
      {
        p: "If you book less than 45 days before the trip, you must pay the full amount at booking.",
      },
      {
        p: "If we do not receive the balance on time, we can cancel your booking. In this case, Section 6 applies.",
      },
      {
        p: "We accept bank transfer and UPI. You must pay all bank and transfer charges.",
      },
      {
        p: "For international trips, we can give a price in a foreign currency. You accept the risk of changes in the exchange rate.",
      },
    ],
  },
  {
    id: "if-you-cancel",
    heading: "6. If you cancel",
    blocks: [
      {
        p: "To cancel, send a written notice by email to enquiries@asilisafaris.in. The cancellation date is the date on which we receive your notice.",
      },
      {
        table: {
          head: ["When you cancel", "Refund"],
          rows: [
            [
              "More than 45 days before trip start",
              "50% of the advance paid (25% of trip price)",
            ],
            ["45 days or less before trip start, or no show", "No refund"],
          ],
        },
      },
      {
        p: "We send the refund within 14 days of the cancellation date. We send it to the payment method that you used.",
      },
      { p: "You cannot transfer your seat to another person." },
      {
        p: "We do not give a refund for parts of the trip that you do not use. For example, if you leave early or miss a safari drive, you get no refund.",
      },
      {
        p: "Some costs are not refundable after we pay them. Examples are park safari permits, flights and some resort bookings. We will tell you about these costs at booking. We do not refund these costs.",
      },
    ],
  },
  {
    id: "if-we-change-or-cancel",
    heading: "7. If we change or cancel a trip",
    blocks: [
      {
        p: "Sometimes we must change the itinerary, the resort, the safari zone or the sequence of activities. Usual causes are park rules, weather, road conditions, safety or a supplier problem. If possible, we replace a changed item with an item of a similar standard.",
      },
      { p: "We can cancel a trip for one of these causes:" },
      {
        ul: [
          "Too few guests book for the trip to run.",
          "An event in Section 12 makes the trip unsafe or not possible.",
        ],
      },
      { p: "If we cancel a trip, you can choose one of these two options:" },
      {
        ol: [
          "A full refund of the amounts that you paid to us",
          "A seat on a different trip, with the amount that you paid as credit",
        ],
      },
      {
        p: "We are not responsible for costs that you booked separately, for example flights, trains or visas. We recommend that you buy flexible tickets and travel insurance.",
      },
    ],
  },
  {
    id: "wildlife-parks-and-ethics",
    heading: "8. Wildlife, parks and our ethics",
    blocks: [
      {
        p: "Wildlife is wild. We do not promise that you will see or photograph a specific animal. We do not give a refund if you do not see an animal.",
      },
      {
        p: "Park authorities control safari zones, safari times, vehicle numbers and permits. They can change these items without notice. We obey their decisions.",
      },
      {
        p: "Ethics are our first priority. We do not bait animals. We do not chase or crowd animals. We do not tell drivers to break park rules. You must obey the same rules. On safety and ethics, the decision of our lead, guide or driver is final.",
      },
    ],
  },
  {
    id: "health-risk-and-insurance",
    heading: "9. Health, risk and insurance",
    blocks: [
      {
        p: "Safari trips have risks. Examples are rough roads, long jeep drives, heat, cold, dust, insects and wild animals. Some locations are remote and far from hospitals. You join the trip at your own risk.",
      },
      { p: "Before the trip, tell us in writing about:" },
      {
        ul: [
          "Medical conditions and allergies",
          "Food needs",
          "Physical limits that can have an effect on you during the trip",
        ],
      },
      {
        p: "We keep this information private. We use it only for your safety.",
      },
      {
        p: "Travel and medical insurance is mandatory for international trips. We recommend it for trips in India. Asili Safaris and Tarang Hirani accept no liability for a loss that insurance can cover. We also accept no liability for a loss that occurs because a guest has no insurance.",
      },
      {
        p: "If you become ill or hurt, we will help you get medical care. You must pay all medical and evacuation costs.",
      },
      { p: "Before the trip starts, you must sign our risk acceptance form." },
    ],
  },
  {
    id: "your-conduct",
    heading: "10. Your conduct",
    blocks: [
      {
        ul: [
          "Obey park rules, local laws and the instructions of our lead, guides and drivers.",
          "Respect other guests, staff and local communities.",
          "Do not use drones, flash or animal calls, unless the park permits them.",
          "Pay for damage that you cause to vehicles, rooms or equipment.",
        ],
      },
      { p: "We can remove a guest from the trip if the guest:" },
      {
        ul: [
          "Puts persons or wildlife at risk",
          "Breaks park rules",
          "Is abusive",
        ],
      },
      {
        p: "In this case, we give no refund. The guest must pay their own costs to return home.",
      },
    ],
  },
  {
    id: "suppliers-and-liability",
    heading: "11. Suppliers and limits of our liability",
    blocks: [
      {
        p: "We use independent suppliers. Examples are resorts, jeep operators, drivers, local guides, park authorities, airlines and transport companies. These suppliers are not our employees. Their own terms also apply to you.",
      },
      {
        p: "We select suppliers carefully. But we are not liable for loss, injury, delay or damage that these cause:",
      },
      {
        ul: [
          "A supplier or a park authority",
          "Another guest",
          "Wild animals",
          "You",
        ],
      },
      {
        p: "We are not liable for loss of or damage to your camera, lenses, phone or other personal items. Get insurance for your equipment.",
      },
      {
        p: "If a court finds us liable, our total liability is limited to the amount that you paid to us for that trip. This limit does not apply where Indian law does not permit it. An example is death or injury that our negligence causes.",
      },
    ],
  },
  {
    id: "events-outside-our-control",
    heading: "12. Events outside our control",
    blocks: [
      {
        p: "We are not liable if an event outside our control stops us from doing our duties. Examples are natural disaster, flood, fire, epidemic, war, riot, strike, government order, park closure and transport failure.",
      },
      { p: "If such an event cancels a trip, you can choose one of these two options:" },
      {
        ol: [
          "A full refund of the amounts that you paid to us",
          "A credit for a future trip",
        ],
      },
    ],
  },
  {
    id: "international-trips",
    heading: "13. International trips",
    blocks: [
      {
        p: "For trips outside India, for example East Africa, you are responsible for these items:",
      },
      {
        ul: [
          "A passport that is valid for a minimum of 6 months after your return date",
          "Visas and entry permits",
          "Vaccinations and health certificates, for example yellow fever",
          "Compliance with the rules of your home country and of the destination",
        ],
      },
      {
        p: "We can give general guidance. But we are not liable if a country refuses you entry or if you cannot travel.",
      },
      {
        p: "Local tour operators in the destination country can operate parts of the trip. Their own terms apply to those parts.",
      },
    ],
  },
  {
    id: "photos-and-videos",
    heading: "14. Photos and videos",
    blocks: [
      {
        lead: "Your photos.",
        p: "You own the copyright in the photos and videos that you make on the trip. We do not claim them.",
      },
      {
        lead: "Photos that you share.",
        p: "If you share a photo with us or tag us, you give us a free, non exclusive right to show it. We can show it on our website and social media, with credit to you. You can tell us to remove it at any time.",
      },
      {
        lead: "Photos of you.",
        p: "During the trip, we can photograph or film guests for our marketing. If you do not want to appear, tell us in writing before the trip. After that, we will not use your image.",
      },
      {
        lead: "Our content.",
        p: "Our teaching material, presentations and edits are our property. You can use them only for your own learning. Do not share, sell or publish them without our written consent.",
      },
    ],
  },
  {
    id: "privacy",
    heading: "15. Privacy",
    blocks: [
      {
        p: "We collect your name, contact details, ID details, age, health information and food needs. We use these data only for these purposes:",
      },
      {
        ul: [
          "To operate your trip",
          "To obey the law",
          "To send you updates, if you agree to receive them",
        ],
      },
      {
        p: "We share your data only with suppliers that need it for your trip, for example resorts, park authorities and transport. We also share it with authorities when the law tells us to.",
      },
      {
        p: "Our website uses cookies and tracking tools, for example the Meta Pixel. We use them to measure our advertisements. You can block cookies in your browser.",
      },
      // shortcut: the supplied text ends with the drafting note "[Publish a
      // separate full Privacy Policy and link it here.]"; link it once that page exists.
      {
        p: "At any time, you can tell us to show, correct or delete your data. You can also tell us to stop marketing emails. We obey the Digital Personal Data Protection Act, 2023 of India.",
      },
    ],
  },
  {
    id: "website-use",
    heading: "16. Website use",
    blocks: [
      {
        p: "All photos, text, logos and design on asilisafaris.in are the property of Asili Safaris or Tarang Hirani. Do not copy, download or use them again without our written consent.",
      },
      {
        p: "We try to keep the website correct. Trip details, prices and dates can change. The details in your written booking confirmation apply.",
      },
    ],
  },
  {
    id: "law-and-disputes",
    heading: "17. Law and disputes",
    blocks: [
      {
        p: "The laws of India apply to these terms. If you have a complaint, contact us first. We will try to solve the complaint within 30 days.",
      },
      {
        p: "If a court finds one part of these terms not valid, the other parts stay in force.",
      },
    ],
  },
  {
    id: "contact-and-grievances",
    heading: "18. Contact and grievances",
    blocks: [
      {
        p: "For bookings, cancellations, privacy requests or complaints, contact:",
      },
      {
        lines: [
          "Tarang Hirani, Owner and Grievance Officer, Asili Safaris",
          "Email: enquiries@asilisafaris.in",
          "Pune, Maharashtra, India",
        ],
      },
      { p: "We reply to complaints within 30 days." },
    ],
  },
];

const listClass =
  "mt-4 space-y-2 pl-5 text-base leading-relaxed text-charcoal marker:text-smoke";

function renderBlock(block: Block, i: number) {
  if ("ul" in block)
    return (
      <ul key={i} className={`list-disc ${listClass}`}>
        {block.ul.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  if ("ol" in block)
    return (
      <ol key={i} className={`list-decimal ${listClass}`}>
        {block.ol.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>
    );
  if ("table" in block)
    return (
      <div key={i} className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm md:text-base text-charcoal">
          <thead>
            <tr className="border-b border-charcoal/20">
              {block.table.head.map((h) => (
                <th key={h} scope="col" className="py-3 pr-4 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.table.rows.map(([first, ...rest]) => (
              <tr key={first} className="border-b border-charcoal/10">
                <th scope="row" className="py-3 pr-4 align-top font-medium">
                  {first}
                </th>
                {rest.map((cell) => (
                  <td key={cell} className="py-3 pr-4 align-top">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  if ("lines" in block)
    return (
      <address
        key={i}
        className="mt-4 not-italic text-base leading-relaxed text-charcoal"
      >
        {block.lines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </address>
    );
  return (
    <p key={i} className="mt-4 text-base leading-relaxed text-charcoal">
      {block.lead && <strong className="font-semibold">{block.lead} </strong>}
      {block.p}
    </p>
  );
}

export default function TermsPage() {
  return (
    <>
      <Head>
        <title>Terms and Conditions | Tarang Hirani</title>
        <meta
          name="description"
          content="Booking, payment, cancellation and participation terms for Asili Safaris wildlife photography trips and workshops led by Tarang Hirani."
        />
        <meta name="robots" content="noindex, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <article className="bg-paper min-h-screen pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="mx-auto max-w-3xl px-6 md:px-12">
          <div className="h-px w-12 bg-sage" />
          <h1 className="mt-8 font-display text-4xl md:text-5xl font-semibold text-charcoal tracking-tight">
            Terms and Conditions
          </h1>

          <nav
            aria-label="Contents"
            className="mt-10 border-y border-charcoal/10 py-6"
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-smoke">
              Contents
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2 text-sm">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="text-charcoal underline decoration-charcoal/20 underline-offset-4 hover:decoration-sage transition-colors"
                  >
                    {s.heading}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {SECTIONS.map((s) => (
            <section key={s.id} aria-labelledby={s.id} className="mt-12">
              <h2
                id={s.id}
                className="scroll-mt-28 font-display text-2xl md:text-3xl font-semibold text-charcoal tracking-tight"
              >
                {s.heading}
              </h2>
              {s.blocks.map(renderBlock)}
            </section>
          ))}
        </div>
      </article>
    </>
  );
}

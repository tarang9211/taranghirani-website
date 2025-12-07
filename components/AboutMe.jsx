import React from "react";

export default function AboutSection({ featuredImage }) {
  return (
    <section className="bg-espresso/80 py-20">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-6 md:px-12 lg:flex-row lg:px-20">
        <img
          src={featuredImage.url}
          alt={featuredImage.alt}
          className="h-auto w-full max-w-md rounded-2xl border border-smoke/30 bg-charcoal/40 object-cover shadow-xl lg:max-w-lg"
        />
        <div className="max-w-2xl rounded-3xl border border-smoke/30 bg-espresso px-8 py-10 text-white shadow-lg lg:max-w-3xl">
          <h2 className="text-3xl font-semibold text-parchment md:text-4xl">
            My Journey into the Wild
          </h2>

          <p className="mt-6 text-parchment">
            I’ve been fascinated by wildlife since childhood — starting from
            various parks in India, seemingly endless plains of Serengeti,
            stunning landscapes of the Masai Mara, and the dusty savannahs of
            Amboseli admist the mighty Mt. Kilimanjaro . The camera came later.
            On a leisure trip to the forests of Central India, I decided to
            document what I’d been watching all my life, and that first roll of
            images set the course.
          </p>

          <p className="mt-6 text-parchment">
            Now I spend every spare stretch of daylight in the field, chasing
            real behaviour rather than staged moments. Some frames are tight
            portraits; others are <em>small in frame</em> scenes that show how
            tiny an animal can look in its own vast habitat.
          </p>

          <p className="mt-6 text-parchment">
            My kit has grown up with me—from entry-level Nikon DSLRs to the
            mirrorless flagship&nbsp;
            <strong className="font-semibold text-gold">Nikon Z9</strong>,
            letting me work quickly and unobtrusively in the wild.
          </p>
        </div>
      </div>
    </section>
  );
}

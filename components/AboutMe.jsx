import React from "react";

export default function AboutSection({ featuredImage }) {
  return (
    <section className="bg-paper py-20">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-6 md:px-12 lg:flex-row lg:px-20">
        <img
          src={featuredImage.url}
          alt={featuredImage.alt}
          className="h-auto w-full max-w-md rounded-2xl border border-gray-200 bg-gray-100 object-cover shadow-xl lg:max-w-lg"
        />
        <div className="max-w-2xl px-4 py-6 text-smoke lg:max-w-3xl lg:px-0">
          <h2 className="text-3xl font-semibold text-charcoal md:text-4xl">
            My Journey into the Wild
          </h2>

          <p className="mt-6 text-smoke">
            I’ve been fascinated by wildlife since childhood. Starting from
            various parks in India, seemingly endless plains of Serengeti,
            stunning landscapes of the Masai Mara, and the dusty savannahs of
            Amboseli admist the mighty Mt. Kilimanjaro . The camera came later.
            On a leisure trip to the forests of Central India, I decided to
            document what I’d been watching all my life, and that first roll of
            images set the course.
          </p>

          <p className="mt-6 text-smoke">
            Now I spend every spare stretch of daylight in the field, chasing
            real behaviour rather than staged moments. Some frames are tight
            portraits; others are <em>small in frame</em> scenes that show how
            tiny an animal can look in its own vast habitat.
          </p>

          <p className="mt-6 text-smoke">
            My kit has grown up with me from Nikon DSLRs to the&nbsp;
            <strong className="font-semibold text-charcoal">Z9</strong>, Nikon's
            mirrorless flagship,&nbsp;letting me work quickly and unobtrusively
            in the wild.
          </p>
        </div>
      </div>
    </section>
  );
}

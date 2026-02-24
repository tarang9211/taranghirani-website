import React from "react";
import Image from "next/image";

export default function AboutSection({ featuredImage }) {
  return (
    <section className="bg-paper py-20 md:py-24 border-t border-gray-200/60">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 md:px-12 lg:flex-row lg:gap-16 lg:px-20">
        <Image
          src={featuredImage.url}
          alt={featuredImage.alt}
          width={600}
          height={800}
          className="h-auto w-full max-w-md rounded-2xl border border-gray-200 bg-gray-100 object-cover shadow-xl lg:max-w-lg"
        />
        <div className="max-w-2xl py-4 text-smoke lg:max-w-3xl">
          <h2 className="text-3xl font-semibold text-charcoal md:text-4xl tracking-tight">
            My Journey into the Wild
          </h2>

          <p className="mt-5 leading-relaxed text-smoke">
            I've been fascinated by wildlife since childhood. Starting from
            various parks in India, seemingly endless plains of Serengeti,
            stunning landscapes of the Masai Mara, and the dusty savannahs of
            Amboseli admist the mighty Mt. Kilimanjaro . The camera came later.
            On a leisure trip to the forests of Central India, I decided to
            document what I'd been watching all my life, and that first roll of
            images set the course.
          </p>

          <p className="mt-5 leading-relaxed text-smoke">
            Now I spend every spare stretch of daylight in the field, chasing
            real behaviour rather than staged moments. Some frames are tight
            portraits; others are <em>small in frame</em> scenes that show how
            tiny an animal can look in its own vast habitat.
          </p>

          <p className="mt-5 leading-relaxed text-smoke">
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

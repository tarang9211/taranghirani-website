import React from "react";
import Image from "next/image";
import { useInView } from "../lib/useInView";

const PORTRAIT = {
  url: "https://res.cloudinary.com/duiyn8wll/image/upload/f_auto,q_auto/db3b2405-9bec-4b5e-a88f-80c4032b321c_ukpumb",
  alt: "Tarang Hirani in the field",
};

export default function AboutSection() {
  const { ref: textRef, visible: textVisible } = useInView(0.1);
  const { ref: imgRef, visible: imgVisible } = useInView();

  return (
    <section className="bg-charcoal overflow-hidden">
      {/* Thin separator from Statement */}
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-20">
        <div className="h-px bg-white/5" />
      </div>

      <div className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-8">
            {/* Text — left 8 columns */}
            <div
              ref={textRef}
              className={`lg:col-span-8 transition-all duration-700 delay-150 ${
                textVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-sage">
                <span className="font-display text-base">02</span>
                <span className="mx-3 inline-block h-px w-6 bg-sage/40 align-middle" />
                About
              </p>
              <div className="mt-4 h-px w-16 bg-white/10" />

              <h2 className="mt-8 font-display text-3xl font-semibold text-white md:text-4xl tracking-tight">
                My Journey into the Wild
              </h2>

              <p className="mt-8 text-base md:text-lg leading-relaxed text-gray-400">
                I've been fascinated by wildlife since childhood. Starting from
                various parks in India, seemingly endless plains of Serengeti,
                stunning landscapes of the Masai Mara, and the dusty savannahs
                of Amboseli admist the mighty Mt. Kilimanjaro . The camera came
                later. On a leisure trip to the forests of Central India, I
                decided to document what I'd been watching all my life, and that
                first roll of images set the course.
              </p>

              <p className="mt-6 text-base md:text-lg leading-relaxed text-gray-400">
                Now I spend every spare stretch of daylight in the field,
                chasing real behaviour rather than staged moments. Some frames
                are tight portraits; others are <em>small in frame</em> scenes
                that show how tiny an animal can look in its own vast habitat.
              </p>

              <p className="mt-6 text-base md:text-lg leading-relaxed text-gray-400">
                My kit has grown up with me from Nikon DSLRs to the&nbsp;
                <strong className="font-medium text-white">Z9</strong>, Nikon's
                mirrorless flagship,&nbsp;letting me work quickly and
                unobtrusively in the wild.
              </p>
            </div>

            {/* Image — right 4 columns, vertically centered, portrait crop */}
            <div
              ref={imgRef}
              className={`lg:col-span-4 lg:self-center transition-all duration-700 ${
                imgVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <div className="mx-auto max-w-sm lg:max-w-none lg:ml-auto lg:mr-0 lg:w-[320px] xl:w-[360px]">
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
                  <Image
                    src={PORTRAIT.url}
                    alt={PORTRAIT.alt}
                    fill
                    sizes="(min-width: 1280px) 360px, (min-width: 1024px) 320px, 384px"
                    className="object-cover object-center"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

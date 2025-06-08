import React from "react";

export default function AboutSection({ featuredImage }) {
  return (
    <section
      className="
  py-16 px-6 md:px-12 lg:px-20
  flex flex-col lg:flex-row
  gap-10
  items-center lg:items-start"
    >
      <img
        src={featuredImage.url}
        alt={featuredImage.alt}
        className="w-96 md:w-[28rem] h-auto object-cover shadow-lg"
      />
      <div className="max-w-2xl lg:max-w-3xl">
        <h2 className="text-3xl font-semibold mb-4">
          My Journey into the Wild
        </h2>

        <p className="mb-4">
          I’ve been fascinated by wildlife since childhood — starting from
          various parks in India, seemingly endless plains of Serengeti,
          stunning landscapes of the Masai Mara, and the dusty savannahs of
          Amboseli admist the mighty Mt. Kilimanjaro . The camera came later. On
          a leisure trip to the forests of Central India, I decided to document
          what I’d been watching all my life, and that first roll of images set
          the course.
        </p>

        <p className="mb-4">
          Now I spend every spare stretch of daylight in the field, chasing real
          behaviour rather than staged moments. Some frames are tight portraits;
          others are <em>small in frame</em> scenes that show how tiny an animal
          can look in its own vast habitat.
        </p>

        <p>
          My kit has grown up with me—from entry-level Nikon DSLRs to the
          mirrorless flagship&nbsp;
          <strong>Nikon Z9</strong>, letting me work quickly and unobtrusively
          in the wild.
        </p>
      </div>
    </section>
  );
}

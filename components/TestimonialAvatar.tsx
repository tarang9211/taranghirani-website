import React from "react";
import Image from "next/image";

// Circular guest photo. Renders nothing when there is no photo so the layout
// never shows an empty frame or initials (see the testimonials handoff).
// Decorative: the guest's name is always printed beside it, so an alt would
// make screen readers announce the name twice.
export default function TestimonialAvatar({
  src,
  size,
}: {
  src?: string;
  size: 48 | 96;
}) {
  if (!src) return null;
  return (
    <Image
      src={src}
      alt=""
      width={size}
      height={size}
      className="shrink-0 rounded-full object-cover"
    />
  );
}

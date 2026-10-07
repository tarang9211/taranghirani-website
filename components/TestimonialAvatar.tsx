import React from "react";
import Image from "next/image";

// Circular guest photo. Renders nothing when there is no photo so the layout
// never shows an empty frame or initials (see the testimonials handoff).
export default function TestimonialAvatar({
  src,
  name,
  size,
}: {
  src?: string;
  name: string;
  size: 48 | 96;
}) {
  if (!src) return null;
  return (
    <Image
      src={src}
      alt={name}
      width={size}
      height={size}
      className="shrink-0 rounded-full object-cover"
    />
  );
}

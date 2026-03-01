import React from "react";
import { GalleryImage } from "../../lib/helpers";
import { useInView } from "../../lib/useInView";

interface ImageCardProps {
  image: GalleryImage;
  alt?: string;
  onSelect?: (image: GalleryImage) => void;
  delay?: number;
}

const ImageCard: React.FC<ImageCardProps> = ({
  image,
  alt,
  onSelect,
  delay = 0,
}) => {
  const { id, url } = image;
  const { ref, visible } = useInView(0.1);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <button
        type="button"
        onClick={() => onSelect?.(image)}
        className="group cursor-pointer w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal"
      >
        <div className="relative overflow-hidden">
          <img
            src={url}
            alt={alt || `Image ${id}`}
            className="w-full h-auto block transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            loading="lazy"
            style={{ display: "block" }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500" />
        </div>
      </button>
    </div>
  );
};

export default ImageCard;

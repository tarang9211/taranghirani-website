import React from "react";
import { GalleryImage } from "../../lib/helpers";

interface ImageCardProps {
  image: GalleryImage;
  alt?: string;
  onSelect?: (image: GalleryImage) => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ image, alt, onSelect }) => {
  const { id, url } = image;

  return (
    <button
      type="button"
      onClick={() => onSelect?.(image)}
      className="group cursor-pointer w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-charcoal focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
    >
      <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]">
        <img
          src={url}
          alt={alt || `Image ${id}`}
          className="w-full h-auto block"
          loading="lazy"
          style={{ display: "block" }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
      </div>
    </button>
  );
};

export default ImageCard;

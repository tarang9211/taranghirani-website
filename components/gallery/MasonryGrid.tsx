import React from "react";
import ImageCard from "./ImageCard";
import { GalleryImage } from "../../lib/helpers";

interface MasonryGridProps {
  images: GalleryImage[];
  onSelect?: (image: GalleryImage, index: number) => void;
}

const MasonryGrid: React.FC<MasonryGridProps> = ({ images, onSelect }) => {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 md:gap-6">
      {images.map((image, index) => (
        <div key={image.id} className="break-inside-avoid mb-5 md:mb-6">
          <ImageCard
            image={image}
            alt={image.alt}
            onSelect={(currentImage) => onSelect?.(currentImage, index)}
            delay={(index % 3) * 100}
          />
        </div>
      ))}
    </div>
  );
};

export default MasonryGrid;

import React from "react";
import ImageCard from "./ImageCard";
import { GalleryImage } from "../../lib/helpers";

interface MasonryGridProps {
  images: GalleryImage[];
  onSelect?: (image: GalleryImage, index: number) => void;
}

const MasonryGrid: React.FC<MasonryGridProps> = ({ images, onSelect }) => {
  return (
    <div className="columns-1 sm:columns-2 md:columns-3 gap-4">
      {images.map((image, index) => (
        <div key={image.id} className="break-inside-avoid mb-4">
          <ImageCard
            image={image}
            alt={`Gallery image ${index + 1}`}
            onSelect={(currentImage) => onSelect?.(currentImage, index)}
          />
        </div>
      ))}
    </div>
  );
};

export default MasonryGrid;

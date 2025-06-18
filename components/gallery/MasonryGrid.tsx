import React from "react";
import ImageCard from "./ImageCard";
import { GalleryImage } from "../../lib/helpers";

interface MasonryGridProps {
  images: GalleryImage[];
}

const MasonryGrid: React.FC<MasonryGridProps> = ({ images }) => {
  return (
    <div className="columns-1 sm:columns-2 md:columns-3 gap-4">
      {images.map((image, index) => (
        <div key={image.id} className="break-inside-avoid mb-4">
          <ImageCard
            id={image.id}
            url={image.url}
            alt={`Gallery image ${index + 1}`}
          />
        </div>
      ))}
    </div>
  );
};

export default MasonryGrid;

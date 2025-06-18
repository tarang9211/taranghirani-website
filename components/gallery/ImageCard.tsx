import React from "react";

interface ImageCardProps {
  id: string;
  url: string;
  alt?: string;
}

const ImageCard: React.FC<ImageCardProps> = ({ id, url, alt }) => {
  return (
    <div className="group cursor-pointer w-full">
      <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]">
        <img
          src={url}
          alt={alt || `Image ${id}`}
          className="w-full h-auto block"
          loading="lazy"
          style={{ display: "block" }}
        />
        {/* Optional overlay for hover effects */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
      </div>
    </div>
  );
};

export default ImageCard;

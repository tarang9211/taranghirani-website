import React, { useCallback } from "react";
import { GalleryImage } from "../../lib/helpers";

interface ImageLightboxProps {
  image: GalleryImage;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({
  image,
  onClose,
  onNext,
  onPrevious,
  hasNext = false,
  hasPrevious = false,
}) => {
  const handleBackdropClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) {
        onClose();
      }
    },
    [onClose],
  );

  const altText = `Gallery image ${image.id}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 px-4 py-10"
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-6 top-6 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        aria-label="Close image"
      >
        <span className="text-2xl leading-none">&times;</span>
      </button>

      {hasPrevious && onPrevious ? (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onPrevious();
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          aria-label="View previous image"
        >
          <span className="text-2xl leading-none">&#8592;</span>
        </button>
      ) : null}

      {hasNext && onNext ? (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onNext();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          aria-label="View next image"
        >
          <span className="text-2xl leading-none">&#8594;</span>
        </button>
      ) : null}

      <div
        className="max-h-full w-full max-w-5xl"
        onClick={(event) => event.stopPropagation()}
      >
        <img
          src={image.url}
          alt={altText}
          className="max-h-[80vh] w-full rounded-lg object-contain shadow-2xl"
        />
      </div>
    </div>
  );
};

export default ImageLightbox;

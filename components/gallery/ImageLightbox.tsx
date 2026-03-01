import React, { useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { GalleryImage } from "../../lib/helpers";

interface ImageLightboxProps {
  image: GalleryImage;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
  currentIndex?: number;
  totalCount?: number;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({
  image,
  onClose,
  onNext,
  onPrevious,
  hasNext = false,
  hasPrevious = false,
  currentIndex,
  totalCount,
}) => {
  const handleBackdropClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) {
        onClose();
      }
    },
    [onClose],
  );

  const showCounter =
    currentIndex !== undefined && totalCount !== undefined && totalCount > 1;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 px-4 py-6 md:py-10"
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 py-4 md:px-8 md:py-6">
        {showCounter ? (
          <span className="font-body text-xs tracking-[0.15em] uppercase text-white/40">
            {currentIndex + 1} / {totalCount}
          </span>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-2 text-white/60 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          aria-label="Close image"
        >
          <X size={20} strokeWidth={1.5} />
        </button>
      </div>

      {/* Navigation arrows */}
      {hasPrevious && onPrevious ? (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onPrevious();
          }}
          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full p-2.5 text-white/40 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black md:left-6"
          aria-label="View previous image"
        >
          <ChevronLeft size={28} strokeWidth={1.5} />
        </button>
      ) : null}

      {hasNext && onNext ? (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onNext();
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2.5 text-white/40 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black md:right-6"
          aria-label="View next image"
        >
          <ChevronRight size={28} strokeWidth={1.5} />
        </button>
      ) : null}

      {/* Image + Caption */}
      <div
        className="flex max-h-full w-full max-w-6xl flex-col items-center"
        onClick={(event) => event.stopPropagation()}
      >
        <img
          src={image.url}
          alt={image.alt}
          className="max-h-[78vh] w-auto max-w-full object-contain"
        />
        {image.alt && image.alt !== "Wildlife photograph" && (
          <p className="mt-4 font-body text-sm text-white/40 tracking-wide">
            {image.alt}
          </p>
        )}
      </div>
    </div>
  );
};

export default ImageLightbox;

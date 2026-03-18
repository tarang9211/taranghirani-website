import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import FadeIn from "../FadeIn";
import ImageLightbox from "../gallery/ImageLightbox";

function TextBlock({ body, isFirst }) {
  return (
    <FadeIn className="mt-6">
      <p
        className={`text-base md:text-lg leading-relaxed text-smoke ${
          isFirst ? "first-letter:float-left first-letter:font-display first-letter:text-[3.5rem] first-letter:md:text-[4.5rem] first-letter:font-semibold first-letter:leading-[0.75] first-letter:mr-3 first-letter:mt-[0.1em] first-letter:text-charcoal" : ""
        }`}
      >
        {body}
      </p>
    </FadeIn>
  );
}

function ImageBlock({ image, onClick }) {
  return (
    <FadeIn className="my-10 max-w-4xl mx-auto">
      <div
        className="overflow-hidden rounded-xl cursor-zoom-in"
        onClick={onClick}
      >
        <Image
          src={image.url}
          alt={image.alt}
          width={1200}
          height={800}
          className="w-full h-auto object-cover transition-transform duration-300 hover:scale-[1.02]"
        />
      </div>
      {image.caption && (
        <p className="mt-3 text-center text-sm text-smoke/60 italic">
          {image.caption}
        </p>
      )}
    </FadeIn>
  );
}

function GalleryBlock({ images, onImageClick }) {
  return (
    <FadeIn className="my-10 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {images.map((img, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-xl cursor-zoom-in"
            onClick={() => onImageClick(i)}
          >
            <Image
              src={img.url}
              alt={img.alt}
              width={600}
              height={400}
              className="w-full h-auto object-cover transition-transform duration-300 hover:scale-[1.02]"
            />
          </div>
        ))}
      </div>
    </FadeIn>
  );
}

function QuoteBlock({ text, attribution }) {
  return (
    <FadeIn className="my-12 text-center max-w-2xl mx-auto">
      <div className="h-px w-12 bg-sage/30 mx-auto" />
      <blockquote className="mt-6 font-display text-xl md:text-2xl italic text-charcoal leading-relaxed">
        &ldquo;{text}&rdquo;
      </blockquote>
      {attribution && (
        <p className="mt-4 text-sm text-smoke/60 tracking-wide">
          — {attribution}
        </p>
      )}
      <div className="mt-6 h-px w-12 bg-sage/30 mx-auto" />
    </FadeIn>
  );
}

export default function ContentRenderer({ content }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // Collect all images (from image and gallery blocks) into a flat list for lightbox navigation
  const allImages = useMemo(() => {
    const images = [];
    content.forEach((block) => {
      if (block.type === "image") {
        images.push(block.image);
      } else if (block.type === "gallery") {
        block.images.forEach((img) => images.push(img));
      }
    });
    return images;
  }, [content]);

  // Build a mapping from block index to the starting position in allImages
  const blockImageOffset = useMemo(() => {
    const offsets = {};
    let offset = 0;
    content.forEach((block, index) => {
      if (block.type === "image") {
        offsets[index] = offset;
        offset += 1;
      } else if (block.type === "gallery") {
        offsets[index] = offset;
        offset += block.images.length;
      }
    });
    return offsets;
  }, [content]);

  const lightboxImage = lightboxIndex !== null ? {
    id: String(lightboxIndex),
    url: allImages[lightboxIndex].url,
    thumbnailUrl: allImages[lightboxIndex].url,
    alt: allImages[lightboxIndex].alt || "Blog image",
  } : null;

  const lightboxCaption = lightboxIndex !== null
    ? allImages[lightboxIndex].caption || allImages[lightboxIndex].alt || ""
    : "";

  const handleClose = useCallback(() => setLightboxIndex(null), []);

  const handleNext = useCallback(() => {
    setLightboxIndex((current) => {
      if (current === null || current >= allImages.length - 1) return current;
      return current + 1;
    });
  }, [allImages.length]);

  const handlePrevious = useCallback(() => {
    setLightboxIndex((current) => {
      if (current === null || current <= 0) return current;
      return current - 1;
    });
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        handleClose();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        handleNext();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        handlePrevious();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, handleClose, handleNext, handlePrevious]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightboxIndex === null) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = originalOverflow; };
  }, [lightboxIndex]);

  return (
    <div>
      {content.map((block, index) => {
        switch (block.type) {
          case "text": {
            const isFirstText = !content.slice(0, index).some((b) => b.type === "text");
            return <TextBlock key={index} body={block.body} isFirst={isFirstText} />;
          }
          case "image":
            return (
              <ImageBlock
                key={index}
                image={block.image}
                onClick={() => setLightboxIndex(blockImageOffset[index])}
              />
            );
          case "gallery":
            return (
              <GalleryBlock
                key={index}
                images={block.images}
                onImageClick={(i) => setLightboxIndex(blockImageOffset[index] + i)}
              />
            );
          case "quote":
            return (
              <QuoteBlock
                key={index}
                text={block.text}
                attribution={block.attribution}
              />
            );
          default:
            return null;
        }
      })}

      {lightboxImage && (
        <ImageLightbox
          image={lightboxImage}
          caption={lightboxCaption}
          onClose={handleClose}
          onPrevious={handlePrevious}
          onNext={handleNext}
          hasPrevious={lightboxIndex > 0}
          hasNext={lightboxIndex < allImages.length - 1}
          currentIndex={lightboxIndex}
          totalCount={allImages.length}
        />
      )}
    </div>
  );
}

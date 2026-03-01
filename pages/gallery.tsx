import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import ImageLightbox from "../components/gallery/ImageLightbox";
import MasonryGrid from "../components/gallery/MasonryGrid";
import { listImages, GalleryImage } from "../lib/helpers";

import { useInView } from "../lib/useInView";

interface GalleryProps {
  images: GalleryImage[];
}

export async function getStaticProps() {
  try {
    const images = await listImages(30, true);

    return {
      props: {
        images,
      },
      revalidate: 3600,
    };
  } catch (error) {
    console.error("Error fetching gallery images:", error);

    return {
      props: {
        images: [],
      },
      revalidate: 300,
    };
  }
}

export default function Gallery({ images }: GalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hasHydratedFromQuery, setHasHydratedFromQuery] = useState(false);
  const router = useRouter();
  const imageQueryParam = router.query.image;
  const imageQueryId =
    typeof imageQueryParam === "string" ? imageQueryParam : undefined;

  const { ref: ctaRef, visible: ctaVisible } = useInView(0.2);

  useEffect(() => {
    if (!router.isReady) return;

    if (imageQueryId) {
      const matchIndex = images.findIndex((img) => img.id === imageQueryId);

      if (matchIndex !== -1) {
        setSelectedIndex((current) =>
          current === matchIndex ? current : matchIndex,
        );
        setHasHydratedFromQuery(true);
        return;
      }
    }

    setSelectedIndex((current) => (current === null ? current : null));
    setHasHydratedFromQuery(true);
  }, [router.isReady, imageQueryId, images]);

  const selectedImage = useMemo(() => {
    if (
      selectedIndex === null ||
      selectedIndex < 0 ||
      selectedIndex >= images.length
    ) {
      return null;
    }

    return images[selectedIndex] ?? null;
  }, [selectedIndex, images]);

  useEffect(() => {
    if (!router.isReady || !hasHydratedFromQuery) return;

    const currentId =
      selectedIndex === null ? undefined : images[selectedIndex]?.id;

    if (currentId === imageQueryId) return;

    const nextQuery = { ...router.query };

    if (currentId) {
      nextQuery.image = currentId;
    } else {
      delete nextQuery.image;
    }

    router.replace({ pathname: router.pathname, query: nextQuery }, undefined, {
      shallow: true,
      scroll: false,
    });
  }, [
    router,
    router.isReady,
    images,
    selectedIndex,
    imageQueryId,
    hasHydratedFromQuery,
  ]);

  const handleSelect = useCallback((_image: GalleryImage, index: number) => {
    setSelectedIndex(index);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const handleNext = useCallback(() => {
    if (images.length === 0) return;

    setSelectedIndex((current) => {
      if (current === null) return current;
      return (current + 1) % images.length;
    });
  }, [images.length]);

  const handlePrevious = useCallback(() => {
    if (images.length === 0) return;

    setSelectedIndex((current) => {
      if (current === null) return current;
      return (current - 1 + images.length) % images.length;
    });
  }, [images.length]);

  useEffect(() => {
    if (!selectedImage) return;

    const handleKeyDown = (event: KeyboardEvent) => {
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

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedImage, handleClose, handleNext, handlePrevious]);

  useEffect(() => {
    if (!selectedImage) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [selectedImage]);

  const hasMultipleImages = images.length > 1;

  return (
    <>
      <Head>
        <title>Gallery | Tarang Hirani</title>
        <meta
          name="description"
          content="Wildlife photography portfolio featuring big cats, birds, and wild places across India and Africa. Immersive storytelling from the wild."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Gallery Header */}
      <section className="bg-charcoal pt-32 pb-12 md:pt-36 md:pb-20">
        <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-20">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-sage opacity-0 animate-fade-up">
            <span className="font-display text-base">Portfolio</span>
          </p>
          <h1 className="mt-4 font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-parchment tracking-tight opacity-0 animate-fade-up">
            The Gallery
          </h1>
          <p className="mt-5 text-base md:text-lg font-light text-white/45 tracking-wide max-w-xl leading-relaxed opacity-0 animate-fade-up-delay">
            Each frame is a moment of stillness in the wild — an invitation to
            look closer and feel the pulse of nature.
          </p>
          <div className="mt-8 h-px w-16 bg-sage/30 opacity-0 animate-fade-up-delay" />
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="bg-charcoal pb-24 md:pb-32">
        <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-20">
          {images.length > 0 ? (
            <MasonryGrid images={images} onSelect={handleSelect} />
          ) : (
            <div className="flex items-center justify-center min-h-64">
              <div className="text-center text-white/40">
                <p className="text-lg font-light">
                  No images found in the gallery.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Safari CTA */}
      <section className="bg-paper py-24 md:py-32">
        <div
          ref={ctaRef}
          className={`mx-auto max-w-7xl px-6 md:px-12 lg:px-20 text-center transition-all duration-700 ${
            ctaVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-sage">
            Experience the Wild
          </p>
          <h2 className="mt-4 font-display text-3xl md:text-4xl font-semibold text-charcoal tracking-tight">
            Join Me on Safari
          </h2>
          <p className="mt-6 text-smoke max-w-2xl mx-auto leading-relaxed">
            These photographs are just a glimpse. The real magic is being there
            — the early morning light, the quiet tension before a sighting, the
            raw beauty of untouched wilderness. I lead small-group safaris across
            Africa and India for those who want to see the wild up close.
          </p>
          <Link
            href="https://ig.me/m/tarang.hirani"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex items-center gap-2 font-display text-sm uppercase tracking-[0.15em] text-charcoal transition-colors duration-300 hover:text-sage group"
          >
            Get in Touch
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
              &rarr;
            </span>
          </Link>
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <ImageLightbox
          image={selectedImage}
          onClose={handleClose}
          onNext={hasMultipleImages ? handleNext : undefined}
          onPrevious={hasMultipleImages ? handlePrevious : undefined}
          hasNext={hasMultipleImages}
          hasPrevious={hasMultipleImages}
          currentIndex={selectedIndex ?? undefined}
          totalCount={images.length}
        />
      )}
    </>
  );
}

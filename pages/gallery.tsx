import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import ImageLightbox from "../components/gallery/ImageLightbox";
import MasonryGrid from "../components/gallery/MasonryGrid";
import { listImages, GalleryImage } from "../lib/helpers";

interface GalleryProps {
  images: GalleryImage[];
}

export async function getStaticProps() {
  try {
    // Fetch all images from wildlife folder (not just home-gallery tagged ones)
    const images = await listImages(30, true);

    return {
      props: {
        images,
      },
      // Revalidate every hour to get new images
      revalidate: 3600,
    };
  } catch (error) {
    console.error("Error fetching gallery images:", error);

    return {
      props: {
        images: [],
      },
      // Retry more frequently if there was an error
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

    router.replace(
      { pathname: router.pathname, query: nextQuery },
      undefined,
      { shallow: true, scroll: false },
    );
  }, [
    router,
    router.isReady,
    images,
    selectedIndex,
    imageQueryId,
    hasHydratedFromQuery,
  ]);

  // Opens the lightbox at the index of the image that was clicked in the grid.
  const handleSelect = useCallback(
    (_image: GalleryImage, index: number) => {
      setSelectedIndex(index);
    },
    [],
  );

  // Closes the lightbox and returns the gallery to its default state.
  const handleClose = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  // Moves forward to the next image, wrapping to the start when needed.
  const handleNext = useCallback(() => {
    if (images.length === 0) return;

    setSelectedIndex((current) => {
      if (current === null) return current;
      return (current + 1) % images.length;
    });
  }, [images.length]);

  // Moves backward to the previous image, wrapping to the end when needed.
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
        <title>Gallery</title>
        <meta
          name="description"
          content="Explore our photo gallery showcasing beautiful moments and memories."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-black py-16">
        <div className="max-w-7xl mx-auto">
          {images.length > 0 ? (
            <MasonryGrid images={images} onSelect={handleSelect} />
          ) : (
            <div className="flex items-center justify-center min-h-64">
              <div className="text-center text-gray-600">
                <p className="text-lg">No images found in the gallery.</p>
              </div>
            </div>
          )}
        </div>
      </div>
      {selectedImage && (
        <ImageLightbox
          image={selectedImage}
          onClose={handleClose}
          onNext={hasMultipleImages ? handleNext : undefined}
          onPrevious={hasMultipleImages ? handlePrevious : undefined}
          hasNext={hasMultipleImages}
          hasPrevious={hasMultipleImages}
        />
      )}
    </>
  );
}

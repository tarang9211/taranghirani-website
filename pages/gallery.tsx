import Head from "next/head";
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

      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto">
          {images.length > 0 ? (
            <MasonryGrid images={images} />
          ) : (
            <div className="flex items-center justify-center min-h-64">
              <div className="text-center text-gray-600">
                <p className="text-lg">No images found in the gallery.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

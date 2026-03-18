import Image from "next/image";
import FadeIn from "../FadeIn";

function TextBlock({ body }) {
  return (
    <p className="mt-6 text-base md:text-lg leading-relaxed text-smoke">
      {body}
    </p>
  );
}

function ImageBlock({ image }) {
  return (
    <FadeIn className="my-10 max-w-4xl mx-auto">
      <div className="overflow-hidden rounded-xl">
        <Image
          src={image.url}
          alt={image.alt}
          width={1200}
          height={800}
          className="w-full h-auto object-cover"
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

function GalleryBlock({ images }) {
  return (
    <FadeIn className="my-10 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {images.map((img, i) => (
          <div key={i} className="overflow-hidden rounded-xl">
            <Image
              src={img.url}
              alt={img.alt}
              width={600}
              height={400}
              className="w-full h-auto object-cover"
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
  return (
    <div>
      {content.map((block, index) => {
        switch (block.type) {
          case "text":
            return <TextBlock key={index} body={block.body} />;
          case "image":
            return <ImageBlock key={index} image={block.image} />;
          case "gallery":
            return <GalleryBlock key={index} images={block.images} />;
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
    </div>
  );
}

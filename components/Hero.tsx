import Image from "next/image";

function Hero({ src, alt }: { src: string; alt?: string }) {
  return (
    <section className="relative w-full overflow-hidden">
      <Image
        priority={true}
        src={src}
        alt={alt}
        width="1920"
        height="1080"
        className="w-full h-auto"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
        <div className="flex h-full items-end justify-center pb-16 md:pb-20">
          <div className="max-w-3xl px-6 text-center">
            <h1 className="font-display text-4xl md:text-6xl font-semibold text-white tracking-tight">
              Capturing Nature&apos;s Majesty
            </h1>
            <p className="mt-4 text-base md:text-xl font-light text-gray-200/90 tracking-wide">
              Immersive storytelling from the wild
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;

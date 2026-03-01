import Image from "next/image";

function Hero({ src, alt }: { src: string; alt?: string }) {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <Image
        priority
        src={src}
        alt={alt || "Hero image"}
        fill
        sizes="100vw"
        className="object-cover animate-slow-zoom"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      <div className="absolute inset-0 flex items-end pb-20 md:pb-28">
        <div className="max-w-3xl px-6 md:px-12 lg:px-20">
          <div className="w-10 h-px bg-sage mb-6 opacity-0 animate-fade-up" />
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-semibold text-white tracking-tight opacity-0 animate-fade-up">
            Capturing Nature&apos;s Majesty
          </h1>
          <p className="mt-4 text-base md:text-lg font-light text-white/60 tracking-wide opacity-0 animate-fade-up-delay">
            Immersive storytelling from the wild
          </p>
        </div>
      </div>
    </section>
  );
}

export default Hero;

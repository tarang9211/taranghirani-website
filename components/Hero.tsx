function Hero({ src, alt }: { src: string; alt?: string }) {
  return (
    <section className="relative w-full">
      <img
        src={src}
        alt={alt}
        className="w-full h-[60vh] md:h-[70vh] object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/95 via-charcoal/60 to-transparent">
        <div className="flex h-full items-center justify-center">
          <div className="max-w-3xl px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-semibold text-parchment">
              Capturing Nature’s Majesty
            </h1>
            <p className="mt-6 text-base md:text-lg text-gold">
              Immersive storytelling from the wild
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;

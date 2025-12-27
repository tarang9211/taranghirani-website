function Hero({ src, alt }: { src: string; alt?: string }) {
  return (
    <section className="relative w-full overflow-hidden">
      <img
        src={src}
        alt={alt}
        className="w-full h-auto object-cover"
      />
      <div className="absolute inset-0 bg-black/40">
        <div className="flex h-full items-center justify-center">
          <div className="max-w-3xl px-6 text-center">
            <h1 className="text-3xl md:text-5xl font-semibold text-white">
              Capturing Nature’s Majesty
            </h1>
            <p className="mt-6 text-sm md:text-lg text-gray-200">
              Immersive storytelling from the wild
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;

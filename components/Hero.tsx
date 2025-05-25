function Hero({ src, alt }: { src: string; alt?: string }) {
  return (
    <section className="relative w-full">
      <img src={src} alt={alt} className="w-full h-auto" />
      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
        <h1 className="text-4xl md:text-6xl font-bold text-center">
          Capturing Nature’s Majesty
        </h1>
      </div>
    </section>
  );
}

export default Hero;
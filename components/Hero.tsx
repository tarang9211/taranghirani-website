import Image from "next/image";
import { useEffect, useRef, useCallback } from "react";

interface HeroProps {
  desktopSrc: string;
  mobileSrc: string;
  alt: string;
}

function Hero({ desktopSrc, mobileSrc, alt }: HeroProps) {
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      if (imageRef.current) {
        imageRef.current.style.transform = `translate(${-x * 30}px, ${-y * 20}px) scale(1.06)`;
      }
      if (textRef.current) {
        textRef.current.style.transform = `translate(${x * 10}px, ${y * 8}px)`;
      }
    });
  }, []);

  useEffect(() => {
    // Only enable on devices with a pointer (no touch)
    const mq = window.matchMedia("(hover: hover) and (min-width: 768px)");
    if (!mq.matches) return;

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleMouseMove]);

  return (
    <section className="relative min-h-screen w-full bg-charcoal">
      {/* Mobile: image on top, text below */}
      <div className="md:hidden">
        <div className="relative h-[60vh] w-full overflow-hidden">
          <Image
            priority
            src={mobileSrc}
            alt={alt}
            fill
            sizes="100vw"
            className="object-cover animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent" />
        </div>
        <div className="px-6 -mt-16 relative z-10 pb-16">
          <div className="w-10 h-px bg-sage mb-6 opacity-0 animate-fade-up" />
          <h1 className="font-display text-5xl font-semibold text-white tracking-tight leading-[0.95] opacity-0 animate-fade-up">
            Tarang
            <br />
            Hirani
          </h1>
          <p className="mt-5 text-sm font-light uppercase tracking-[0.2em] text-white/40 opacity-0 animate-fade-up-delay">
            Wildlife Photographer
          </p>
        </div>
      </div>

      {/* Desktop: split layout with mouse-tracked parallax */}
      <div className="hidden md:grid md:grid-cols-12 min-h-screen">
        {/* Left — text */}
        <div className="col-span-5 flex flex-col justify-end px-12 lg:px-20 pb-28">
          <div
            ref={textRef}
            className="transition-transform duration-[600ms] ease-out will-change-transform"
          >
            <div className="w-10 h-px bg-sage mb-8 opacity-0 animate-fade-up" />
            <h1 className="font-display text-6xl lg:text-7xl xl:text-8xl font-semibold text-white tracking-tight leading-[0.9] opacity-0 animate-fade-up">
              Tarang
              <br />
              Hirani
            </h1>
            <p className="mt-6 text-sm font-light uppercase tracking-[0.2em] text-white/40 opacity-0 animate-fade-up-delay">
              Wildlife Photographer
            </p>
          </div>
        </div>

        {/* Right — image, bleeds off edge */}
        <div className="col-span-7 relative overflow-hidden">
          <div
            ref={imageRef}
            className="absolute inset-[-40px] transition-transform duration-[800ms] ease-out will-change-transform"
          >
            <Image
              priority
              src={desktopSrc}
              alt={alt}
              fill
              sizes="60vw"
              className="object-cover"
            />
          </div>
          {/* Left fade into charcoal */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-charcoal to-transparent z-10" />
        </div>
      </div>
    </section>
  );
}

export default Hero;

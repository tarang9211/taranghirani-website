import { getImageProps } from "next/image";
import Head from "next/head";
import { useCallback, useEffect, useRef, useState } from "react";

interface HeroProps {
  desktopSrc: string;
  mobileSrc: string;
  desktopAlt: string;
  mobileAlt: string;
}

function Hero({ desktopSrc, mobileSrc, desktopAlt, mobileAlt }: HeroProps) {
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  // SSR assumes the phone-first case; corrected after hydration so each
  // viewport announces its own photograph.
  const [isDesktop, setIsDesktop] = useState(false);

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
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    // Pointer devices only, and never against a reduced-motion preference
    const pointer = window.matchMedia("(hover: hover) and (min-width: 768px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!pointer.matches || reducedMotion.matches) return;

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleMouseMove]);

  // One art-directed <picture>: phones download only the mobile asset,
  // desktops only the desktop asset — a single preload each.
  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({
    src: desktopSrc,
    alt: "",
    fill: true,
    priority: true,
    sizes: "64vw",
  });
  const {
    props: { alt: _alt, ...imgProps },
  } = getImageProps({
    src: mobileSrc,
    alt: "",
    fill: true,
    priority: true,
    sizes: "100vw",
  });

  return (
    <>
      <Head>
        <link
          rel="preload"
          as="image"
          imageSrcSet={imgProps.srcSet}
          imageSizes="100vw"
          media="(max-width: 767px)"
        />
        <link
          rel="preload"
          as="image"
          imageSrcSet={desktopSrcSet}
          imageSizes="64vw"
          media="(min-width: 768px)"
        />
      </Head>
      <section className="relative w-full bg-charcoal md:grid md:min-h-screen md:grid-cols-12">
        {/* Photograph — top on mobile, right seven columns on desktop */}
        <div className="relative h-[60vh] w-full overflow-hidden md:order-2 md:col-span-7 md:h-auto md:min-h-screen">
          <div
            ref={imageRef}
            className="absolute inset-0 md:inset-[-40px] md:transition-transform md:duration-[800ms] md:ease-out md:will-change-transform"
          >
            <picture>
              <source
                media="(min-width: 768px)"
                srcSet={desktopSrcSet}
                sizes="64vw"
              />
              <img
                {...imgProps}
                alt={isDesktop ? desktopAlt : mobileAlt}
                className="animate-slow-zoom object-cover md:animate-none"
              />
            </picture>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent md:hidden" />
          {/* Left fade into charcoal on desktop */}
          <div className="absolute inset-y-0 left-0 z-10 hidden w-32 bg-gradient-to-r from-charcoal to-transparent md:block" />
        </div>

        {/* Name and invitation — below on mobile, left five columns on desktop */}
        <div className="relative z-10 -mt-16 px-6 pb-16 md:order-1 md:col-span-5 md:mt-0 md:flex md:flex-col md:justify-end md:px-12 md:pb-28 lg:px-20">
          <div
            ref={textRef}
            className="md:transition-transform md:duration-[600ms] md:ease-out md:will-change-transform"
          >
            <div className="mb-6 h-px w-10 bg-sage opacity-0 animate-fade-up md:mb-8" />
            <h1 className="font-display text-5xl font-semibold leading-[0.95] tracking-tight text-white opacity-0 animate-fade-up md:text-6xl md:leading-[0.9] lg:text-7xl xl:text-8xl">
              Tarang
              <br />
              Hirani
            </h1>
            <p className="mt-4 font-display text-xl leading-snug text-white/80 opacity-0 animate-fade-up-delay md:mt-6 lg:text-2xl">
              Experience the Wild. Capture the Moment.
            </p>
            <p
              className="mt-3 text-sm font-light leading-relaxed text-white opacity-0 animate-fade-up md:mt-4 lg:text-base"
              style={{ animationDelay: "0.4s" }}
            >
              Wildlife photography and curated safaris across India and Africa.
            </p>
            <a
              href="#work"
              className="group mt-6 inline-flex items-center gap-2 border border-sage px-6 py-3 text-xs font-medium uppercase tracking-cta text-sage opacity-0 transition-colors duration-300 animate-fade-up hover:bg-sage hover:text-charcoal md:mt-8 md:px-7 md:py-3.5"
              style={{ animationDelay: "0.55s" }}
            >
              See the Work
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                &rarr;
              </span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

export default Hero;

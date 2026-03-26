import Head from "next/head";
import Link from "next/link";
import { getAllPosts } from "../../lib/blog/posts";
import {
  FeaturedArticleCard,
  ArticleCard,
} from "../../components/blog/ArticleCard";
import FadeIn from "../../components/FadeIn";
import { useInView } from "../../lib/useInView";

export async function getStaticProps() {
  const posts = getAllPosts();
  return { props: { posts } };
}

export default function BlogIndex({ posts }) {
  const [featured, ...rest] = posts;
  const { ref: ctaRef, visible: ctaVisible } = useInView(0.2);

  return (
    <>
      <Head>
        <title>Field Notes | Tarang Hirani</title>
        <meta
          name="description"
          content="Stories from the field — reflections on wildlife photography, conservation, and the wild places that shape us."
        />
        <meta property="og:title" content="Field Notes | Tarang Hirani" />
        <meta
          property="og:description"
          content="Stories from the field — reflections on wildlife photography, conservation, and the wild places that shape us."
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:title" content="Field Notes | Tarang Hirani" />
        <meta
          name="twitter:description"
          content="Stories from the field — reflections on wildlife photography, conservation, and the wild places that shape us."
        />
      </Head>

      {/* Header */}
      <section className="bg-charcoal pt-32 pb-12 md:pt-36 md:pb-20">
        <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-20">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-sage opacity-0 animate-fade-up">
            <span className="font-display text-base">Journal</span>
          </p>
          <h1 className="mt-4 font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-parchment tracking-tight opacity-0 animate-fade-up">
            Stories from the Field
          </h1>
          <p className="mt-5 text-base md:text-lg font-light text-white/45 tracking-wide max-w-xl leading-relaxed opacity-0 animate-fade-up-delay">
            Reflections on patience, light, and the quiet drama of wild places.
          </p>
          <div className="mt-8 h-px w-16 bg-sage/30 opacity-0 animate-fade-up-delay" />
        </div>
      </section>

      {/* Article Grid */}
      <section className="bg-paper py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-20">
          {/* Featured Post */}
          {featured && (
            <div className="pb-12 md:pb-16 border-b border-charcoal/10">
              <FeaturedArticleCard post={featured} />
            </div>
          )}

          {/* Remaining Posts */}
          {rest.length > 0 && (
            <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-8">
              {rest.map((post, i) => (
                <ArticleCard key={post.slug} post={post} delay={i * 100} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Instagram CTA */}
      <section className="bg-parchment py-24 md:py-32">
        <div
          ref={ctaRef}
          className={`mx-auto max-w-7xl px-6 md:px-12 lg:px-20 text-center transition-all duration-700 ${
            ctaVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-sage">
            Follow the Journey
          </p>
          <h2 className="mt-4 font-display text-3xl md:text-4xl font-semibold text-charcoal tracking-tight">
            More on Instagram
          </h2>
          <p className="mt-6 text-smoke max-w-2xl mx-auto leading-relaxed">
            For behind-the-scenes moments, recent sightings, and stories that
            don&apos;t make it to the journal — follow along on Instagram.
          </p>
          <Link
            href="https://www.instagram.com/tarang.hirani/?hl=en"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex items-center gap-2 font-display text-sm uppercase tracking-[0.15em] text-charcoal transition-colors duration-300 hover:text-sage group"
          >
            @tarang.hirani
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
              &rarr;
            </span>
          </Link>
        </div>
      </section>
    </>
  );
}

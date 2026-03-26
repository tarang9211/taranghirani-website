import Link from "next/link";
import Image from "next/image";
import FadeIn from "../FadeIn";

function formatDate(dateStr) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function FeaturedArticleCard({ post, delay = 0 }) {
  return (
    <FadeIn delay={delay}>
      <Link href={`/blog/${post.slug}`} className="group block cursor-pointer">
        {post.heroImage && (
          <div className="relative overflow-hidden rounded-lg aspect-[16/9]">
            <Image
              src={post.heroImage.url}
              alt={post.heroImage.alt}
              fill
              sizes="(max-width: 768px) 100vw, 1200px"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
          </div>
        )}
        <div className="mt-6 max-w-2xl">
          <p className="text-sm text-smoke/50 tracking-wide">
            {formatDate(post.date)}
            {post.location && (
              <span>
                <span className="mx-2">&middot;</span>
                {post.location}
              </span>
            )}
          </p>
          <h2 className="mt-3 font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-charcoal tracking-tight group-hover:text-sage transition-colors duration-300 leading-tight">
            {post.title}
          </h2>
          <p className="mt-4 text-smoke leading-relaxed line-clamp-2 text-base md:text-lg">
            {post.excerpt}
          </p>
          <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.15em] text-sage border border-sage/40 px-5 py-2.5 rounded-sm transition-colors duration-300 group-hover:border-sage group-hover:bg-sage group-hover:text-white">
            Read Article
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">
              &rarr;
            </span>
          </span>
        </div>
      </Link>
    </FadeIn>
  );
}

export function ArticleCard({ post, delay = 0 }) {
  return (
    <FadeIn delay={delay}>
      <Link href={`/blog/${post.slug}`} className="group block cursor-pointer">
        {post.heroImage && (
          <div className="relative overflow-hidden rounded-lg aspect-[16/9]">
            <Image
              src={post.heroImage.url}
              alt={post.heroImage.alt}
              fill
              sizes="(max-width: 768px) 100vw, 600px"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
          </div>
        )}
        <div className="mt-5">
          <p className="text-sm text-smoke/50 tracking-wide">
            {formatDate(post.date)}
            {post.location && (
              <span>
                <span className="mx-2">&middot;</span>
                {post.location}
              </span>
            )}
          </p>
          <h3 className="mt-2 font-display text-xl md:text-2xl font-semibold text-charcoal tracking-tight group-hover:text-sage transition-colors duration-300 leading-snug">
            {post.title}
          </h3>
          <p className="mt-3 text-smoke leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.15em] text-sage border border-sage/40 px-5 py-2.5 rounded-sm transition-colors duration-300 group-hover:border-sage group-hover:bg-sage group-hover:text-white">
            Read Article
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">
              &rarr;
            </span>
          </span>
        </div>
      </Link>
    </FadeIn>
  );
}

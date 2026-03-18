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
      <Link href={`/blog/${post.slug}`} className="group block">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          {post.heroImage && (
            <div className="lg:col-span-7 overflow-hidden rounded-xl">
              <Image
                src={post.heroImage.url}
                alt={post.heroImage.alt}
                width={900}
                height={600}
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>
          )}
          <div className={post.heroImage ? "lg:col-span-5" : "lg:col-span-12"}>
            <p className="text-sm text-smoke/50 tracking-wide">
              {formatDate(post.date)}
              {post.location && (
                <span>
                  <span className="mx-2">&middot;</span>
                  {post.location}
                </span>
              )}
            </p>
            <h2 className="mt-3 font-display text-2xl md:text-3xl lg:text-4xl font-semibold text-charcoal tracking-tight group-hover:text-sage transition-colors duration-300">
              {post.title}
            </h2>
            <p className="mt-4 text-smoke leading-relaxed line-clamp-3">
              {post.excerpt}
            </p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.15em] text-charcoal group-hover:text-sage transition-colors duration-300">
              Read Article
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                &rarr;
              </span>
            </span>
          </div>
        </div>
      </Link>
    </FadeIn>
  );
}

export function ArticleCard({ post, delay = 0 }) {
  return (
    <FadeIn delay={delay}>
      <Link href={`/blog/${post.slug}`} className="group block">
        {post.heroImage && (
          <div className="overflow-hidden rounded-xl">
            <Image
              src={post.heroImage.url}
              alt={post.heroImage.alt}
              width={600}
              height={400}
              className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>
        )}
        <p className="mt-4 text-sm text-smoke/50 tracking-wide">
          {formatDate(post.date)}
          {post.location && (
            <span>
              <span className="mx-2">&middot;</span>
              {post.location}
            </span>
          )}
        </p>
        <h3 className="mt-2 font-display text-xl md:text-2xl font-semibold text-charcoal tracking-tight group-hover:text-sage transition-colors duration-300">
          {post.title}
        </h3>
        <p className="mt-3 text-smoke leading-relaxed line-clamp-3">
          {post.excerpt}
        </p>
        <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.15em] text-charcoal group-hover:text-sage transition-colors duration-300">
          Read Article
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
            &rarr;
          </span>
        </span>
      </Link>
    </FadeIn>
  );
}

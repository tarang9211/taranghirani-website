import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { getAllPosts, getPostBySlug, getPostOgImage } from "../../lib/blog/posts";
import ContentRenderer from "../../components/blog/ContentRenderer";
import FadeIn from "../../components/FadeIn";

export async function getStaticPaths() {
  const posts = getAllPosts();
  return {
    paths: posts.map((post) => ({ params: { slug: post.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const post = getPostBySlug(params.slug);
  if (!post) {
    return { notFound: true };
  }

  const allPosts = getAllPosts();
  const currentIndex = allPosts.findIndex((p) => p.slug === post.slug);
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

  const ogImage = getPostOgImage(post);

  return {
    props: {
      post,
      ogImage,
      prevPost: prevPost ? { slug: prevPost.slug, title: prevPost.title } : null,
      nextPost: nextPost ? { slug: nextPost.slug, title: nextPost.title } : null,
    },
  };
}

function formatDate(dateStr) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPost({ post, ogImage, prevPost, nextPost }) {
  const pageTitle = `${post.title} | Tarang Hirani`;
  const pageUrl = `https://www.taranghirani.com/blog/${post.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: "Tarang Hirani",
      url: "https://www.taranghirani.com",
    },
    publisher: {
      "@type": "Person",
      name: "Tarang Hirani",
    },
    url: pageUrl,
    ...(ogImage && { image: ogImage }),
  };

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={pageUrl} />
        <meta property="article:published_time" content={post.date} />
        {ogImage && <meta property="og:image" content={ogImage} />}
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={post.excerpt} />
        {ogImage && <meta name="twitter:image" content={ogImage} />}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      {/* Header */}
      <section className="bg-charcoal pt-32 pb-12 md:pt-36 md:pb-16">
        <div className="mx-auto max-w-4xl px-6 md:px-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-sage/70 hover:text-sage transition-colors duration-300 tracking-wide"
          >
            <span>&larr;</span>
            Back to Journal
          </Link>

          <div className="mt-8">
            <p className="text-sm text-white/40 tracking-wide opacity-0 animate-fade-up">
              {formatDate(post.date)}
              {post.location && (
                <span>
                  <span className="mx-2">&middot;</span>
                  {post.location}
                </span>
              )}
            </p>
            <h1 className="mt-4 font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-parchment tracking-tight opacity-0 animate-fade-up">
              {post.title}
            </h1>
          </div>

          {post.heroImage && (
            <div className="mt-10 overflow-hidden rounded-xl opacity-0 animate-fade-up-delay">
              <Image
                src={post.heroImage.url}
                alt={post.heroImage.alt}
                width={1200}
                height={700}
                priority
                className="w-full h-auto object-cover"
              />
              {post.heroImage.caption && (
                <p className="mt-3 text-sm text-white/30 italic text-center">
                  {post.heroImage.caption}
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Body */}
      <section className="bg-paper py-12 md:py-20">
        <div className="mx-auto max-w-3xl px-6 md:px-12">
          <ContentRenderer content={post.content} />
        </div>
      </section>

      {/* Footer nav */}
      <section className="bg-paper border-t border-charcoal/10 py-12 md:py-16">
        <div className="mx-auto max-w-3xl px-6 md:px-12">
          <FadeIn>
            <div className="flex items-center justify-between gap-4">
              <div>
                {prevPost && (
                  <Link
                    href={`/blog/${prevPost.slug}`}
                    className="group text-left"
                  >
                    <p className="text-xs uppercase tracking-[0.15em] text-smoke/50">
                      Previous
                    </p>
                    <p className="mt-1 font-display text-base md:text-lg text-charcoal group-hover:text-sage transition-colors duration-300">
                      <span>&larr;</span> {prevPost.title}
                    </p>
                  </Link>
                )}
              </div>
              <div className="text-right">
                {nextPost && (
                  <Link
                    href={`/blog/${nextPost.slug}`}
                    className="group text-right"
                  >
                    <p className="text-xs uppercase tracking-[0.15em] text-smoke/50">
                      Next
                    </p>
                    <p className="mt-1 font-display text-base md:text-lg text-charcoal group-hover:text-sage transition-colors duration-300">
                      {nextPost.title} <span>&rarr;</span>
                    </p>
                  </Link>
                )}
              </div>
            </div>
          </FadeIn>

          <FadeIn className="mt-12 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.15em] text-charcoal hover:text-sage transition-colors duration-300"
            >
              <span>&larr;</span>
              Back to Journal
            </Link>
          </FadeIn>
        </div>
      </section>
    </>
  );
}

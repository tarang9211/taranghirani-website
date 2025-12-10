import Head from "next/head";
import Layout from "../components/Layout";
import "../styles/globals.css";

export default function MyApp({ Component, pageProps }) {
  const meta = {
    title: "Tarang Hirani | Wildlife Photographer",
    description: "Wildlife photography portfolio featuring big cats, birds, and wild places across India and Africa. Immersive storytelling from the wild.",
    url: "https://www.taranghirani.com",
  };

  return (
    <Layout>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:url" content={meta.url} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
      </Head>
      <Component {...pageProps} />
    </Layout>
  );
}

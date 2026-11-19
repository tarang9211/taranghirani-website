import Head from "next/head";
import { SITE_NAME } from "../lib/constants";

interface Props {
  // Page-specific part of the title. The brand suffix is added here.
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
}

// Per-page title, description and social tags. Keys match the defaults in
// _app.js, so these replace them instead of rendering duplicates (next/head
// only de-duplicates og:* tags that share a key). og:url and the canonical
// link come from _app.js.
export default function PageMeta({
  title,
  description,
  image,
  imageAlt,
  type,
}: Props) {
  const fullTitle = `${title} | ${SITE_NAME}`;
  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} key="description" />
      <meta property="og:title" content={fullTitle} key="og:title" />
      <meta
        property="og:description"
        content={description}
        key="og:description"
      />
      <meta name="twitter:title" content={fullTitle} key="twitter:title" />
      <meta
        name="twitter:description"
        content={description}
        key="twitter:description"
      />
      {type && <meta property="og:type" content={type} key="og:type" />}
      {image && <meta property="og:image" content={image} key="og:image" />}
      {image && <meta name="twitter:image" content={image} key="twitter:image" />}
      {image && imageAlt && (
        <meta property="og:image:alt" content={imageAlt} key="og:image:alt" />
      )}
    </Head>
  );
}

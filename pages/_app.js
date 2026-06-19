import { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Script from "next/script";
import Layout from "../components/Layout";
import "../styles/globals.css";

const GA_MEASUREMENT_ID = "G-JBM6SPGXWS";
const META_PIXEL_ID = "1340182068044541";

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const { asPath } = router;
  const canonicalUrl = `https://www.taranghirani.com${asPath === "/" ? "" : asPath.split("?")[0]}`;

  // Fire a Meta Pixel PageView on every client-side navigation. The base pixel
  // code only tracks the initial load, so this covers SPA route changes.
  useEffect(() => {
    const handleRouteChange = () => {
      if (typeof window !== "undefined" && window.fbq) {
        window.fbq("track", "PageView");
      }
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => router.events.off("routeChangeComplete", handleRouteChange);
  }, [router.events]);

  const meta = {
    title: "Tarang Hirani | Wildlife Photographer",
    description:
      "Wildlife photography portfolio featuring big cats, birds, and wild places across India and Africa. Immersive storytelling from the wild.",
    url: "https://www.taranghirani.com",
    image:
      "https://res.cloudinary.com/duiyn8wll/image/upload/w_1200,h_630,c_fill,f_jpg,q_auto/_Z9_20251231_TMH_2311_wm_wyiafz",
  };

  return (
    <Layout>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="google-site-verification"
          content="RTlg1RFRuCDiwJq2fNrrZP_qVqUzIEJe4vkH2xLrTXU"
        />
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta property="og:type" content="website" key="og:type" />
        <meta property="og:title" content={meta.title} key="og:title" />
        <meta
          property="og:description"
          content={meta.description}
          key="og:description"
        />
        <meta property="og:url" content={meta.url} key="og:url" />
        <meta property="og:image" content={meta.image} key="og:image" />
        <meta
          name="twitter:card"
          content="summary_large_image"
          key="twitter:card"
        />
        <meta name="twitter:title" content={meta.title} key="twitter:title" />
        <meta
          name="twitter:description"
          content={meta.description}
          key="twitter:description"
        />
        <meta name="twitter:image" content={meta.image} key="twitter:image" />
        <link rel="canonical" href={canonicalUrl} />
      </Head>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${META_PIXEL_ID}');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
      <Component {...pageProps} />
    </Layout>
  );
}

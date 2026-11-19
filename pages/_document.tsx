import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" className="no-js">
      <Head>
        {/* Asili Safaris logo mark on a charcoal tile. favicon.ico holds
            16/32/48 for browsers and Google's search-result favicon. */}
        <link rel="icon" href="/favicon.ico" sizes="48x48" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16-16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#080808" />
        {/* Removed before first paint; .no-js keeps scroll-reveal content visible without JS */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.remove("no-js")`,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

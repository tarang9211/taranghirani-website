import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" className="no-js">
      <Head>
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

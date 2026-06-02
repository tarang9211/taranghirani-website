import Head from "next/head";
import FadeIn from "../components/FadeIn";
import ContactLinks from "../components/ContactLinks";

export default function ContactPage() {
  return (
    <>
      <Head>
        <title>Contact | Tarang Hirani</title>
        <meta
          name="description"
          content="Get in touch with Tarang Hirani to enquire about wildlife safaris in India and Africa, prints, collaborations, or commissions. Call, WhatsApp, or email."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <section className="bg-charcoal min-h-screen pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="mx-auto max-w-2xl px-6 md:px-12">
          <FadeIn>
            <div className="text-center">
              <div className="mx-auto h-px w-12 bg-sage" />
              <p className="mt-8 text-[11px] font-medium uppercase tracking-[0.2em] text-sage">
                Get in Touch
              </p>
              <h1 className="mt-4 font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-parchment tracking-tight">
                Let&apos;s talk.
              </h1>
              <p className="mt-6 text-base md:text-lg leading-relaxed text-white/60">
                Whether you&apos;re planning a safari in India or Africa, looking
                for prints, or want to collaborate, the fastest way to reach me
                is on WhatsApp or email. I read every message.
              </p>
            </div>

            <div className="mt-14 md:mt-16">
              <ContactLinks
                theme="dark"
                layout="stack"
                showLabels
                includeInstagram
              />
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}

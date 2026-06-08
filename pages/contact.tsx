import Head from "next/head";
import FadeIn from "../components/FadeIn";
import ContactLinks from "../components/ContactLinks";
import ContactForm from "../components/ContactForm";

export default function ContactPage() {
  return (
    <>
      <Head>
        <title>Contact | Tarang Hirani</title>
        <meta
          name="description"
          content="Get in touch with Tarang Hirani to enquire about wildlife safaris in India and Africa, prints, collaborations, or commissions. Send a message or reach out on WhatsApp."
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
                Looking to learn photography or plan a photography focussed
                experience? I read every message and reply within 48 hours.
              </p>
            </div>

            <div className="mt-14 md:mt-16">
              <ContactForm />
            </div>
          </FadeIn>

          <FadeIn delay={200}>
            <div className="mt-20 md:mt-24 flex items-center justify-center gap-4">
              <span className="h-px w-12 bg-white/10" />
              <span className="text-[11px] text-white/30 uppercase tracking-[0.2em]">
                Or reach out directly
              </span>
              <span className="h-px w-12 bg-white/10" />
            </div>

            <div className="mt-10 md:mt-12">
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

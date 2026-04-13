import React, { useState, useEffect, useRef, FormEvent } from "react";
import FadeIn from "./FadeIn";
import { INSTAGRAM_URL } from "../lib/constants";

type Status = "idle" | "loading" | "success" | "already" | "error";

const RESET_DELAY = 5000;

interface SectionProps {
  variant: "section";
  theme?: never;
}

interface InlineProps {
  variant: "inline";
  theme?: "dark" | "light";
}

type EmailSignupProps = SectionProps | InlineProps;

function useSubscribe() {
  const [status, setStatus] = useState<Status>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset to idle after success/already states
  useEffect(() => {
    if (status === "success" || status === "already") {
      timerRef.current = setTimeout(() => setStatus("idle"), RESET_DELAY);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [status]);

  async function subscribe(email: string) {
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        const data = await res.json();
        setStatus(data.alreadySubscribed ? "already" : "success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return { status, subscribe };
}

/* ------------------------------------------------------------------ */
/*  Section variant — full homepage block                              */
/* ------------------------------------------------------------------ */
function SectionSignup() {
  const { status, subscribe } = useSubscribe();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = new FormData(form).get("email") as string;
    subscribe(email);
  }

  return (
    <section className="bg-charcoal py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6 md:px-12 text-center">
        <FadeIn>
          <div className="mx-auto h-px w-12 bg-sage" />

          <h2 className="mt-10 font-display text-2xl md:text-3xl lg:text-4xl font-semibold text-white tracking-tight">
            Stay in the Loop
          </h2>

          <p className="mt-6 text-base md:text-lg leading-relaxed text-gray-400">
            Safari dates, field notes, and photography tips.
            <br className="hidden sm:block" />
            Straight to your inbox.
          </p>

          {status === "success" || status === "already" ? (
            <p className="mt-10 text-sm font-medium uppercase tracking-[0.15em] text-sage">
              {status === "already"
                ? "You\u2019re already subscribed!"
                : "You\u2019re in \u2014 check your inbox."}
            </p>
          ) : (
            <>
              <form
                onSubmit={handleSubmit}
                className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3"
              >
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  placeholder="Your email"
                  disabled={status === "loading"}
                  className="w-full sm:w-72 px-4 py-3 bg-transparent border border-white/15 text-white text-sm placeholder:text-white/30 focus:border-sage focus:outline-none transition-colors duration-300 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="group inline-flex items-center justify-center gap-2 px-7 py-3 border border-sage text-sage text-xs uppercase tracking-[0.15em] font-medium hover:bg-sage hover:text-charcoal transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? (
                    <span className="inline-block h-3 w-3 border border-sage border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Subscribe
                      <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                        &rarr;
                      </span>
                    </>
                  )}
                </button>
              </form>

              {status === "error" && (
                <p className="mt-4 text-sm text-red-400">
                  Something went wrong. Please try again.
                </p>
              )}

              <p className="mt-5 text-xs text-white/25 tracking-wide">
                No spam. Unsubscribe anytime.
              </p>
            </>
          )}

          {/* Divider + Instagram */}
          <div className="mt-12 flex items-center justify-center gap-4">
            <span className="h-px w-8 bg-white/10" />
            <span className="text-xs text-white/20 uppercase tracking-widest">
              or
            </span>
            <span className="h-px w-8 bg-white/10" />
          </div>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-6 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.15em] text-sage transition-colors duration-300 hover:text-white"
          >
            @tarang.hirani
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
              &rarr;
            </span>
          </a>
        </FadeIn>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Inline variant — footer & blog posts                               */
/* ------------------------------------------------------------------ */
function InlineSignup({ theme = "dark" }: { theme?: "dark" | "light" }) {
  const { status, subscribe } = useSubscribe();
  const isDark = theme === "dark";

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = new FormData(form).get("email") as string;
    subscribe(email);
  }

  const labelColor = isDark ? "text-gray-500" : "text-smoke/60";
  const inputBorder = isDark ? "border-white/15" : "border-charcoal/15";
  const inputText = isDark ? "text-white placeholder:text-white/30" : "text-charcoal placeholder:text-smoke/40";
  const inputFocus = "focus:border-sage focus:outline-none";
  const btnBorder = isDark
    ? "border-sage text-sage hover:bg-sage hover:text-charcoal"
    : "border-sage text-sage hover:bg-sage hover:text-white";

  if (status === "success" || status === "already") {
    return (
      <p className="text-xs font-medium uppercase tracking-[0.15em] text-sage">
        {status === "already"
          ? "You\u2019re already subscribed!"
          : "You\u2019re in \u2014 check your inbox."}
      </p>
    );
  }

  return (
    <div>
      <p className={`text-xs uppercase tracking-[0.15em] font-medium mb-3 ${labelColor}`}>
        Get safari updates & field notes
      </p>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
      >
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="Your email"
          disabled={status === "loading"}
          className={`w-full sm:w-52 px-3 py-2 bg-transparent border text-sm transition-colors duration-300 disabled:opacity-50 ${inputBorder} ${inputText} ${inputFocus}`}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className={`group inline-flex items-center justify-center px-4 py-2 border text-xs uppercase tracking-[0.15em] font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${btnBorder}`}
        >
          {status === "loading" ? (
            <span className="inline-block h-3 w-3 border border-sage border-t-transparent rounded-full animate-spin" />
          ) : (
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">
              &rarr;
            </span>
          )}
        </button>
      </form>
      {status === "error" && (
        <p className="mt-2 text-xs text-red-400">
          Something went wrong. Try again.
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Export                                                              */
/* ------------------------------------------------------------------ */
export default function EmailSignup(props: EmailSignupProps) {
  if (props.variant === "section") {
    return <SectionSignup />;
  }
  return <InlineSignup theme={props.theme} />;
}

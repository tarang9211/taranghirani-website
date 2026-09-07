import React, { useState, useEffect, useRef, useId, FormEvent } from "react";

type Status = "idle" | "loading" | "success" | "already" | "error";

const RESET_DELAY = 5000;

interface EmailSignupProps {
  variant: "inline";
  theme?: "dark" | "light";
}

function useSubscribe() {
  const [status, setStatus] = useState<Status>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset to idle after success/already states
  useEffect(() => {
    if (status === "success" || status === "already") {
      timerRef.current = setTimeout(() => setStatus("idle"), RESET_DELAY);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
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

function InlineSignup({ theme = "dark" }: { theme?: "dark" | "light" }) {
  const { status, subscribe } = useSubscribe();
  const inputId = useId();
  const isDark = theme === "dark";

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = new FormData(form).get("email") as string;
    subscribe(email);
  }

  const labelColor = isDark ? "text-white/60" : "text-smoke";
  const inputBorder = isDark ? "border-white/15" : "border-charcoal/15";
  const inputText = isDark
    ? "text-white placeholder:text-white/45"
    : "text-charcoal placeholder:text-smoke/60";
  const inputFocus =
    "focus:border-sage focus:outline-none focus:ring-1 focus:ring-sage";
  const btnBorder = isDark
    ? "border-sage text-sage hover:bg-sage hover:text-charcoal"
    : "border-sage text-sage hover:bg-sage hover:text-white";
  const focusRing = isDark
    ? "focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal"
    : "focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 focus-visible:ring-offset-paper";

  if (status === "success" || status === "already") {
    return (
      <p
        role="status"
        className="text-xs font-medium uppercase tracking-cta text-sage"
      >
        {status === "already"
          ? "You’re already subscribed!"
          : "You’re in — check your inbox."}
      </p>
    );
  }

  return (
    <div>
      <label
        htmlFor={inputId}
        className={`mb-3 block text-xs font-medium uppercase tracking-cta ${labelColor}`}
      >
        Get safari updates & field notes
      </label>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
      >
        <input
          id={inputId}
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
          aria-label="Subscribe"
          className={`group inline-flex items-center justify-center px-4 py-2 border text-xs uppercase tracking-cta font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${btnBorder} ${focusRing}`}
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
        <p
          role="alert"
          className={`mt-2 text-xs ${isDark ? "text-white/80" : "text-smoke"}`}
        >
          Something went wrong and your email wasn&apos;t subscribed &mdash;
          please try again.
        </p>
      )}
    </div>
  );
}

export default function EmailSignup(props: EmailSignupProps) {
  return <InlineSignup theme={props.theme} />;
}

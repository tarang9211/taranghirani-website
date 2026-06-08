import React, { FormEvent, useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

type FieldErrors = Partial<
  Record<"name" | "email" | "phone" | "message", string>
>;

const COUNTRY_CODES: { code: string; label: string }[] = [
  { code: "+91", label: "India" },
  { code: "+1", label: "USA / Canada" },
  { code: "+44", label: "United Kingdom" },
  { code: "+61", label: "Australia" },
  { code: "+971", label: "UAE" },
  { code: "+65", label: "Singapore" },
  { code: "+27", label: "South Africa" },
  { code: "+255", label: "Tanzania" },
  { code: "+254", label: "Kenya" },
  { code: "+49", label: "Germany" },
  { code: "+33", label: "France" },
  { code: "+31", label: "Netherlands" },
  { code: "+34", label: "Spain" },
  { code: "+39", label: "Italy" },
  { code: "+41", label: "Switzerland" },
  { code: "+46", label: "Sweden" },
  { code: "+47", label: "Norway" },
  { code: "+45", label: "Denmark" },
  { code: "+81", label: "Japan" },
  { code: "+82", label: "South Korea" },
  { code: "+852", label: "Hong Kong" },
  { code: "+86", label: "China" },
  { code: "+60", label: "Malaysia" },
  { code: "+66", label: "Thailand" },
  { code: "+64", label: "New Zealand" },
  { code: "+55", label: "Brazil" },
  { code: "+972", label: "Israel" },
  { code: "+90", label: "Turkey" },
];

const labelClass =
  "block text-[11px] font-medium uppercase tracking-[0.2em] text-sage/80 mb-3";
const baseInputClass =
  "w-full bg-transparent border-0 border-b px-0 py-3 text-base text-white placeholder:text-white/25 focus:outline-none focus:ring-0 transition-colors duration-300 disabled:opacity-50";

function inputClass(hasError: boolean) {
  return `${baseInputClass} ${
    hasError
      ? "border-red-400/70 focus:border-red-400"
      : "border-white/15 focus:border-sage"
  }`;
}

function validate(fields: {
  name: string;
  email: string;
  phone: string;
  message: string;
}): FieldErrors {
  const errors: FieldErrors = {};

  if (!fields.name) {
    errors.name = "Please enter your name.";
  } else if (fields.name.length < 2) {
    errors.name = "Please enter your full name.";
  }

  if (!fields.email) {
    errors.email = "Please enter your email.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!fields.phone) {
    errors.phone = "Please enter your phone number.";
  } else if (!/^[\d\s()-]{4,}$/.test(fields.phone)) {
    errors.phone = "Please enter a valid phone number.";
  }

  if (!fields.message) {
    errors.message = "Please add a short message.";
  } else if (fields.message.length < 10) {
    errors.message = "Tell me a little more — at least a sentence.";
  }

  return errors;
}

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [submitError, setSubmitError] = useState<string>("");
  const [countryCode, setCountryCode] = useState("+91");
  const [errors, setErrors] = useState<FieldErrors>({});

  function clearError(field: keyof FieldErrors) {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return;

    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot — if filled, silently succeed (bots usually fill all fields)
    if ((data.get("company") as string)?.trim()) {
      setStatus("success");
      return;
    }

    const fields = {
      name: ((data.get("name") as string) || "").trim(),
      email: ((data.get("email") as string) || "").trim(),
      phone: ((data.get("phone") as string) || "").trim(),
      message: ((data.get("message") as string) || "").trim(),
    };

    const fieldErrors = validate(fields);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      setStatus("idle");
      return;
    }

    setErrors({});
    setStatus("loading");
    setSubmitError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, countryCode }),
      });

      if (res.ok) {
        setStatus("success");
        form.reset();
        setCountryCode("+91");
      } else {
        const data = await res.json().catch(() => ({}));
        setSubmitError(data.error || "Something went wrong. Try again.");
        setStatus("error");
      }
    } catch {
      setSubmitError("Something went wrong. Try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-px w-12 bg-sage" />
        <p className="mt-8 text-[11px] font-medium uppercase tracking-[0.2em] text-sage">
          Message Received
        </p>
        <h3 className="mt-4 font-display text-2xl md:text-3xl font-semibold text-parchment tracking-tight">
          Thanks — I&apos;ll be in touch.
        </h3>
        <p className="mt-4 text-sm md:text-base text-white/50">
          I read every message and reply within 48 hours.
        </p>
      </div>
    );
  }

  const errorTextClass = "mt-2 text-xs text-red-400";

  return (
    <form onSubmit={handleSubmit} className="w-full" noValidate>
      {/* Honeypot — visually hidden but available to bots */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label>
          Company
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
        <div>
          <label htmlFor="contact-name" className={labelClass}>
            Name
          </label>
          <input
            id="contact-name"
            type="text"
            name="name"
            autoComplete="name"
            disabled={status === "loading"}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            onChange={() => clearError("name")}
            className={inputClass(!!errors.name)}
          />
          {errors.name && (
            <p id="contact-name-error" role="alert" className={errorTextClass}>
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="contact-email" className={labelClass}>
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            name="email"
            autoComplete="email"
            disabled={status === "loading"}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
            onChange={() => clearError("email")}
            className={inputClass(!!errors.email)}
          />
          {errors.email && (
            <p id="contact-email-error" role="alert" className={errorTextClass}>
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="mt-8">
        <label htmlFor="contact-phone" className={labelClass}>
          Phone
        </label>
        <div className="flex items-end gap-3">
          <div className="relative">
            <select
              aria-label="Country code"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              disabled={status === "loading"}
              className="appearance-none bg-transparent border-0 border-b border-white/15 px-0 pr-6 py-3 text-base text-white focus:border-sage focus:outline-none focus:ring-0 transition-colors duration-300 disabled:opacity-50 cursor-pointer"
            >
              {COUNTRY_CODES.map((c) => (
                <option
                  key={c.code}
                  value={c.code}
                  className="bg-charcoal text-white"
                >
                  {c.label} {c.code}
                </option>
              ))}
            </select>
            <span
              aria-hidden
              className="pointer-events-none absolute right-0 bottom-3.5 text-sage text-xs"
            >
              ▾
            </span>
          </div>
          <input
            id="contact-phone"
            type="tel"
            name="phone"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder="98765 43210"
            disabled={status === "loading"}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "contact-phone-error" : undefined}
            onChange={() => clearError("phone")}
            className={`${inputClass(!!errors.phone)} flex-1`}
          />
        </div>
        {errors.phone && (
          <p id="contact-phone-error" role="alert" className={errorTextClass}>
            {errors.phone}
          </p>
        )}
      </div>

      <div className="mt-8">
        <label htmlFor="contact-message" className={labelClass}>
          Your Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          disabled={status === "loading"}
          placeholder="Tell me what you'd like to learn, where you'd like to go, or what you're hoping to make."
          aria-invalid={!!errors.message}
          aria-describedby={
            errors.message ? "contact-message-error" : undefined
          }
          onChange={() => clearError("message")}
          className={`${inputClass(!!errors.message)} resize-none leading-relaxed`}
        />
        {errors.message && (
          <p
            id="contact-message-error"
            role="alert"
            className={errorTextClass}
          >
            {errors.message}
          </p>
        )}
      </div>

      <div className="mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4">
        {status === "error" && (
          <p className="text-sm text-red-400 sm:mr-auto">
            {submitError}{" "}
            <a
              href="https://wa.me/917030047045"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-sage transition-colors"
            >
              Or message me on WhatsApp.
            </a>
          </p>
        )}
        <button
          type="submit"
          disabled={status === "loading"}
          className="group inline-flex items-center justify-center gap-2 px-7 py-3 border border-sage text-sage text-xs uppercase tracking-[0.15em] font-medium hover:bg-sage hover:text-charcoal transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "loading" ? (
            <span className="inline-block h-3 w-3 border border-sage border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              Send Enquiry
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                &rarr;
              </span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

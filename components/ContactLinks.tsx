import React from "react";
import { Phone, MessageCircle, Mail, Instagram } from "lucide-react";
import {
  PHONE_NUMBER_DISPLAY,
  PHONE_TEL,
  WHATSAPP_URL,
  EMAIL,
  EMAIL_MAILTO,
  INSTAGRAM_URL,
} from "../lib/constants";

type Theme = "dark" | "light";
type Layout = "row" | "stack";

interface ContactLinksProps {
  theme?: Theme;
  layout?: Layout;
  showLabels?: boolean;
  includeInstagram?: boolean;
  className?: string;
}

interface ContactItem {
  href: string;
  external: boolean;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  label: string;
  value: string;
  ariaLabel: string;
}

const buildItems = (includeInstagram: boolean): ContactItem[] => {
  const items: ContactItem[] = [
    {
      href: PHONE_TEL,
      external: false,
      icon: Phone,
      label: "Call",
      value: PHONE_NUMBER_DISPLAY,
      ariaLabel: `Call ${PHONE_NUMBER_DISPLAY}`,
    },
    {
      href: WHATSAPP_URL,
      external: true,
      icon: MessageCircle,
      label: "WhatsApp",
      value: PHONE_NUMBER_DISPLAY,
      ariaLabel: `Chat on WhatsApp at ${PHONE_NUMBER_DISPLAY}`,
    },
    {
      href: EMAIL_MAILTO,
      external: false,
      icon: Mail,
      label: "Email",
      value: EMAIL,
      ariaLabel: `Email ${EMAIL}`,
    },
  ];

  if (includeInstagram) {
    items.push({
      href: INSTAGRAM_URL,
      external: true,
      icon: Instagram,
      label: "Instagram",
      value: "@tarang.hirani",
      ariaLabel: "Follow on Instagram",
    });
  }

  return items;
};

const ContactLinks: React.FC<ContactLinksProps> = ({
  theme = "dark",
  layout = "row",
  showLabels = false,
  includeInstagram = false,
  className = "",
}) => {
  const items = buildItems(includeInstagram);

  const isDark = theme === "dark";
  const isStack = layout === "stack";

  const baseText = isDark ? "text-white/60" : "text-smoke";
  const hoverText = isDark ? "hover:text-sage" : "hover:text-sage";
  const labelColor = isDark ? "text-sage/80" : "text-sage";
  const valueColor = isDark ? "text-white/90" : "text-charcoal";
  const dividerBg = isDark ? "bg-white/10" : "bg-charcoal/10";

  if (isStack) {
    return (
      <ul className={`flex flex-col ${className}`}>
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <li key={item.label}>
              <a
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                aria-label={item.ariaLabel}
                className={`group flex items-center gap-5 py-5 transition-colors duration-300 ${baseText} ${hoverText}`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${
                    isDark ? "border-white/15" : "border-charcoal/15"
                  } transition-colors duration-300 group-hover:border-sage`}
                >
                  <Icon size={18} strokeWidth={1.5} />
                </span>
                <span className="flex flex-1 flex-col items-start">
                  <span
                    className={`font-display text-[11px] uppercase tracking-[0.2em] ${labelColor}`}
                  >
                    {item.label}
                  </span>
                  <span
                    className={`mt-1 text-base md:text-lg ${valueColor} transition-colors duration-300 group-hover:text-sage`}
                  >
                    {item.value}
                  </span>
                </span>
                <span
                  aria-hidden
                  className="text-sage opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1"
                >
                  &rarr;
                </span>
              </a>
              {idx < items.length - 1 && (
                <div className={`h-px w-full ${dividerBg}`} />
              )}
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <ul
      className={`flex flex-wrap items-center justify-center gap-x-6 gap-y-3 md:gap-x-8 ${className}`}
    >
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <li key={item.label}>
            <a
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              aria-label={item.ariaLabel}
              className={`group inline-flex items-center gap-2 text-xs md:text-sm transition-colors duration-300 ${baseText} ${hoverText}`}
            >
              <Icon size={14} strokeWidth={1.5} />
              {showLabels && (
                <span className="font-display uppercase tracking-[0.15em]">
                  {item.label}
                </span>
              )}
              <span className="tracking-wide">{item.value}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default ContactLinks;

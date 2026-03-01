"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/cn";

export function LocaleToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const locales = [
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
  ];

  const current = locales.find((l) => l.code === locale) || locales[0];

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
    setIsOpen(false);
  };

  return (
    <div className="locale-toggle-root">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="locale-toggle-button"
      >
        <span className="locale-toggle-flag">{current.flag}</span>
        <span>{current.code.toUpperCase()}</span>
        <span
          className={cn(
            "locale-toggle-chevron",
            isOpen && "locale-toggle-chevron-open"
          )}
        >
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="locale-toggle-menu">
          {locales.map((l) => (
            <button
              key={l.code}
              onClick={() => switchLocale(l.code)}
              className={cn(
                "locale-toggle-menu-item",
                l.code === locale
                  ? "locale-toggle-menu-item-active"
                  : "locale-toggle-menu-item-inactive"
              )}
            >
              <span>{l.flag}</span>
              <span>{l.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

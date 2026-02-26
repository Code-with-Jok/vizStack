"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

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
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "6px 14px",
          background: "var(--color-bg-card)",
          border: "1px solid var(--color-border)",
          borderRadius: "8px",
          color: "var(--color-text-primary)",
          cursor: "pointer",
          fontSize: "0.8rem",
          fontWeight: 500,
          transition: "all 0.2s ease",
        }}
      >
        <span style={{ fontSize: "1rem" }}>{current.flag}</span>
        <span>{current.code.toUpperCase()}</span>
        <span
          style={{
            fontSize: "0.6rem",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        >
          ▼
        </span>
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            marginTop: "4px",
            background: "var(--color-bg-secondary)",
            border: "1px solid var(--color-border)",
            borderRadius: "8px",
            overflow: "hidden",
            zIndex: 100,
            minWidth: "140px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
          }}
        >
          {locales.map((l) => (
            <button
              key={l.code}
              onClick={() => switchLocale(l.code)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                width: "100%",
                padding: "10px 14px",
                background:
                  l.code === locale ? "var(--color-glow-cyan)" : "transparent",
                border: "none",
                color:
                  l.code === locale
                    ? "var(--color-accent-cyan)"
                    : "var(--color-text-secondary)",
                cursor: "pointer",
                fontSize: "0.85rem",
                fontWeight: l.code === locale ? 600 : 400,
                transition: "background 0.15s ease",
                textAlign: "left",
              }}
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

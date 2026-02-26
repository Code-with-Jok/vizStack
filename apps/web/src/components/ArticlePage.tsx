"use client";

import { ReactNode } from "react";
import { Allotment } from "allotment";
import "allotment/dist/style.css";

/* ─── types ──────────────────────────────────────────────── */

export interface ArticleSection {
  id: string;
  title: string;
  content: ReactNode;
  onTitleChange?: (val: string) => void;
}

interface ArticlePageProps {
  title: string;
  description: string;
  sections: ArticleSection[];
  vizUrl?: string;
  vizLabel?: string;
  tocLabel?: string;
  onTitleChange?: (val: string) => void;
  onDescriptionChange?: (val: string) => void;
}

/* ─── code block helper ──────────────────────────────────── */

export function CodeBlock({
  code,
  language = "tsx",
  filename,
}: {
  code: string;
  language?: string;
  filename?: string;
}) {
  return (
    <div
      style={{
        borderRadius: "8px",
        overflow: "hidden",
        backgroundColor: "#f7f6f3", // Light, Notion-like code background
        margin: "16px 0",
        fontSize: "0.85rem",
        lineHeight: 1.6,
      }}
    >
      {filename && (
        <div
          style={{
            padding: "8px 16px",
            background: "var(--color-bg-card)",
            borderBottom: "1px solid var(--color-border)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span
            style={{ fontSize: "0.75rem", color: "var(--color-accent-cyan)" }}
          >
            📄
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              color: "var(--color-text-secondary)",
            }}
          >
            {filename}
          </span>
          <span
            style={{
              marginLeft: "auto",
              fontSize: "0.65rem",
              color: "var(--color-text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {language}
          </span>
        </div>
      )}
      <pre
        style={{
          padding: "16px",
          background: "rgba(0, 0, 0, 0.03)",
          margin: 0,
          overflowX: "auto",
          fontFamily: "var(--font-mono)",
          color: "#eb5757", // Notion-ish inline code color, but for block we want dark text
        }}
      >
        <code style={{ color: "var(--color-text-primary)" }}>{code}</code>
      </pre>
    </div>
  );
}

/* ─── info/tip callout ───────────────────────────────────── */

export function Callout({
  type = "info",
  children,
}: {
  type?: string;
  children: ReactNode;
}) {
  const styles: Record<string, { bg: string; icon: string }> = {
    info: {
      bg: "rgba(235, 236, 237, 0.5)", // Notion light grey callout
      icon: "💡",
    },
    tip: {
      bg: "rgba(224, 243, 236, 0.5)", // Notion light green process
      icon: "✅",
    },
    warning: {
      bg: "rgba(250, 235, 221, 0.5)", // Notion light orange warning
      icon: "⚠️",
    },
  };
  const s = styles[type];

  return (
    <div
      style={{
        background: s.bg,
        padding: "16px 16px",
        borderRadius: "6px",
        margin: "16px 0",
        fontSize: "0.95rem",
        lineHeight: 1.6,
        color: "var(--color-text-primary)",
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
      }}
    >
      <span style={{ fontSize: "1.2rem", lineHeight: 1 }}>{s.icon}</span>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}

/* ─── main article page ──────────────────────────────────── */

export function ArticlePage({
  title,
  description,
  sections,
  vizUrl,
  vizLabel = "Open 3D Visualization",
  tocLabel = "Table of Contents",
  onTitleChange,
  onDescriptionChange,
}: ArticlePageProps) {
  return (
    <div
      style={{
        display: "flex",
        height: "calc(100vh - 48px)", // Fixed height for Allotment
        width: "100%",
        background: "#ffffff",
      }}
    >
      <Allotment>
        <Allotment.Pane preferredSize={260} minSize={200} maxSize={400} snap>
          {/* Sidebar TOC */}
          <aside
            style={{
              height: "100%",
              overflowY: "auto",
              padding: "40px 24px",
              background: "#fcfaf8", // Slight contrast for sidebar like Notion
            }}
          >
            <h4
              style={{
                fontSize: "0.7rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--color-text-muted)",
                marginBottom: "12px",
              }}
            >
              {tocLabel}
            </h4>
            <nav
              style={{ display: "flex", flexDirection: "column", gap: "4px" }}
            >
              {sections.map((sec) => (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  style={{
                    padding: "6px 10px",
                    borderRadius: "6px",
                    fontSize: "0.8rem",
                    color: "var(--color-text-secondary)",
                    textDecoration: "none",
                    transition: "all 0.15s ease",
                    lineHeight: 1.4,
                  }}
                  onMouseOver={(e) => {
                    (e.target as HTMLElement).style.background =
                      "var(--color-bg-card)";
                    (e.target as HTMLElement).style.color =
                      "var(--color-accent-cyan)";
                  }}
                  onMouseOut={(e) => {
                    (e.target as HTMLElement).style.background = "transparent";
                    (e.target as HTMLElement).style.color =
                      "var(--color-text-secondary)";
                  }}
                >
                  {sec.title}
                </a>
              ))}
            </nav>

            {/* 3D Viz button */}
            {vizUrl && (
              <a
                href={vizUrl}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  marginTop: "24px",
                  padding: "10px 12px",
                  background:
                    "linear-gradient(135deg, var(--color-accent-cyan), var(--color-accent-purple))",
                  borderRadius: "8px",
                  color: "#fff",
                  textDecoration: "none",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  textAlign: "center",
                  justifyContent: "center",
                }}
              >
                🧊 {vizLabel}
              </a>
            )}
          </aside>
        </Allotment.Pane>

        {/* Article Content */}
        <Allotment.Pane>
          <div style={{ height: "100%", overflowY: "auto" }}>
            <main
              style={{
                maxWidth: "760px",
                margin: "0 auto",
                padding: "40px 32px 120px",
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, 'Apple Color Emoji', Arial, sans-serif, 'Segoe UI Emoji', 'Segoe UI Symbol'",
              }}
            >
              {/* Header */}
              <header style={{ marginBottom: "40px" }}>
                <h1
                  style={{
                    fontSize: "2.8rem",
                    fontWeight: 800,
                    lineHeight: 1.2,
                    marginBottom: "12px",
                    color: "var(--color-text-primary)",
                    letterSpacing: "-0.02em",
                    display: "flex",
                  }}
                >
                  {onTitleChange ? (
                    <input
                      value={title}
                      onChange={(e) => onTitleChange(e.target.value)}
                      placeholder="Title"
                      style={{
                        width: "100%",
                        background: "transparent",
                        border: "none",
                        outline: "none",
                        color: "inherit",
                        font: "inherit",
                        letterSpacing: "inherit",
                      }}
                    />
                  ) : (
                    title
                  )}
                </h1>
                <p
                  style={{
                    fontSize: "1.05rem",
                    lineHeight: 1.7,
                    color: "var(--color-text-secondary)",
                    display: "flex",
                  }}
                >
                  {onDescriptionChange ? (
                    <textarea
                      value={description}
                      onChange={(e) => {
                        onDescriptionChange(e.target.value);
                        e.target.style.height = "auto";
                        e.target.style.height = e.target.scrollHeight + "px";
                      }}
                      placeholder="Description"
                      rows={1}
                      style={{
                        width: "100%",
                        background: "transparent",
                        border: "none",
                        outline: "none",
                        color: "inherit",
                        font: "inherit",
                        resize: "none",
                        overflow: "hidden",
                      }}
                    />
                  ) : (
                    description
                  )}
                </p>
              </header>

              {/* Sections */}
              {sections.map((sec) => (
                <section
                  key={sec.id}
                  id={sec.id}
                  style={{
                    marginBottom: "48px",
                    scrollMarginTop: "64px",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "1.75rem",
                      fontWeight: 700,
                      color: "var(--color-text-primary)",
                      marginTop: "32px",
                      marginBottom: "16px",
                      letterSpacing: "-0.01em",
                      display: "flex",
                    }}
                  >
                    {sec.onTitleChange ? (
                      <input
                        value={sec.title}
                        onChange={(e) => sec.onTitleChange!(e.target.value)}
                        placeholder="Chapter Title"
                        style={{
                          width: "100%",
                          background: "transparent",
                          border: "none",
                          outline: "none",
                          color: "inherit",
                          font: "inherit",
                          letterSpacing: "inherit",
                        }}
                      />
                    ) : (
                      sec.title
                    )}
                  </h2>
                  <div
                    style={{
                      fontSize: "1rem",
                      lineHeight: 1.7,
                      color: "var(--color-text-primary)",
                    }}
                  >
                    {sec.content}
                  </div>
                </section>
              ))}
            </main>
          </div>
        </Allotment.Pane>
      </Allotment>
    </div>
  );
}

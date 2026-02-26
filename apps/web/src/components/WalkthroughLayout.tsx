"use client";

import { ReactNode, useState } from "react";
import dynamic from "next/dynamic";
import { Allotment } from "allotment";
import "allotment/dist/style.css";

const BlockEditor = dynamic(() => import("./BlockEditor"), { ssr: false });

/* ─── Types ──────────────────────────────────────── */

interface ContentBlock {
  type: string;
  text_en?: string;
  text_vi?: string;
  code?: string;
  language?: string;
  filename?: string;
  calloutType?: string;
  headers?: string[];
  rows?: string[][];
  imageUrl?: string;
  caption_en?: string;
  caption_vi?: string;
}

interface Chapter {
  _id: string;
  order: number;
  title_en: string;
  title_vi: string;
  content_en?: string;
  content_vi?: string;
  blocks?: ContentBlock[];
  vizConfig?: any;
}

interface WalkthroughLayoutProps {
  title: string;
  description: string;
  chapters: Chapter[];
  activeChapter: number;
  onChapterChange: (index: number) => void;
  visualization: ReactNode;
  tocLabel?: string;
  locale: string;
}

/* ─── Main Layout ────────────────────────────────── */

export function WalkthroughLayout({
  title,
  description,
  chapters,
  activeChapter,
  onChapterChange,
  visualization,
  tocLabel = "Table of Contents",
  locale,
}: WalkthroughLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const vi = locale === "vi";
  const totalChapters = chapters.length;
  const hasChapters = totalChapters > 0;
  const safeChapter = hasChapters
    ? Math.min(Math.max(activeChapter, 0), totalChapters - 1)
    : 0;
  const progress = hasChapters ? ((safeChapter + 1) / totalChapters) * 100 : 0;
  const currentChapter = hasChapters ? chapters[safeChapter] : undefined;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 48px)",
        position: "relative",
      }}
    >
      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label={isSidebarOpen ? "Collapse table of contents" : "Expand table of contents"}
        aria-expanded={isSidebarOpen}
        aria-controls="walkthrough-toc"
        style={{
          position: "absolute",
          top: "12px",
          left: isSidebarOpen ? "212px" : "12px",
          zIndex: 100,
          width: "32px",
          height: "32px",
          borderRadius: "8px",
          background: "var(--color-bg-card)",
          border: "1px solid var(--color-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          color: "var(--color-text-secondary)",
        }}
        title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
      >
        {isSidebarOpen ? "←" : "→"}
      </button>

      {/* Main area: TOC + Content + Viz */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Allotment defaultSizes={[200, 440, 680]}>
          {/* TOC Pane */}
          <Allotment.Pane visible={isSidebarOpen} minSize={150}>
            <aside id="walkthrough-toc"
              style={{
                height: "100%",
                borderRight: "1px solid var(--color-border)",
                padding: "16px 12px",
                overflowY: "auto",
                background: "var(--color-bg-secondary)",
              }}
            >
              <h4
                style={{
                  fontSize: "0.65rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--color-text-muted)",
                  marginBottom: "10px",
                }}
              >
                {tocLabel}
              </h4>
              <nav
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "2px",
                }}
              >
                {chapters.map((ch, i) => (
                  <button
                    key={ch._id}
                    onClick={() => onChapterChange(i)}
                    style={{
                      textAlign: "left",
                      padding: "7px 10px",
                      borderRadius: "6px",
                      fontSize: "0.78rem",
                      lineHeight: 1.3,
                      background:
                        i === activeChapter
                          ? "var(--color-glow-cyan)"
                          : "transparent",
                      color:
                        i === activeChapter
                          ? "var(--color-accent-cyan)"
                          : "var(--color-text-secondary)",
                      fontWeight: i === activeChapter ? 600 : 400,
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {vi ? ch.title_vi : ch.title_en}
                  </button>
                ))}
              </nav>
            </aside>
          </Allotment.Pane>

          {/* Article Pane */}
          <Allotment.Pane minSize={300}>
            <div
              style={{
                height: "100%",
                overflowY: "auto",
                padding: "32px 28px 60px",
                maxWidth: "100%", // Remove rigid maxWidth to allow resizing
                background: "var(--color-bg-secondary)",
              }}
            >
              <div style={{ maxWidth: "640px", margin: "0 auto" }}>
                {/* Header (only on first chapter) */}
                {activeChapter === 0 && (
                  <header style={{ marginBottom: "32px" }}>
                    <h1
                      style={{
                        fontSize: "1.8rem",
                        fontWeight: 800,
                        lineHeight: 1.2,
                        marginBottom: "10px",
                        background:
                          "linear-gradient(135deg, var(--color-accent-cyan), var(--color-accent-orange-warm))",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {title}
                    </h1>
                    <p
                      style={{
                        fontSize: "0.95rem",
                        lineHeight: 1.7,
                        color: "var(--color-text-secondary)",
                      }}
                    >
                      {description}
                    </p>
                  </header>
                )}

                {/* Active chapter content */}
                {currentChapter && (
                  <section>
                    <h2
                      style={{
                        fontSize: "1.3rem",
                        fontWeight: 700,
                        color: "var(--color-text-primary)",
                        marginBottom: "16px",
                        paddingBottom: "8px",
                        borderBottom: "1px solid var(--color-border)",
                      }}
                    >
                      {vi ? currentChapter.title_vi : currentChapter.title_en}
                    </h2>

                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <BlockEditor
                        key={currentChapter._id}
                        editable={false}
                        initialContent={vi ? currentChapter.content_vi : currentChapter.content_en}
                        onChange={() => {}}
                      />
                    </div>
                  </section>
                )}
              </div>
            </div>
          </Allotment.Pane>

          {/* Right Panel: 3D Visualization */}
          <Allotment.Pane minSize={400}>
            <div
              style={{
                height: "100%",
                position: "relative",
                background: "var(--color-bg-primary)",
                borderLeft: "2px solid rgba(86, 217, 209, 0.15)", // Premium Teal Boundary
                boxShadow: "-10px 0 20px rgba(0,0,0,0.02) inset", // Subtle inner shadow for depth
                overflow: "hidden",
              }}
            >
              {visualization}
            </div>
          </Allotment.Pane>
        </Allotment>
      </div>

      {/* Bottom Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "8px 20px",
          gap: "12px",
          borderTop: "1px solid var(--color-border)",
          background: "var(--color-bg-secondary)",
          flexShrink: 0,
        }}
      >
        <button
          onClick={() =>
            activeChapter > 0 && onChapterChange(activeChapter - 1)
          }
          disabled={activeChapter === 0}
          style={{
            padding: "6px 14px",
            background:
              activeChapter === 0 ? "var(--color-bg-card)" : "transparent",
            color:
              activeChapter === 0
                ? "var(--color-text-muted)"
                : "var(--color-text-primary)",
            border: `1px solid ${activeChapter === 0 ? "transparent" : "var(--color-border)"}`,
            borderRadius: "8px",
            cursor: activeChapter === 0 ? "not-allowed" : "pointer",
            fontSize: "0.8rem",
            fontWeight: 500,
          }}
        >
          ← {vi ? "Trước" : "Prev"}
        </button>

        {/* Progress */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              flex: 1,
              height: "3px",
              background: "var(--color-bg-card)",
              borderRadius: "2px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background:
                  "linear-gradient(90deg, var(--color-accent-cyan), var(--color-accent-orange-warm))",
                transition: "width 0.3s ease",
              }}
            />
          </div>
          <span
            style={{
              fontSize: "0.75rem",
              color: "var(--color-text-muted)",
              fontFamily: "var(--font-mono)",
              whiteSpace: "nowrap",
            }}
          >
            {hasChapters ? safeChapter + 1 : 0} / {totalChapters}
          </span>
        </div>

        <button
          onClick={() =>
            activeChapter < totalChapters - 1 &&
            onChapterChange(activeChapter + 1)
          }
          disabled={!hasChapters || safeChapter === totalChapters - 1}
          style={{
            padding: "6px 14px",
            background:
              activeChapter === totalChapters - 1
                ? "var(--color-bg-card)"
                : "linear-gradient(135deg, var(--color-accent-cyan), var(--color-accent-orange-warm))",
            color:
              activeChapter === totalChapters - 1
                ? "var(--color-text-muted)"
                : "#fff",
            border: "none",
            borderRadius: "8px",
            cursor:
              activeChapter === totalChapters - 1 ? "not-allowed" : "pointer",
            fontSize: "0.8rem",
            fontWeight: 600,
          }}
        >
          {vi ? "Tiếp" : "Next"} →
        </button>
      </div>
    </div>
  );
}

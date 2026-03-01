"use client";

import { ReactNode } from "react";
import { LearningSplitLayout } from "./LearningSplitLayout";
import type { TocItem } from "./LearningToc";

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
  visualization?: ReactNode;
  vizUrl?: string;
  vizLabel?: string;
  tocLabel?: string;
  activeSectionIndex?: number;
  onSectionSelect?: (index: number) => void;
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
    <div className="code-block-container">
      {filename && (
        <div className="code-block-header">
          <span className="text-accent-cyan mr-2">📄</span>
          <span className="code-block-filename">{filename}</span>
          <span className="code-block-language">{language}</span>
        </div>
      )}
      <pre className="code-block-pre">
        <code className="text-text-primary">{code}</code>
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
  const configs: Record<string, { bg: string; icon: string }> = {
    info: { bg: "var(--color-alert-info-bg)", icon: "💡" },
    tip: { bg: "var(--color-alert-success-bg)", icon: "✅" },
    warning: { bg: "var(--color-alert-warning-bg)", icon: "⚠️" },
  };
  const config = configs[type] ?? configs.info;

  return (
    <div className="callout-container" style={{ background: config.bg }}>
      <span className="text-xl leading-none mr-3">{config.icon}</span>
      <div className="flex-1">{children}</div>
    </div>
  );
}

/* ─── main article page ──────────────────────────────────── */

export function ArticlePage({
  title,
  description,
  sections,
  visualization,
  vizUrl,
  vizLabel = "Open 3D Visualization",
  tocLabel = "Table of Contents",
  activeSectionIndex,
  onSectionSelect,
  onTitleChange,
  onDescriptionChange,
}: ArticlePageProps) {
  const clampedIndex =
    sections.length === 0
      ? 0
      : Math.min(
          Math.max(activeSectionIndex ?? 0, 0),
          Math.max(sections.length - 1, 0)
        );

  const handleSectionSelect = (index: number) => {
    onSectionSelect?.(index);
    const id = sections[index]?.id;
    const el = id ? document.getElementById(id) : null;
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const tocItems: TocItem[] = sections.map((sec) => ({
    id: sec.id,
    title: sec.title,
    href: `#${sec.id}`,
  }));

  const content = (
    <div className="article-main-scroll">
      <main className="article-main">
        <header className="article-header">
          <h1 className="article-title">
            {onTitleChange ? (
              <input
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
                placeholder="Title"
                className="article-title-input"
              />
            ) : (
              title
            )}
          </h1>
          <p className="article-description">
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
                className="article-description-input"
              />
            ) : (
              description
            )}
          </p>
        </header>

        {sections[clampedIndex] && (
          <section
            key={sections[clampedIndex].id}
            id={sections[clampedIndex].id}
            className="article-section"
          >
            <h2 className="article-section-title">
              {sections[clampedIndex].onTitleChange ? (
                <input
                  value={sections[clampedIndex].title}
                  onChange={(e) =>
                    sections[clampedIndex].onTitleChange!(e.target.value)
                  }
                  placeholder="Chapter Title"
                  className="article-section-title-input"
                />
              ) : (
                sections[clampedIndex].title
              )}
            </h2>
            <div className="article-section-body">
              {sections[clampedIndex].content}
            </div>
          </section>
        )}
      </main>
    </div>
  );

  return (
    <LearningSplitLayout
      showVisualization={false}
      tocLabel={tocLabel}
      items={tocItems}
      activeIndex={clampedIndex}
      onSelect={handleSectionSelect}
      content={content}
      visualization={visualization ?? null}
      contentWrapperClassName="article-content-wrapper"
      vizPaneClassName="article-viz-pane"
    />
  );
}

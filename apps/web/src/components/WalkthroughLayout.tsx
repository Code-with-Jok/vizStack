"use client";

import { ReactNode } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import dynamic from "next/dynamic";
import { cn } from "@/lib/cn";
import { LearningSplitLayout } from "./LearningSplitLayout";
import type { TocItem } from "./LearningToc";

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
  knowledgeGraph?: any;
  visualization2dSchema?: any;
  visualization3dSchema?: any;
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
  const vi = locale === "vi";
  const totalChapters = chapters.length;
  const hasChapters = totalChapters > 0;
  const safeChapter = hasChapters
    ? Math.min(Math.max(activeChapter, 0), totalChapters - 1)
    : 0;
  const progress = hasChapters ? ((safeChapter + 1) / totalChapters) * 100 : 0;
  const currentChapter = hasChapters ? chapters[safeChapter] : undefined;
  const tocItems: TocItem[] = chapters.map((ch) => ({
    id: ch._id,
    title: vi ? ch.title_vi : ch.title_en,
  }));

  console.log({ currentChapter });

  const content = (
    <div className="w-full">
      {activeChapter === 0 && (
        <header className="mb-8 lg:mb-10">
          <h1 className="text-2xl lg:text-3xl font-extrabold mb-3 text-gradient">
            {title}
          </h1>
          <p className="text-gray-500 leading-relaxed">{description}</p>
        </header>
      )}

      <h2 className="text-xl lg:text-2xl font-bold mb-4 lg:mb-6 pb-2 border-b border-gray-100">
        {vi ? currentChapter?.title_vi : currentChapter?.title_en}
      </h2>

      {currentChapter && (
        <BlockEditor
          key={`${activeChapter}-${
            (vi ? currentChapter.content_vi : currentChapter.content_en)?.length
          }`}
          editable={false}
          initialContent={
            vi ? currentChapter.content_vi : currentChapter.content_en
          }
          onChange={() => {}}
        />
      )}
    </div>
  );

  return (
    <div className="walkthrough-root">
      <LearningSplitLayout
        tocLabel={tocLabel}
        items={tocItems}
        activeIndex={activeChapter}
        onSelect={onChapterChange}
        content={content}
        visualization={visualization}
      />

      {/* Bottom Bar */}
      <div className="walkthrough-bottom-bar z-110">
        <button
          onClick={() =>
            activeChapter > 0 && onChapterChange(activeChapter - 1)
          }
          disabled={activeChapter === 0}
          className={cn(
            "walkthrough-nav-button",
            activeChapter === 0
              ? "walkthrough-nav-prev-disabled"
              : "walkthrough-nav-prev"
          )}
        >
          ← {vi ? "Trước" : "Prev"}
        </button>

        {/* Progress */}
        <div className="walkthrough-progress">
          <div className="walkthrough-progress-track">
            <div
              className="walkthrough-progress-bar"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="walkthrough-progress-label">
            {hasChapters ? safeChapter + 1 : 0} / {totalChapters}
          </span>
        </div>

        <button
          onClick={() =>
            activeChapter < totalChapters - 1 &&
            onChapterChange(activeChapter + 1)
          }
          disabled={!hasChapters || safeChapter === totalChapters - 1}
          className={cn(
            "walkthrough-nav-button",
            !hasChapters || safeChapter === totalChapters - 1
              ? "walkthrough-nav-next-disabled"
              : "walkthrough-nav-next"
          )}
        >
          {vi ? "Tiếp" : "Next"} →
        </button>
      </div>
    </div>
  );
}

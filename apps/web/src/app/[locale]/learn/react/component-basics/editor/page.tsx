"use client";

import { useLocale } from "next-intl";
import { useWalkthroughEditor } from "@/hooks/useChapterEditor";
import { ChapterEditor } from "@/components/editor/ChapterEditor";
import Link from "next/link";

/**
 * Walkthrough Editor Page
 * Main editor interface for managing lessons
 *
 * Responsibilities:
 * - Load walkthrough data via hook
 * - Render chapter list
 * - Handle add/update/delete operations
 */
export default function WalkthroughEditorPage() {
  const locale = useLocale();
  const editor = useWalkthroughEditor("react", "component-basics");

  // Loading state
  if (editor.isLoading) {
    return (
      <div className="editor-loading">
        <span>Loading editor...</span>
      </div>
    );
  }

  // No data state
  if (!editor.hasWalkthrough) {
    return (
      <div className="editor-empty">
        <span>No walkthrough found. Seed data first.</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-6 pb-16">
      {/* Header */}
      <div className="editor-header">
        <div className="editor-flex-row mb-2">
          <h1 className="editor-title">✏️ Walkthrough Editor</h1>
          <Link
            href={`/${locale}/learn/react/component-basics`}
            className="editor-btn-secondary px-2 py-1 text-xs"
          >
            👁️ Preview
          </Link>
        </div>
        <p className="editor-subtitle">
          {editor.walkthrough?.title_en} — {editor.chapters.length} chapters
        </p>
      </div>

      {/* Chapters List */}
      <div className="space-y-2 mb-4">
        {editor.chapters.map((ch) => (
          <ChapterEditor
            key={ch._id}
            chapter={ch}
            isActive={editor.activeChapterId === ch._id}
            onSelect={() => editor.setActiveChapterId(ch._id)}
            onSave={(data) => editor.handleUpdateChapter(ch._id, data)}
            onDelete={() => editor.handleDeleteChapter(ch._id)}
          />
        ))}
      </div>

      {/* Add Chapter Button */}
      <button
        className="editor-btn-primary w-full py-2.5"
        onClick={() => editor.handleAddChapter()}
      >
        + Add New Chapter
      </button>
    </div>
  );
}

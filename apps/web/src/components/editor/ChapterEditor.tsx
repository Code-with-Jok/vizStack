"use client";

import type { Id } from "../../../convex/_generated/dataModel";
import { BlockEditor } from "./BlockEditor";
import { useChapterEditor, type ContentBlock } from "@/hooks/useChapterEditor";

interface Chapter {
  _id: Id<"chapters">;
  order: number;
  title_en: string;
  title_vi: string;
  blocks?: ContentBlock[];
}

interface ChapterEditorProps {
  chapter: Chapter;
  isActive: boolean;
  onSelect: () => void;
  onSave: (data: {
    title_en: string;
    title_vi: string;
    blocks: ContentBlock[];
  }) => void;
  onDelete: () => void;
}

/**
 * Chapter Editor Component
 * Renders chapter in either preview (collapsed) or edit (expanded) mode
 */
export function ChapterEditor({
  chapter,
  isActive,
  onSelect,
  onSave,
  onDelete,
}: ChapterEditorProps) {
  const editor = useChapterEditor({
    ...chapter,
    blocks: chapter.blocks || [],
  });

  // Preview mode - collapsed
  if (!isActive) {
    return (
      <button
        onClick={onSelect}
        className="editor-card editor-card-minimal editor-flex-row px-4 py-3"
      >
        <span className="editor-chapter-meta w-6">#{chapter.order + 1}</span>
        <span className="editor-chapter-title flex-1 text-left">
          {chapter.title_en}
        </span>
        <span className="editor-chapter-meta">
          {(chapter.blocks || []).length} blocks
        </span>
      </button>
    );
  }

  // Edit mode - expanded
  return (
    <div className={`editor-card ${isActive && "editor-card-active"}`}>
      {/* Header */}
      <div className="editor-flex-row mb-3">
        <span className="editor-chapter-meta">
          Chapter #{chapter.order + 1}
        </span>
        <button
          className="editor-btn-danger ms-auto"
          onClick={() => {
            if (confirm("Delete this chapter?")) onDelete();
          }}
        >
          🗑️ Delete Chapter
        </button>
      </div>

      {/* Titles */}
      <div className="editor-grid-2 mb-3">
        <div>
          <label className="editor-label">Title (EN)</label>
          <input
            className="editor-input text-xs py-1 px-2"
            value={editor.titleEn}
            onChange={(e) => editor.updateTitle("en", e.target.value)}
          />
        </div>
        <div>
          <label className="editor-label">Title (VI)</label>
          <input
            className="editor-input text-xs py-1 px-2"
            value={editor.titleVi}
            onChange={(e) => editor.updateTitle("vi", e.target.value)}
          />
        </div>
      </div>

      {/* Blocks Section Header */}
      <h4 className="editor-label mb-2">
        Content Blocks ({editor.blocks.length})
      </h4>

      {/* Block List */}
      <div className="space-y-2 mb-3">
        {editor.blocks.map((block, i) => (
          <BlockEditor
            key={block._tempId || i}
            block={block}
            index={i}
            onChange={(b) => editor.updateBlock(i, b)}
            onRemove={() => editor.removeBlock(i)}
          />
        ))}
      </div>

      {/* Add Block Buttons */}
      <div className="editor-btn-group mb-3">
        {(["text", "code", "callout", "table", "image"] as const).map(
          (type) => (
            <button
              key={type}
              className="editor-btn-secondary text-xs py-1 px-2"
              onClick={() => editor.addBlock(type)}
            >
              + {type}
            </button>
          )
        )}
      </div>

      {/* Save/Discard Actions */}
      {editor.dirty && (
        <div className="editor-flex-row gap-2">
          <button
            className="editor-btn-primary flex-1 py-2"
            onClick={() => {
              onSave({
                title_en: editor.titleEn,
                title_vi: editor.titleVi,
                blocks: editor.blocks,
              });
            }}
          >
            💾 Save Changes
          </button>
          <button
            className="editor-btn-secondary flex-1 py-2"
            onClick={() => editor.reset()}
          >
            ↩ Discard
          </button>
        </div>
      )}
    </div>
  );
}

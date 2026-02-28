"use client";

import type { ContentBlock } from "@/hooks/useChapterEditor";

interface BlockEditorProps {
  block: ContentBlock;
  index: number;
  onChange: (block: ContentBlock) => void;
  onRemove: () => void;
}

/**
 * Block Editor Component - Render individual content block editor
 * Handles: Text, Code, Callout, Table, Image
 */
export function BlockEditor({
  block,
  index,
  onChange,
  onRemove,
}: BlockEditorProps) {
  const blockTypeClass: Record<string, string> = {
    text: "editor-block-type-text",
    code: "editor-block-type-code",
    callout: "editor-block-type-callout",
    table: "editor-block-type-table",
    image: "editor-block-type-image",
  };

  const handleTypeChange = (type: string) => {
    onChange({ ...block, type });
  };

  const handleTextChange = (lang: "en" | "vi", value: string) => {
    onChange({
      ...block,
      [`text_${lang}`]: value,
    });
  };

  return (
    <div className={`editor-block ${blockTypeClass[block.type] || ""}`}>
      {/* Block Header */}
      <div className="editor-flex-row mb-2">
        <select
          value={block.type}
          onChange={(e) => handleTypeChange(e.target.value)}
          className="editor-input w-[120px] px-2 py-1 text-xs"
        >
          <option value="text">📝 Text</option>
          <option value="code">💻 Code</option>
          <option value="callout">💡 Callout</option>
          <option value="table">📊 Table</option>
          <option value="image">🖼️ Image</option>
        </select>
        <span className="editor-chapter-meta">Block #{index + 1}</span>
        <button className="editor-btn-danger ms-auto" onClick={onRemove}>
          ✕ Remove
        </button>
      </div>

      {/* Text / Callout Content */}
      {(block.type === "text" || block.type === "callout") && (
        <div className="editor-flex-col">
          {block.type === "callout" && (
            <select
              value={block.calloutType || "info"}
              onChange={(e) =>
                onChange({
                  ...block,
                  calloutType: e.target.value as "info" | "tip" | "warning",
                })
              }
              className="editor-input w-[100px] px-2 py-1 text-xs"
            >
              <option value="info">💡 Info</option>
              <option value="tip">✅ Tip</option>
              <option value="warning">⚠️ Warning</option>
            </select>
          )}

          <div>
            <label className="editor-label">English</label>
            <textarea
              className="editor-textarea"
              value={block.text_en || ""}
              onChange={(e) => handleTextChange("en", e.target.value)}
              placeholder="English text..."
            />
          </div>

          <div>
            <label className="editor-label">Vietnamese</label>
            <textarea
              className="editor-textarea"
              value={block.text_vi || ""}
              onChange={(e) => handleTextChange("vi", e.target.value)}
              placeholder="Vietnamese text..."
            />
          </div>
        </div>
      )}

      {/* Code Content */}
      {block.type === "code" && (
        <div className="editor-flex-col">
          <div className="editor-flex-row gap-2">
            <div className="flex-1">
              <label className="editor-label">Filename</label>
              <input
                className="editor-input text-xs py-1 px-2"
                value={block.filename || ""}
                onChange={(e) =>
                  onChange({ ...block, filename: e.target.value })
                }
                placeholder="e.g. App.tsx"
              />
            </div>
            <div className="w-[100px]">
              <label className="editor-label">Language</label>
              <input
                className="editor-input text-xs py-1 px-2"
                value={block.language || "tsx"}
                onChange={(e) =>
                  onChange({ ...block, language: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className="editor-label">Code</label>
            <textarea
              className="editor-textarea-large"
              value={block.code || ""}
              onChange={(e) => onChange({ ...block, code: e.target.value })}
              placeholder="Code content..."
            />
          </div>
        </div>
      )}

      {/* Table Content */}
      {block.type === "table" && (
        <div className="editor-flex-col">
          <div>
            <label className="editor-label">Headers (comma-separated)</label>
            <input
              className="editor-input text-xs py-1 px-2"
              value={(block.headers || []).join(", ")}
              onChange={(e) =>
                onChange({
                  ...block,
                  headers: e.target.value.split(",").map((s) => s.trim()),
                })
              }
              placeholder="Column 1, Column 2, Column 3"
            />
          </div>

          <div>
            <label className="editor-label">
              Rows (one per line, columns separated by |)
            </label>
            <textarea
              className="editor-textarea"
              value={(block.rows || []).map((r) => r.join(" | ")).join("\n")}
              onChange={(e) =>
                onChange({
                  ...block,
                  rows: e.target.value
                    .split("\n")
                    .map((line) => line.split("|").map((s) => s.trim())),
                })
              }
              placeholder="Cell 1 | Cell 2 | Cell 3"
            />
          </div>
        </div>
      )}

      {/* Image Content */}
      {block.type === "image" && (
        <div className="editor-flex-col">
          <div>
            <label className="editor-label">Image URL</label>
            <input
              className="editor-input text-xs py-1 px-2"
              value={block.imageUrl || ""}
              onChange={(e) => onChange({ ...block, imageUrl: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="editor-label">Caption (EN)</label>
            <input
              className="editor-input text-xs py-1 px-2"
              value={block.caption_en || ""}
              onChange={(e) =>
                onChange({ ...block, caption_en: e.target.value })
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}

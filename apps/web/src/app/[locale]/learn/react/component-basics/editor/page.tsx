"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useLocale } from "next-intl";
import { api } from "../../../../../../../convex/_generated/api";
import type { Id } from "../../../../../../../convex/_generated/dataModel";

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
  _tempId?: string;
}

interface Chapter {
  _id: Id<"chapters">;
  order: number;
  title_en: string;
  title_vi: string;
  blocks: ContentBlock[];
}

/* ─── Styles ─────────────────────────────────────── */
const card: React.CSSProperties = {
  background: "var(--color-bg-card)",
  border: "1px solid var(--color-border)",
  borderRadius: "10px",
  padding: "16px",
  marginBottom: "10px",
};

const input: React.CSSProperties = {
  width: "100%",
  padding: "8px 12px",
  background: "var(--color-bg-primary)",
  border: "1px solid var(--color-border)",
  borderRadius: "6px",
  color: "var(--color-text-primary)",
  fontSize: "0.85rem",
  fontFamily: "var(--font-sans)",
};

const textarea: React.CSSProperties = {
  ...input,
  minHeight: "80px",
  fontFamily: "var(--font-mono)",
  fontSize: "0.8rem",
  resize: "vertical" as const,
};

const btnPrimary: React.CSSProperties = {
  padding: "6px 14px",
  background:
    "linear-gradient(135deg, var(--color-accent-cyan), var(--color-accent-orange-warm))",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "0.8rem",
  fontWeight: 600,
};

const btnDanger: React.CSSProperties = {
  padding: "4px 10px",
  background: "rgba(239, 68, 68, 0.15)",
  color: "#ef4444",
  border: "1px solid rgba(239, 68, 68, 0.3)",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "0.75rem",
};

const btnSecondary: React.CSSProperties = {
  padding: "4px 10px",
  background: "var(--color-bg-card)",
  color: "var(--color-text-secondary)",
  border: "1px solid var(--color-border)",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "0.75rem",
};

const label: React.CSSProperties = {
  display: "block",
  fontSize: "0.7rem",
  color: "var(--color-text-muted)",
  marginBottom: "4px",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

/* ─── Block Editor ───────────────────────────────── */
function BlockEditor({
  block,
  index,
  onChange,
  onRemove,
}: {
  block: ContentBlock;
  index: number;
  onChange: (b: ContentBlock) => void;
  onRemove: () => void;
}) {
  const typeColors: Record<string, string> = {
    text: "var(--color-accent-cyan)",
    code: "var(--color-accent-orange-warm)",
    callout: "var(--color-accent-green)",
    table: "var(--color-accent-orange)",
    image: "var(--color-accent-pink, #ec4899)",
  };

  return (
    <div
      style={{
        ...card,
        borderLeft: `3px solid ${typeColors[block.type] || "var(--color-border)"}`,
        padding: "12px",
        marginBottom: "8px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "8px",
        }}
      >
        <select
          value={block.type}
          onChange={(e) =>
            onChange({ ...block, type: e.target.value as ContentBlock["type"] })
          }
          style={{ ...input, width: "120px", padding: "4px 8px" }}
        >
          <option value="text">📝 Text</option>
          <option value="code">💻 Code</option>
          <option value="callout">💡 Callout</option>
          <option value="table">📊 Table</option>
          <option value="image">🖼️ Image</option>
        </select>
        <span style={{ fontSize: "0.7rem", color: "var(--color-text-muted)" }}>
          Block #{index + 1}
        </span>
        <button style={{ ...btnDanger, marginLeft: "auto" }} onClick={onRemove}>
          ✕ Remove
        </button>
      </div>

      {/* Text / Callout */}
      {(block.type === "text" || block.type === "callout") && (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {block.type === "callout" && (
            <select
              value={block.calloutType || "info"}
              onChange={(e) =>
                onChange({
                  ...block,
                  calloutType: e.target.value as "info" | "tip" | "warning",
                })
              }
              style={{ ...input, width: "100px", padding: "4px 8px" }}
            >
              <option value="info">💡 Info</option>
              <option value="tip">✅ Tip</option>
              <option value="warning">⚠️ Warning</option>
            </select>
          )}
          <div>
            <span style={label}>English</span>
            <textarea
              style={textarea}
              value={block.text_en || ""}
              onChange={(e) => onChange({ ...block, text_en: e.target.value })}
              placeholder="English text..."
            />
          </div>
          <div>
            <span style={label}>Vietnamese</span>
            <textarea
              style={textarea}
              value={block.text_vi || ""}
              onChange={(e) => onChange({ ...block, text_vi: e.target.value })}
              placeholder="Vietnamese text..."
            />
          </div>
        </div>
      )}

      {/* Code */}
      {block.type === "code" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            <div style={{ flex: 1 }}>
              <span style={label}>Filename</span>
              <input
                style={input}
                value={block.filename || ""}
                onChange={(e) =>
                  onChange({ ...block, filename: e.target.value })
                }
                placeholder="e.g. App.tsx"
              />
            </div>
            <div style={{ width: "100px" }}>
              <span style={label}>Language</span>
              <input
                style={input}
                value={block.language || "tsx"}
                onChange={(e) =>
                  onChange({ ...block, language: e.target.value })
                }
              />
            </div>
          </div>
          <div>
            <span style={label}>Code</span>
            <textarea
              style={{ ...textarea, minHeight: "120px" }}
              value={block.code || ""}
              onChange={(e) => onChange({ ...block, code: e.target.value })}
              placeholder="Code content..."
            />
          </div>
        </div>
      )}

      {/* Table */}
      {block.type === "table" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <div>
            <span style={label}>Headers (comma-separated)</span>
            <input
              style={input}
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
            <span style={label}>
              Rows (one per line, columns separated by |)
            </span>
            <textarea
              style={textarea}
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

      {/* Image */}
      {block.type === "image" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <div>
            <span style={label}>Image URL</span>
            <input
              style={input}
              value={block.imageUrl || ""}
              onChange={(e) => onChange({ ...block, imageUrl: e.target.value })}
              placeholder="https://..."
            />
          </div>
          <div>
            <span style={label}>Caption (EN)</span>
            <input
              style={input}
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

/* ─── Chapter Editor ─────────────────────────────── */
function ChapterEditor({
  chapter,
  isActive,
  onSelect,
  onSave,
  onDelete,
}: {
  chapter: Chapter;
  isActive: boolean;
  onSelect: () => void;
  onSave: (ch: {
    title_en: string;
    title_vi: string;
    blocks: ContentBlock[];
  }) => void;
  onDelete: () => void;
}) {
  const [titleEn, setTitleEn] = useState(chapter.title_en);
  const [titleVi, setTitleVi] = useState(chapter.title_vi);
  const [blocks, setBlocks] = useState<ContentBlock[]>(chapter.blocks);
  const [dirty, setDirty] = useState(false);

  const updateBlock = (i: number, b: ContentBlock) => {
    const next = [...blocks];
    next[i] = b;
    setBlocks(next);
    setDirty(true);
  };

  const removeBlock = (i: number) => {
    setBlocks(blocks.filter((_, idx) => idx !== i));
    setDirty(true);
  };

  const addBlock = (type: ContentBlock["type"]) => {
    setBlocks([...blocks, { type, _tempId: crypto.randomUUID() }]);
    setDirty(true);
  };

  if (!isActive) {
    return (
      <div
        onClick={onSelect}
        style={{
          ...card,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "12px 16px",
        }}
      >
        <span
          style={{
            fontSize: "0.75rem",
            color: "var(--color-text-muted)",
            fontFamily: "var(--font-mono)",
            width: "24px",
          }}
        >
          #{chapter.order + 1}
        </span>
        <span
          style={{
            color: "var(--color-text-primary)",
            fontSize: "0.9rem",
            fontWeight: 500,
          }}
        >
          {titleEn}
        </span>
        <span
          style={{
            fontSize: "0.75rem",
            color: "var(--color-text-muted)",
            marginLeft: "auto",
          }}
        >
          {blocks.length} blocks
        </span>
      </div>
    );
  }

  return (
    <div style={{ ...card, border: "1px solid var(--color-accent-cyan)" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "12px",
        }}
      >
        <span
          style={{
            fontSize: "0.75rem",
            color: "var(--color-accent-cyan)",
            fontFamily: "var(--font-mono)",
          }}
        >
          Chapter #{chapter.order + 1}
        </span>
        <button
          style={{ ...btnDanger, marginLeft: "auto" }}
          onClick={() => {
            if (confirm("Delete this chapter?")) onDelete();
          }}
        >
          🗑️ Delete Chapter
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "8px",
          marginBottom: "12px",
        }}
      >
        <div>
          <span style={label}>Title (EN)</span>
          <input
            style={input}
            value={titleEn}
            onChange={(e) => {
              setTitleEn(e.target.value);
              setDirty(true);
            }}
          />
        </div>
        <div>
          <span style={label}>Title (VI)</span>
          <input
            style={input}
            value={titleVi}
            onChange={(e) => {
              setTitleVi(e.target.value);
              setDirty(true);
            }}
          />
        </div>
      </div>

      <h4
        style={{
          fontSize: "0.75rem",
          color: "var(--color-text-muted)",
          margin: "12px 0 8px",
          textTransform: "uppercase",
        }}
      >
        Content Blocks ({blocks.length})
      </h4>

      {blocks.map((block, i) => (
        <BlockEditor
          key={block._tempId || i}
          block={block}
          index={i}
          onChange={(b) => updateBlock(i, b)}
          onRemove={() => removeBlock(i)}
        />
      ))}

      <div
        style={{
          display: "flex",
          gap: "6px",
          marginTop: "8px",
          flexWrap: "wrap",
        }}
      >
        {(["text", "code", "callout", "table", "image"] as const).map(
          (type) => (
            <button
              key={type}
              style={btnSecondary}
              onClick={() => addBlock(type)}
            >
              + {type}
            </button>
          )
        )}
      </div>

      {dirty && (
        <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
          <button
            style={btnPrimary}
            onClick={() => {
              onSave({ title_en: titleEn, title_vi: titleVi, blocks });
              setDirty(false);
            }}
          >
            💾 Save Changes
          </button>
          <button
            style={btnSecondary}
            onClick={() => {
              setTitleEn(chapter.title_en);
              setTitleVi(chapter.title_vi);
              setBlocks(chapter.blocks);
              setDirty(false);
            }}
          >
            ↩ Discard
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Main Editor Page ───────────────────────────── */
export default function WalkthroughEditorPage() {
  const locale = useLocale();
  const [activeChapter, setActiveChapter] = useState<string | null>(null);

  const walkthrough = useQuery(api.walkthroughs.getBySlug, {
    courseSlug: "react",
    slug: "component-basics",
  });
  const chapters = useQuery(
    api.chapters.listByWalkthrough,
    walkthrough ? { walkthroughId: walkthrough._id } : "skip"
  );

  const updateChapter = useMutation(api.chapters.update);
  const deleteChapter = useMutation(api.chapters.remove);
  const createChapter = useMutation(api.chapters.create);

  if (walkthrough === undefined || chapters === undefined) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "calc(100vh - 48px)",
          color: "var(--color-text-muted)",
        }}
      >
        Loading editor...
      </div>
    );
  }

  if (!walkthrough) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "calc(100vh - 48px)",
          color: "var(--color-text-secondary)",
        }}
      >
        No walkthrough found. Seed data first.
      </div>
    );
  }

  const sorted = [...(chapters || [])].sort((a, b) => a.order - b.order);

  const handleSave = async (
    id: Id<"chapters">,
    data: { title_en: string; title_vi: string; blocks: ContentBlock[] }
  ) => {
    await updateChapter({ id, ...data });
  };

  const handleDelete = async (id: Id<"chapters">) => {
    await deleteChapter({ id });
    setActiveChapter(null);
  };

  const handleAddChapter = async () => {
    const maxOrder =
      sorted.length > 0 ? Math.max(...sorted.map((c) => c.order)) : -1;
    await createChapter({
      walkthroughId: walkthrough._id,
      order: maxOrder + 1,
      title_en: "New Chapter",
      title_vi: "Chương mới",
      blocks: [
        {
          type: "text",
          text_en: "Start writing here...",
          text_vi: "Bắt đầu viết ở đây...",
          _tempId: crypto.randomUUID(),
        },
      ],
    });
  };

  return (
    <div
      style={{ maxWidth: "820px", margin: "0 auto", padding: "24px 20px 60px" }}
    >
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "8px",
          }}
        >
          <h1
            style={{
              fontSize: "1.4rem",
              fontWeight: 700,
              color: "var(--color-text-primary)",
            }}
          >
            ✏️ Walkthrough Editor
          </h1>
          <a
            href={`/${locale}/learn/react/component-basics`}
            style={{
              padding: "4px 10px",
              background: "var(--color-bg-card)",
              border: "1px solid var(--color-border)",
              borderRadius: "6px",
              color: "var(--color-accent-cyan)",
              textDecoration: "none",
              fontSize: "0.75rem",
            }}
          >
            👁️ Preview
          </a>
        </div>
        <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
          {walkthrough.title_en} — {sorted.length} chapters
        </p>
      </div>

      {/* Chapter List */}
      {sorted.map((ch) => (
        <ChapterEditor
          key={ch._id}
          chapter={ch as Chapter}
          isActive={activeChapter === ch._id}
          onSelect={() => setActiveChapter(ch._id)}
          onSave={(data) => handleSave(ch._id, data)}
          onDelete={() => handleDelete(ch._id)}
        />
      ))}

      {/* Add Chapter */}
      <button
        style={{
          ...btnPrimary,
          width: "100%",
          padding: "10px",
          marginTop: "8px",
        }}
        onClick={handleAddChapter}
      >
        + Add New Chapter
      </button>
    </div>
  );
}

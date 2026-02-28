"use client";

import dynamic from "next/dynamic";

const BlockEditor = dynamic(() => import("./BlockEditor"), { ssr: false });

interface EditorMainFieldProps {
  activeIdx: number | null;
  vi: boolean;
  titleEn: string;
  setTitleEn: (v: string) => void;
  titleVi: string;
  setTitleVi: (v: string) => void;
  setDirty: (v: boolean) => void;
  tab: "en" | "vi";
  setTab: (v: "en" | "vi") => void;
  contentEn: string;
  setContentEn: (v: string) => void;
  contentVi: string;
  setContentVi: (v: string) => void;
  handleDelete: () => Promise<void>;
  handleSave: () => Promise<void>;
  saving: boolean;
  selectChapter: (i: number) => void;
  dirty: boolean;
}

export function EditorMainField({
  activeIdx,
  vi,
  titleEn,
  setTitleEn,
  titleVi,
  setTitleVi,
  setDirty,
  tab,
  setTab,
  contentEn,
  setContentEn,
  contentVi,
  setContentVi,
  handleDelete,
  handleSave,
  saving,
  selectChapter,
  dirty,
}: EditorMainFieldProps) {
  if (activeIdx === null) {
    return (
      <div className="flex items-center justify-center flex-1 text-text-strong text-[0.85rem]">
        ← {vi ? "Chọn chương để chỉnh sửa" : "Select a chapter to edit"}
      </div>
    );
  }

  return (
    <div className="editor-main-container">
      <div className="editor-scroll-area">
        {/* Title row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2.5">
          <div>
            <span className="editor-input-label">Title (EN)</span>
            <input
              value={titleEn}
              onChange={(e) => {
                setTitleEn(e.target.value);
                setDirty(true);
              }}
              className="editor-text-input"
            />
          </div>
          <div>
            <span className="editor-input-label">Title (VI)</span>
            <input
              value={titleVi}
              onChange={(e) => {
                setTitleVi(e.target.value);
                setDirty(true);
              }}
              className="editor-text-input"
            />
          </div>
        </div>

        {/* Lang tabs + delete */}
        <div className="flex items-center gap-1.5 mb-2">
          {(["en", "vi"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`editor-tab-button ${tab === t ? "editor-tab-button-active" : "editor-tab-button-inactive"}`}
            >
              {t === "en" ? "🇺🇸 English" : "🇻🇳 Tiếng Việt"}
            </button>
          ))}
          <button onClick={handleDelete} className="editor-delete-button">
            🗑️ {vi ? "Xóa" : "Delete"}
          </button>
        </div>

        {/* MDEditor replaced by BlockEditor */}
        <div className="flex-1 min-h-[300px]">
          <BlockEditor
            key={activeIdx + "-" + tab}
            initialContent={tab === "en" ? contentEn : contentVi}
            onChange={(val) => {
              if (tab === "en") setContentEn(val || "");
              else setContentVi(val || "");
              setDirty(true);
            }}
          />
        </div>
      </div>

      {/* Save bar (Persistent Footer) */}
      {dirty && (
        <div className="editor-footer-save-bar">
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary py-2.5! px-6! text-[0.85rem]! rounded-[10px]! shadow-none!"
          >
            {saving ? "⏳ Saving..." : "💾 Save Changes"}
          </button>
          <button
            onClick={() => selectChapter(activeIdx)}
            className="btn-secondary py-2.5! px-5! text-[0.82rem]! rounded-[10px]!"
          >
            ↩ Discard
          </button>
          <span className="editor-unsaved-warning">
            <span className="text-base">⚠️</span> Unsaved changes
          </span>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useMutation, useAction } from "convex/react";
import gsap from "gsap";
import dynamic from "next/dynamic";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

const BlockEditor = dynamic(() => import("./BlockEditor"), { ssr: false });

/* ─── Types ─────────────────────────────── */
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
  _id: Id<"chapters">;
  walkthroughId: Id<"walkthroughs">;
  order: number;
  title_en: string;
  title_vi: string;
  content_en?: string;
  content_vi?: string;
  blocks?: ContentBlock[];
  vizConfig?: any;
}

interface EditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapters: Chapter[];
  walkthroughId: Id<"walkthroughs">;
  locale: string;
}

/* ─── Main Modal ────────────────────────── */
export function EditorModal({
  isOpen,
  onClose,
  chapters,
  walkthroughId,
  locale,
}: EditorModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [titleEn, setTitleEn] = useState("");
  const [titleVi, setTitleVi] = useState("");
  const [contentEn, setContentEn] = useState("");
  const [contentVi, setContentVi] = useState("");
  const [tab, setTab] = useState<"en" | "vi">("en");
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [aiStatus, setAiStatus] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const updateChapter = useMutation(api.chapters.update);
  const deleteChapter = useMutation(api.chapters.remove);
  const createChapter = useMutation(api.chapters.create);
  const generateViz = useAction(api.vizAI.generateVizFromContent);

  const sorted = [...chapters].sort((a, b) => a.order - b.order);
  const vi = locale === "vi";

  // ─── GSAP open ───
  useEffect(() => {
    if (!isOpen || !modalRef.current || !backdropRef.current) return;
    gsap.set(modalRef.current, { scale: 0.85, opacity: 0, y: 40 });
    gsap.set(backdropRef.current, { opacity: 0 });
    gsap.to(backdropRef.current, {
      opacity: 1,
      duration: 0.25,
      ease: "power2.out",
    });
    gsap.to(modalRef.current, {
      scale: 1,
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: "back.out(1.4)",
      delay: 0.05,
    });
  }, [isOpen]);

  const handleClose = useCallback(() => {
    if (!modalRef.current || !backdropRef.current) {
      onClose();
      return;
    }
    gsap.to(modalRef.current, {
      scale: 0.9,
      opacity: 0,
      y: 30,
      duration: 0.25,
      ease: "power2.in",
    });
    gsap.to(backdropRef.current, {
      opacity: 0,
      duration: 0.2,
      delay: 0.1,
      onComplete: onClose,
    });
  }, [onClose]);

  // ─── Drag ───
  useEffect(() => {
    if (!isOpen || !headerRef.current || !modalRef.current) return;
    const header = headerRef.current;
    const modal = modalRef.current;
    let startX = 0,
      startY = 0,
      offsetX = 0,
      offsetY = 0,
      dragging = false;

    const onDown = (e: MouseEvent) => {
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const r = modal.getBoundingClientRect();
      offsetX = r.left;
      offsetY = r.top;
      header.style.cursor = "grabbing";
    };
    const onMove = (e: MouseEvent) => {
      if (!dragging) return;
      modal.style.left = `${offsetX + e.clientX - startX}px`;
      modal.style.top = `${offsetY + e.clientY - startY}px`;
      modal.style.transform = "none";
    };
    const onUp = () => {
      dragging = false;
      header.style.cursor = "grab";
    };

    header.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      header.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [isOpen]);

  // ─── Select chapter ───
  const selectChapter = (i: number) => {
    const ch = sorted[i];
    setActiveIdx(i);
    setTitleEn(ch.title_en);
    setTitleVi(ch.title_vi);
    setContentEn(ch.content_en || "");
    setContentVi(ch.content_vi || "");
    setDirty(false);
  };

  const handleSave = async () => {
    if (activeIdx === null) return;
    setSaving(true);
    await updateChapter({
      id: sorted[activeIdx]._id,
      title_en: titleEn,
      title_vi: titleVi,
      content_en: contentEn,
      content_vi: contentVi,
    });
    setSaving(false);
    setDirty(false);
  };

  const handleDelete = async () => {
    if (activeIdx === null) return;
    if (!confirm(vi ? "Xóa chương này?" : "Delete this chapter?")) return;
    await deleteChapter({ id: sorted[activeIdx]._id });
    setActiveIdx(null);
  };

  const handleAdd = async () => {
    const maxOrder =
      sorted.length > 0 ? Math.max(...sorted.map((c) => c.order)) : -1;
    await createChapter({
      walkthroughId,
      order: maxOrder + 1,
      title_en: "New Chapter",
      title_vi: "Chương mới",
      content_en: "# New Chapter\n\nStart writing here...",
      content_vi: "# Chương mới\n\nBắt đầu viết ở đây...",
    });
  };

  // ─── AI Generate ───
  const handleGenerateViz = async () => {
    if (sorted.length === 0) return;
    setGenerating(true);
    setAiStatus(
      vi ? "🧠 Đang tạo 3D bằng Gemini..." : "🧠 Generating 3D with Gemini..."
    );

    if (activeIdx === null) return;
    const currentChapter = sorted[activeIdx];
    if (!currentChapter) return;

    try {
      const result = await generateViz({
        chapterId: currentChapter._id,
        order: currentChapter.order,
        title_en: currentChapter.title_en,
        content_en: currentChapter.content_en || "",
      });
      setAiStatus(
        vi
          ? `✅ Tạo thành công! ${result.nodeCount} nodes, ${result.connectionCount} connections`
          : `✅ Generated! ${result.nodeCount} nodes, ${result.connectionCount} connections`
      );
    } catch (err) {
      setAiStatus(
        `❌ ${err instanceof Error ? err.message : "AI generation failed"}`
      );
    } finally {
      setGenerating(false);
      setTimeout(() => setAiStatus(null), 5000);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={handleClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(4px)",
          zIndex: 999,
        }}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        data-color-mode="light"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "95vw",
          maxWidth: "1100px",
          height: "90vh",
          background: "#ffffff",
          border: "1px solid rgba(0,0,0,0.08)",
          borderRadius: "20px",
          boxShadow:
            "0 32px 120px rgba(0,0,0,0.12), 0 0 40px rgba(86,217,209,0.1)",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          ref={headerRef}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "16px 20px",
            borderBottom: "1px solid rgba(0,0,0,0.05)",
            cursor: "grab",
            userSelect: "none",
            background: "linear-gradient(180deg, #fef9f6, #ffffff)",
          }}
        >
          <span
            style={{
              fontSize: "0.8rem",
              color: "#8e8e8e",
              marginRight: "10px",
            }}
          >
            ⠿
          </span>
          <h3
            style={{
              fontSize: "1rem",
              fontWeight: 800,
              color: "#2d2d2d",
              flex: 1,
            }}
          >
            ✏️ {vi ? "Trình chỉnh sửa Markdown" : "Markdown Editor"}
          </h3>
          <button
            onClick={handleGenerateViz}
            disabled={generating || sorted.length === 0}
            className="btn-primary"
            style={{
              padding: "6px 14px",
              borderRadius: "8px",
              fontSize: "0.75rem",
              marginRight: "12px",
              boxShadow: "none",
            }}
          >
            {generating ? "⏳ AI..." : "🧠 Generate 3D"}
          </button>
          <span
            style={{
              fontSize: "0.75rem",
              color: "#8e8e8e",
              marginRight: "16px",
              fontWeight: 500,
            }}
          >
            {sorted.length} {vi ? "chương" : "chapters"}
          </span>
          <button
            onClick={handleClose}
            style={{
              background: "#f3f4f6",
              border: "none",
              color: "#5a5a5a",
              fontSize: "1rem",
              cursor: "pointer",
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#e5e7eb")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#f3f4f6")}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div
          style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}
        >
          {/* Chapter sidebar */}
          <div
            style={{
              width: "220px",
              borderRight: "1px solid rgba(0,0,0,0.05)",
              overflowY: "auto",
              padding: "16px 12px",
              flexShrink: 0,
              background: "#fcfaf8",
            }}
          >
            {sorted.map((ch, i) => (
              <button
                key={ch._id}
                onClick={() => selectChapter(i)}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "10px 14px",
                  marginBottom: "4px",
                  borderRadius: "10px",
                  border: "none",
                  background:
                    activeIdx === i ? "rgba(86,217,209,0.12)" : "transparent",
                  color: activeIdx === i ? "#0d9488" : "#5a5a5a",
                  fontSize: "0.82rem",
                  fontWeight: activeIdx === i ? 700 : 500,
                  cursor: "pointer",
                  lineHeight: 1.4,
                  transition: "all 0.2s",
                }}
              >
                <span
                  style={{
                    fontSize: "0.7rem",
                    color: "#8e8e8e",
                    marginRight: "6px",
                  }}
                >
                  {ch.order + 1}.
                </span>
                {vi ? ch.title_vi : ch.title_en}
              </button>
            ))}
            {/* AI status */}
            {aiStatus && (
              <div
                style={{
                  padding: "8px 12px",
                  marginTop: "8px",
                  borderRadius: "8px",
                  background: aiStatus.startsWith("✅")
                    ? "rgba(16,185,129,0.08)"
                    : aiStatus.startsWith("❌")
                      ? "rgba(239,68,68,0.08)"
                      : "rgba(245,158,11,0.08)",
                  color: aiStatus.startsWith("✅")
                    ? "#10b981"
                    : aiStatus.startsWith("❌")
                      ? "#ef4444"
                      : "#f59e0b",
                  fontSize: "0.7rem",
                  lineHeight: 1.4,
                  wordBreak: "break-word",
                  border: "1px solid currentColor",
                }}
              >
                {aiStatus}
              </div>
            )}
            <button
              onClick={handleAdd}
              className="btn-secondary"
              style={{
                width: "100%",
                marginTop: "12px",
                padding: "8px 12px",
                fontSize: "0.75rem",
                justifyContent: "center",
                borderRadius: "10px",
              }}
            >
              + {vi ? "Thêm chương" : "Add Chapter"}
            </button>
          </div>

          {/* Editor */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              background: "#ffffff",
            }}
          >
            {activeIdx === null ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 1,
                  color: "#484f58",
                  fontSize: "0.85rem",
                }}
              >
                ← {vi ? "Chọn chương để chỉnh sửa" : "Select a chapter to edit"}
              </div>
            ) : (
              <>
                {/* Title row */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "8px",
                    marginBottom: "10px",
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: "0.7rem",
                        color: "#5a5a5a",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        fontWeight: 700,
                        display: "block",
                        marginBottom: "6px",
                      }}
                    >
                      Title (EN)
                    </span>
                    <input
                      value={titleEn}
                      onChange={(e) => {
                        setTitleEn(e.target.value);
                        setDirty(true);
                      }}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        background: "#f9fafb",
                        border: "1px solid rgba(0,0,0,0.08)",
                        borderRadius: "10px",
                        color: "#2d2d2d",
                        fontSize: "0.9rem",
                        outline: "none",
                        transition: "all 0.2s",
                      }}
                      onFocus={(e) =>
                        (e.currentTarget.style.borderColor = "#56d9d1")
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.borderColor = "rgba(0,0,0,0.08)")
                      }
                    />
                  </div>
                  <div>
                    <span
                      style={{
                        fontSize: "0.7rem",
                        color: "#5a5a5a",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        fontWeight: 700,
                        display: "block",
                        marginBottom: "6px",
                      }}
                    >
                      Title (VI)
                    </span>
                    <input
                      value={titleVi}
                      onChange={(e) => {
                        setTitleVi(e.target.value);
                        setDirty(true);
                      }}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        background: "#f9fafb",
                        border: "1px solid rgba(0,0,0,0.08)",
                        borderRadius: "10px",
                        color: "#2d2d2d",
                        fontSize: "0.9rem",
                        outline: "none",
                        transition: "all 0.2s",
                      }}
                      onFocus={(e) =>
                        (e.currentTarget.style.borderColor = "#56d9d1")
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.borderColor = "rgba(0,0,0,0.08)")
                      }
                    />
                  </div>
                </div>

                {/* Lang tabs + delete */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    marginBottom: "8px",
                  }}
                >
                  {(["en", "vi"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      style={{
                        padding: "6px 16px",
                        borderRadius: "8px",
                        border:
                          tab === t
                            ? "1px solid #56d9d1"
                            : "1px solid rgba(0,0,0,0.08)",
                        background:
                          tab === t ? "rgba(86,217,209,0.1)" : "#f9fafb",
                        color: tab === t ? "#0d9488" : "#5a5a5a",
                        cursor: "pointer",
                        fontSize: "0.8rem",
                        fontWeight: tab === t ? 700 : 500,
                        transition: "all 0.2s",
                      }}
                    >
                      {t === "en" ? "🇺🇸 English" : "🇻🇳 Tiếng Việt"}
                    </button>
                  ))}
                  <button
                    onClick={handleDelete}
                    style={{
                      marginLeft: "auto",
                      padding: "6px 14px",
                      background: "rgba(239,68,68,0.05)",
                      color: "#ef4444",
                      border: "1px solid rgba(239,68,68,0.2)",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      transition: "all 0.2s",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.background = "rgba(239,68,68,0.1)")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(239,68,68,0.05)")
                    }
                  >
                    🗑️ {vi ? "Xóa" : "Delete"}
                  </button>
                </div>

                {/* MDEditor replaced by BlockEditor */}
                <div
                  style={{ flex: 1, minHeight: "300px" }}
                >
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

                {/* Save bar */}
                {dirty && (
                  <div
                    style={{
                      marginTop: "16px",
                      padding: "12px 16px",
                      background: "#fef9f6",
                      borderTop: "1px solid rgba(0,0,0,0.05)",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      borderRadius: "12px",
                      boxShadow: "0 -4px 15px rgba(0,0,0,0.02)",
                    }}
                  >
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="btn-primary"
                      style={{
                        padding: "8px 20px",
                        fontSize: "0.8rem",
                        borderRadius: "10px",
                        boxShadow: "none",
                      }}
                    >
                      {saving ? "⏳ Saving..." : "💾 Save Changes"}
                    </button>
                    <button
                      onClick={() => selectChapter(activeIdx as number)}
                      className="btn-secondary"
                      style={{
                        padding: "8px 16px",
                        fontSize: "0.78rem",
                        borderRadius: "10px",
                      }}
                    >
                      ↩ Discard
                    </button>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "#f59e0b",
                        fontWeight: 600,
                        marginLeft: "auto",
                      }}
                    >
                      ⚠️ Unsaved changes
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import gsap from "gsap";
import {
  useEditorModalState,
  type Chapter,
} from "../hooks/useEditorModalState";
import { EditorSidebar } from "./EditorSidebar";
import { EditorMainField } from "./EditorMainField";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import type { Id } from "../../convex/_generated/dataModel";

interface EditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapters: Chapter[];
  walkthroughId: Id<"walkthroughs">;
  locale: string;
}

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
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Close sidebar by default on mobile
  useEffect(() => {
    if (isMobile) setIsSidebarOpen(false);
    else setIsSidebarOpen(true);
  }, [isMobile]);

  const {
    activeIdx,
    titleEn,
    setTitleEn,
    titleVi,
    setTitleVi,
    contentEn,
    setContentEn,
    contentVi,
    setContentVi,
    tab,
    setTab,
    dirty,
    setDirty,
    saving,
    aiStatus,
    generating,
    sorted,
    vi,
    selectChapter,
    handleSave,
    handleDelete,
    handleAdd,
    handleGenerateViz,
  } = useEditorModalState({ chapters, walkthroughId, locale });

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

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={handleClose}
        className="fixed inset-0 bg-black/55 backdrop-blur-xs z-999"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        data-color-mode="light"
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] lg:w-[90vw] max-w-[1200px] h-[95vh] lg:h-[85vh] bg-white border border-black/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden z-1000"
        style={{
          boxShadow:
            "0 32px 120px rgba(0,0,0,0.12), 0 0 40px var(--color-glow-cyan-soft)",
        }}
      >
        {/* Header */}
        <div
          ref={headerRef}
          className="flex items-center px-4 lg:px-5 py-3 lg:py-4 border-b border-black/5 cursor-grab select-none bg-linear-to-b from-bg-primary to-white"
        >
          {isMobile && (
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 mr-2 text-text-secondary hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isSidebarOpen ? "✕" : "☰"}
            </button>
          )}
          <span className="text-[0.8rem] text-text-muted mr-2 lg:mr-3 hidden sm:inline">
            ⠿
          </span>
          <h3 className="text-base font-extrabold text-text-primary flex-1">
            ✏️ {vi ? "Trình chỉnh sửa Markdown" : "Markdown Editor"}
          </h3>
          {/* <button
            onClick={handleGenerateViz}
            disabled={true}
            // disabled={generating}
            className={`btn-primary py-1.5! px-3.5! text-[0.75rem]! mr-3 shadow-none! ${generating ? "opacity-50 cursor-not-allowed" : "hover:opacity-90 active:scale-95 transition-all"}`}
          >
            {generating ? "⏳ AI..." : "🧠 Auto-Generate 2D/3D UI"}
          </button> */}
          <span className="text-[0.75rem] text-text-muted mr-4 font-medium">
            {sorted.length} {vi ? "chương" : "chapters"}
          </span>
          <button
            onClick={handleClose}
            className="bg-gray-100 hover:bg-gray-200 text-text-secondary text-base cursor-pointer w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div
          style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}
        >
          {(isSidebarOpen || !isMobile) && (
            <div
              className={
                isMobile
                  ? "fixed inset-0 top-[52px] bg-white z-1100 p-4 flex flex-col"
                  : "w-64 border-r border-border"
              }
            >
              <div className="flex justify-between items-center mb-4 lg:hidden">
                <h4 className="font-bold">{vi ? "Chương" : "Chapters"}</h4>
                <button onClick={() => setIsSidebarOpen(false)} className="p-2">
                  ✕
                </button>
              </div>
              <EditorSidebar
                sorted={sorted}
                activeIdx={activeIdx}
                selectChapter={(idx) => {
                  selectChapter(idx);
                  if (isMobile) setIsSidebarOpen(false);
                }}
                aiStatus={aiStatus}
                handleAdd={handleAdd}
                vi={vi}
              />
            </div>
          )}
          <EditorMainField
            activeIdx={activeIdx}
            vi={vi}
            titleEn={titleEn}
            setTitleEn={setTitleEn}
            titleVi={titleVi}
            setTitleVi={setTitleVi}
            setDirty={setDirty}
            tab={tab}
            setTab={setTab}
            contentEn={contentEn}
            setContentEn={setContentEn}
            contentVi={contentVi}
            setContentVi={setContentVi}
            handleDelete={handleDelete}
            handleSave={handleSave}
            saving={saving}
            selectChapter={selectChapter}
            dirty={dirty}
          />
        </div>
      </div>
    </>
  );
}

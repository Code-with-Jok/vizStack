"use client";

import { cn } from "@/lib/cn";
import type { Chapter } from "../hooks/useEditorModalState";

interface EditorSidebarProps {
  sorted: Chapter[];
  activeIdx: number | null;
  selectChapter: (i: number) => void;
  aiStatus: string | null;
  handleAdd: () => Promise<void>;
  vi: boolean;
}

export function EditorSidebar({
  sorted,
  activeIdx,
  selectChapter,
  aiStatus,
  handleAdd,
  vi,
}: EditorSidebarProps) {
  const statusTone = aiStatus?.startsWith("✅")
    ? "success"
    : aiStatus?.startsWith("❌")
      ? "error"
      : aiStatus
        ? "warning"
        : null;

  return (
    <div className="w-[220px] border-r border-border overflow-y-auto px-3 py-4 flex-shrink-0 bg-bg-soft">
      {sorted.map((ch, i) => (
        <button
          key={ch._id}
          onClick={() => selectChapter(i)}
          className={cn(
            "flex w-full text-left px-3.5 py-2.5 mb-1 rounded-[10px] border border-transparent text-[0.82rem] font-medium cursor-pointer leading-snug transition-all",
            activeIdx === i
              ? "bg-accent-cyan-soft text-accent-teal-strong font-bold"
              : "text-text-secondary hover:bg-black/5"
          )}
        >
          <span
            className="text-[0.7rem] text-text-muted mr-1.5"
          >
            {ch.order + 1}.
          </span>
          <p className="break-words">
            {vi ? ch.title_vi : ch.title_en}
          </p>
        </button>
      ))}
      {/* AI status */}
      {aiStatus && statusTone && (
        <div
          className={cn(
            "mt-2 rounded-lg px-3 py-2 text-[0.7rem] leading-relaxed break-words border border-current",
            statusTone === "success" && "bg-status-success text-accent-green",
            statusTone === "error" && "bg-status-error text-accent-red",
            statusTone === "warning" && "bg-status-warning text-accent-orange"
          )}
        >
          {aiStatus}
        </div>
      )}
      <button
        onClick={handleAdd}
        className="btn-secondary w-full mt-3 py-2 text-[0.75rem] justify-center rounded-[10px]"
      >
        + {vi ? "Thêm chương" : "Add Chapter"}
      </button>
    </div>
  );
}

"use client";

import { useState, useCallback } from "react";
import { useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

import { ContentBlock } from "./useChapterEditor";

export interface Chapter {
  _id: Id<"chapters">;
  walkthroughId: Id<"walkthroughs">;
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

interface UseEditorModalStateProps {
  chapters: Chapter[];
  walkthroughId: Id<"walkthroughs">;
  locale: string;
}

export function useEditorModalState({
  chapters,
  walkthroughId,
  locale,
}: UseEditorModalStateProps) {
  const [activeId, setActiveId] = useState<Id<"chapters"> | null>(null);
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

  const selectChapter = useCallback(
    (id: Id<"chapters">) => {
      const ch = chapters.find((c) => c._id === id);
      if (!ch) return;
      setActiveId(id);
      setTitleEn(ch.title_en);
      setTitleVi(ch.title_vi);
      setContentEn(ch.content_en || "");
      setContentVi(ch.content_vi || "");
      setDirty(false);
    },
    [chapters]
  );

  const handleSave = async () => {
    if (activeId === null) return;
    setSaving(true);
    try {
      await updateChapter({
        id: activeId,
        title_en: titleEn,
        title_vi: titleVi,
        content_en: contentEn,
        content_vi: contentVi,
      });
      setDirty(false);
    } catch (err) {
      console.error("Failed to save chapter:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (activeId === null) return;
    if (!confirm(vi ? "Xóa chương này?" : "Delete this chapter?")) return;
    try {
      await deleteChapter({ id: activeId });
      setActiveId(null);
    } catch (err) {
      console.error("Failed to delete chapter:", err);
    }
  };

  const handleAdd = async () => {
    const maxOrder =
      sorted.length > 0 ? Math.max(...sorted.map((c) => c.order)) : -1;
    try {
      await createChapter({
        walkthroughId,
        order: maxOrder + 1,
        title_en: "New Chapter",
        title_vi: "Chương mới",
        content_en: "# New Chapter\n\nStart writing here...",
        content_vi: "# Chương mới\n\nBắt đầu viết ở đây...",
      });
    } catch (err) {
      console.error("Failed to add chapter:", err);
    }
  };

  const handleGenerateViz = async () => {
    if (sorted.length === 0 || activeId === null) return;
    const currentChapter = sorted.find((c) => c._id === activeId);
    if (!currentChapter) return;

    setGenerating(true);
    setAiStatus(
      vi
        ? "🧠 Đang tạo knowledge graph + 2D/3D..."
        : "🧠 Generating knowledge graph + 2D/3D..."
    );

    try {
      const result = await generateViz({
        chapterId: activeId,
        order: currentChapter.order,
        title: tab === "vi" ? titleVi : titleEn,
        content: tab === "vi" ? contentVi : contentEn,
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

  return {
    activeId,
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
  };
}

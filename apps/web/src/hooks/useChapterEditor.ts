"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

export interface ContentBlock {
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

export interface Chapter {
  _id: Id<"chapters">;
  order: number;
  title_en: string;
  title_vi: string;
  blocks: ContentBlock[];
}

/**
 * Hook để quản lý state editor một chapter
 * Tách biệt logic state từ UI component
 */
export function useChapterEditor(initialChapter: Chapter) {
  const [titleEn, setTitleEn] = useState(initialChapter.title_en);
  const [titleVi, setTitleVi] = useState(initialChapter.title_vi);
  const [blocks, setBlocks] = useState<ContentBlock[]>(initialChapter.blocks);
  const [dirty, setDirty] = useState(false);

  // Sync state when initialChapter changes (e.g. parent switches chapter)
  useEffect(() => {
    setTitleEn(initialChapter.title_en);
    setTitleVi(initialChapter.title_vi);
    setBlocks(initialChapter.blocks);
    setDirty(false);
  }, [
    initialChapter._id,
    initialChapter.title_en,
    initialChapter.title_vi,
    initialChapter.blocks,
  ]);

  const updateBlock = (index: number, updatedBlock: ContentBlock) => {
    const next = [...blocks];
    next[index] = updatedBlock;
    setBlocks(next);
    setDirty(true);
  };

  const removeBlock = (index: number) => {
    setBlocks(blocks.filter((_, idx) => idx !== index));
    setDirty(true);
  };

  const addBlock = (type: ContentBlock["type"]) => {
    setBlocks([...blocks, { type, _tempId: crypto.randomUUID() }]);
    setDirty(true);
  };

  const updateTitle = (lang: "en" | "vi", value: string) => {
    if (lang === "en") {
      setTitleEn(value);
    } else {
      setTitleVi(value);
    }
    setDirty(true);
  };

  const reset = () => {
    setTitleEn(initialChapter.title_en);
    setTitleVi(initialChapter.title_vi);
    setBlocks(initialChapter.blocks);
    setDirty(false);
  };

  return {
    titleEn,
    titleVi,
    blocks,
    dirty,
    updateBlock,
    removeBlock,
    addBlock,
    updateTitle,
    reset,
  };
}

/**
 * Hook để quản lý list chapters và mutations
 */
export function useWalkthroughEditor(courseSlug: string, slug: string) {
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);

  const walkthrough = useQuery(api.walkthroughs.getBySlug, {
    courseSlug,
    slug,
  });

  const chapters = useQuery(
    api.chapters.listByWalkthrough,
    walkthrough ? { walkthroughId: walkthrough._id } : "skip"
  );

  const updateChapterMutation = useMutation(api.chapters.update);
  const deleteChapterMutation = useMutation(api.chapters.remove);
  const createChapterMutation = useMutation(api.chapters.create);

  const isLoading = walkthrough === undefined || chapters === undefined;
  const hasWalkthrough = !!walkthrough;
  const sortedChapters = chapters
    ? [...chapters].sort((a, b) => a.order - b.order)
    : [];

  const handleUpdateChapter = async (
    id: Id<"chapters">,
    data: { title_en: string; title_vi: string; blocks: ContentBlock[] }
  ) => {
    // Strip client-only _tempId before sending to backend
    const cleanBlocks = data.blocks.map(({ _tempId, ...rest }) => rest);
    await updateChapterMutation({ id, ...data, blocks: cleanBlocks });
  };

  const handleDeleteChapter = async (id: Id<"chapters">) => {
    await deleteChapterMutation({ id });
    setActiveChapterId(null);
  };

  const handleAddChapter = async () => {
    if (!walkthrough) return;

    const maxOrder =
      sortedChapters.length > 0
        ? Math.max(...sortedChapters.map((c) => c.order))
        : -1;

    await createChapterMutation({
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

  return {
    walkthrough,
    chapters: sortedChapters,
    activeChapterId,
    isLoading,
    hasWalkthrough,
    setActiveChapterId,
    handleUpdateChapter,
    handleDeleteChapter,
    handleAddChapter,
  };
}

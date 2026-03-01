"use client";

import { useState, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useMutation } from "convex/react";
import { WalkthroughLayout } from "@/components/WalkthroughLayout";
import { EditorModal } from "@/components/EditorModal";
import { FullPageLoader } from "@/components/FullPageLoader";
import { EmptyWalkthroughState } from "@/components/EmptyWalkthroughState";
import { LessonVizSwitcher } from "@/components/LessonVizSwitcher";
import { useWalkthrough } from "@/hooks/useWalkthrough";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { DEFAULT_VIZ } from "@/constants/viz";
import {
  contentToVisualization,
  textToVisualization,
} from "@/lib/contentToVisualization";

type MutationReference = Parameters<typeof useMutation>[0];

interface WalkthroughPageProps {
  courseSlug: string;
  slug: string;
  seedLabel: string;
  seedAction: MutationReference;
}

export function WalkthroughPage({
  courseSlug,
  slug,
  seedLabel,
  seedAction,
}: WalkthroughPageProps) {
  const locale = useLocale();
  const t = useTranslations();
  const [activeChapter, setActiveChapter] = useState(0);
  const [editorOpen, setEditorOpen] = useState(false);
  const isAdmin = useIsAdmin();
  const { walkthrough, chapters, isLoading } = useWalkthrough(courseSlug, slug);
  const vi = locale === "vi";

  const seed = useMutation(seedAction);
  const sortedChapters = chapters || [];
  const activeChapterData = sortedChapters[activeChapter];

  // Generate visualization from chapter content (data-driven approach)
  // MUST be called before any conditional returns to follow Rules of Hooks
  const contentBasedViz = useMemo(() => {
    if (!activeChapterData) {
      return {
        viz2d: { nodes: [], edges: [], viewport: { width: 900, height: 560 } },
        viz3d: {
          nodes: [],
          connections: [],
          cameraPosition: [0, 2, 16] as const,
        },
      };
    }

    // Priority: use blocks if available, fallback to content_en/content_vi
    const hasBlocks =
      activeChapterData.blocks && activeChapterData.blocks.length > 0;
    if (hasBlocks) {
      return contentToVisualization(
        activeChapterData.blocks,
        vi ? "vi" : "en",
        activeChapterData.title_en
      );
    }

    // Fallback: use text content
    const textContent = vi
      ? activeChapterData.content_vi
      : activeChapterData.content_en;
    return textToVisualization(textContent, activeChapterData.title_en);
  }, [activeChapterData, vi]);

  if (isLoading) {
    return <FullPageLoader />;
  }

  if (!walkthrough) {
    return (
      <EmptyWalkthroughState
        canSeed={isAdmin}
        onSeed={() => seed({})}
        seedLabel={seedLabel}
      />
    );
  }

  // Use generated visualization, with fallback to stored schema
  const viz3dConfig =
    (activeChapterData?.visualization3dSchema as any) ||
    (activeChapterData?.vizConfig as any) ||
    (contentBasedViz.viz3d as any) ||
    (walkthrough.vizConfig as any) ||
    DEFAULT_VIZ;

  const viz2dSchema =
    activeChapterData?.visualization2dSchema || contentBasedViz.viz2d;

  const knowledgeGraph = activeChapterData?.knowledgeGraph;
  const focusLabel = activeChapterData
    ? vi
      ? activeChapterData.title_vi
      : activeChapterData.title_en
    : null;

  return (
    <>
      <WalkthroughLayout
        title={vi ? walkthrough.title_vi : walkthrough.title_en}
        description={
          vi ? walkthrough.description_vi : walkthrough.description_en
        }
        chapters={sortedChapters}
        activeChapter={activeChapter}
        onChapterChange={setActiveChapter}
        locale={locale}
        tocLabel={t("common.tableOfContents")}
        visualization={
          <LessonVizSwitcher
            vizKey={activeChapter}
            viz3d={viz3dConfig}
            viz2d={viz2dSchema}
            knowledgeGraph={knowledgeGraph}
            focusLabel={focusLabel}
          />
        }
      />

      {isAdmin && (
        <button
          onClick={() => setEditorOpen(true)}
          className="btn-edit-floating"
          title={vi ? "Mở trình chỉnh sửa" : "Open Editor"}
        >
          ✏️
        </button>
      )}

      <EditorModal
        isOpen={editorOpen}
        onClose={() => setEditorOpen(false)}
        chapters={sortedChapters}
        walkthroughId={walkthrough._id}
        locale={locale}
      />
    </>
  );
}

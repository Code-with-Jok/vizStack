"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useQuery, useMutation, useAction } from "convex/react";
import { useDebouncedCallback } from "use-debounce";
import dynamic from "next/dynamic";
import { api } from "../../../convex/_generated/api";
import { ArticlePageWith2D3D } from "@/components/ArticlePageWith2D3D";
import { type ArticleSection } from "@/components/ArticlePage";
import { LessonVizSwitcher } from "@/components/LessonVizSwitcher";
import { FullPageLoader } from "@/components/FullPageLoader";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { usePersistedVisualizationMode } from "@/hooks/useVisualizationMode";
import { DEFAULT_VIZ } from "@/constants/viz";
import {
  contentToVisualization,
  textToVisualization,
} from "@/lib/contentToVisualization";

const BlockEditor = dynamic(() => import("@/components/BlockEditor"), {
  ssr: false,
});

interface WalkthroughArticlePageProps {
  courseSlug: string;
  slug: string;
}

export function WalkthroughArticlePage({
  courseSlug,
  slug,
}: WalkthroughArticlePageProps) {
  const t = useTranslations();
  const locale = useLocale();
  const vi = locale === "vi";
  const isAdmin = useIsAdmin();

  const [chapterTitleDrafts, setChapterTitleDrafts] = useState<
    Record<string, string>
  >({});
  const [walkthroughTitleDraft, setWalkthroughTitleDraft] = useState<
    string | null
  >(null);
  const [walkthroughDescriptionDraft, setWalkthroughDescriptionDraft] =
    useState<string | null>(null);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [isGeneratingViz, setIsGeneratingViz] = useState(false);

  const walkthrough = useQuery(api.walkthroughs.getBySlug, {
    courseSlug,
    slug,
  });

  const chapters = useQuery(
    api.chapters.listByWalkthrough,
    walkthrough ? { walkthroughId: walkthrough._id } : "skip"
  );

  const updateChapter = useMutation(api.chapters.update);
  const updateWalkthrough = useMutation(api.walkthroughs.update);
  const generateViz = useAction(api.vizAI.generateVizFromContent);

  const debouncedUpdateChapter = useDebouncedCallback((args) => {
    updateChapter(args);
  }, 1000);

  const debouncedUpdateWalkthrough = useDebouncedCallback((args) => {
    updateWalkthrough(args);
  }, 1000);

  // Compute memoized data BEFORE any conditional returns (Rules of Hooks)
  const sectionChapters = useMemo(() => {
    if (!chapters) return [];
    return [...chapters].sort((a, b) => a.order - b.order);
  }, [chapters]);

  const activeChapter = sectionChapters[activeSectionIndex];

  // Generate visualization from chapter content (data-driven approach)
  // MUST be called before any conditional returns to follow Rules of Hooks
  const contentBasedViz = useMemo(() => {
    if (!activeChapter) {
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
    const hasBlocks = activeChapter.blocks && activeChapter.blocks.length > 0;
    if (hasBlocks) {
      return contentToVisualization(
        activeChapter.blocks,
        vi ? "vi" : "en",
        activeChapter.title_en
      );
    }

    // Fallback: use text content
    const textContent = vi
      ? activeChapter.content_vi
      : activeChapter.content_en;
    return textToVisualization(textContent, activeChapter.title_en);
  }, [activeChapter, vi]);

  if (walkthrough === undefined || chapters === undefined) {
    return <FullPageLoader />;
  }

  if (!walkthrough || !chapters) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-48px)] text-text-muted">
        Walkthrough not found.
      </div>
    );
  }

  type Chapter = NonNullable<typeof chapters>[number];

  useEffect(() => {
    if (activeSectionIndex >= sectionChapters.length) {
      setActiveSectionIndex(0);
    }
  }, [activeSectionIndex, sectionChapters.length]);

  const sections: ArticleSection[] = useMemo(
    () =>
      sectionChapters.map((ch) => ({
        id: ch._id,
        title:
          chapterTitleDrafts[ch._id as string] ??
          (vi ? ch.title_vi : ch.title_en),
        onTitleChange: isAdmin
          ? (val: string) => {
              const key = ch._id as string;
              setChapterTitleDrafts((prev) => ({ ...prev, [key]: val }));
              debouncedUpdateChapter({
                id: ch._id,
                title_en: vi ? ch.title_en : val,
                title_vi: vi ? val : ch.title_vi,
              });
            }
          : undefined,
        content: (
          <div className="flex flex-col relative group">
            {/* Nút Auto-Generate AI đã được di dời sang component EditorModal chung */}
            <BlockEditor
              editable={isAdmin}
              initialContent={vi ? ch.content_vi : ch.content_en}
              onChange={(val) => {
                debouncedUpdateChapter({
                  id: ch._id,
                  content_en: vi ? ch.content_en : val,
                  content_vi: vi ? val : ch.content_vi,
                });
              }}
            />
          </div>
        ),
      })),
    [sectionChapters, chapterTitleDrafts, vi, isAdmin, debouncedUpdateChapter]
  );

  const baseWalkthroughTitle = vi ? walkthrough.title_vi : walkthrough.title_en;
  const effectiveWalkthroughTitle =
    walkthroughTitleDraft ?? baseWalkthroughTitle;

  const baseDescription = vi
    ? walkthrough.description_vi
    : walkthrough.description_en;
  const effectiveDescription = walkthroughDescriptionDraft ?? baseDescription;

  // Use generated visualization, with fallback to stored schema
  const viz3dConfig =
    (activeChapter?.visualization3dSchema as any) ||
    (activeChapter?.vizConfig as any) ||
    (contentBasedViz.viz3d as any) ||
    DEFAULT_VIZ;

  const viz2dSchema =
    activeChapter?.visualization2dSchema || contentBasedViz.viz2d;

  const knowledgeGraph = activeChapter?.knowledgeGraph;
  const focusLabel = sections[activeSectionIndex]?.title ?? null;

  // Determine default viz mode from chapter or walkthrough config
  const defaultVizMode =
    (activeChapter?.vizMode as "2d" | "3d" | "hybrid") ||
    (walkthrough.vizMode as "2d" | "3d" | "hybrid") ||
    "3d";

  // Create 2D and 3D visualization components
  const viz2dComponent = viz2dSchema ? (
    <LessonVizSwitcher
      vizKey={`${activeChapter?._id ?? activeSectionIndex}-2d`}
      viz2d={viz2dSchema}
      knowledgeGraph={knowledgeGraph}
      focusLabel={focusLabel}
    />
  ) : null;

  const viz3dComponent = (
    <LessonVizSwitcher
      vizKey={`${activeChapter?._id ?? activeSectionIndex}-3d`}
      viz3d={viz3dConfig}
      focusLabel={focusLabel}
    />
  );

  return (
    <ArticlePageWith2D3D
      title={effectiveWalkthroughTitle}
      onTitleChange={
        isAdmin
          ? (val) => {
              setWalkthroughTitleDraft(val);
              debouncedUpdateWalkthrough({
                id: walkthrough._id,
                title_en: vi ? walkthrough.title_en : val,
                title_vi: vi ? val : walkthrough.title_vi,
              });
            }
          : undefined
      }
      description={effectiveDescription}
      onDescriptionChange={
        isAdmin
          ? (val) => {
              setWalkthroughDescriptionDraft(val);
              debouncedUpdateWalkthrough({
                id: walkthrough._id,
                description_en: vi ? walkthrough.description_en : val,
                description_vi: vi ? val : walkthrough.description_vi,
              });
            }
          : undefined
      }
      sections={sections}
      visualization3d={viz3dComponent}
      visualization2d={viz2dComponent}
      defaultVizMode={defaultVizMode}
      activeSectionIndex={activeSectionIndex}
      onSectionSelect={setActiveSectionIndex}
      vizUrl={`/${locale}/learn/${courseSlug}/${slug}`}
      vizLabel={t("common.goToViz")}
      tocLabel={t("common.tableOfContents")}
    />
  );
}

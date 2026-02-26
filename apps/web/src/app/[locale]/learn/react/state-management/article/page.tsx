"use client";

import { useTranslations, useLocale } from "next-intl";
import { useQuery, useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "../../../../../../../convex/_generated/api";
import { ArticlePage, ArticleSection } from "@/components/ArticlePage";
import dynamic from "next/dynamic";

const BlockEditor = dynamic(() => import("@/components/BlockEditor"), {
  ssr: false,
});

export default function StateManagementArticle() {
  const t = useTranslations();
  const locale = useLocale();
  const vi = locale === "vi";
  const { user } = useUser();

  const isAdmin =
    !!user &&
    (user.id === process.env.NEXT_PUBLIC_IS_ADMIN ||
      user.primaryEmailAddress?.emailAddress ===
        process.env.NEXT_PUBLIC_IS_ADMIN ||
      user.username === process.env.NEXT_PUBLIC_IS_ADMIN);

  // Query walkthrough + chapters from Convex
  const walkthrough = useQuery(api.walkthroughs.getBySlug, {
    courseSlug: "react",
    slug: "state-management",
  });

  const chapters = useQuery(
    api.chapters.listByWalkthrough,
    walkthrough ? { walkthroughId: walkthrough._id } : "skip"
  );

  const updateChapter = useMutation(api.chapters.update);
  const updateWalkthrough = useMutation(api.walkthroughs.update);

  // Loading state
  if (walkthrough === undefined || chapters === undefined) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          color: "var(--color-text-muted)",
        }}
      >
        Loading...
      </div>
    );
  }

  if (!walkthrough || !chapters) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        Walkthrough not found.
      </div>
    );
  }

  // Map Convex chapters to Article sections
  const sections: ArticleSection[] = chapters
    .sort((a, b) => a.order - b.order)
    .map((ch) => ({
      id: ch._id,
      title: vi ? ch.title_vi : ch.title_en,
      onTitleChange: isAdmin
        ? (val: string) => {
            updateChapter({
              id: ch._id,
              title_en: vi ? ch.title_en : val, // preserve other lang
              title_vi: vi ? val : ch.title_vi,
            });
          }
        : undefined,
      content: (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <BlockEditor
            editable={isAdmin}
            initialContent={vi ? ch.content_vi : ch.content_en}
            onChange={(val) => {
              updateChapter({
                id: ch._id,
                content_en: vi ? ch.content_en : val, // preserve other lang
                content_vi: vi ? val : ch.content_vi,
              });
            }}
          />
        </div>
      ),
    }));

  return (
    <ArticlePage
      title={vi ? walkthrough.title_vi : walkthrough.title_en}
      onTitleChange={
        isAdmin
          ? (val) => {
              updateWalkthrough({
                id: walkthrough._id,
                title_en: vi ? walkthrough.title_en : val,
                title_vi: vi ? val : walkthrough.title_vi,
              });
            }
          : undefined
      }
      description={vi ? walkthrough.description_vi : walkthrough.description_en}
      onDescriptionChange={
        isAdmin
          ? (val) => {
              updateWalkthrough({
                id: walkthrough._id,
                description_en: vi ? walkthrough.description_en : val,
                description_vi: vi ? val : walkthrough.description_vi,
              });
            }
          : undefined
      }
      sections={sections}
      vizUrl={`/${locale}/learn/react/state-management`}
      vizLabel={t("common.goToViz")}
      tocLabel={t("common.tableOfContents")}
    />
  );
}

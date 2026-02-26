"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useLocale } from "next-intl";
import { useUser } from "@clerk/nextjs";
import dynamic from "next/dynamic";
import { api } from "../../../../../../convex/_generated/api";
import { WalkthroughLayout } from "@/components/WalkthroughLayout";
import { EditorModal } from "@/components/EditorModal";

const GenericVizRenderer = dynamic(
  () =>
    import("@/components/GenericVizRenderer").then((m) => ({
      default: m.GenericVizRenderer,
    })),
  { ssr: false }
);

export default function ComponentBasicsPage() {
  const locale = useLocale();
  const [activeChapter, setActiveChapter] = useState(0);
  const [editorOpen, setEditorOpen] = useState(false);
  const { user } = useUser();

  console.log({ user });

  const isAdmin =
    !!user &&
    (user.id === process.env.NEXT_PUBLIC_IS_ADMIN ||
      user.primaryEmailAddress?.emailAddress ===
        process.env.NEXT_PUBLIC_IS_ADMIN ||
      user.username === process.env.NEXT_PUBLIC_IS_ADMIN);

  // Query walkthrough + chapters from Convex
  const walkthrough = useQuery(api.walkthroughs.getBySlug, {
    courseSlug: "react",
    slug: "component-basics",
  });

  const chapters = useQuery(
    api.chapters.listByWalkthrough,
    walkthrough ? { walkthroughId: walkthrough._id } : "skip"
  );

  // Seed button (only shows if no data)
  const seed = useMutation(api.seed.seedComponentBasics);

  // Loading state
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
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              border: "3px solid var(--color-border)",
              borderTop: "3px solid var(--color-accent-cyan)",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 12px",
            }}
          />
          Loading...
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  // No data yet — show seed button
  if (!walkthrough) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "calc(100vh - 48px)",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <p style={{ color: "var(--color-text-secondary)" }}>
          No walkthrough data found.
        </p>
        {isAdmin && (
          <button className="btn-primary" onClick={() => seed()}>
            🌱 Seed Component Basics
          </button>
        )}
      </div>
    );
  }

  const vi = locale === "vi";
  const sortedChapters = [...(chapters || [])].sort(
    (a, b) => a.order - b.order
  );

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
        tocLabel={vi ? "Mục lục" : "Table of Contents"}
        visualization={
          sortedChapters[activeChapter]?.vizConfig ? (
            <GenericVizRenderer
              vizConfig={sortedChapters[activeChapter].vizConfig}
            />
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                color: "var(--color-text-muted)",
                fontSize: "0.85rem",
              }}
            >
              🧠 No 3D visualization yet
            </div>
          )
        }
      />

      {/* Floating edit button - Only for Admins */}
      {isAdmin && (
        <button
          onClick={() => setEditorOpen(true)}
          style={{
            position: "fixed",
            bottom: "56px",
            right: "20px",
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #00d4ff, #7c3aed)",
            color: "#fff",
            border: "none",
            fontSize: "1.2rem",
            cursor: "pointer",
            boxShadow: "0 4px 20px rgba(0,212,255,0.3)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          title={vi ? "Mở trình chỉnh sửa" : "Open Editor"}
        >
          ✏️
        </button>
      )}

      {/* Editor Modal */}
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

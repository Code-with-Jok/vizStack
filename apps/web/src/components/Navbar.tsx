"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { LocaleToggle } from "./LocaleToggle";

export function Navbar() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  // Derive breadcrumbs from pathname
  // e.g. /en/learn/react/hooks → ["learn", "react", "hooks"]
  const segments = pathname.split("/").filter(Boolean);
  // Remove locale prefix
  const routeSegments = segments.slice(1);

  const isHome = routeSegments.length === 0;
  const isCoursePage =
    routeSegments[0] === "learn" && routeSegments.length === 2;
  const isLessonPage =
    routeSegments[0] === "learn" && routeSegments.length >= 3;
  const isArticlePage = routeSegments.includes("article");

  // Course key for breadcrumb
  const courseKey = routeSegments[1]; // "react" or "nextjs"
  const lessonSlug = routeSegments[2]; // "hooks", "component-basics", etc.

  // Map slug to a readable name via i18n
  const courseTitle = courseKey
    ? (() => {
        try {
          return t(`courses.${courseKey}.title`);
        } catch {
          return courseKey;
        }
      })()
    : "";

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 24px",
        borderBottom: "1px solid var(--color-border)",
        background: "rgba(10, 10, 15, 0.88)",
        backdropFilter: "blur(16px)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        minHeight: "48px",
        flexShrink: 0,
      }}
    >
      {/* Left: Logo + Breadcrumbs */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          minWidth: 0,
        }}
      >
        {/* Logo */}
        <span
          onClick={() => router.push(`/${locale}`)}
          style={{
            fontSize: "1.1rem",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            cursor: "pointer",
            background:
              "linear-gradient(135deg, var(--color-accent-cyan), var(--color-accent-purple))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            flexShrink: 0,
          }}
        >
          VizStack
        </span>

        {/* Breadcrumb separator + course */}
        {(isCoursePage || isLessonPage) && (
          <>
            <span
              style={{ color: "var(--color-text-muted)", fontSize: "0.85rem" }}
            >
              /
            </span>
            <span
              onClick={() => router.push(`/${locale}/learn/${courseKey}`)}
              style={{
                color: isLessonPage
                  ? "var(--color-text-muted)"
                  : "var(--color-accent-cyan)",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
                textDecoration: "none",
                transition: "color 0.2s",
                whiteSpace: "nowrap",
              }}
            >
              {courseTitle}
            </span>
          </>
        )}

        {/* Lesson breadcrumb */}
        {isLessonPage && lessonSlug && (
          <>
            <span
              style={{ color: "var(--color-text-muted)", fontSize: "0.85rem" }}
            >
              /
            </span>
            <span
              style={{
                color: isArticlePage
                  ? "var(--color-text-muted)"
                  : "var(--color-accent-cyan)",
                fontSize: "0.85rem",
                fontWeight: 500,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {lessonSlug
                .replace(/-/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase())}
            </span>
          </>
        )}

        {/* Article badge */}
        {isArticlePage && (
          <>
            <span
              style={{ color: "var(--color-text-muted)", fontSize: "0.85rem" }}
            >
              /
            </span>
            <span
              style={{
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "var(--color-accent-green)",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              📖 Article
            </span>
          </>
        )}
      </div>

      {/* Right: Actions */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          flexShrink: 0,
        }}
      >
        {/* Article link on lesson pages (not on article pages themselves) */}
        {isLessonPage && !isArticlePage && lessonSlug && (
          <button
            onClick={() =>
              router.push(`/${locale}/learn/${courseKey}/${lessonSlug}/article`)
            }
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "5px 12px",
              background: "var(--color-bg-card)",
              border: "1px solid var(--color-border)",
              borderRadius: "8px",
              color: "var(--color-text-secondary)",
              cursor: "pointer",
              fontSize: "0.8rem",
              fontWeight: 500,
              transition: "all 0.2s ease",
            }}
          >
            📖{" "}
            {(() => {
              try {
                return t("common.article");
              } catch {
                return "Theory";
              }
            })()}
          </button>
        )}

        {/* Viz link on article pages */}
        {isArticlePage && lessonSlug && (
          <button
            onClick={() =>
              router.push(`/${locale}/learn/${courseKey}/${lessonSlug}`)
            }
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "5px 12px",
              background:
                "linear-gradient(135deg, var(--color-accent-cyan), var(--color-accent-purple))",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
              cursor: "pointer",
              fontSize: "0.8rem",
              fontWeight: 600,
              transition: "all 0.2s ease",
            }}
          >
            🧊 3D Viz
          </button>
        )}

        <LocaleToggle />

        {/* Auth */}
        <div className="ml-2 flex items-center">
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button
                style={{
                  display: "inline-block",
                  padding: "6px 16px",
                  borderRadius: "20px",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: "var(--color-accent-cyan)",
                  border: "1px solid var(--color-border-hover)",
                  background: "var(--color-glow-cyan)",
                }}
              >
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
}

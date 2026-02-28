"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { LocaleToggle } from "./LocaleToggle";
import { cn } from "@/lib/cn";

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

  const lessonTitle =
    lessonSlug
      ?.replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()) ?? "";

  return (
    <nav className="navbar">
      {/* Left: Logo + Breadcrumbs */}
      <div className="navbar-left">
        {/* Logo */}
        <span
          onClick={() => router.push(`/${locale}`)}
          className="navbar-logo"
        >
          VizStack
        </span>

        {/* Breadcrumb separator + course */}
        {(isCoursePage || isLessonPage) && (
          <>
            <span className="navbar-separator">/</span>
            <span
              onClick={() => router.push(`/${locale}/learn/${courseKey}`)}
              className={cn(
                "navbar-course-link",
                isLessonPage && "navbar-course-link-muted"
              )}
            >
              {courseTitle}
            </span>
          </>
        )}

        {/* Lesson breadcrumb */}
        {isLessonPage && lessonSlug && (
          <>
            <span className="navbar-separator">/</span>
            <span
              className={cn(
                "navbar-lesson-title",
                isArticlePage ? "navbar-lesson-muted" : "navbar-lesson-active"
              )}
            >
              {lessonTitle}
            </span>
          </>
        )}

        {/* Article badge */}
        {isArticlePage && (
          <>
            <span className="navbar-separator">/</span>
            <span className="navbar-article-badge">
              📖 {t("navbar.article")}
            </span>
          </>
        )}
      </div>

      {/* Right: Actions */}
      <div className="navbar-right">
        {/* Article link on lesson pages (not on article pages themselves) */}
        {isLessonPage && !isArticlePage && lessonSlug && (
          <button
            onClick={() =>
              router.push(`/${locale}/learn/${courseKey}/${lessonSlug}/article`)
            }
            className={cn("navbar-pill-button", "navbar-pill-ghost")}
          >
            📖 {t("navbar.theory")}
          </button>
        )}

        {/* Viz link on article pages */}
        {isArticlePage && lessonSlug && (
          <button
            onClick={() =>
              router.push(`/${locale}/learn/${courseKey}/${lessonSlug}`)
            }
            className={cn("navbar-pill-button", "navbar-pill-primary")}
          >
            🧊 {t("navbar.viz3d")}
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
              <button className="btn-secondary">
                {t("navbar.signIn")}
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
}

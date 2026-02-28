"use client";

import type { CSSProperties } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { COURSES } from "@/modules/learn/courses";

export default function LandingPage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();

  return (
    <div className="dot-grid dot-grid-full relative">
      {/* Hero */}
      <section className="landing-hero">
        <span className="landing-hero-tag">✦ {t("landing.heroTag")}</span>

        <h1 className="landing-title">
          <span className="glow-text">{t("landing.title")}</span>
        </h1>

        <p className="landing-subtitle">{t("landing.subtitle")}</p>

        <div className="landing-hero-actions">
          <button
            className="btn-primary"
            onClick={() => router.push(`/${locale}/learn/react`)}
          >
            {t("common.startLearning")} →
          </button>
          <button
            className="btn-secondary"
            onClick={() => {
              document
                .getElementById("courses-section")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            {t("landing.exploreCourses")}
          </button>
        </div>
      </section>

      {/* Course Cards */}
      <section id="courses-section" className="landing-courses">
        <h2 className="landing-courses-title">{t("landing.featuredCourse")}</h2>

        <div className="landing-course-list">
          {COURSES.map((course) => (
            <Link
              key={course.key}
              href={`/${locale}/learn/${course.slug}`}
              className="glass-card landing-course-card"
              style={
                {
                  "--course-color": course.accentColor,
                  "--course-gradient": course.gradient,
                } as CSSProperties
              }
            >
              <div className="landing-course-card-inner">
                <div className="landing-course-icon">{course.icon}</div>

                <div className="landing-course-body">
                  <h3 className="landing-course-title">
                    {t(`courses.${course.key}.title`)}
                  </h3>
                  <p className="landing-course-description">
                    {t(`courses.${course.key}.description`)}
                  </p>

                  <div className="landing-course-tags">
                    {course.featuredTags.map((tag) => (
                      <span key={tag} className="landing-course-tag-pill">
                        {t(`courses.${course.key}.sections.${tag}`)}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="landing-course-arrow">→</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">{t("landing.footer")}</footer>
    </div>
  );
}

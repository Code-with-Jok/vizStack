"use client";

import type { CSSProperties } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { reactCourse } from "@/modules/learn/reactCourse";

export default function ReactCoursePage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const course = reactCourse;

  return (
    <div className="dot-grid dot-grid-full">
      {/* Header */}
      <section className="react-course-header">
        <div className="react-course-logo">{course.icon}</div>
        <h1 className="glow-text react-course-title">
          {t(`courses.${course.key}.title`)}
        </h1>
        <p className="react-course-description">
          {t(`courses.${course.key}.description`)}
        </p>
      </section>

      {/* Lessons Grid */}
      <section className="react-course-grid-section">
        <div className="react-course-grid">
          {course.sections.map((section) => (
            <div
              key={section.key}
              style={
                {
                  "--section-color": section.colorVar,
                } as CSSProperties
              }
              className={cn(
                "glass-card react-course-card",
                !section.ready && "react-course-card-disabled"
              )}
              onClick={() => {
                if (section.ready && section.slug) {
                  router.push(`/${locale}/learn/react/${section.slug}`);
                }
              }}
            >
              <div className="react-course-card-header">
                <span className="react-course-card-icon">
                  {section.icon}
                </span>
                <div>
                  <h3 className="react-course-card-title">
                    {t(`courses.${course.key}.sections.${section.key}`)}
                  </h3>
                  {!section.ready && (
                    <span className="react-course-card-coming-soon">
                      {t("common.comingSoon")}
                    </span>
                  )}
                </div>
              </div>
              <div className="react-course-topics">
                {section.topics.map((topic) => (
                  <span key={topic} className="react-course-topic-pill">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

"use client";

import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";

const COURSES = [
  {
    key: "react",
    icon: "⚛️",
    gradient: "linear-gradient(135deg, #61dafb, #7c3aed)",
    tags: ["componentBasics", "hooks", "stateManagement", "rendering"],
    tagColor: "#61dafb",
    slug: "react",
  },
];

export default function LandingPage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();

  return (
    <div className="dot-grid" style={{ minHeight: "100vh" }}>
      {/* Hero */}
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "100px 24px 60px",
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <span
          style={{
            display: "inline-block",
            padding: "6px 16px",
            borderRadius: "20px",
            fontSize: "0.8rem",
            fontWeight: 600,
            color: "var(--color-accent-cyan)",
            border: "1px solid var(--color-border-hover)",
            background: "var(--color-glow-cyan)",
            marginBottom: "24px",
          }}
        >
          ✦ {t("landing.heroTag")}
        </span>

        <h1
          style={{
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            marginBottom: "24px",
            whiteSpace: "pre-line",
          }}
        >
          <span className="glow-text">{t("landing.title")}</span>
        </h1>

        <p
          style={{
            fontSize: "1.15rem",
            lineHeight: 1.7,
            color: "var(--color-text-secondary)",
            maxWidth: "640px",
            marginBottom: "40px",
          }}
        >
          {t("landing.subtitle")}
        </p>

        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
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
      <section
        id="courses-section"
        style={{
          padding: "40px 24px 100px",
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            fontSize: "0.85rem",
            color: "var(--color-text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          {t("landing.featuredCourse")}
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {COURSES.map((course) => (
            <Link
              key={course.key}
              href={`/${locale}/learn/${course.slug}`}
              className="glass-card"
              style={{
                padding: "32px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                display: "block",
                textDecoration: "none",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "24px",
                }}
              >
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "14px",
                    background: course.gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                    flexShrink: 0,
                  }}
                >
                  {course.icon}
                </div>

                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      marginBottom: "8px",
                      color: "var(--color-text-primary)",
                    }}
                  >
                    {t(`courses.${course.key}.title`)}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.95rem",
                      lineHeight: 1.6,
                      color: "var(--color-text-secondary)",
                      marginBottom: "16px",
                    }}
                  >
                    {t(`courses.${course.key}.description`)}
                  </p>

                  <div
                    style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}
                  >
                    {course.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          padding: "4px 12px",
                          borderRadius: "6px",
                          fontSize: "0.75rem",
                          fontWeight: 500,
                          color: course.tagColor,
                          background: `${course.tagColor}15`,
                          border: `1px solid ${course.tagColor}20`,
                        }}
                      >
                        {t(`courses.${course.key}.sections.${tag}`)}
                      </span>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    fontSize: "1.2rem",
                    color: "var(--color-text-muted)",
                    alignSelf: "center",
                  }}
                >
                  →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid var(--color-border)",
          padding: "24px 40px",
          textAlign: "center",
          fontSize: "0.8rem",
          color: "var(--color-text-muted)",
        }}
      >
        {t("landing.footer")}
      </footer>
    </div>
  );
}

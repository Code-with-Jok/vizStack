"use client";

import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";

const SECTIONS = [
  {
    key: "componentBasics",
    icon: "🧩",
    color: "#00d4ff",
    slug: "component-basics",
    ready: true,
    topics: ["JSX", "Props vs State", "Conditional Rendering", "Composition"],
  },
  {
    key: "rendering",
    icon: "🖼️",
    color: "#7c3aed",
    slug: "rendering",
    ready: true,
    topics: [
      "Component Lifecycle",
      "Lists & Keys",
      "Render Props",
      "Refs",
      "Events",
    ],
  },
  {
    key: "hooks",
    icon: "🪝",
    color: "#10b981",
    slug: "hooks",
    ready: true,
    topics: [
      "useState",
      "useEffect",
      "useRef",
      "useMemo",
      "useContext",
      "Custom Hooks",
    ],
  },
  {
    key: "stateManagement",
    icon: "🗄️",
    color: "#f59e0b",
    slug: "state-management",
    ready: true,
    topics: ["Context", "Zustand", "Jotai", "MobX"],
  },
  {
    key: "routers",
    icon: "🧭",
    color: "#ec4899",
    slug: "routers",
    ready: true,
    topics: ["React Router", "Tanstack Router"],
  },
  {
    key: "writingCss",
    icon: "🎨",
    color: "#06b6d4",
    slug: "writing-css",
    ready: true,
    topics: ["CSS Modules", "Tailwind CSS", "Panda CSS"],
  },
  {
    key: "componentLibraries",
    icon: "📦",
    color: "#8b5cf6",
    slug: "component-libraries",
    ready: true,
    topics: ["Material UI", "Shadcn UI", "Chakra UI"],
  },
  {
    key: "apiCalls",
    icon: "🌐",
    color: "#14b8a6",
    slug: "api-calls",
    ready: true,
    topics: ["Axios", "react-query", "SWR", "Apollo", "RTK Query"],
  },
  {
    key: "forms",
    icon: "📝",
    color: "#f97316",
    slug: "forms",
    ready: true,
    topics: ["React Hook Form", "Formik"],
  },
  {
    key: "testing",
    icon: "🧪",
    color: "#22c55e",
    slug: "testing",
    ready: true,
    topics: ["Vitest", "Jest", "Cypress", "Playwright"],
  },
  {
    key: "typesValidation",
    icon: "🔒",
    color: "#3b82f6",
    slug: "types-validation",
    ready: true,
    topics: ["TypeScript", "Zod"],
  },
  {
    key: "frameworks",
    icon: "🏗️",
    color: "#a855f7",
    slug: "frameworks",
    ready: true,
    topics: ["Next.js", "Astro", "react-router"],
  },
  {
    key: "advancedTopics",
    icon: "🚀",
    color: "#ef4444",
    slug: "advanced-topics",
    ready: true,
    topics: ["Suspense", "Portals", "Error Boundaries", "Server APIs"],
  },
  {
    key: "animation",
    icon: "✨",
    color: "#eab308",
    slug: "animation",
    ready: true,
    topics: ["Framer Motion", "react-spring", "GSAP"],
  },
  {
    key: "mobile",
    icon: "📱",
    color: "#06b6d4",
    slug: "mobile",
    ready: true,
    topics: ["React Native"],
  },
];

export default function ReactCoursePage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();

  return (
    <div className="dot-grid" style={{ minHeight: "100vh" }}>
      {/* Header */}
      <section
        style={{
          textAlign: "center",
          padding: "60px 24px 40px",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "18px",
            background: "linear-gradient(135deg, #61dafb, #7c3aed)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2rem",
            margin: "0 auto 20px",
          }}
        >
          ⚛️
        </div>
        <h1
          className="glow-text"
          style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "12px" }}
        >
          {t("courses.react.title")}
        </h1>
        <p
          style={{
            color: "var(--color-text-secondary)",
            fontSize: "1rem",
            lineHeight: 1.7,
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          {t("courses.react.description")}
        </p>
      </section>

      {/* Lessons Grid */}
      <section
        style={{
          padding: "20px 40px 80px",
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "16px",
          }}
        >
          {SECTIONS.map((section) => (
            <div
              key={section.key}
              className="glass-card"
              style={{
                padding: "24px",
                cursor: section.ready ? "pointer" : "default",
                opacity: section.ready ? 1 : 0.5,
                transition: "all 0.3s ease",
              }}
              onClick={() => {
                if (section.ready && section.slug) {
                  router.push(`/${locale}/learn/react/${section.slug}`);
                }
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "12px",
                }}
              >
                <span
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    background: `${section.color}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.2rem",
                  }}
                >
                  {section.icon}
                </span>
                <div>
                  <h3
                    style={{
                      fontSize: "1rem",
                      fontWeight: 600,
                      color: "var(--color-text-primary)",
                    }}
                  >
                    {t(`courses.react.sections.${section.key}`)}
                  </h3>
                  {!section.ready && (
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--color-text-muted)",
                        fontStyle: "italic",
                      }}
                    >
                      {t("common.comingSoon")}
                    </span>
                  )}
                </div>
              </div>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {section.topics.map((topic) => (
                  <span
                    key={topic}
                    style={{
                      padding: "2px 8px",
                      borderRadius: "4px",
                      fontSize: "0.7rem",
                      color: section.color,
                      background: `${section.color}10`,
                      border: `1px solid ${section.color}20`,
                    }}
                  >
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

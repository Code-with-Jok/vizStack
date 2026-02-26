"use client";

import { useState } from "react";

interface SidebarLink {
  id: string;
  label: string;
  href: string;
  active?: boolean;
}

interface SidebarSection {
  title: string;
  links: SidebarLink[];
}

interface SidebarProps {
  sections: SidebarSection[];
  courseTitle: string;
  onNavigate?: (href: string) => void;
}

export function Sidebar({ sections, courseTitle, onNavigate }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      style={{
        width: collapsed ? "60px" : "260px",
        height: "100vh",
        background: "var(--color-bg-secondary)",
        borderRight: "1px solid var(--color-border)",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.3s ease",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px",
          borderBottom: "1px solid var(--color-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: "56px",
        }}
      >
        {!collapsed && (
          <span
            style={{
              fontSize: "0.875rem",
              fontWeight: 700,
              background:
                "linear-gradient(135deg, var(--color-accent-cyan), var(--color-accent-purple))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              whiteSpace: "nowrap",
            }}
          >
            {courseTitle}
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--color-text-muted)",
            cursor: "pointer",
            fontSize: "1.2rem",
            padding: "4px",
          }}
        >
          {collapsed ? "→" : "←"}
        </button>
      </div>

      {/* Navigation */}
      {!collapsed && (
        <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
          {sections.map((section, i) => (
            <div key={i} style={{ marginBottom: "16px" }}>
              <div
                style={{
                  fontSize: "0.7rem",
                  color: "var(--color-text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  padding: "4px 12px",
                  fontWeight: 600,
                }}
              >
                {section.title}
              </div>
              {section.links.map((link) => (
                <button
                  key={link.id}
                  onClick={() => onNavigate?.(link.href)}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "8px 12px",
                    fontSize: "0.85rem",
                    color: link.active
                      ? "var(--color-accent-cyan)"
                      : "var(--color-text-secondary)",
                    background: link.active
                      ? "var(--color-glow-cyan)"
                      : "transparent",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    fontWeight: link.active ? 600 : 400,
                  }}
                >
                  {link.label}
                </button>
              ))}
            </div>
          ))}
        </nav>
      )}
    </aside>
  );
}

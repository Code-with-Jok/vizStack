"use client";

import { ReactNode } from "react";

interface LessonLayoutProps {
  visualization: ReactNode;
  controls: ReactNode;
}

export function LessonLayout({ visualization, controls }: LessonLayoutProps) {
  return (
    <div
      style={{
        display: "flex",
        height: "calc(100vh - 48px)",
        width: "100%",
        overflow: "hidden",
      }}
    >
      {/* 3D Visualization Panel */}
      <div
        style={{
          flex: 1,
          position: "relative",
          background: "var(--color-bg-primary)",
        }}
      >
        {visualization}
      </div>

      {/* Step Controller Panel */}
      <div
        style={{
          width: "380px",
          minWidth: "320px",
          flexShrink: 0,
        }}
      >
        {controls}
      </div>
    </div>
  );
}

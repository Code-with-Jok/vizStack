"use client";

import type { ReactNode } from "react";

interface VizModeToggleProps {
  mode: "2d" | "3d" | "hybrid";
  onMode2D: () => void;
  onMode3D: () => void;
  onModeHybrid?: () => void;
  className?: string;
  showLabels?: boolean;
}

/**
 * VizModeToggle - UI component for switching between 2D/3D visualization
 */
export function VizModeToggle({
  mode,
  onMode2D,
  onMode3D,
  onModeHybrid,
  className,
  showLabels = true,
}: VizModeToggleProps) {
  return (
    <div className={`viz-mode-toggle ${className || ""}`}>
      <button
        className={`${
          mode === "2d"
            ? "bg-cyan-500 text-white"
            : "bg-neutral-50 text-neutral-700"
        } rounded-md px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer`}
        onClick={onMode2D}
        title="2D Knowledge Graph"
      >
        {showLabels ? "📊 2D" : "2D"}
      </button>

      <button
        className={`${
          mode === "3d"
            ? "bg-cyan-500 text-white"
            : "bg-neutral-50 text-neutral-700"
        } rounded-md px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer`}
        onClick={onMode3D}
        title="3D Interactive Scene"
      >
        {showLabels ? "🎯 3D" : "3D"}
      </button>

      {onModeHybrid && (
        <button
          className={`${
            mode === "hybrid"
              ? "bg-cyan-500 text-white"
              : "bg-neutral-50 text-neutral-700"
          } rounded-md px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer`}
          onClick={onModeHybrid}
          title="Hybrid 2D + 3D"
        >
          {showLabels ? "🔄 Hybrid" : "Hybrid"}
        </button>
      )}
    </div>
  );
}

/**
 * VisualizationRenderer - Renders appropriate visualization based on mode
 */
interface VisualizationRendererProps {
  mode: "2d" | "3d" | "hybrid";
  viz2d: ReactNode;
  viz3d: ReactNode;
  className?: string;
}

export function VisualizationRenderer({
  mode,
  viz2d,
  viz3d,
  className,
}: VisualizationRendererProps) {
  if (mode === "hybrid") {
    return (
      <div className={`grid grid-cols-2 gap-4 ${className || ""}`}>
        <div className="rounded-lg border border-neutral-200 overflow-hidden">
          {viz2d}
        </div>
        <div className="rounded-lg border border-neutral-200 overflow-hidden">
          {viz3d}
        </div>
      </div>
    );
  }

  if (mode === "2d") {
    return <div className={className}>{viz2d}</div>;
  }

  return <div className={className}>{viz3d}</div>;
}

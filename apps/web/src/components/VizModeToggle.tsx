"use client";

import type { ReactNode } from "react";

interface VizModeToggleProps {
  mode: "2d" | "3d" | "hybrid";
  onMode2D: () => void;
  onMode3D: () => void;
  onModeHybrid?: () => void;
  className?: string;
  showLabels?: boolean;
  is2dDisabled?: boolean;
  is3dDisabled?: boolean;
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
  is2dDisabled = false,
  is3dDisabled = false,
}: VizModeToggleProps) {
  const btnClass =
    "rounded-md px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className={`viz-mode-toggle flex gap-2 ${className || ""}`}>
      <button
        type="button"
        className={`${
          mode === "2d"
            ? "bg-cyan-500 text-white"
            : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
        } ${btnClass}`}
        onClick={onMode2D}
        disabled={is2dDisabled}
        aria-pressed={mode === "2d"}
        title="2D Knowledge Graph"
      >
        {showLabels ? "📊 2D" : "2D"}
      </button>

      <button
        type="button"
        className={`${
          mode === "3d"
            ? "bg-cyan-500 text-white"
            : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
        } ${btnClass}`}
        onClick={onMode3D}
        disabled={is3dDisabled}
        aria-pressed={mode === "3d"}
        title="3D Interactive Scene"
      >
        {showLabels ? "🎯 3D" : "3D"}
      </button>

      {onModeHybrid && (
        <button
          type="button"
          className={`${
            mode === "hybrid"
              ? "bg-cyan-500 text-white"
              : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
          } ${btnClass}`}
          onClick={onModeHybrid}
          disabled={is2dDisabled || is3dDisabled}
          aria-pressed={mode === "hybrid"}
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

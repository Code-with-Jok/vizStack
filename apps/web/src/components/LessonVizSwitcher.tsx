"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/cn";
import { DEFAULT_VIZ } from "@/constants/viz";
import { type Viz2dSchema } from "@/components/GenericViz2D";
import {
  InteractiveViz2D,
  type KnowledgeGraphData,
} from "@/components/InteractiveViz2D";
import type { VizConfig } from "@/components/GenericVizRenderer";
import { findBestMatchIndex, normalizeText } from "@/lib/textMatch";

const GenericVizRenderer = dynamic(
  () =>
    import("@/components/GenericVizRenderer").then((m) => ({
      default: m.GenericVizRenderer,
    })),
  { ssr: false }
);

type VizMode = "2d" | "3d";

interface LessonVizSwitcherProps {
  viz3d?: VizConfig | null;
  viz2d?: Viz2dSchema | null;
  knowledgeGraph?: KnowledgeGraphData | null;
  focusLabel?: string | null;
  onNodeFocusLabel?: (label: string) => void;
  initialMode?: VizMode;
  className?: string;
  vizKey?: string | number;
}

export const build2dFrom3d = (viz: VizConfig): Viz2dSchema => {
  const edges = viz.connections
    .map((conn) => {
      const from = viz.nodes[conn.fromIndex];
      const to = viz.nodes[conn.toIndex];
      if (!from || !to) return null;
      return { fromId: from.id, toId: to.id };
    })
    .filter(Boolean) as Viz2dSchema["edges"];

  return {
    nodes: viz.nodes.map((node) => ({
      id: node.id,
      label: node.label,
      x: node.x,
      y: node.y,
      color: node.color,
      width: node.width,
      height: node.height,
    })),
    edges,
  };
};

const findBestNodeId = (focusLabel: string, nodes: Viz2dSchema["nodes"]) => {
  const normalizedFocus = normalizeText(focusLabel);
  if (!normalizedFocus) return null;
  const bestIndex = findBestMatchIndex(focusLabel, nodes, (node) => node.label);
  return bestIndex >= 0 ? (nodes[bestIndex]?.id ?? null) : null;
};

export function LessonVizSwitcher({
  viz3d,
  viz2d,
  knowledgeGraph,
  focusLabel,
  onNodeFocusLabel,
  initialMode = "3d",
  className,
  vizKey,
}: LessonVizSwitcherProps) {
  const resolved3d = viz3d ?? DEFAULT_VIZ;
  const resolved2d = useMemo(
    () => viz2d ?? build2dFrom3d(resolved3d),
    [viz2d, resolved3d]
  );
  const [mode, setMode] = useState<VizMode>(initialMode);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const mapTitle =
    knowledgeGraph?.lesson?.title ?? focusLabel ?? "Interactive Knowledge Map";

  const handleNodeSelect = (nodeId: string | null) => {
    if (!nodeId) {
      setSelectedNodeId(null);
      return;
    }

    const nextNodeId = selectedNodeId === nodeId ? null : nodeId;
    setSelectedNodeId(nextNodeId);

    if (nextNodeId) {
      const label = resolved2d.nodes.find((node) => node.id === nodeId)?.label;
      if (label) {
        onNodeFocusLabel?.(label);
      }
    }
  };

  useEffect(() => {
    if (mode === "2d" && resolved2d.nodes.length === 0) {
      setMode("3d");
    }
  }, [mode, resolved2d.nodes.length]);

  const focusNodeId = useMemo(() => {
    if (!focusLabel) return null;
    return findBestNodeId(focusLabel, resolved2d.nodes);
  }, [focusLabel, resolved2d.nodes]);

  useEffect(() => {
    if (focusLabel) {
      setSelectedNodeId(focusNodeId);
    } else if (vizKey !== undefined) {
      setSelectedNodeId(null);
    }
  }, [focusLabel, focusNodeId, vizKey]);

  const keyBase = vizKey ?? "viz";

  return (
    <div className={cn("viz-switcher", className)}>
      <div className="viz-toggle" role="tablist" aria-label="Viz mode">
        <button
          type="button"
          className={cn(
            "viz-toggle-button",
            mode === "2d" && "viz-toggle-button-active"
          )}
          onClick={() => setMode("2d")}
          aria-pressed={mode === "2d"}
        >
          2D
        </button>
        <button
          type="button"
          className={cn(
            "viz-toggle-button",
            mode === "3d" && "viz-toggle-button-active"
          )}
          onClick={() => setMode("3d")}
          aria-pressed={mode === "3d"}
        >
          3D
        </button>
      </div>

      <div className="viz-stage">
        {mode === "2d" ? (
          <InteractiveViz2D
            key={`${keyBase}-2d`}
            schema={resolved2d}
            knowledgeGraph={knowledgeGraph}
            selectedNodeId={selectedNodeId}
            onNodeSelect={handleNodeSelect}
            onRequest3D={() => setMode("3d")}
            title={mapTitle}
          />
        ) : (
          <GenericVizRenderer
            key={`${keyBase}-3d`}
            vizConfig={resolved3d}
            selectedNodeId={selectedNodeId}
            onNodeSelect={(nodeId) => handleNodeSelect(nodeId)}
          />
        )}
      </div>
    </div>
  );
}

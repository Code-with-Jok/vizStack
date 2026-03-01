"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { themeColors } from "@/theme/colors";
import { GenericViz2D, type Viz2dSchema } from "./GenericViz2D";

export interface KnowledgeGraphNode {
  id: string;
  label: string;
  type?: string;
}

export interface KnowledgeGraphEdge {
  from: string;
  to: string;
  relation?: string;
}

export interface KnowledgeGraphData {
  module?: { id: string; title: string };
  chapter?: { id: string; title: string };
  lesson?: { id: string; title: string };
  nodes: KnowledgeGraphNode[];
  edges: KnowledgeGraphEdge[];
}

interface InteractiveViz2DProps {
  schema: Viz2dSchema;
  knowledgeGraph?: KnowledgeGraphData | null;
  selectedNodeId?: string | null;
  onNodeSelect?: (nodeId: string | null) => void;
  onRequest3D?: () => void;
  className?: string;
  title?: string;
}

type Mode = "flow" | "concept";

const LEGEND_ITEMS = [
  { label: "Concept", color: themeColors.accentCyanBright },
  { label: "Relation", color: themeColors.accentOrangeWarm },
  { label: "Focus", color: themeColors.accentPink },
];

export function InteractiveViz2D({
  schema,
  knowledgeGraph,
  selectedNodeId,
  onNodeSelect,
  onRequest3D,
  className,
  title = "Interactive Knowledge Map",
}: InteractiveViz2DProps) {
  const [mode, setMode] = useState<Mode>("flow");
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const nodeDetails = useMemo(() => {
    if (!selectedNodeId) return null;
    const targetId = selectedNodeId;

    const schemaNode = schema.nodes.find((node) => node.id === targetId);
    if (!schemaNode) return null;

    const graphNodes = knowledgeGraph?.nodes ?? [];
    const graphEdges = knowledgeGraph?.edges ?? [];
    const graphNode = graphNodes.find((node) => node.id === targetId);

    const outgoing = graphEdges.filter((edge) => edge.from === targetId);
    const incoming = graphEdges.filter((edge) => edge.to === targetId);

    const relatedIds = new Set<string>();
    outgoing.forEach((edge) => relatedIds.add(edge.to));
    incoming.forEach((edge) => relatedIds.add(edge.from));

    if (relatedIds.size === 0) {
      schema.edges.forEach((edge) => {
        if (edge.fromId === targetId) relatedIds.add(edge.toId);
        if (edge.toId === targetId) relatedIds.add(edge.fromId);
      });
    }

    const related = Array.from(relatedIds)
      .map((id) => {
        const graphLabel = graphNodes.find((node) => node.id === id)?.label;
        const schemaLabel = schema.nodes.find((node) => node.id === id)?.label;
        return graphLabel ?? schemaLabel ?? id;
      })
      .slice(0, 6);

    return {
      id: schemaNode.id,
      label: schemaNode.label,
      type: graphNode?.type ?? "concept",
      incoming: incoming.length,
      outgoing: outgoing.length,
      related,
    };
  }, [knowledgeGraph, schema.edges, schema.nodes, selectedNodeId]);

  const handleNodeSelect = (nodeId: string | null) => {
    if (!nodeId) {
      onNodeSelect?.(null);
      return;
    }
    if (selectedNodeId === nodeId) {
      onNodeSelect?.(null);
      return;
    }
    onNodeSelect?.(nodeId);
  };

  return (
    <div className={cn("viz-2d-shell", className)} data-mode={mode}>
      <div className="viz-2d-header">
        <div className="viz-2d-title">{title}</div>
        <div className="viz-2d-mode">
          <button
            type="button"
            className={cn(
              "viz-2d-mode-button",
              mode === "flow" && "viz-2d-mode-button-active"
            )}
            onClick={() => setMode("flow")}
          >
            Flow
          </button>
          <button
            type="button"
            className={cn(
              "viz-2d-mode-button",
              mode === "concept" && "viz-2d-mode-button-active"
            )}
            onClick={() => setMode("concept")}
          >
            Concepts
          </button>
        </div>
      </div>

      <div className="viz-2d-legend">
        {LEGEND_ITEMS.map((item) => (
          <div key={item.label} className="viz-2d-legend-item">
            <span
              className="viz-2d-legend-dot"
              style={{ backgroundColor: item.color }}
            />
            <span>{item.label}</span>
          </div>
        ))}
        <span className="viz-2d-hint">Click a node to explore.</span>
      </div>

      <div className="viz-2d-canvas">
        <GenericViz2D
          schema={schema}
          selectedNodeId={selectedNodeId}
          hoveredNodeId={hoveredNodeId}
          onNodeSelect={handleNodeSelect}
          onNodeHover={setHoveredNodeId}
          showEdges={mode === "flow"}
          animateEdges={mode === "flow"}
        />
      </div>

      {nodeDetails && (
        <div className="viz-2d-panel">
          <div className="viz-2d-panel-header">
            <div>
              <div className="viz-2d-panel-title">{nodeDetails.label}</div>
              <div className="viz-2d-panel-subtitle">{nodeDetails.type}</div>
            </div>
            <button
              type="button"
              className="viz-2d-panel-close"
              onClick={() => onNodeSelect?.(null)}
            >
              x
            </button>
          </div>

          <div className="viz-2d-panel-stats">
            <div className="viz-2d-stat">
              <span>Incoming</span>
              <strong>{nodeDetails.incoming}</strong>
            </div>
            <div className="viz-2d-stat">
              <span>Outgoing</span>
              <strong>{nodeDetails.outgoing}</strong>
            </div>
          </div>

          {nodeDetails.related.length > 0 && (
            <div className="viz-2d-panel-relations">
              {nodeDetails.related.map((label) => (
                <span key={label} className="viz-2d-pill">
                  {label}
                </span>
              ))}
            </div>
          )}

          {onRequest3D && (
            <button
              type="button"
              className="viz-2d-action"
              onClick={onRequest3D}
            >
              Focus in 3D
            </button>
          )}
        </div>
      )}
    </div>
  );
}

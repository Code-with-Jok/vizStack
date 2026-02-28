"use client";

import { useMemo } from "react";
import { cn } from "@/lib/cn";
import { themeColors } from "@/theme/colors";

export interface Viz2dNode {
  id: string;
  label: string;
  x: number;
  y: number;
  color: string;
  width?: number;
  height?: number;
}

export interface Viz2dEdge {
  fromId: string;
  toId: string;
  label?: string;
}

export interface Viz2dSchema {
  nodes: Viz2dNode[];
  edges: Viz2dEdge[];
  viewport?: {
    width: number;
    height: number;
  };
}

interface GenericViz2DProps {
  schema: Viz2dSchema;
  className?: string;
  selectedNodeId?: string | null;
  hoveredNodeId?: string | null;
  onNodeSelect?: (nodeId: string | null) => void;
  onNodeHover?: (nodeId: string | null) => void;
  showEdges?: boolean;
  animateEdges?: boolean;
}

const DEFAULT_VIEWPORT = { width: 800, height: 600 };
const DEFAULT_NODE_WIDTH = 2.8;
const DEFAULT_NODE_HEIGHT = 0.9;
const MIN_NODE_WIDTH = 84;
const MIN_NODE_HEIGHT = 34;
const PADDING = 60;

export function GenericViz2D({
  schema,
  className,
  selectedNodeId,
  hoveredNodeId,
  onNodeSelect,
  onNodeHover,
  showEdges = true,
  animateEdges = false,
}: GenericViz2DProps) {
  const viewport = schema.viewport ?? DEFAULT_VIEWPORT;
  const focusedNodeId = hoveredNodeId ?? selectedNodeId ?? null;

  const layout = useMemo(() => {
    if (!schema.nodes || schema.nodes.length === 0) {
      return {
        nodes: [],
        edges: [],
        viewBox: `0 0 ${viewport.width} ${viewport.height}`,
      };
    }

    const xs = schema.nodes.map((node) => node.x);
    const ys = schema.nodes.map((node) => node.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const rangeX = maxX - minX || 1;
    const rangeY = maxY - minY || 1;
    const scaleX = (viewport.width - PADDING * 2) / rangeX;
    const scaleY = (viewport.height - PADDING * 2) / rangeY;
    const scale = Math.min(scaleX, scaleY);

    const nodes = schema.nodes.map((node) => {
      const widthUnits = node.width ?? DEFAULT_NODE_WIDTH;
      const heightUnits = node.height ?? DEFAULT_NODE_HEIGHT;
      const width = Math.max(MIN_NODE_WIDTH, widthUnits * scale);
      const height = Math.max(MIN_NODE_HEIGHT, heightUnits * scale);
      const px = PADDING + (node.x - minX) * scale;
      const py = PADDING + (maxY - node.y) * scale;
      return {
        ...node,
        px,
        py,
        width,
        height,
      };
    });

    const nodeMap = new Map(nodes.map((node) => [node.id, node]));
    const edges = schema.edges
      .map((edge) => {
        const fromNode = nodeMap.get(edge.fromId);
        const toNode = nodeMap.get(edge.toId);
        if (!fromNode || !toNode) return null;
        return {
          ...edge,
          from: fromNode,
          to: toNode,
        };
      })
      .filter(Boolean);

    return {
      nodes,
      edges,
      viewBox: `0 0 ${viewport.width} ${viewport.height}`,
    };
  }, [schema, viewport.height, viewport.width]);

  if (layout.nodes.length === 0) {
    return (
      <div className={cn("viz-2d-empty", className)}>No 2D data available.</div>
    );
  }

  return (
    <div className={cn("viz-2d-root", className)}>
      <svg
        className="viz-2d-svg"
        viewBox={layout.viewBox}
        role="img"
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            onNodeSelect?.(null);
          }
        }}
      >
        <defs>
          <marker
            id="viz-2d-arrow"
            viewBox="0 0 10 10"
            refX="7"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill={themeColors.grid} />
          </marker>
          <filter id="viz-2d-glow" height="160%" width="160%" x="-30%" y="-30%">
            <feDropShadow dx="0" dy="0" stdDeviation="6" floodOpacity="0.6" />
          </filter>
        </defs>

        {showEdges && (
          <g className="viz-2d-edges">
            {layout.edges.map((edge, index) => {
              const isActive =
                !focusedNodeId ||
                edge?.fromId === focusedNodeId ||
                edge?.toId === focusedNodeId;
              return (
                <line
                  key={`${edge?.fromId}-${edge?.toId}-${index}`}
                  x1={edge?.from.px}
                  y1={edge?.from.py}
                  x2={edge?.to.px}
                  y2={edge?.to.py}
                  className={cn(
                    "viz-2d-edge",
                    isActive ? "viz-2d-edge-active" : "viz-2d-edge-muted",
                    animateEdges && isActive && "viz-2d-edge-animated"
                  )}
                  stroke={themeColors.grid}
                  strokeWidth={1.5}
                  markerEnd="url(#viz-2d-arrow)"
                  data-animated={animateEdges && isActive ? "true" : "false"}
                />
              );
            })}
          </g>
        )}

        <g className="viz-2d-nodes">
          {layout.nodes.map((node) => {
            const isSelected = node.id === selectedNodeId;
            const isHovered = node.id === hoveredNodeId;
            const isDimmed = Boolean(selectedNodeId) && !isSelected;
            const isFocused = isSelected || isHovered;

            return (
              <g
                key={node.id}
                className={cn(
                  "viz-2d-node",
                  isSelected && "viz-2d-node-selected",
                  isHovered && "viz-2d-node-hovered",
                  isDimmed && "viz-2d-node-dimmed"
                )}
                onClick={(event) => {
                  event.stopPropagation();
                  onNodeSelect?.(node.id);
                }}
                onMouseEnter={() => onNodeHover?.(node.id)}
                onMouseLeave={() => onNodeHover?.(null)}
                role={onNodeSelect ? "button" : undefined}
              >
                <rect
                  x={node.px - node.width / 2}
                  y={node.py - node.height / 2}
                  width={node.width}
                  height={node.height}
                  rx={12}
                  fill={node.color}
                  opacity={isDimmed ? 0.55 : 0.95}
                  filter={isFocused ? "url(#viz-2d-glow)" : undefined}
                />
                <text
                  x={node.px}
                  y={node.py}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="viz-2d-node-label"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}

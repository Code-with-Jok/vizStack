"use client";

import { Scene, AnimatedNode, ConnectionLine } from "@viz/three-engine";

export interface SteppedNode {
  id: string;
  label: string;
  pos: [number, number, number];
  color: string;
  glow: string;
}

export interface SteppedConnection {
  from: number;
  to: number;
}

export interface SteppedVizBaseProps {
  currentStep: number;
  nodes: SteppedNode[];
  connections: SteppedConnection[];
  stepMap: Record<number, string[]>;
  connMap: Record<number, number[]>;
  cameraPosition?: [number, number, number];
  gridPosition?: [number, number, number];
  nodeSize?: [number, number, number];
  translations?: Record<string, string>;
}

export function SteppedVizBase({
  currentStep,
  nodes,
  connections,
  stepMap,
  connMap,
  cameraPosition = [0, 0, 13],
  gridPosition = [0, -6, 0],
  nodeSize = [2.4, 0.8, 0.2],
  translations,
}: SteppedVizBaseProps) {
  const activeNodes = stepMap[currentStep] || [];
  const activeConnections = connMap[currentStep] || [];

  return (
    <Scene cameraPosition={cameraPosition} enableOrbit>
      <gridHelper
        args={[20, 20, "#1a1a2e", "#1a1a2e"]}
        position={gridPosition}
      />
      {nodes.map((n, i) => (
        <AnimatedNode
          key={n.id}
          position={n.pos}
          label={translations?.[n.id] || n.label}
          color={n.color}
          glowColor={n.glow}
          size={nodeSize}
          active={currentStep === 0 || activeNodes.includes(n.id)}
          highlighted={activeNodes.includes(n.id) && currentStep > 0}
          delay={i * 0.1}
        />
      ))}
      {connections.map((c, i) => {
        const fromNode = nodes[c.from];
        const toNode = nodes[c.to];

        if (!fromNode || !toNode) return null;

        return (
          <ConnectionLine
            key={i}
            start={fromNode.pos}
            end={toNode.pos}
            color={toNode.glow}
            active={activeConnections.includes(i)}
            animated={activeConnections.includes(i)}
          />
        );
      })}
    </Scene>
  );
}

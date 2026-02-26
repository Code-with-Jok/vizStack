"use client";

import { Scene, AnimatedNode, ConnectionLine } from "@viz/three-engine";

interface VizNode {
  id: string;
  label: string;
  x: number;
  y: number;
  color: string;
  glowColor: string;
  width?: number;
  height?: number;
}

interface VizConnection {
  fromIndex: number;
  toIndex: number;
}

export interface VizConfig {
  nodes: VizNode[];
  connections: VizConnection[];
  cameraPosition: number[];
}

interface GenericVizRendererProps {
  vizConfig: VizConfig;
}

export function GenericVizRenderer({ vizConfig }: GenericVizRendererProps) {
  const { nodes, connections, cameraPosition } = vizConfig;

  return (
    <Scene
      cameraPosition={cameraPosition as [number, number, number]}
      enableOrbit={true}
    >
      <gridHelper args={[24, 24, "#e2e8f0", "#e2e8f0"]} position={[0, -6, 0]} />
      {nodes.map((node, i) => (
        <AnimatedNode
          key={node.id}
          position={[node.x, node.y, 0]}
          label={node.label}
          color={node.color}
          glowColor={node.glowColor}
          size={[node.width || 2.8, node.height || 0.9, 0.2]}
          active={true}
          highlighted={true}
          delay={i * 0.1}
        />
      ))}
      {connections.map((conn, i) => {
        const fromNode = nodes[conn.fromIndex];
        const toNode = nodes[conn.toIndex];
        if (!fromNode || !toNode) return null;
        
        return (
          <ConnectionLine
            key={i}
            start={[fromNode.x, fromNode.y, 0]}
            end={[toNode.x, toNode.y, 0]}
            color={toNode.glowColor}
            active={true}
            animated={true}
          />
        );
      })}
    </Scene>
  );
}

"use client";

import { Scene, AnimatedNode, ConnectionLine } from "@viz/three-engine";

const NODES = [
  {
    id: "jsx",
    label: "JSX",
    pos: [-4, 3, 0] as [number, number, number],
    color: "#1e3a5f",
    glow: "#00d4ff",
  },
  {
    id: "reactElement",
    label: "React.createElement",
    pos: [-1, 3, 0] as [number, number, number],
    color: "#2d1b4e",
    glow: "#7c3aed",
  },
  {
    id: "vdom",
    label: "Virtual DOM",
    pos: [2, 3, 0] as [number, number, number],
    color: "#1b3d2f",
    glow: "#10b981",
  },
  {
    id: "prevVdom",
    label: "Prev VDOM",
    pos: [-2, 1, 0] as [number, number, number],
    color: "#3d2d1b",
    glow: "#f59e0b",
  },
  {
    id: "newVdom",
    label: "New VDOM",
    pos: [2, 1, 0] as [number, number, number],
    color: "#3d2d1b",
    glow: "#f59e0b",
  },
  {
    id: "diffing",
    label: "Reconciliation",
    pos: [0, -1, 0] as [number, number, number],
    color: "#3b1b3d",
    glow: "#ec4899",
  },
  {
    id: "patch",
    label: "Minimal Patches",
    pos: [0, -3, 0] as [number, number, number],
    color: "#1e3a5f",
    glow: "#00d4ff",
  },
  {
    id: "realDom",
    label: "Real DOM",
    pos: [0, -5, 0] as [number, number, number],
    color: "#1b3d2f",
    glow: "#10b981",
  },
  {
    id: "browser",
    label: "Browser Paint",
    pos: [3.5, -5, 0] as [number, number, number],
    color: "#2d1b4e",
    glow: "#7c3aed",
  },
];

const CONNECTIONS = [
  { from: 0, to: 1 },
  { from: 1, to: 2 },
  { from: 2, to: 3 },
  { from: 2, to: 4 },
  { from: 3, to: 5 },
  { from: 4, to: 5 },
  { from: 5, to: 6 },
  { from: 6, to: 7 },
  { from: 7, to: 8 },
];

const STEP_NODE_MAP: Record<number, string[]> = {
  0: [],
  1: ["jsx"],
  2: ["jsx", "reactElement"],
  3: ["reactElement", "vdom"],
  4: ["prevVdom", "newVdom"],
  5: ["prevVdom", "newVdom", "diffing"],
  6: ["diffing", "patch"],
  7: ["patch", "realDom", "browser"],
};

const STEP_CONN_MAP: Record<number, number[]> = {
  0: [],
  1: [],
  2: [0],
  3: [1],
  4: [2, 3],
  5: [4, 5],
  6: [6],
  7: [7, 8],
};

interface RenderingVizProps {
  currentStep: number;
}

export function RenderingViz({ currentStep }: RenderingVizProps) {
  const activeNodes = STEP_NODE_MAP[currentStep] || [];
  const activeConns = STEP_CONN_MAP[currentStep] || [];

  return (
    <Scene cameraPosition={[0, -1, 14]} enableOrbit={true}>
      <gridHelper args={[20, 20, "#1a1a2e", "#1a1a2e"]} position={[0, -7, 0]} />
      {NODES.map((node, i) => (
        <AnimatedNode
          key={node.id}
          position={node.pos}
          label={node.label}
          color={node.color}
          glowColor={node.glow}
          size={[2.5, 0.8, 0.2]}
          active={currentStep === 0 || activeNodes.includes(node.id)}
          highlighted={activeNodes.includes(node.id) && currentStep > 0}
          delay={i * 0.12}
        />
      ))}
      {CONNECTIONS.map((conn, i) => (
        <ConnectionLine
          key={i}
          start={NODES[conn.from].pos}
          end={NODES[conn.to].pos}
          color={NODES[conn.to].glow}
          active={activeConns.includes(i)}
          animated={activeConns.includes(i)}
        />
      ))}
    </Scene>
  );
}

"use client";

import { Scene, AnimatedNode, ConnectionLine } from "@viz/three-engine";

const NODES = [
  {
    id: "component",
    label: "Component",
    pos: [0, 4, 0] as [number, number, number],
    color: "#1e3a5f",
    glow: "#00d4ff",
  },
  {
    id: "useState",
    label: "useState(0)",
    pos: [-3, 2, 0] as [number, number, number],
    color: "#2d1b4e",
    glow: "#7c3aed",
  },
  {
    id: "useEffect",
    label: "useEffect()",
    pos: [0, 2, 0] as [number, number, number],
    color: "#1b3d2f",
    glow: "#10b981",
  },
  {
    id: "useRef",
    label: "useRef()",
    pos: [3, 2, 0] as [number, number, number],
    color: "#3d2d1b",
    glow: "#f59e0b",
  },
  {
    id: "setState",
    label: "setState(1)",
    pos: [-4, 0, 0] as [number, number, number],
    color: "#3b1b3d",
    glow: "#ec4899",
  },
  {
    id: "rerender",
    label: "Re-render",
    pos: [-2, 0, 0] as [number, number, number],
    color: "#1e3a5f",
    glow: "#00d4ff",
  },
  {
    id: "cleanup",
    label: "Cleanup fn",
    pos: [-1, 0, 0] as [number, number, number],
    color: "#3b1b3d",
    glow: "#ec4899",
  },
  {
    id: "sideEffect",
    label: "Side Effect",
    pos: [1, 0, 0] as [number, number, number],
    color: "#1b3d2f",
    glow: "#10b981",
  },
  {
    id: "domRef",
    label: "DOM Element",
    pos: [3, 0, 0] as [number, number, number],
    color: "#3d2d1b",
    glow: "#f59e0b",
  },
  {
    id: "render",
    label: "Render (JSX)",
    pos: [0, -2, 0] as [number, number, number],
    color: "#1e3a5f",
    glow: "#00d4ff",
  },
  {
    id: "dom",
    label: "DOM Update",
    pos: [0, -4, 0] as [number, number, number],
    color: "#2d1b4e",
    glow: "#7c3aed",
  },
];

const CONNECTIONS = [
  { from: 0, to: 1 },
  { from: 0, to: 2 },
  { from: 0, to: 3 },
  { from: 1, to: 4 },
  { from: 4, to: 5 },
  { from: 2, to: 6 },
  { from: 2, to: 7 },
  { from: 3, to: 8 },
  { from: 5, to: 9 },
  { from: 9, to: 10 },
  { from: 10, to: 2 },
];

const STEP_NODE_MAP: Record<number, string[]> = {
  0: [],
  1: ["component"],
  2: ["component", "useState"],
  3: ["useState", "setState", "rerender"],
  4: ["component", "useEffect"],
  5: ["useEffect", "cleanup", "sideEffect"],
  6: ["component", "useRef", "domRef"],
  7: ["rerender", "render", "dom", "useEffect"],
};

const STEP_CONN_MAP: Record<number, number[]> = {
  0: [],
  1: [],
  2: [0],
  3: [3, 4],
  4: [1],
  5: [5, 6],
  6: [2, 7],
  7: [8, 9, 10],
};

interface HooksFlowVizProps {
  currentStep: number;
}

export function HooksFlowViz({ currentStep }: HooksFlowVizProps) {
  const activeNodes = STEP_NODE_MAP[currentStep] || [];
  const activeConns = STEP_CONN_MAP[currentStep] || [];

  return (
    <Scene cameraPosition={[0, 0, 14]} enableOrbit={true}>
      <gridHelper args={[20, 20, "#1a1a2e", "#1a1a2e"]} position={[0, -6, 0]} />
      {NODES.map((node, i) => (
        <AnimatedNode
          key={node.id}
          position={node.pos}
          label={node.label}
          color={node.color}
          glowColor={node.glow}
          size={[2.2, 0.8, 0.2]}
          active={currentStep === 0 || activeNodes.includes(node.id)}
          highlighted={activeNodes.includes(node.id) && currentStep > 0}
          delay={i * 0.1}
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

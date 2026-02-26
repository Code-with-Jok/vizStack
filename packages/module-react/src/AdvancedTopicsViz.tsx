"use client";

import { Scene, AnimatedNode, ConnectionLine } from "@viz/three-engine";

const NODES = [
  {
    id: "react",
    label: "React Runtime",
    pos: [0, 4, 0] as [number, number, number],
    color: "#1e3a5f",
    glow: "#00d4ff",
  },
  {
    id: "suspense",
    label: "<Suspense>",
    pos: [-3, 2, 0] as [number, number, number],
    color: "#2d1b4e",
    glow: "#7c3aed",
  },
  {
    id: "errBound",
    label: "Error Boundary",
    pos: [0, 2, 0] as [number, number, number],
    color: "#3b1b3d",
    glow: "#ec4899",
  },
  {
    id: "portal",
    label: "createPortal()",
    pos: [3, 2, 0] as [number, number, number],
    color: "#3d2d1b",
    glow: "#f59e0b",
  },
  {
    id: "fallback",
    label: "Fallback UI",
    pos: [-4, 0, 0] as [number, number, number],
    color: "#2d1b4e",
    glow: "#7c3aed",
  },
  {
    id: "lazy",
    label: "React.lazy()",
    pos: [-2, 0, 0] as [number, number, number],
    color: "#1b3d2f",
    glow: "#10b981",
  },
  {
    id: "catch",
    label: "componentDidCatch",
    pos: [-0.5, 0, 0] as [number, number, number],
    color: "#3b1b3d",
    glow: "#ec4899",
  },
  {
    id: "fallbackE",
    label: "Error Fallback",
    pos: [1.5, 0, 0] as [number, number, number],
    color: "#3b1b3d",
    glow: "#ec4899",
  },
  {
    id: "modal",
    label: "Modal / Tooltip",
    pos: [3, 0, 0] as [number, number, number],
    color: "#3d2d1b",
    glow: "#f59e0b",
  },
  {
    id: "domNode",
    label: "document.body",
    pos: [5, 0, 0] as [number, number, number],
    color: "#3d2d1b",
    glow: "#f59e0b",
  },
  {
    id: "serverApi",
    label: "Server APIs",
    pos: [0, -2, 0] as [number, number, number],
    color: "#1e3a5f",
    glow: "#00d4ff",
  },
  {
    id: "formAction",
    label: "Form Actions",
    pos: [0, -4, 0] as [number, number, number],
    color: "#1b3d2f",
    glow: "#10b981",
  },
];

const CONNECTIONS = [
  { from: 0, to: 1 },
  { from: 0, to: 2 },
  { from: 0, to: 3 },
  { from: 1, to: 4 },
  { from: 1, to: 5 },
  { from: 2, to: 6 },
  { from: 2, to: 7 },
  { from: 3, to: 8 },
  { from: 3, to: 9 },
  { from: 0, to: 10 },
  { from: 10, to: 11 },
];

const STEP_MAP: Record<number, string[]> = {
  0: [],
  1: ["react"],
  2: ["react", "suspense", "errBound", "portal"],
  3: ["suspense", "fallback", "lazy"],
  4: ["errBound", "catch", "fallbackE"],
  5: ["portal", "modal", "domNode"],
  6: ["react", "serverApi", "formAction"],
};
const CONN_MAP: Record<number, number[]> = {
  0: [],
  1: [],
  2: [0, 1, 2],
  3: [3, 4],
  4: [5, 6],
  5: [7, 8],
  6: [9, 10],
};

interface Props {
  currentStep: number;
}

export function AdvancedTopicsViz({ currentStep }: Props) {
  const an = STEP_MAP[currentStep] || [];
  const ac = CONN_MAP[currentStep] || [];
  return (
    <Scene cameraPosition={[0, 0, 14]} enableOrbit>
      <gridHelper args={[20, 20, "#1a1a2e", "#1a1a2e"]} position={[0, -6, 0]} />
      {NODES.map((n, i) => (
        <AnimatedNode
          key={n.id}
          position={n.pos}
          label={n.label}
          color={n.color}
          glowColor={n.glow}
          size={[2.4, 0.8, 0.2]}
          active={currentStep === 0 || an.includes(n.id)}
          highlighted={an.includes(n.id) && currentStep > 0}
          delay={i * 0.1}
        />
      ))}
      {CONNECTIONS.map((c, i) => (
        <ConnectionLine
          key={i}
          start={NODES[c.from].pos}
          end={NODES[c.to].pos}
          color={NODES[c.to].glow}
          active={ac.includes(i)}
          animated={ac.includes(i)}
        />
      ))}
    </Scene>
  );
}

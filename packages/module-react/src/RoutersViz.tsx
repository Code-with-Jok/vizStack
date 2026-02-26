"use client";

import { Scene, AnimatedNode, ConnectionLine } from "@viz/three-engine";

const NODES = [
  {
    id: "url",
    label: "URL Change",
    pos: [0, 4, 0] as [number, number, number],
    color: "#1e3a5f",
    glow: "#00d4ff",
  },
  {
    id: "router",
    label: "Router",
    pos: [0, 2.5, 0] as [number, number, number],
    color: "#2d1b4e",
    glow: "#7c3aed",
  },
  {
    id: "routes",
    label: "Route Config",
    pos: [-3, 1, 0] as [number, number, number],
    color: "#1b3d2f",
    glow: "#10b981",
  },
  {
    id: "match",
    label: "Route Matching",
    pos: [0, 1, 0] as [number, number, number],
    color: "#3d2d1b",
    glow: "#f59e0b",
  },
  {
    id: "params",
    label: "URL Params",
    pos: [3, 1, 0] as [number, number, number],
    color: "#3b1b3d",
    glow: "#ec4899",
  },
  {
    id: "outlet",
    label: "Outlet / Layout",
    pos: [-2, -1, 0] as [number, number, number],
    color: "#1e3a5f",
    glow: "#00d4ff",
  },
  {
    id: "page",
    label: "Page Component",
    pos: [2, -1, 0] as [number, number, number],
    color: "#1b3d2f",
    glow: "#10b981",
  },
  {
    id: "navigate",
    label: "useNavigate()",
    pos: [-2, -3, 0] as [number, number, number],
    color: "#2d1b4e",
    glow: "#7c3aed",
  },
  {
    id: "link",
    label: '<Link to="/">',
    pos: [2, -3, 0] as [number, number, number],
    color: "#3d2d1b",
    glow: "#f59e0b",
  },
];

const CONNECTIONS = [
  { from: 0, to: 1 },
  { from: 1, to: 2 },
  { from: 1, to: 3 },
  { from: 1, to: 4 },
  { from: 3, to: 5 },
  { from: 3, to: 6 },
  { from: 6, to: 7 },
  { from: 6, to: 8 },
  { from: 7, to: 0 },
  { from: 8, to: 0 },
];

const STEP_MAP: Record<number, string[]> = {
  0: [],
  1: ["url"],
  2: ["url", "router"],
  3: ["router", "routes", "match", "params"],
  4: ["match", "outlet", "page"],
  5: ["page", "navigate", "link"],
  6: ["navigate", "link", "url"],
};
const CONN_MAP: Record<number, number[]> = {
  0: [],
  1: [],
  2: [0],
  3: [1, 2, 3],
  4: [4, 5],
  5: [6, 7],
  6: [8, 9],
};

interface Props {
  currentStep: number;
}

export function RoutersViz({ currentStep }: Props) {
  const an = STEP_MAP[currentStep] || [];
  const ac = CONN_MAP[currentStep] || [];
  return (
    <Scene cameraPosition={[0, 0, 12]} enableOrbit>
      <gridHelper args={[20, 20, "#1a1a2e", "#1a1a2e"]} position={[0, -5, 0]} />
      {NODES.map((n, i) => (
        <AnimatedNode
          key={n.id}
          position={n.pos}
          label={n.label}
          color={n.color}
          glowColor={n.glow}
          size={[2.2, 0.8, 0.2]}
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

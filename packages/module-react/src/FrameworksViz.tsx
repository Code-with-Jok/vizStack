"use client";

import { Scene, AnimatedNode, ConnectionLine } from "@viz/three-engine";

const NODES = [
  {
    id: "react",
    label: "React App",
    pos: [0, 4, 0] as [number, number, number],
    color: "#1e3a5f",
    glow: "#00d4ff",
  },
  {
    id: "nextjs",
    label: "Next.js",
    pos: [-3, 2, 0] as [number, number, number],
    color: "#2d1b4e",
    glow: "#7c3aed",
  },
  {
    id: "astro",
    label: "Astro",
    pos: [0, 2, 0] as [number, number, number],
    color: "#3d2d1b",
    glow: "#f59e0b",
  },
  {
    id: "rrouter",
    label: "React Router v7",
    pos: [3, 2, 0] as [number, number, number],
    color: "#1b3d2f",
    glow: "#10b981",
  },
  {
    id: "ssr",
    label: "SSR + SSG",
    pos: [-3, 0, 0] as [number, number, number],
    color: "#2d1b4e",
    glow: "#7c3aed",
  },
  {
    id: "islands",
    label: "Islands Arch",
    pos: [0, 0, 0] as [number, number, number],
    color: "#3d2d1b",
    glow: "#f59e0b",
  },
  {
    id: "loader",
    label: "Loaders/Actions",
    pos: [3, 0, 0] as [number, number, number],
    color: "#1b3d2f",
    glow: "#10b981",
  },
  {
    id: "rsc",
    label: "Server Components",
    pos: [-2, -2, 0] as [number, number, number],
    color: "#2d1b4e",
    glow: "#7c3aed",
  },
  {
    id: "partial",
    label: "Partial Hydration",
    pos: [1, -2, 0] as [number, number, number],
    color: "#3d2d1b",
    glow: "#f59e0b",
  },
  {
    id: "full",
    label: "Full-Stack React",
    pos: [0, -4, 0] as [number, number, number],
    color: "#3b1b3d",
    glow: "#ec4899",
  },
];

const CONNECTIONS = [
  { from: 0, to: 1 },
  { from: 0, to: 2 },
  { from: 0, to: 3 },
  { from: 1, to: 4 },
  { from: 2, to: 5 },
  { from: 3, to: 6 },
  { from: 4, to: 7 },
  { from: 5, to: 8 },
  { from: 7, to: 9 },
  { from: 8, to: 9 },
];

const STEP_MAP: Record<number, string[]> = {
  0: [],
  1: ["react"],
  2: ["react", "nextjs", "astro", "rrouter"],
  3: ["nextjs", "ssr", "rsc"],
  4: ["astro", "islands", "partial"],
  5: ["rrouter", "loader"],
  6: ["rsc", "partial", "full"],
};
const CONN_MAP: Record<number, number[]> = {
  0: [],
  1: [],
  2: [0, 1, 2],
  3: [3, 6],
  4: [4, 7],
  5: [5],
  6: [8, 9],
};

interface Props {
  currentStep: number;
}

export function FrameworksViz({ currentStep }: Props) {
  const an = STEP_MAP[currentStep] || [];
  const ac = CONN_MAP[currentStep] || [];
  return (
    <Scene cameraPosition={[0, 0, 13]} enableOrbit>
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

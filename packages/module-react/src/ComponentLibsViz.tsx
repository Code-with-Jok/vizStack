"use client";

import { Scene, AnimatedNode, ConnectionLine } from "@viz/three-engine";

const NODES = [
  {
    id: "app",
    label: "Your App",
    pos: [0, 4, 0] as [number, number, number],
    color: "#1e3a5f",
    glow: "#00d4ff",
  },
  {
    id: "mui",
    label: "Material UI",
    pos: [-3, 2, 0] as [number, number, number],
    color: "#2d1b4e",
    glow: "#7c3aed",
  },
  {
    id: "shadcn",
    label: "Shadcn UI",
    pos: [0, 2, 0] as [number, number, number],
    color: "#1b3d2f",
    glow: "#10b981",
  },
  {
    id: "chakra",
    label: "Chakra UI",
    pos: [3, 2, 0] as [number, number, number],
    color: "#3d2d1b",
    glow: "#f59e0b",
  },
  {
    id: "theme",
    label: "Theme Provider",
    pos: [-3, 0, 0] as [number, number, number],
    color: "#2d1b4e",
    glow: "#7c3aed",
  },
  {
    id: "copy",
    label: "Copy to Project",
    pos: [0, 0, 0] as [number, number, number],
    color: "#1b3d2f",
    glow: "#10b981",
  },
  {
    id: "runtime",
    label: "Runtime Styles",
    pos: [3, 0, 0] as [number, number, number],
    color: "#3d2d1b",
    glow: "#f59e0b",
  },
  {
    id: "radix",
    label: "Radix Primitives",
    pos: [-1, -2, 0] as [number, number, number],
    color: "#3b1b3d",
    glow: "#ec4899",
  },
  {
    id: "aria",
    label: "React Aria",
    pos: [2, -2, 0] as [number, number, number],
    color: "#3b1b3d",
    glow: "#ec4899",
  },
  {
    id: "a11y",
    label: "Accessibility",
    pos: [0.5, -4, 0] as [number, number, number],
    color: "#1e3a5f",
    glow: "#00d4ff",
  },
];

const CONNECTIONS = [
  { from: 0, to: 1 },
  { from: 0, to: 2 },
  { from: 0, to: 3 },
  { from: 1, to: 4 },
  { from: 2, to: 5 },
  { from: 3, to: 6 },
  { from: 5, to: 7 },
  { from: 6, to: 8 },
  { from: 7, to: 9 },
  { from: 8, to: 9 },
];

const STEP_MAP: Record<number, string[]> = {
  0: [],
  1: ["app"],
  2: ["app", "mui", "shadcn", "chakra"],
  3: ["mui", "theme"],
  4: ["shadcn", "copy", "radix"],
  5: ["chakra", "runtime"],
  6: ["radix", "aria", "a11y"],
};
const CONN_MAP: Record<number, number[]> = {
  0: [],
  1: [],
  2: [0, 1, 2],
  3: [3],
  4: [4, 6],
  5: [5],
  6: [8, 9],
};

interface Props {
  currentStep: number;
}

export function ComponentLibsViz({ currentStep }: Props) {
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

"use client";

import { Scene, AnimatedNode, ConnectionLine } from "@viz/three-engine";

const NODES = [
  {
    id: "react",
    label: "React Code",
    pos: [0, 4, 0] as [number, number, number],
    color: "#1e3a5f",
    glow: "#00d4ff",
  },
  {
    id: "rn",
    label: "React Native",
    pos: [0, 2, 0] as [number, number, number],
    color: "#2d1b4e",
    glow: "#7c3aed",
  },
  {
    id: "bridge",
    label: "Bridge / Fabric",
    pos: [-2.5, 0, 0] as [number, number, number],
    color: "#3d2d1b",
    glow: "#f59e0b",
  },
  {
    id: "native",
    label: "Native Modules",
    pos: [2.5, 0, 0] as [number, number, number],
    color: "#1b3d2f",
    glow: "#10b981",
  },
  {
    id: "ios",
    label: "iOS (UIKit)",
    pos: [-3, -2, 0] as [number, number, number],
    color: "#3b1b3d",
    glow: "#ec4899",
  },
  {
    id: "android",
    label: "Android (Views)",
    pos: [0, -2, 0] as [number, number, number],
    color: "#1b3d2f",
    glow: "#10b981",
  },
  {
    id: "expo",
    label: "Expo",
    pos: [3, -2, 0] as [number, number, number],
    color: "#3d2d1b",
    glow: "#f59e0b",
  },
  {
    id: "app",
    label: "Native App",
    pos: [0, -4, 0] as [number, number, number],
    color: "#1e3a5f",
    glow: "#00d4ff",
  },
];

const CONNECTIONS = [
  { from: 0, to: 1 },
  { from: 1, to: 2 },
  { from: 1, to: 3 },
  { from: 2, to: 4 },
  { from: 2, to: 5 },
  { from: 3, to: 6 },
  { from: 4, to: 7 },
  { from: 5, to: 7 },
  { from: 6, to: 7 },
];

const STEP_MAP: Record<number, string[]> = {
  0: [],
  1: ["react"],
  2: ["react", "rn"],
  3: ["rn", "bridge", "native"],
  4: ["bridge", "ios", "android"],
  5: ["native", "expo"],
  6: ["ios", "android", "expo", "app"],
};
const CONN_MAP: Record<number, number[]> = {
  0: [],
  1: [],
  2: [0],
  3: [1, 2],
  4: [3, 4],
  5: [5],
  6: [6, 7, 8],
};

interface Props {
  currentStep: number;
}

export function MobileViz({ currentStep }: Props) {
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

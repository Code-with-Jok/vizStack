"use client";

import { Scene, AnimatedNode, ConnectionLine } from "@viz/three-engine";

const NODES = [
  {
    id: "trigger",
    label: "User Action",
    pos: [0, 4, 0] as [number, number, number],
    color: "#1e3a5f",
    glow: "#00d4ff",
  },
  {
    id: "framer",
    label: "Framer Motion",
    pos: [-3, 2, 0] as [number, number, number],
    color: "#2d1b4e",
    glow: "#7c3aed",
  },
  {
    id: "spring",
    label: "react-spring",
    pos: [0, 2, 0] as [number, number, number],
    color: "#1b3d2f",
    glow: "#10b981",
  },
  {
    id: "gsap",
    label: "GSAP",
    pos: [3, 2, 0] as [number, number, number],
    color: "#3d2d1b",
    glow: "#f59e0b",
  },
  {
    id: "declarative",
    label: "Declarative API",
    pos: [-3, 0, 0] as [number, number, number],
    color: "#2d1b4e",
    glow: "#7c3aed",
  },
  {
    id: "physics",
    label: "Physics Engine",
    pos: [0, 0, 0] as [number, number, number],
    color: "#1b3d2f",
    glow: "#10b981",
  },
  {
    id: "timeline",
    label: "Timeline Control",
    pos: [3, 0, 0] as [number, number, number],
    color: "#3d2d1b",
    glow: "#f59e0b",
  },
  {
    id: "layout",
    label: "Layout Animations",
    pos: [-2, -2, 0] as [number, number, number],
    color: "#3b1b3d",
    glow: "#ec4899",
  },
  {
    id: "gesture",
    label: "Gesture Handling",
    pos: [1, -2, 0] as [number, number, number],
    color: "#3b1b3d",
    glow: "#ec4899",
  },
  {
    id: "smooth",
    label: "Smooth 60fps UI",
    pos: [0, -4, 0] as [number, number, number],
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
  { from: 4, to: 7 },
  { from: 5, to: 8 },
  { from: 7, to: 9 },
  { from: 8, to: 9 },
];

const STEP_MAP: Record<number, string[]> = {
  0: [],
  1: ["trigger"],
  2: ["trigger", "framer", "spring", "gsap"],
  3: ["framer", "declarative", "layout"],
  4: ["spring", "physics", "gesture"],
  5: ["gsap", "timeline"],
  6: ["layout", "gesture", "smooth"],
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

export function AnimationViz({ currentStep }: Props) {
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

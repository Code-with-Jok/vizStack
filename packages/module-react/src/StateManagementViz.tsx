"use client";

import { SteppedVizBase } from "./utils/SteppedVizBase";

const NODES = [
  {
    id: "store",
    label: "Global Store",
    pos: [0, 4, 0] as [number, number, number],
    color: "#2d1b4e",
    glow: "#7c3aed",
  },
  {
    id: "context",
    label: "Context Provider",
    pos: [-3, 2, 0] as [number, number, number],
    color: "#1b3d2f",
    glow: "#10b981",
  },
  {
    id: "zustand",
    label: "Zustand Store",
    pos: [0, 2, 0] as [number, number, number],
    color: "#1e3a5f",
    glow: "#00d4ff",
  },
  {
    id: "jotai",
    label: "Jotai Atoms",
    pos: [3, 2, 0] as [number, number, number],
    color: "#3d2d1b",
    glow: "#f59e0b",
  },
  {
    id: "provider",
    label: "Provider",
    pos: [-3, 0, 0] as [number, number, number],
    color: "#1b3d2f",
    glow: "#10b981",
  },
  {
    id: "selector",
    label: "useStore()",
    pos: [0, 0, 0] as [number, number, number],
    color: "#1e3a5f",
    glow: "#00d4ff",
  },
  {
    id: "atom",
    label: "useAtom()",
    pos: [3, 0, 0] as [number, number, number],
    color: "#3d2d1b",
    glow: "#f59e0b",
  },
  {
    id: "compA",
    label: "Component A",
    pos: [-4, -2, 0] as [number, number, number],
    color: "#3b1b3d",
    glow: "#ec4899",
  },
  {
    id: "compB",
    label: "Component B",
    pos: [-1.5, -2, 0] as [number, number, number],
    color: "#3b1b3d",
    glow: "#ec4899",
  },
  {
    id: "compC",
    label: "Component C",
    pos: [1.5, -2, 0] as [number, number, number],
    color: "#3b1b3d",
    glow: "#ec4899",
  },
  {
    id: "compD",
    label: "Component D",
    pos: [4, -2, 0] as [number, number, number],
    color: "#3b1b3d",
    glow: "#ec4899",
  },
  {
    id: "rerender",
    label: "Selective Re-render",
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
  { from: 4, to: 8 },
  { from: 5, to: 8 },
  { from: 5, to: 9 },
  { from: 6, to: 9 },
  { from: 6, to: 10 },
  { from: 8, to: 11 },
  { from: 9, to: 11 },
];

const STEP_NODE_MAP: Record<number, string[]> = {
  0: [],
  1: ["store"],
  2: ["store", "context", "zustand", "jotai"],
  3: ["context", "provider", "compA", "compB"],
  4: ["zustand", "selector", "compB", "compC"],
  5: ["jotai", "atom", "compC", "compD"],
  6: ["compB", "compC", "rerender"],
};

const STEP_CONN_MAP: Record<number, number[]> = {
  0: [],
  1: [],
  2: [0, 1, 2],
  3: [3, 6, 7],
  4: [4, 8, 9],
  5: [5, 10, 11],
  6: [12, 13],
};

interface StateManagementVizProps {
  currentStep: number;
}

export function StateManagementViz({ currentStep }: StateManagementVizProps) {
  return (
    <SteppedVizBase
      currentStep={currentStep}
      nodes={NODES}
      connections={CONNECTIONS}
      stepMap={STEP_NODE_MAP}
      connMap={STEP_CONN_MAP}
      cameraPosition={[0, 0, 14]}
      nodeSize={[2.4, 0.8, 0.2]}
    />
  );
}

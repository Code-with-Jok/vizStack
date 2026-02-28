"use client";

import { SteppedVizBase } from "./utils/SteppedVizBase";

const NODES = [
  {
    id: "js",
    label: "JavaScript",
    pos: [0, 4, 0] as [number, number, number],
    color: "#3d2d1b",
    glow: "#f59e0b",
  },
  {
    id: "ts",
    label: "TypeScript",
    pos: [0, 2, 0] as [number, number, number],
    color: "#1e3a5f",
    glow: "#00d4ff",
  },
  {
    id: "interface",
    label: "Interfaces",
    pos: [-3, 0, 0] as [number, number, number],
    color: "#1e3a5f",
    glow: "#00d4ff",
  },
  {
    id: "generics",
    label: "Generics<T>",
    pos: [-1, 0, 0] as [number, number, number],
    color: "#2d1b4e",
    glow: "#7c3aed",
  },
  {
    id: "enums",
    label: "Enums & Unions",
    pos: [1.5, 0, 0] as [number, number, number],
    color: "#1b3d2f",
    glow: "#10b981",
  },
  {
    id: "zod",
    label: "Zod Schema",
    pos: [3.5, 0, 0] as [number, number, number],
    color: "#3b1b3d",
    glow: "#ec4899",
  },
  {
    id: "infer",
    label: "z.infer<>",
    pos: [3.5, -2, 0] as [number, number, number],
    color: "#3b1b3d",
    glow: "#ec4899",
  },
  {
    id: "runtime",
    label: "Runtime Check",
    pos: [-2, -2, 0] as [number, number, number],
    color: "#2d1b4e",
    glow: "#7c3aed",
  },
  {
    id: "compiletime",
    label: "Compile-time Check",
    pos: [1, -2, 0] as [number, number, number],
    color: "#1e3a5f",
    glow: "#00d4ff",
  },
  {
    id: "safe",
    label: "Type Safe App",
    pos: [0, -4, 0] as [number, number, number],
    color: "#1b3d2f",
    glow: "#10b981",
  },
];

const CONNECTIONS = [
  { from: 0, to: 1 },
  { from: 1, to: 2 },
  { from: 1, to: 3 },
  { from: 1, to: 4 },
  { from: 1, to: 5 },
  { from: 5, to: 6 },
  { from: 3, to: 7 },
  { from: 2, to: 8 },
  { from: 6, to: 7 },
  { from: 7, to: 9 },
  { from: 8, to: 9 },
];

const STEP_MAP: Record<number, string[]> = {
  0: [],
  1: ["js"],
  2: ["js", "ts"],
  3: ["ts", "interface", "generics", "enums"],
  4: ["ts", "zod", "infer"],
  5: ["generics", "runtime", "interface", "compiletime"],
  6: ["runtime", "compiletime", "safe"],
};
const CONN_MAP: Record<number, number[]> = {
  0: [],
  1: [],
  2: [0],
  3: [1, 2, 3],
  4: [4, 5],
  5: [6, 7, 8],
  6: [9, 10],
};

interface Props {
  currentStep: number;
}

export function TypesValidationViz({ currentStep }: Props) {
  return (
    <SteppedVizBase
      currentStep={currentStep}
      nodes={NODES}
      connections={CONNECTIONS}
      stepMap={STEP_MAP}
      connMap={CONN_MAP}
      cameraPosition={[0, 0, 13]}
      nodeSize={[2.4, 0.8, 0.2]}
    />
  );
}

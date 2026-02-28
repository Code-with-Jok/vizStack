"use client";

import { SteppedVizBase } from "./utils/SteppedVizBase";

const NODES = [
  {
    id: "code",
    label: "Source Code",
    pos: [0, 4, 0] as [number, number, number],
    color: "#1e3a5f",
    glow: "#00d4ff",
  },
  {
    id: "unit",
    label: "Unit Tests",
    pos: [-3, 2, 0] as [number, number, number],
    color: "#1b3d2f",
    glow: "#10b981",
  },
  {
    id: "integ",
    label: "Integration",
    pos: [0, 2, 0] as [number, number, number],
    color: "#2d1b4e",
    glow: "#7c3aed",
  },
  {
    id: "e2e",
    label: "E2E Tests",
    pos: [3, 2, 0] as [number, number, number],
    color: "#3d2d1b",
    glow: "#f59e0b",
  },
  {
    id: "vitest",
    label: "Vitest",
    pos: [-4, 0, 0] as [number, number, number],
    color: "#1b3d2f",
    glow: "#10b981",
  },
  {
    id: "jest",
    label: "Jest",
    pos: [-2, 0, 0] as [number, number, number],
    color: "#1b3d2f",
    glow: "#10b981",
  },
  {
    id: "rtl",
    label: "Testing Library",
    pos: [0, 0, 0] as [number, number, number],
    color: "#2d1b4e",
    glow: "#7c3aed",
  },
  {
    id: "cypress",
    label: "Cypress",
    pos: [2, 0, 0] as [number, number, number],
    color: "#3d2d1b",
    glow: "#f59e0b",
  },
  {
    id: "pw",
    label: "Playwright",
    pos: [4, 0, 0] as [number, number, number],
    color: "#3d2d1b",
    glow: "#f59e0b",
  },
  {
    id: "ci",
    label: "CI/CD Pipeline",
    pos: [0, -2, 0] as [number, number, number],
    color: "#3b1b3d",
    glow: "#ec4899",
  },
  {
    id: "deploy",
    label: "Confident Deploy",
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
  { from: 1, to: 5 },
  { from: 2, to: 6 },
  { from: 3, to: 7 },
  { from: 3, to: 8 },
  { from: 4, to: 9 },
  { from: 6, to: 9 },
  { from: 7, to: 9 },
  { from: 9, to: 10 },
];

const STEP_MAP: Record<number, string[]> = {
  0: [],
  1: ["code"],
  2: ["code", "unit", "integ", "e2e"],
  3: ["unit", "vitest", "jest"],
  4: ["integ", "rtl"],
  5: ["e2e", "cypress", "pw"],
  6: ["vitest", "rtl", "cypress", "ci", "deploy"],
};
const CONN_MAP: Record<number, number[]> = {
  0: [],
  1: [],
  2: [0, 1, 2],
  3: [3, 4],
  4: [5],
  5: [6, 7],
  6: [8, 9, 10, 11],
};

interface Props {
  currentStep: number;
}

export function TestingViz({ currentStep }: Props) {
  return (
    <SteppedVizBase
      currentStep={currentStep}
      nodes={NODES}
      connections={CONNECTIONS}
      stepMap={STEP_MAP}
      connMap={CONN_MAP}
      cameraPosition={[0, 0, 14]}
      nodeSize={[2.2, 0.8, 0.2]}
    />
  );
}

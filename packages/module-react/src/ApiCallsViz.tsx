"use client";

import { SteppedVizBase } from "./utils/SteppedVizBase";

const NODES = [
  {
    id: "component",
    label: "Component",
    pos: [0, 4, 0] as [number, number, number],
    color: "#1e3a5f",
    glow: "#00d4ff",
  },
  {
    id: "fetch",
    label: "Data Fetching",
    pos: [0, 2, 0] as [number, number, number],
    color: "#2d1b4e",
    glow: "#7c3aed",
  },
  {
    id: "axios",
    label: "Axios",
    pos: [-3, 0, 0] as [number, number, number],
    color: "#3d2d1b",
    glow: "#f59e0b",
  },
  {
    id: "rquery",
    label: "React Query",
    pos: [-1, 0, 0] as [number, number, number],
    color: "#1b3d2f",
    glow: "#10b981",
  },
  {
    id: "swr",
    label: "SWR",
    pos: [1, 0, 0] as [number, number, number],
    color: "#1b3d2f",
    glow: "#10b981",
  },
  {
    id: "apollo",
    label: "Apollo Client",
    pos: [3, 0, 0] as [number, number, number],
    color: "#3b1b3d",
    glow: "#ec4899",
  },
  {
    id: "cache",
    label: "Cache Layer",
    pos: [-1, -2, 0] as [number, number, number],
    color: "#2d1b4e",
    glow: "#7c3aed",
  },
  {
    id: "graphql",
    label: "GraphQL",
    pos: [3, -2, 0] as [number, number, number],
    color: "#3b1b3d",
    glow: "#ec4899",
  },
  {
    id: "api",
    label: "REST / GraphQL API",
    pos: [0, -4, 0] as [number, number, number],
    color: "#1e3a5f",
    glow: "#00d4ff",
  },
];

const CONNECTIONS = [
  { from: 0, to: 1 },
  { from: 1, to: 2 },
  { from: 1, to: 3 },
  { from: 1, to: 4 },
  { from: 1, to: 5 },
  { from: 3, to: 6 },
  { from: 4, to: 6 },
  { from: 5, to: 7 },
  { from: 6, to: 8 },
  { from: 7, to: 8 },
];

const STEP_MAP: Record<number, string[]> = {
  0: [],
  1: ["component"],
  2: ["component", "fetch"],
  3: ["fetch", "axios"],
  4: ["fetch", "rquery", "swr", "cache"],
  5: ["fetch", "apollo", "graphql"],
  6: ["cache", "graphql", "api"],
};
const CONN_MAP: Record<number, number[]> = {
  0: [],
  1: [],
  2: [0],
  3: [1],
  4: [2, 3, 5, 6],
  5: [4, 7],
  6: [8, 9],
};

interface Props {
  currentStep: number;
}

export function ApiCallsViz({ currentStep }: Props) {
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

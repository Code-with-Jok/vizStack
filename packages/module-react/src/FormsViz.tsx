"use client";

import { SteppedVizBase } from "./utils/SteppedVizBase";

const NODES = [
  {
    id: "form",
    label: "<form>",
    pos: [0, 4, 0] as [number, number, number],
    color: "#1e3a5f",
    glow: "#00d4ff",
  },
  {
    id: "rhf",
    label: "React Hook Form",
    pos: [-2, 2, 0] as [number, number, number],
    color: "#1b3d2f",
    glow: "#10b981",
  },
  {
    id: "formik",
    label: "Formik",
    pos: [2, 2, 0] as [number, number, number],
    color: "#2d1b4e",
    glow: "#7c3aed",
  },
  {
    id: "register",
    label: "register()",
    pos: [-3, 0, 0] as [number, number, number],
    color: "#1b3d2f",
    glow: "#10b981",
  },
  {
    id: "uncontrol",
    label: "Uncontrolled",
    pos: [-1, 0, 0] as [number, number, number],
    color: "#1b3d2f",
    glow: "#10b981",
  },
  {
    id: "field",
    label: "<Field>",
    pos: [1, 0, 0] as [number, number, number],
    color: "#2d1b4e",
    glow: "#7c3aed",
  },
  {
    id: "controlled",
    label: "Controlled",
    pos: [3, 0, 0] as [number, number, number],
    color: "#2d1b4e",
    glow: "#7c3aed",
  },
  {
    id: "validate",
    label: "Validation (Zod)",
    pos: [0, -2, 0] as [number, number, number],
    color: "#3d2d1b",
    glow: "#f59e0b",
  },
  {
    id: "submit",
    label: "onSubmit(data)",
    pos: [0, -4, 0] as [number, number, number],
    color: "#3b1b3d",
    glow: "#ec4899",
  },
];

const CONNECTIONS = [
  { from: 0, to: 1 },
  { from: 0, to: 2 },
  { from: 1, to: 3 },
  { from: 1, to: 4 },
  { from: 2, to: 5 },
  { from: 2, to: 6 },
  { from: 3, to: 7 },
  { from: 5, to: 7 },
  { from: 7, to: 8 },
];

const STEP_MAP: Record<number, string[]> = {
  0: [],
  1: ["form"],
  2: ["form", "rhf", "formik"],
  3: ["rhf", "register", "uncontrol"],
  4: ["formik", "field", "controlled"],
  5: ["register", "field", "validate"],
  6: ["validate", "submit"],
};
const CONN_MAP: Record<number, number[]> = {
  0: [],
  1: [],
  2: [0, 1],
  3: [2, 3],
  4: [4, 5],
  5: [6, 7],
  6: [8],
};

interface Props {
  currentStep: number;
}

export function FormsViz({ currentStep }: Props) {
  return (
    <SteppedVizBase
      currentStep={currentStep}
      nodes={NODES}
      connections={CONNECTIONS}
      stepMap={STEP_MAP}
      connMap={CONN_MAP}
      cameraPosition={[0, 0, 13]}
      nodeSize={[2.2, 0.8, 0.2]}
    />
  );
}

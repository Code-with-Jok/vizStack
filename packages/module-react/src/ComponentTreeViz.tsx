"use client";

import { Scene, AnimatedNode, ConnectionLine } from "@viz/three-engine";

const NODES = [
  {
    id: "app",
    label: "App",
    pos: [0, 5, 0] as [number, number, number],
    color: "#1e3a5f",
    glow: "#00d4ff",
  },
  {
    id: "header",
    label: "Header",
    pos: [-4, 3, 0] as [number, number, number],
    color: "#2d1b4e",
    glow: "#7c3aed",
  },
  {
    id: "main",
    label: "Main",
    pos: [0, 3, 0] as [number, number, number],
    color: "#1b3d2f",
    glow: "#10b981",
  },
  {
    id: "footer",
    label: "Footer",
    pos: [4, 3, 0] as [number, number, number],
    color: "#2d1b4e",
    glow: "#7c3aed",
  },
  {
    id: "nav",
    label: "Nav",
    pos: [-5.5, 1, 0] as [number, number, number],
    color: "#3d2d1b",
    glow: "#f59e0b",
  },
  {
    id: "logo",
    label: "Logo",
    pos: [-2.5, 1, 0] as [number, number, number],
    color: "#3d2d1b",
    glow: "#f59e0b",
  },
  {
    id: "productList",
    label: "ProductList",
    pos: [0, 1, 0] as [number, number, number],
    color: "#1e3a5f",
    glow: "#00d4ff",
  },
  {
    id: "sidebar",
    label: "Sidebar",
    pos: [3.5, 1, 0] as [number, number, number],
    color: "#1b3d2f",
    glow: "#10b981",
  },
  {
    id: "productCard",
    label: "ProductCard",
    pos: [-1.5, -1.5, 0] as [number, number, number],
    color: "#3b1b3d",
    glow: "#ec4899",
  },
  {
    id: "productCard2",
    label: "ProductCard",
    pos: [2, -1.5, 0] as [number, number, number],
    color: "#3b1b3d",
    glow: "#ec4899",
  },
  {
    id: "button",
    label: "Button",
    pos: [-1.5, -3.5, 0] as [number, number, number],
    color: "#3d2d1b",
    glow: "#f59e0b",
  },
  {
    id: "price",
    label: "Price",
    pos: [2, -3.5, 0] as [number, number, number],
    color: "#3d2d1b",
    glow: "#f59e0b",
  },
];

const CONNECTIONS = [
  { from: 0, to: 1 },
  { from: 0, to: 2 },
  { from: 0, to: 3 },
  { from: 1, to: 4 },
  { from: 1, to: 5 },
  { from: 2, to: 6 },
  { from: 2, to: 7 },
  { from: 6, to: 8 },
  { from: 6, to: 9 },
  { from: 8, to: 10 },
  { from: 8, to: 11 },
];

const STEP_NODE_MAP: Record<number, string[]> = {
  0: [],
  1: ["app"],
  2: ["app", "header", "main", "footer"],
  3: ["header", "nav", "logo"],
  4: ["main", "productList", "sidebar"],
  5: ["productList", "productCard", "productCard2"],
  6: ["productCard", "button", "price"],
  7: [
    "app",
    "header",
    "main",
    "footer",
    "nav",
    "logo",
    "productList",
    "sidebar",
    "productCard",
    "productCard2",
    "button",
    "price",
  ],
};

const STEP_CONN_MAP: Record<number, number[]> = {
  0: [],
  1: [],
  2: [0, 1, 2],
  3: [3, 4],
  4: [5, 6],
  5: [7, 8],
  6: [9, 10],
  7: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
};

interface ComponentTreeVizProps {
  currentStep: number;
}

export function ComponentTreeViz({ currentStep }: ComponentTreeVizProps) {
  const activeNodes = STEP_NODE_MAP[currentStep] || [];
  const activeConns = STEP_CONN_MAP[currentStep] || [];

  return (
    <Scene cameraPosition={[0, 1, 16]} enableOrbit={true}>
      <gridHelper args={[24, 24, "#1a1a2e", "#1a1a2e"]} position={[0, -6, 0]} />
      {NODES.map((node, i) => (
        <AnimatedNode
          key={node.id}
          position={node.pos}
          label={node.label}
          color={node.color}
          glowColor={node.glow}
          size={[2.8, 0.9, 0.2]}
          active={currentStep === 0 || activeNodes.includes(node.id)}
          highlighted={activeNodes.includes(node.id) && currentStep > 0}
          delay={i * 0.1}
        />
      ))}
      {CONNECTIONS.map((conn, i) => (
        <ConnectionLine
          key={i}
          start={NODES[conn.from].pos}
          end={NODES[conn.to].pos}
          color={NODES[conn.to].glow}
          active={activeConns.includes(i)}
          animated={activeConns.includes(i)}
        />
      ))}
    </Scene>
  );
}

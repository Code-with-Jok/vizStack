/**
 * Utility để transform nội dung lesson (blocks) thành 2D/3D visualization nodes
 * Ánh xạ trực tiếp từ chapter content → visualization schema
 */

export interface VizNode {
  id: string;
  label: string;
  x: number;
  y: number;
  color: string;
  glowColor: string;
  width?: number;
  height?: number;
}

export interface Viz3DConnection {
  fromIndex: number;
  toIndex: number;
}

export interface Viz3DSchema {
  nodes: VizNode[];
  connections: Viz3DConnection[];
  cameraPosition?: [number, number, number];
}

export interface Viz2DNode {
  id: string;
  label: string;
  x: number;
  y: number;
  color: string;
  width?: number;
  height?: number;
}

export interface Viz2DEdge {
  fromId: string;
  toId: string;
  label?: string;
}

export interface Viz2DSchema {
  nodes: Viz2DNode[];
  edges: Viz2DEdge[];
  viewport?: {
    width: number;
    height: number;
  };
}

interface ContentBlock {
  type: string;
  text_en?: string;
  text_vi?: string;
  code?: string;
  language?: string;
  filename?: string;
  calloutType?: string;
  headers?: string[];
  rows?: string[][];
  imageUrl?: string;
  caption_en?: string;
  caption_vi?: string;
}

interface ExtractionConfig {
  locale?: "en" | "vi";
  maxNodes?: number;
}

/**
 * Extract concepts từ chapter blocks
 * Dùng heuristics để tìm key terms và concepts từ text blocks
 */
function extractConcepts(
  blocks: ContentBlock[] | undefined,
  locale: "en" | "vi" = "en"
): { concepts: string[]; codeExamples: string[] } {
  if (!blocks || blocks.length === 0) {
    return { concepts: [], codeExamples: [] };
  }

  const concepts: string[] = [];
  const codeExamples: string[] = [];

  blocks.forEach((block) => {
    if (block.type === "text") {
      const text = locale === "vi" ? block.text_vi : block.text_en;
      if (text) {
        // Extract text in backticks (inline code)
        const inlineCodeMatches = text.match(/`([^`]+)`/g);
        if (inlineCodeMatches) {
          inlineCodeMatches.forEach((match) => {
            const term = match.replace(/`/g, "").trim();
            if (term && !concepts.includes(term)) {
              concepts.push(term);
            }
          });
        }

        // Extract bold text (often key concepts - ** or __)
        const boldMatches = text.match(/\*\*([^*]+)\*\*|__([^_]+)__/g);
        if (boldMatches) {
          boldMatches.forEach((match) => {
            const term = match.replace(/(\*\*|__)/g, "").trim();
            if (term && !concepts.includes(term)) {
              concepts.push(term);
            }
          });
        }

        // Extract headings (## style)
        const headingMatches = text.match(/^#+\s+(.+)$/gm);
        if (headingMatches) {
          headingMatches.forEach((match) => {
            const term = match.replace(/^#+\s+/, "").trim();
            if (term && !concepts.includes(term)) {
              concepts.push(term);
            }
          });
        }
      }
    } else if (block.type === "code") {
      if (block.filename) {
        codeExamples.push(block.filename);
      }
      if (block.language) {
        codeExamples.push(`${block.language} code`);
      }
    } else if (block.type === "callout") {
      // Callout titles/types as concepts
      if (block.calloutType) {
        const label = `${block.calloutType[0].toUpperCase()}${block.calloutType.slice(1)}`;
        if (!concepts.includes(label)) {
          concepts.push(label);
        }
      }
    }
  });

  return { concepts: concepts.slice(0, 20), codeExamples };
}

/**
 * Generate 2D layout grid positions cho nodes
 */
function generate2DLayout(
  nodeCount: number,
  config?: { cellWidth?: number; cellHeight?: number }
): Array<[number, number]> {
  // Increased spacing from 3.5/2.5 to 5.5/4.0 to prevent overlaps
  const { cellWidth = 5.5, cellHeight = 4.0 } = config || {};
  const cols = Math.ceil(Math.sqrt(nodeCount));
  const positions: Array<[number, number]> = [];

  for (let i = 0; i < nodeCount; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;

    // Add subtle random jitter to x-axis to prevent perfect vertical alignment
    const jitter = (Math.random() - 0.5) * 0.8;

    const x = col * cellWidth - (cols * cellWidth) / 2 + jitter;
    const y = row * cellHeight - (Math.ceil(nodeCount / cols) / 2) * cellHeight;
    positions.push([x, y]);
  }

  return positions;
}

/**
 * Generate 3D layout tree positions cho nodes
 */
function generate3DLayout(nodeCount: number): Array<[number, number, number]> {
  const positions: Array<[number, number, number]> = [];

  if (nodeCount === 0) return positions;

  // Root node at top center
  positions.push([0, 5, 0]);

  if (nodeCount === 1) return positions;

  // Arrange remaining nodes in semi-circle around root with increased radius
  const radius = 6;
  const angleStep = Math.PI / (nodeCount - 1);

  for (let i = 1; i < nodeCount; i++) {
    const angle = angleStep * i - Math.PI / 2;

    // Add small random noise to make it less rigid
    const noiseX = (Math.random() - 0.5) * 0.5;
    const noiseZ = (Math.random() - 0.5) * 0.5;

    const x = radius * Math.cos(angle) + noiseX;
    const y = 2 - i * 2.0; // Increased vertical drop from 1.5 to 2.0
    const z = radius * Math.sin(angle) + noiseZ;
    positions.push([x, y, z]);
  }

  return positions;
}

/**
 * Color palette cho visualization
 */
const COLOR_PALETTE = [
  { color: "#1e3a5f", glow: "#00d4ff" }, // Cyan
  { color: "#2d1b4e", glow: "#7c3aed" }, // Purple
  { color: "#1b3d2f", glow: "#10b981" }, // Green
  { color: "#3d2d1b", glow: "#f59e0b" }, // Orange
  { color: "#4c1d1d", glow: "#ef4444" }, // Red
  { color: "#1f3a4d", glow: "#06b6d4" }, // Cyan-dark
  { color: "#3d2d3d", glow: "#a78bfa" }, // Purple-light
  { color: "#2d3d2d", glow: "#34d399" }, // Green-light
];

function getColorForIndex(index: number): { color: string; glow: string } {
  return COLOR_PALETTE[index % COLOR_PALETTE.length];
}

/**
 * Main: Transform chapter blocks → Viz schemas
 */
export function contentToVisualization(
  blocks: ContentBlock[] | undefined,
  locale: "en" | "vi" = "en",
  chapterTitle: string = "Lesson"
): {
  viz2d: Viz2DSchema;
  viz3d: Viz3DSchema & { cameraPosition: [number, number, number] };
} {
  const { concepts, codeExamples } = extractConcepts(blocks, locale);

  // Combine concepts và code examples, limit to ~12 nodes
  const allNodes = [...concepts, ...codeExamples].slice(0, 12);
  const nodeCount = Math.max(1, allNodes.length);

  if (nodeCount === 0) {
    // Fallback: create minimal visualization
    return {
      viz2d: createDefaultViz2D(chapterTitle),
      viz3d: createDefaultViz3D(),
    };
  }

  // Generate positions
  const positions2D = generate2DLayout(nodeCount);
  const positions3D = generate3DLayout(nodeCount);

  // Create nodes
  const viz2dNodes: Viz2DNode[] = allNodes.map((label, idx) => ({
    id: `node_${idx}`,
    label,
    x: positions2D[idx][0],
    y: positions2D[idx][1],
    color: getColorForIndex(idx).color,
    width: 100,
    height: 50,
  }));

  const viz3dNodes: VizNode[] = allNodes.map((label, idx) => {
    const colorPair = getColorForIndex(idx);
    return {
      id: `node_${idx}`,
      label,
      x: positions3D[idx][0],
      y: positions3D[idx][1],
      color: colorPair.color,
      glowColor: colorPair.glow,
    };
  });

  // Create connections (simple: root to others)
  const connections3D: Viz3DConnection[] = [];
  for (let i = 1; i < nodeCount; i++) {
    connections3D.push({ fromIndex: 0, toIndex: i });
  }

  const viz2dEdges: Viz2DEdge[] = [];
  for (let i = 1; i < nodeCount; i++) {
    viz2dEdges.push({
      fromId: `node_0`,
      toId: `node_${i}`,
    });
  }

  // Build 2D/3D schemas
  const viz2d: Viz2DSchema = {
    nodes: viz2dNodes,
    edges: viz2dEdges,
    viewport: { width: 900, height: 560 },
  };

  const viz3d: Viz3DSchema & { cameraPosition: [number, number, number] } = {
    nodes: viz3dNodes,
    connections: connections3D,
    cameraPosition: [0, 2, 16],
  };

  return { viz2d, viz3d };
}

/**
 * Default visualization nếu không có content
 */
function createDefaultViz2D(title: string): Viz2DSchema {
  return {
    nodes: [
      {
        id: "main",
        label: title,
        x: 0,
        y: 0,
        color: "#1e3a5f",
      },
    ],
    edges: [],
    viewport: { width: 900, height: 560 },
  };
}

function createDefaultViz3D(): Viz3DSchema & {
  cameraPosition: [number, number, number];
} {
  return {
    nodes: [
      {
        id: "main",
        label: "Lesson",
        x: 0,
        y: 0,
        color: "#1e3a5f",
        glowColor: "#00d4ff",
      },
    ],
    connections: [],
    cameraPosition: [0, 0, 10],
  };
}

/**
 * Build visualization từ text content (legacy support)
 */
export function textToVisualization(
  text: string | undefined,
  title: string = "Lesson"
): {
  viz2d: Viz2DSchema;
  viz3d: Viz3DSchema & { cameraPosition: [number, number, number] };
} {
  if (!text) {
    return {
      viz2d: createDefaultViz2D(title),
      viz3d: createDefaultViz3D(),
    };
  }

  // Extract concepts from raw text
  const codeMatches = text.match(/`([^`]+)`/g) || [];
  const boldMatches = text.match(/\*\*([^*]+)\*\*|__([^_]+)__/g) || [];

  const concepts = [
    ...codeMatches.map((m) => m.replace(/`/g, "")),
    ...boldMatches.map((m) => m.replace(/(\*\*|__)/g, "")),
  ].slice(0, 12);

  if (concepts.length === 0) {
    return {
      viz2d: createDefaultViz2D(title),
      viz3d: createDefaultViz3D(),
    };
  }

  // Same layout generation
  const positions2D = generate2DLayout(concepts.length);
  const positions3D = generate3DLayout(concepts.length);

  const viz2dNodes: Viz2DNode[] = concepts.map((label, idx) => ({
    id: `node_${idx}`,
    label,
    x: positions2D[idx][0],
    y: positions2D[idx][1],
    color: getColorForIndex(idx).color,
  }));

  const viz3dNodes: VizNode[] = concepts.map((label, idx) => {
    const colorPair = getColorForIndex(idx);
    return {
      id: `node_${idx}`,
      label,
      x: positions3D[idx][0],
      y: positions3D[idx][1],
      color: colorPair.color,
      glowColor: colorPair.glow,
    };
  });

  // Connections
  const connections3D: Viz3DConnection[] = [];
  for (let i = 1; i < concepts.length; i++) {
    connections3D.push({ fromIndex: 0, toIndex: i });
  }

  const viz2dEdges: Viz2DEdge[] = [];
  for (let i = 1; i < concepts.length; i++) {
    viz2dEdges.push({ fromId: `node_0`, toId: `node_${i}` });
  }

  return {
    viz2d: {
      nodes: viz2dNodes,
      edges: viz2dEdges,
      viewport: { width: 900, height: 560 },
    },
    viz3d: {
      nodes: viz3dNodes,
      connections: connections3D,
      cameraPosition: [0, 2, 16],
    },
  };
}

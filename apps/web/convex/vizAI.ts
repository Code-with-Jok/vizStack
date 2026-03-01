"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { generateObject } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";

/**
 * AI Viz Generator — Uses Gemini to analyze walkthrough content
 * and generate a static 3D vizConfig (nodes, connections).
 * Overwrites any existing vizConfig on the walkthrough.
 */

const MODEL_AI = process.env.MODEL_AI || "gemini-2.0-flash";
const USE_MOCK = process.env.USE_MOCK_VIZ === "true";

const ORCHESTRATOR_SYSTEM_PROMPT = `You are an AI Orchestrator for a learning visualization system.
Follow the requested flow strictly and return JSON only.`;

const knowledgeGraphSchema = z.object({
  knowledge_graph: z.object({
    module: z.object({
      id: z.string(),
      title: z.string(),
    }),
    chapter: z.object({
      id: z.string(),
      title: z.string(),
    }),
    lesson: z.object({
      id: z.string(),
      title: z.string(),
    }),
    nodes: z.array(
      z.object({
        id: z.string(),
        label: z.string(),
        type: z.string(),
      })
    ),
    edges: z.array(
      z.object({
        from: z.string(),
        to: z.string(),
        relation: z.string(),
      })
    ),
  }),
});

const visualization2dSchema = z.object({
  visualization_2d_schema: z.object({
    nodes: z.array(
      z.object({
        id: z.string(),
        label: z.string(),
        x: z.number(),
        y: z.number(),
        color: z.string(),
        width: z.optional(z.number()),
        height: z.optional(z.number()),
      })
    ),
    edges: z.array(
      z.object({
        fromId: z.string(),
        toId: z.string(),
        label: z.optional(z.string()),
      })
    ),
    viewport: z
      .object({
        width: z.number(),
        height: z.number(),
      })
      .optional(),
  }),
});

const visualization3dSchema = z.object({
  visualization_3d_schema: z.object({
    nodes: z.array(
      z.object({
        id: z.string(),
        label: z.string(),
        x: z.number(),
        y: z.number(),
        color: z.string(),
        glowColor: z.string(),
        width: z.optional(z.number()),
        height: z.optional(z.number()),
      })
    ),
    connections: z.array(
      z.object({
        fromIndex: z.number().int().nonnegative(),
        toIndex: z.number().int().nonnegative(),
      })
    ),
    cameraPosition: z
      .tuple([z.number(), z.number(), z.number()])
      .describe("Camera position [x, y, z], usually [0, 1, 16]"),
  }),
});

/* ─── Mock vizConfigs for testing ─── */

type MockVizType = {
  nodes: {
    id: string;
    label: string;
    x: number;
    y: number;
    color: string;
    glowColor: string;
    width?: number;
    height?: number;
  }[];
  connections: { fromIndex: number; toIndex: number }[];
  cameraPosition: [number, number, number];
};

const MOCK_VIZ: Record<string, MockVizType> = {
  Component: {
    nodes: [
      {
        id: "react_component",
        label: "React Component",
        x: 0,
        y: 6.5,
        color: "#7c3aed",
        glowColor: "#a78bfa",
      },
      {
        id: "function_component",
        label: "Function Component (+ Hooks)",
        x: -4,
        y: 4,
        color: "#10b981",
        glowColor: "#34d399",
      },
      {
        id: "class_component",
        label: "Class Component (Legacy)",
        x: 4,
        y: 4,
        color: "#EC4899",
        glowColor: "#f472b6",
      },
      {
        id: "reusability",
        label: "Tái sử dụng",
        x: -6,
        y: 1,
        color: "#56D9D1",
        glowColor: "#99f6e4",
      },
      {
        id: "modularity",
        label: "Mô-đun hóa",
        x: -3,
        y: 1,
        color: "#3B82F6",
        glowColor: "#93c5fd",
      },
      {
        id: "maintainability",
        label: "Bảo trì dễ dàng",
        x: 0,
        y: 1,
        color: "#10b981",
        glowColor: "#34d399",
      },
      {
        id: "encapsulation",
        label: "Tính đóng gói",
        x: 3,
        y: 1,
        color: "#F59E0B",
        glowColor: "#fcd34d",
      },
      {
        id: "composition",
        label: "Khả năng kết hợp",
        x: 6,
        y: 1,
        color: "#EF4444",
        glowColor: "#fca5a5",
      },
      {
        id: "testing",
        label: "Dễ kiểm thử",
        x: 0,
        y: -2,
        color: "#10b981",
        glowColor: "#34d399",
      },
    ],
    connections: [
      { fromIndex: 0, toIndex: 1 },
      { fromIndex: 0, toIndex: 2 },
      { fromIndex: 0, toIndex: 3 },
      { fromIndex: 0, toIndex: 4 },
      { fromIndex: 0, toIndex: 5 },
      { fromIndex: 0, toIndex: 6 },
      { fromIndex: 0, toIndex: 7 },
      { fromIndex: 6, toIndex: 8 },
    ],
    cameraPosition: [0, 4, 18],
  },
};

MOCK_VIZ["What is a Component?"] = MOCK_VIZ["Component"];
MOCK_VIZ["State — Dynamic Data"] = MOCK_VIZ["Component"]; // mapping for title_vi test

/* ─── Action ─── */

const DEFAULT_VIEWPORT = { width: 900, height: 560 };

type LessonMeta = {
  moduleId: string;
  moduleTitle: string;
  chapterId: string;
  chapterTitle: string;
  lessonId: string;
  lessonTitle: string;
};

const toId = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const titleizeSlug = (value: string) =>
  value
    .replace(/[-_]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");

const extractTextFromBlockNote = (content?: string) => {
  if (!content) return "";
  const trimmed = content.trim();
  if (!trimmed) return "";

  try {
    const parsed = JSON.parse(trimmed);
    if (!Array.isArray(parsed)) return content;

    const lines: string[] = [];
    const readInline = (inline: unknown) => {
      if (typeof inline === "string") return inline;
      if (
        inline &&
        typeof inline === "object" &&
        "text" in inline &&
        typeof (inline as { text?: string }).text === "string"
      ) {
        return (inline as { text: string }).text;
      }
      return "";
    };
    const walkBlock = (block: any) => {
      if (!block) return;
      const parts: string[] = [];

      if (typeof block.text === "string") {
        parts.push(block.text);
      }

      if (Array.isArray(block.content)) {
        for (const inline of block.content) {
          const text = readInline(inline);
          if (text) parts.push(text);
        }
      }

      if (block.props && typeof block.props.code === "string") {
        parts.push(block.props.code);
      }

      if (parts.length > 0) {
        lines.push(parts.join(""));
      }

      if (Array.isArray(block.children)) {
        block.children.forEach(walkBlock);
      }
    };

    parsed.forEach(walkBlock);
    return lines.join("\n");
  } catch {
    return content;
  }
};

const buildLessonContent = (meta: LessonMeta, lessonBody: string) => {
  const body = lessonBody.trim();
  return [
    `MODULE: ${meta.moduleTitle}`,
    `CHAPTER: ${meta.chapterTitle}`,
    `LESSON: ${meta.lessonTitle}`,
    "",
    "CONTENT:",
    body || "No content provided.",
  ].join("\n");
};

const buildParserPrompt = (lessonContent: string) => `
Analyze the lesson content and extract a knowledge graph JSON.
Return JSON only using the schema provided.

REQUIREMENTS:
- Identify module, chapter, and lesson titles from the content.
- Create 6-16 concept nodes with clear labels and type (concept, example, rule, or component).
- Create edges with a short relation label (e.g. "uses", "returns", "includes").
- Use stable snake_case ids for nodes.

INPUT:
${lessonContent}
`;

const build2dPrompt = (knowledgeGraph: unknown) => `
Generate a 2D visualization schema from the knowledge graph.
Return JSON only using the schema provided.

RULES:
- Keep node ids identical to the knowledge graph ids.
- Use a readable layout (root/top concepts above, details below).
- Keep x range roughly -6 to 6 and y range -4 to 6 unless needed.
- Provide a viewport size around ${DEFAULT_VIEWPORT.width}x${DEFAULT_VIEWPORT.height}.
- Ensure every edge maps to valid node ids.

KNOWLEDGE_GRAPH:
${JSON.stringify(knowledgeGraph, null, 2)}
`;

const build3dPrompt = (knowledgeGraph: unknown, viz2d: unknown) => `
Map the 2D schema into a 3D visualization schema.
Return JSON only using the schema provided.

RULES:
- Keep node ordering identical to the 2D schema.
- Use the same x/y positions, add glowColor for each node.
- Convert 2D edges into connections using node index positions.
- Provide a cameraPosition like [0, 1, 16].

KNOWLEDGE_GRAPH:
${JSON.stringify(knowledgeGraph, null, 2)}

VISUALIZATION_2D_SCHEMA:
${JSON.stringify(viz2d, null, 2)}
`;

const buildMockOutput = (
  meta: LessonMeta,
  mockViz: (typeof MOCK_VIZ)[string]
) => {
  const knowledgeGraph = {
    module: { id: meta.moduleId, title: meta.moduleTitle },
    chapter: { id: meta.chapterId, title: meta.chapterTitle },
    lesson: { id: meta.lessonId, title: meta.lessonTitle },
    nodes: mockViz.nodes.map((node) => ({
      id: node.id,
      label: node.label,
      type: "concept",
    })),
    edges: mockViz.connections.map((conn) => ({
      from: mockViz.nodes[conn.fromIndex]?.id ?? "unknown",
      to: mockViz.nodes[conn.toIndex]?.id ?? "unknown",
      relation: "relates_to",
    })),
  };

  const visualization2dSchema = {
    nodes: mockViz.nodes.map((node) => ({
      id: node.id,
      label: node.label,
      x: node.x,
      y: node.y,
      color: node.color,
      width: node.width,
      height: node.height,
    })),
    edges: mockViz.connections.map((conn) => ({
      fromId: mockViz.nodes[conn.fromIndex]?.id ?? "unknown",
      toId: mockViz.nodes[conn.toIndex]?.id ?? "unknown",
    })),
    viewport: DEFAULT_VIEWPORT,
  };

  const visualization3dSchema = {
    nodes: mockViz.nodes,
    connections: mockViz.connections,
    cameraPosition: mockViz.cameraPosition,
  };

  return {
    knowledgeGraph,
    visualization2dSchema,
    visualization3dSchema,
  };
};

export const generateVizFromContent = action({
  args: {
    chapterId: v.id("chapters"),
    order: v.number(),
    title: v.string(),
    content: v.string(),
  },
  handler: async (ctx, { chapterId, order, title, content }) => {
    const chapter = await ctx.runQuery(api.chapters.getById, { id: chapterId });
    if (!chapter) {
      throw new Error(`Chapter not found: ${chapterId}`);
    }

    const walkthrough = await ctx.runQuery(api.walkthroughs.getById, {
      id: chapter.walkthroughId,
    });

    console.log(`[vizAI] Processing chapter: ${chapter._id}`);

    const moduleId = walkthrough?.courseSlug ?? "module";
    const moduleTitle = walkthrough?.courseSlug
      ? titleizeSlug(walkthrough.courseSlug)
      : "Module";
    const chapterTitle = walkthrough?.title_en ?? `Chapter ${order}`;
    const chapterSlug = walkthrough?.slug ?? toId(chapterTitle);
    const lessonTitle = title || chapter.title_en || `Lesson ${order}`;
    const lessonId = toId(lessonTitle) || `lesson_${order}`;

    const meta: LessonMeta = {
      moduleId,
      moduleTitle,
      chapterId: chapterSlug,
      chapterTitle,
      lessonId,
      lessonTitle,
    };

    const rawLessonBody = extractTextFromBlockNote(content);
    if (!rawLessonBody || rawLessonBody.trim() === "") {
      throw new Error(
        "Nội dung bài học trống! Vui lòng nhập nội dung trước khi tạo 2D/3D."
      );
    }

    const lessonBody =
      rawLessonBody.length > 4000
        ? `${rawLessonBody.slice(0, 4000)}...`
        : rawLessonBody;
    const lessonContent = buildLessonContent(meta, lessonBody);

    // -- Mock mode: match by single chapter title --
    if (USE_MOCK) {
      const mockKey = title || chapter.title_en;
      const mockViz = MOCK_VIZ[mockKey] ?? MOCK_VIZ[chapter.title_en];
      if (mockViz) {
        console.log(`[vizAI] Using mock for chapter: "${mockKey}"`);
        const { knowledgeGraph, visualization2dSchema, visualization3dSchema } =
          buildMockOutput(meta, mockViz);

        await ctx.runMutation(api.chapters.update, {
          id: chapterId,
          vizConfig: visualization3dSchema,
          knowledgeGraph,
          visualization2dSchema,
          visualization3dSchema,
        });

        return {
          success: true,
          knowledge_graph: knowledgeGraph,
          visualization_2d_schema: visualization2dSchema,
          visualization_3d_schema: visualization3dSchema,
          nodeCount: visualization3dSchema.nodes.length,
          connectionCount: visualization3dSchema.connections.length,
        };
      }
      console.log(
        `[vizAI] No mock found for: "${mockKey}", falling through to AI`
      );
    }

    // -- Real AI mode --
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      throw new Error("Missing GOOGLE_GENERATIVE_AI_API_KEY env var");
    }

    const google = createGoogleGenerativeAI({ apiKey });

    const { object: knowledgeGraphObject } = await generateObject({
      model: google(MODEL_AI),
      schema: knowledgeGraphSchema,
      system: ORCHESTRATOR_SYSTEM_PROMPT,
      prompt: buildParserPrompt(lessonContent),
      temperature: 0.2,
    });
    const knowledgeGraph = knowledgeGraphObject.knowledge_graph;

    const { object: visualization2dObject } = await generateObject({
      model: google(MODEL_AI),
      schema: visualization2dSchema,
      system: ORCHESTRATOR_SYSTEM_PROMPT,
      prompt: build2dPrompt(knowledgeGraph),
      temperature: 0.2,
    });
    const visualization2dSchemaResult =
      visualization2dObject.visualization_2d_schema;

    const { object: visualization3dObject } = await generateObject({
      model: google(MODEL_AI),
      schema: visualization3dSchema,
      system: ORCHESTRATOR_SYSTEM_PROMPT,
      prompt: build3dPrompt(knowledgeGraph, visualization2dSchemaResult),
      temperature: 0.2,
    });
    const visualization3dSchemaResult =
      visualization3dObject.visualization_3d_schema;

    await ctx.runMutation(api.chapters.update, {
      id: chapterId,
      vizConfig: visualization3dSchemaResult,
      knowledgeGraph,
      visualization2dSchema: visualization2dSchemaResult,
      visualization3dSchema: visualization3dSchemaResult,
    });

    return {
      success: true,
      knowledge_graph: knowledgeGraph,
      visualization_2d_schema: visualization2dSchemaResult,
      visualization_3d_schema: visualization3dSchemaResult,
      nodeCount: visualization3dSchemaResult.nodes.length,
      connectionCount: visualization3dSchemaResult.connections.length,
    };
  },
});

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

/* ─── Mock vizConfigs for testing ─── */

const MOCK_VIZ: Record<
  string,
  {
    nodes: {
      id: string;
      label: string;
      x: number;
      y: number;
      color: string;
      glowColor: string;
    }[];
    connections: { fromIndex: number; toIndex: number }[];
    cameraPosition: [number, number, number];
  }
> = {
  // Lesson 1: What is a Component?
  "What is a Component?": {
    nodes: [
      {
        id: "component",
        label: "Component",
        x: 0,
        y: 5,
        color: "#7c3aed",
        glowColor: "#7c3aed",
      },
      {
        id: "function",
        label: "JS Function",
        x: -3.5,
        y: 3,
        color: "#56D9D1",
        glowColor: "#56D9D1",
      },
      {
        id: "jsx_return",
        label: "Returns JSX",
        x: 3.5,
        y: 3,
        color: "#56D9D1",
        glowColor: "#56D9D1",
      },
      {
        id: "button",
        label: "Button",
        x: -5,
        y: 1,
        color: "#10b981",
        glowColor: "#10b981",
      },
      {
        id: "props",
        label: "Props { label }",
        x: -1.5,
        y: 1,
        color: "#FF9B62",
        glowColor: "#FF9B62",
      },
      {
        id: "html_tag",
        label: "<button>",
        x: 2,
        y: 1,
        color: "#EC4899",
        glowColor: "#EC4899",
      },
      {
        id: "classname",
        label: "className",
        x: 5.5,
        y: 1,
        color: "#EC4899",
        glowColor: "#EC4899",
      },
      {
        id: "uppercase",
        label: "UPPERCASE ✓",
        x: 0,
        y: -1.5,
        color: "#10b981",
        glowColor: "#10b981",
      },
    ],
    connections: [
      { fromIndex: 0, toIndex: 1 },
      { fromIndex: 0, toIndex: 2 },
      { fromIndex: 1, toIndex: 3 },
      { fromIndex: 1, toIndex: 4 },
      { fromIndex: 2, toIndex: 5 },
      { fromIndex: 2, toIndex: 6 },
      { fromIndex: 3, toIndex: 7 },
    ],
    cameraPosition: [0, 1, 16],
  },

  // Lesson 2: The Component Tree
  "The Component Tree": {
    nodes: [
      {
        id: "app",
        label: "App (Root)",
        x: 0,
        y: 5.5,
        color: "#7c3aed",
        glowColor: "#7c3aed",
      },
      {
        id: "header",
        label: "Header",
        x: -4.5,
        y: 3.5,
        color: "#56D9D1",
        glowColor: "#56D9D1",
      },
      {
        id: "main",
        label: "Main",
        x: 0,
        y: 3.5,
        color: "#10b981",
        glowColor: "#10b981",
      },
      {
        id: "footer",
        label: "Footer",
        x: 4.5,
        y: 3.5,
        color: "#56D9D1",
        glowColor: "#56D9D1",
      },
      {
        id: "nav",
        label: "Nav",
        x: -6,
        y: 1.5,
        color: "#FF9B62",
        glowColor: "#FF9B62",
      },
      {
        id: "logo",
        label: "Logo",
        x: -3,
        y: 1.5,
        color: "#FF9B62",
        glowColor: "#FF9B62",
      },
      {
        id: "productList",
        label: "ProductList",
        x: -1,
        y: 1.5,
        color: "#EC4899",
        glowColor: "#EC4899",
      },
      {
        id: "sidebar",
        label: "Sidebar",
        x: 2,
        y: 1.5,
        color: "#10b981",
        glowColor: "#10b981",
      },
      {
        id: "data_flow",
        label: "Props ↓ Data Flow",
        x: 0,
        y: -1.5,
        color: "#FF9B62",
        glowColor: "#FF9B62",
      },
    ],
    connections: [
      { fromIndex: 0, toIndex: 1 },
      { fromIndex: 0, toIndex: 2 },
      { fromIndex: 0, toIndex: 3 },
      { fromIndex: 1, toIndex: 4 },
      { fromIndex: 1, toIndex: 5 },
      { fromIndex: 2, toIndex: 6 },
      { fromIndex: 2, toIndex: 7 },
      { fromIndex: 6, toIndex: 8 },
    ],
    cameraPosition: [0, 1, 16],
  },

  // Lesson 3: JSX
  JSX: {
    nodes: [
      {
        id: "jsx",
        label: "JSX Code",
        x: -4,
        y: 5,
        color: "#7c3aed",
        glowColor: "#7c3aed",
      },
      {
        id: "compiler",
        label: "Babel / SWC",
        x: 0,
        y: 5,
        color: "#FF9B62",
        glowColor: "#FF9B62",
      },
      {
        id: "createElement",
        label: "React.createElement()",
        x: 4,
        y: 5,
        color: "#10b981",
        glowColor: "#10b981",
      },
      {
        id: "h1",
        label: "<h1>",
        x: -5,
        y: 3,
        color: "#56D9D1",
        glowColor: "#56D9D1",
      },
      {
        id: "className",
        label: "className",
        x: -1.75,
        y: 3,
        color: "#EC4899",
        glowColor: "#EC4899",
      },
      {
        id: "htmlFor",
        label: "htmlFor",
        x: 1.75,
        y: 3,
        color: "#EC4899",
        glowColor: "#EC4899",
      },
      {
        id: "curly",
        label: "{ } Expressions",
        x: 5,
        y: 3,
        color: "#FF9B62",
        glowColor: "#FF9B62",
      },
      {
        id: "greeting",
        label: "Greeting()",
        x: -2.5,
        y: 1,
        color: "#56D9D1",
        glowColor: "#56D9D1",
      },
      {
        id: "ternary",
        label: "Ternary ? :",
        x: 1,
        y: 1,
        color: "#10b981",
        glowColor: "#10b981",
      },
      {
        id: "date",
        label: "new Date()",
        x: 4.5,
        y: 1,
        color: "#10b981",
        glowColor: "#10b981",
      },
    ],
    connections: [
      { fromIndex: 0, toIndex: 1 },
      { fromIndex: 1, toIndex: 2 },
      { fromIndex: 0, toIndex: 3 },
      { fromIndex: 0, toIndex: 4 },
      { fromIndex: 0, toIndex: 5 },
      { fromIndex: 0, toIndex: 6 },
      { fromIndex: 6, toIndex: 7 },
      { fromIndex: 7, toIndex: 8 },
      { fromIndex: 7, toIndex: 9 },
    ],
    cameraPosition: [0, 2, 16],
  },

  // Lesson 4: Props — Passing Data
  "Props — Passing Data": {
    nodes: [
      {
        id: "parent",
        label: "Parent Component",
        x: 0,
        y: 5.5,
        color: "#7c3aed",
        glowColor: "#7c3aed",
      },
      {
        id: "props_data",
        label: "Props { name, price }",
        x: 0,
        y: 3.5,
        color: "#FF9B62",
        glowColor: "#FF9B62",
      },
      {
        id: "product_card",
        label: "ProductCard",
        x: 0,
        y: 1.5,
        color: "#56D9D1",
        glowColor: "#56D9D1",
      },
      {
        id: "name_display",
        label: "<h3>{name}</h3>",
        x: -3.5,
        y: -1,
        color: "#10b981",
        glowColor: "#10b981",
      },
      {
        id: "price_display",
        label: "<span>{price}</span>",
        x: 0,
        y: -1,
        color: "#10b981",
        glowColor: "#10b981",
      },
      {
        id: "children_prop",
        label: "children prop",
        x: 3.5,
        y: -1,
        color: "#EC4899",
        glowColor: "#EC4899",
      },
    ],
    connections: [
      { fromIndex: 0, toIndex: 1 },
      { fromIndex: 1, toIndex: 2 },
      { fromIndex: 2, toIndex: 3 },
      { fromIndex: 2, toIndex: 4 },
      { fromIndex: 2, toIndex: 5 },
    ],
    cameraPosition: [0, 1, 16],
  },

  // Lesson 5: State — Dynamic Data
  "State — Dynamic Data": {
    nodes: [
      {
        id: "counter",
        label: "Counter Component",
        x: 0,
        y: 5.5,
        color: "#7c3aed",
        glowColor: "#7c3aed",
      },
      {
        id: "use_state",
        label: "useState(0)",
        x: -4.5,
        y: 3.5,
        color: "#FF9B62",
        glowColor: "#FF9B62",
      },
      {
        id: "state_val",
        label: "count (Value)",
        x: -2.75,
        y: 1.5,
        color: "#10b981",
        glowColor: "#10b981",
      },
      {
        id: "state_setter",
        label: "setCount (Setter)",
        x: -6.25,
        y: 1.5,
        color: "#EC4899",
        glowColor: "#EC4899",
      },
      {
        id: "ui_p",
        label: "<p>{count}</p>",
        x: 3,
        y: 3.5,
        color: "#56D9D1",
        glowColor: "#56D9D1",
      },
      {
        id: "btn_inc",
        label: "button +1",
        x: 1.5,
        y: 1.5,
        color: "#56D9D1",
        glowColor: "#56D9D1",
      },
      {
        id: "btn_dec",
        label: "button -1",
        x: 4.5,
        y: 1.5,
        color: "#56D9D1",
        glowColor: "#56D9D1",
      },
      {
        id: "re_render",
        label: "Auto Re-render ↺",
        x: 0,
        y: -1,
        color: "#FF9B62",
        glowColor: "#FF9B62",
      },
    ],
    connections: [
      { fromIndex: 0, toIndex: 1 },
      { fromIndex: 1, toIndex: 2 },
      { fromIndex: 1, toIndex: 3 },
      { fromIndex: 0, toIndex: 4 },
      { fromIndex: 4, toIndex: 5 },
      { fromIndex: 4, toIndex: 6 },
      { fromIndex: 2, toIndex: 7 },
    ],
    cameraPosition: [0, 1, 16],
  },

  // Lesson 6: Conditional Rendering
  "Conditional Rendering": {
    nodes: [
      {
        id: "login_status",
        label: "LoginStatus",
        x: 0,
        y: 5.5,
        color: "#7c3aed",
        glowColor: "#7c3aed",
      },
      {
        id: "condition",
        label: "isLoggedIn ?",
        x: 0,
        y: 3.5,
        color: "#FF9B62",
        glowColor: "#FF9B62",
      },
      {
        id: "dash",
        label: "UserDashboard ✅",
        x: -3.5,
        y: 1.5,
        color: "#10b981",
        glowColor: "#10b981",
      },
      {
        id: "form",
        label: "LoginForm ❌",
        x: 3.5,
        y: 1.5,
        color: "#EC4899",
        glowColor: "#EC4899",
      },
      {
        id: "and_op",
        label: "&& Operator",
        x: -4.5,
        y: -0.5,
        color: "#56D9D1",
        glowColor: "#56D9D1",
      },
      {
        id: "logout",
        label: "LogoutButton",
        x: -4.5,
        y: -2.5,
        color: "#56D9D1",
        glowColor: "#56D9D1",
      },
    ],
    connections: [
      { fromIndex: 0, toIndex: 1 },
      { fromIndex: 1, toIndex: 2 },
      { fromIndex: 1, toIndex: 3 },
      { fromIndex: 2, toIndex: 4 },
      { fromIndex: 4, toIndex: 5 },
    ],
    cameraPosition: [0, 1, 16],
  },

  // Lesson 7: Composition Pattern
  "Composition Pattern": {
    nodes: [
      {
        id: "layout",
        label: "Layout (Composition)",
        x: 0,
        y: 5.5,
        color: "#7c3aed",
        glowColor: "#7c3aed",
      },
      {
        id: "header",
        label: "Header",
        x: -5,
        y: 3.5,
        color: "#56D9D1",
        glowColor: "#56D9D1",
      },
      {
        id: "main",
        label: "Main",
        x: 0,
        y: 3.5,
        color: "#56D9D1",
        glowColor: "#56D9D1",
      },
      {
        id: "footer",
        label: "Footer",
        x: 5,
        y: 3.5,
        color: "#56D9D1",
        glowColor: "#56D9D1",
      },
      {
        id: "nav",
        label: "Nav",
        x: -6,
        y: 1.5,
        color: "#10b981",
        glowColor: "#10b981",
      },
      {
        id: "logo",
        label: "Logo",
        x: -3.5,
        y: 1.5,
        color: "#10b981",
        glowColor: "#10b981",
      },
      {
        id: "productList",
        label: "ProductList",
        x: -1,
        y: 1.5,
        color: "#10b981",
        glowColor: "#10b981",
      },
      {
        id: "sidebar",
        label: "Sidebar",
        x: 2,
        y: 1.5,
        color: "#10b981",
        glowColor: "#10b981",
      },
      {
        id: "one_thing",
        label: "DO ONE THING WELL",
        x: 0,
        y: -1,
        color: "#FF9B62",
        glowColor: "#FF9B62",
      },
    ],
    connections: [
      { fromIndex: 0, toIndex: 1 },
      { fromIndex: 0, toIndex: 2 },
      { fromIndex: 0, toIndex: 3 },
      { fromIndex: 1, toIndex: 4 },
      { fromIndex: 1, toIndex: 5 },
      { fromIndex: 2, toIndex: 6 },
      { fromIndex: 2, toIndex: 7 },
      { fromIndex: 6, toIndex: 8 },
    ],
    cameraPosition: [0, 1, 16],
  },
};

/* ─── Action ─── */

export const generateVizFromContent = action({
  args: {
    chapterId: v.id("chapters"),
    order: v.number(),
    title_en: v.string(),
    content_en: v.string(),
  },
  handler: async (ctx, { chapterId, order, title_en, content_en }) => {
    // ── Mock mode: match by single chapter title ──
    if (USE_MOCK) {
      const mockViz = MOCK_VIZ[title_en];
      if (mockViz) {
        console.log(`[vizAI] Using mock for chapter: "${title_en}"`);
        await ctx.runMutation(api.chapters.update, {
          id: chapterId,
          vizConfig: mockViz,
        });
        return {
          success: true,
          nodeCount: mockViz.nodes.length,
          connectionCount: mockViz.connections.length,
        };
      }
      console.log(
        `[vizAI] No mock found for: "${title_en}", falling through to AI`
      );
    }

    // ── Real AI mode ──
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey)
      throw new Error("Missing GOOGLE_GENERATIVE_AI_API_KEY env var");

    const google = createGoogleGenerativeAI({ apiKey });

    const chapterSummary = `## Chapter ${order}: ${title_en}\n${content_en.slice(0, 500)}`;

    const prompt = `You are a visualization architect. Given the following educational chapter about a programming topic, generate a 3D component tree visualization that illustrates the concepts discussed in this specific chapter.

CHAPTER CONTENT:
${chapterSummary}

RULES:
- Create 6-15 nodes representing the key concepts/components in the content
- Arrange nodes in a tree hierarchy (root at top y=5, children below)
- x range: -6 to 6, y range: -4 to 6
- Use visually distinct colors: blues (#1e3a5f), purples (#2d1b4e), greens (#1b3d2f), pinks (#3b1b3d), oranges (#3d2d1b)
- Glow colors should be bright: cyan (#00d4ff), purple (#7c3aed), green (#10b981), pink (#ec4899), orange (#f59e0b)
- Connections use fromIndex/toIndex (0-based index in nodes array)
- This is a STATIC visualization — all nodes and connections are always visible`;

    const { object: vizConfig } = await generateObject({
      model: google(MODEL_AI),
      schema: z.object({
        nodes: z.array(
          z.object({
            id: z.string().describe("Unique identifier"),
            label: z.string().describe("Display name"),
            x: z.number().describe("X position (-6 to 6)"),
            y: z.number().describe("Y position (-4 to 6)"),
            color: z.string().describe("Base hex color"),
            glowColor: z.string().describe("Bright hex glow color"),
          })
        ),
        connections: z.array(
          z.object({
            fromIndex: z.number().describe("Parent node index"),
            toIndex: z.number().describe("Child node index"),
          })
        ),
        cameraPosition: z
          .tuple([z.number(), z.number(), z.number()])
          .describe("Camera position [x, y, z], usually [0, 1, 16]"),
      }),
      prompt,
      temperature: 0.3,
    });

    // Save vizConfig to the specific chapter
    await ctx.runMutation(api.chapters.update, {
      id: chapterId,
      vizConfig,
    });

    return {
      success: true,
      nodeCount: vizConfig.nodes.length,
      connectionCount: vizConfig.connections.length,
    };
  },
});

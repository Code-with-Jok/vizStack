import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const vizNodeValidator = v.object({
  id: v.string(),
  label: v.string(),
  x: v.number(),
  y: v.number(),
  color: v.string(),
  glowColor: v.string(),
  width: v.optional(v.number()),
  height: v.optional(v.number()),
});

export const vizConnectionValidator = v.object({
  fromIndex: v.number(),
  toIndex: v.number(),
});

export const viz3dValidator = v.object({
  nodes: v.array(vizNodeValidator),
  connections: v.array(
    v.object({
      fromIndex: v.number(), // will be refined in vizAI.ts if needed, but schema.ts should be generic. Wait, user specifically said connections objects in 3d schema.
      toIndex: v.number(),
    })
  ),
  cameraPosition: v.array(v.number()),
});

export const knowledgeGraphValidator = v.object({
  module: v.object({
    id: v.string(),
    title: v.string(),
  }),
  chapter: v.object({
    id: v.string(),
    title: v.string(),
  }),
  lesson: v.object({
    id: v.string(),
    title: v.string(),
  }),
  nodes: v.array(
    v.object({
      id: v.string(),
      label: v.string(),
      type: v.string(),
    })
  ),
  edges: v.array(
    v.object({
      from: v.string(),
      to: v.string(),
      relation: v.string(),
    })
  ),
});

const viz2dNodeValidator = v.object({
  id: v.string(),
  label: v.string(),
  x: v.number(),
  y: v.number(),
  color: v.string(),
  width: v.optional(v.number()),
  height: v.optional(v.number()),
});

const viz2dEdgeValidator = v.object({
  fromId: v.string(),
  toId: v.string(),
  label: v.optional(v.string()),
});

export const viz2dValidator = v.object({
  nodes: v.array(viz2dNodeValidator),
  edges: v.array(viz2dEdgeValidator),
  viewport: v.optional(
    v.object({
      width: v.number(),
      height: v.number(),
    })
  ),
});

export default defineSchema({
  walkthroughs: defineTable({
    slug: v.string(),
    courseSlug: v.string(),
    title_en: v.string(),
    title_vi: v.string(),
    description_en: v.string(),
    description_vi: v.string(),
    order: v.number(),
    vizMode: v.optional(v.string()), // "data-driven" or "animated"
    vizConfig: v.optional(viz3dValidator),
  }).index("by_course_slug", ["courseSlug", "slug"]),

  chapters: defineTable({
    walkthroughId: v.id("walkthroughs"),
    order: v.number(),
    title_en: v.string(),
    title_vi: v.string(),
    content_en: v.optional(v.string()), // Deprecated, keep for legacy compatibility
    content_vi: v.optional(v.string()), // Deprecated, keep for legacy compatibility
    blocks: v.optional(
      v.array(
        v.object({
          type: v.string(), // "text" | "code" | "callout" | "table" | "image"
          text_en: v.optional(v.string()),
          text_vi: v.optional(v.string()),
          code: v.optional(v.string()),
          language: v.optional(v.string()),
          filename: v.optional(v.string()),
          calloutType: v.optional(v.string()), // "info" | "tip" | "warning"
          headers: v.optional(v.array(v.string())),
          rows: v.optional(v.array(v.array(v.string()))),
          imageUrl: v.optional(v.string()),
          caption_en: v.optional(v.string()),
          caption_vi: v.optional(v.string()),
        })
      )
    ),
    vizMode: v.optional(v.string()), // "3d" | "2d" | "hybrid" - default: "3d"
    vizConfig: v.optional(viz3dValidator),
    knowledgeGraph: v.optional(knowledgeGraphValidator),
    visualization2dSchema: v.optional(viz2dValidator),
    visualization3dSchema: v.optional(viz3dValidator),
  }).index("by_walkthrough", ["walkthroughId", "order"]),
});

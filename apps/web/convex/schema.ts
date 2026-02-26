import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const vizNodeValidator = v.object({
  id: v.string(),
  label: v.string(),
  x: v.number(),
  y: v.number(),
  color: v.string(),
  glowColor: v.string(),
  width: v.optional(v.number()),
  height: v.optional(v.number()),
});

const vizConnectionValidator = v.object({
  fromIndex: v.number(),
  toIndex: v.number(),
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
    vizConfig: v.optional(v.any()),
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
    vizConfig: v.optional(
      v.object({
        nodes: v.array(vizNodeValidator),
        connections: v.array(vizConnectionValidator),
        cameraPosition: v.array(v.number()),
      })
    ),
  }).index("by_walkthrough", ["walkthroughId", "order"]),
});

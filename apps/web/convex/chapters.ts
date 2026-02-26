import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listByWalkthrough = query({
  args: { walkthroughId: v.id("walkthroughs") },
  handler: async (ctx, { walkthroughId }) => {
    return ctx.db
      .query("chapters")
      .withIndex("by_walkthrough", (q) => q.eq("walkthroughId", walkthroughId))
      .collect();
  },
});

export const create = mutation({
  args: {
    walkthroughId: v.id("walkthroughs"),
    order: v.number(),
    title_en: v.string(),
    title_vi: v.string(),
    content_en: v.optional(v.string()),
    content_vi: v.optional(v.string()),
    blocks: v.optional(v.any()), // Array of ContentBlock
    vizConfig: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("chapters", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("chapters"),
    title_en: v.optional(v.string()),
    title_vi: v.optional(v.string()),
    content_en: v.optional(v.string()),
    content_vi: v.optional(v.string()),
    blocks: v.optional(v.any()),
    order: v.optional(v.number()),
    vizConfig: v.optional(v.any()),
  },
  handler: async (ctx, { id, ...rest }) => {
    await ctx.db.patch(id, rest);
  },
});

export const remove = mutation({
  args: { id: v.id("chapters") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

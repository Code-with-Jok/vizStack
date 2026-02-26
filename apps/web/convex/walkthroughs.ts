import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// ── Queries ──

export const getBySlug = query({
  args: { courseSlug: v.string(), slug: v.string() },
  handler: async (ctx, { courseSlug, slug }) => {
    return ctx.db
      .query("walkthroughs")
      .withIndex("by_course_slug", (q) =>
        q.eq("courseSlug", courseSlug).eq("slug", slug)
      )
      .unique();
  },
});

export const listByCourse = query({
  args: { courseSlug: v.string() },
  handler: async (ctx, { courseSlug }) => {
    return ctx.db
      .query("walkthroughs")
      .withIndex("by_course_slug", (q) => q.eq("courseSlug", courseSlug))
      .collect();
  },
});

// ── Mutations ──

export const create = mutation({
  args: {
    slug: v.string(),
    courseSlug: v.string(),
    title_en: v.string(),
    title_vi: v.string(),
    description_en: v.string(),
    description_vi: v.string(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("walkthroughs")
      .withIndex("by_course_slug", (q) =>
        q.eq("courseSlug", args.courseSlug).eq("slug", args.slug)
      )
      .first();
    if (existing) {
      throw new Error(`Walkthrough ${args.slug} already exists for course ${args.courseSlug}`);
    }
    return ctx.db.insert("walkthroughs", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("walkthroughs"),
    title_en: v.optional(v.string()),
    title_vi: v.optional(v.string()),
    description_en: v.optional(v.string()),
    description_vi: v.optional(v.string()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, { id, ...fields }) => {
    const updates: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(fields)) {
      if (val !== undefined) updates[k] = val;
    }
    if (Object.keys(updates).length > 0) {
      await ctx.db.patch(id, updates);
    }
  },
});

export const remove = mutation({
  args: { id: v.id("walkthroughs") },
  handler: async (ctx, { id }) => {
    // Also delete all chapters
    const chapters = await ctx.db
      .query("chapters")
      .withIndex("by_walkthrough", (q) => q.eq("walkthroughId", id))
      .collect();
    for (const ch of chapters) {
      await ctx.db.delete(ch._id);
    }
    await ctx.db.delete(id);
  },
});

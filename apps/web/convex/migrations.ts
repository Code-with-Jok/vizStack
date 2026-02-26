import { mutation } from "./_generated/server";

/**
 * Clean up old chapters that still have the `blocks` format.
 * After schema migration to content_en/content_vi, any documents
 * created with the old format will cause validation errors.
 */
export const cleanOldData = mutation({
  args: {},
  handler: async (ctx) => {
    const allChapters = await ctx.db.query("chapters").collect();
    let deleted = 0;
    for (const ch of allChapters) {
      // Check if old format missing blocks AND content_en
      if (ch.blocks === undefined && ch.content_en === undefined) {
        await ctx.db.delete(ch._id);
        deleted++;
      }
    }

    // Also clean walkthroughs missing vizMode
    const allWalkthroughs = await ctx.db.query("walkthroughs").collect();
    let wtDeleted = 0;
    for (const wt of allWalkthroughs) {
      // Check if old format missing vizMode
      if ((wt as Record<string, unknown>).vizMode === undefined) {
        // Delete associated chapters first
        const chapters = await ctx.db
          .query("chapters")
          .withIndex("by_walkthrough", (q) => q.eq("walkthroughId", wt._id))
          .collect();
        for (const ch of chapters) await ctx.db.delete(ch._id);
        await ctx.db.delete(wt._id);
        wtDeleted++;
      }
    }

    return `Cleaned ${deleted} old chapters, ${wtDeleted} old walkthroughs`;
  },
});

/**
 * Fix the stepMap so each chapter's 3D highlights match its content.
 */
export const fixStepMap = mutation({
  args: {},
  handler: async (ctx) => {
    const wt = await ctx.db
      .query("walkthroughs")
      .withIndex("by_course_slug", (q) =>
        q.eq("courseSlug", "react").eq("slug", "component-basics")
      )
      .unique();
    if (!wt) return "No walkthrough found";

    const newVizConfig = {
      ...wt.vizConfig,
      stepMap: {
        "0": ["app"],
        "1": [
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
        "2": ["app", "header", "main", "footer"],
        "3": [
          "app",
          "header",
          "main",
          "footer",
          "productList",
          "productCard",
          "productCard2",
        ],
        "4": ["productCard", "button", "price"],
        "5": ["app", "main", "productList", "sidebar"],
        "6": [
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
      },
      connStepMap: {
        "0": [],
        "1": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        "2": [0, 1, 2],
        "3": [0, 1, 2, 5, 7, 8],
        "4": [9, 10],
        "5": [1, 5, 6],
        "6": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
    };

    await ctx.db.patch(wt._id, { vizConfig: newVizConfig });
    return "Updated stepMap successfully!";
  },
});

/**
 * Migrate existing chapters from Markdown string to Block format.
 */
export const migrateToBlocks = mutation({
  args: {},
  handler: async (ctx) => {
    const chapters = await ctx.db.query("chapters").collect();
    let migrated = 0;
    for (const ch of chapters) {
      if (!ch.blocks && (ch.content_en || ch.content_vi)) {
        const blocks = [];
        if (ch.content_en || ch.content_vi) {
          blocks.push({
            type: "text",
            text_en: ch.content_en || "",
            text_vi: ch.content_vi || "",
          });
        }
        await ctx.db.patch(ch._id, { blocks });
        migrated++;
      }
    }
    return `Migrated ${migrated} chapters to block format.`;
  },
});

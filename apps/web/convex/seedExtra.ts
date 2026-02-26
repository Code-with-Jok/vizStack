import { mutation } from "./_generated/server";

export const seedHooks = mutation({
  args: {},
  handler: async (ctx) => {
    const existings = await ctx.db
      .query("walkthroughs")
      .withIndex("by_course_slug", (q) =>
        q.eq("courseSlug", "react").eq("slug", "hooks")
      )
      .collect();
    for (const existing of existings) {
      const oldChapters = await ctx.db
        .query("chapters")
        .withIndex("by_walkthrough", (q) => q.eq("walkthroughId", existing._id))
        .collect();
      for (const ch of oldChapters) await ctx.db.delete(ch._id);
      await ctx.db.delete(existing._id);
    }

    const walkthroughId = await ctx.db.insert("walkthroughs", {
      slug: "hooks",
      courseSlug: "react",
      title_en: "React Hooks & useEffect",
      title_vi: "React Hooks & useEffect",
      description_en:
        "Master the rendering lifecycle and side-effects with React Hooks.",
      description_vi:
        "Nắm vững vòng đời render và các side-effects với React Hooks.",
      order: 1,
    });

    const chapters = [
      {
        order: 0,
        title_en: "The Rendering Lifecycle",
        title_vi: "Vòng đời Rendering",
        content_en: `React components go through a lifecycle: **Mounting**, **Updating**, and **Unmounting**. \n\n\`useEffect\` lets you synchronize your component with an external system after rendering.`,
        content_vi: `Các component React trải qua một vòng đời: **Mounting**, **Updating**, và **Unmounting**. \n\n\`useEffect\` cho phép bạn đồng bộ hóa component của mình với một hệ thống bên ngoài sau khi render.`,
        vizConfig: {
          nodes: [
            { id: "render", label: "Render", x: -4, y: 3, color: "#7c3aed", glowColor: "#7c3aed" },
            { id: "dom", label: "Commit to DOM", x: 0, y: 3, color: "#10b981", glowColor: "#10b981" },
            { id: "effect", label: "Run useEffect()", x: 4, y: 3, color: "#FF9B62", glowColor: "#FF9B62" },
          ],
          connections: [
            { fromIndex: 0, toIndex: 1 },
            { fromIndex: 1, toIndex: 2 }
          ],
          cameraPosition: [0, 1, 12],
        },
      },
      {
        order: 1,
        title_en: "Dependency Arrays",
        title_vi: "Mảng Dependencies",
        content_en: `If you pass an empty array \`[]\`, the effect runs only once after the initial render.\n\n\`\`\`tsx\nuseEffect(() => {\n  console.log("Mounted!");\n}, []);\n\`\`\``,
        content_vi: `Nếu bạn truyền một mảng rỗng \`[]\`, effect chỉ chạy một lần sau lần render đầu tiên.\n\n\`\`\`tsx\nuseEffect(() => {\n  console.log("Mounted!");\n}, []);\n\`\`\``,
        vizConfig: {
          nodes: [
            { id: "effect2", label: "useEffect", x: -3, y: 0, color: "#56D9D1", glowColor: "#56D9D1" },
            { id: "dep", label: "Dependencies []", x: 3, y: 0, color: "#EC4899", glowColor: "#EC4899" },
          ],
          connections: [
            { fromIndex: 0, toIndex: 1 }
          ],
          cameraPosition: [0, 0, 10],
        }
      }
    ];

    for (const ch of chapters) {
      await ctx.db.insert("chapters", {
        walkthroughId,
        ...ch,
      });
    }
    return walkthroughId;
  },
});

export const seedStateManagement = mutation({
  args: {},
  handler: async (ctx) => {
    const existings = await ctx.db
      .query("walkthroughs")
      .withIndex("by_course_slug", (q) =>
        q.eq("courseSlug", "react").eq("slug", "state-management")
      )
      .collect();
    for (const existing of existings) {
      const oldChapters = await ctx.db
        .query("chapters")
        .withIndex("by_walkthrough", (q) => q.eq("walkthroughId", existing._id))
        .collect();
      for (const ch of oldChapters) await ctx.db.delete(ch._id);
      await ctx.db.delete(existing._id);
    }

    const walkthroughId = await ctx.db.insert("walkthroughs", {
      slug: "state-management",
      courseSlug: "react",
      title_en: "State Management & Context API",
      title_vi: "Quản lý State & Context API",
      description_en: "Solve prop-drilling with React Context and global state managers.",
      description_vi: "Giải quyết vấn đề prop-drilling bằng React Context và các trình quản lý state toàn cục.",
      order: 2,
    });

    const chapters = [
      {
        order: 0,
        title_en: "What is Prop Drilling?",
        title_vi: "Prop Drilling là gì?",
        content_en: "Passing props down highly nested component trees feels tedious. Context API fixes this.",
        content_vi: "Việc truyền props xuống các cây component lồng nhau sâu sắc rất phức tạp. Context API giải quyết điều này.",
        vizConfig: {
          nodes: [
            { id: "root", label: "App Root", x: 0, y: 4, color: "#7c3aed", glowColor: "#7c3aed" },
            { id: "mid", label: "Header", x: 0, y: 1, color: "#10b981", glowColor: "#10b981" },
            { id: "deep", label: "UserButton", x: 0, y: -2, color: "#EC4899", glowColor: "#EC4899" },
          ],
          connections: [
            { fromIndex: 0, toIndex: 1 },
            { fromIndex: 1, toIndex: 2 }
          ],
          cameraPosition: [0, 1, 12],
        }
      },
      {
        order: 1,
        title_en: "The Context API",
        title_vi: "Context API",
        content_en: "Use `createContext()` and `<Context.Provider>` to beam data directly to any component calling `useContext()`.",
        content_vi: "Sử dụng `createContext()` và `<Context.Provider>` để truyền dữ liệu trực tiếp đến bất kỳ component nào gọi `useContext()`.",
        vizConfig: {
          nodes: [
            { id: "provider", label: "<Provider>", x: -3, y: 3, color: "#FF9B62", glowColor: "#FF9B62" },
            { id: "consumer", label: "useContext()", x: 3, y: -1, color: "#56D9D1", glowColor: "#56D9D1" },
          ],
          connections: [
            { fromIndex: 0, toIndex: 1 }
          ],
          cameraPosition: [0, 1, 10],
        }
      }
    ];

    for (const ch of chapters) {
      await ctx.db.insert("chapters", {
        walkthroughId,
        ...ch,
      });
    }
    return walkthroughId;
  },
});

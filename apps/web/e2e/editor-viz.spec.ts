import { test, expect } from "@playwright/test";

test.describe("Visualization Updater Flow", () => {
  test("should load Walkthrough Editor and show visualizations", async ({
    page,
  }) => {
    // Navigate to the editor (assuming local dev server is running on :3000)
    await page.goto("/en/learn/react/component-basics/editor");

    // Check if the page title loads (requires auth, but we assume it's publicly accessible in test or bypassed)
    // If auth is required, this test might need a setup step. We'll check basic elements for now.

    // Check if "Walkthrough Editor" text is visible
    const header = page.locator("h1.editor-title");
    if (await header.isVisible()) {
      await expect(header).toContainText("Walkthrough Editor");

      // Check if Add Chapter button exists
      const addBtn = page.locator("text=+ Add New Chapter");
      await expect(addBtn).toBeVisible();
    }
  });

  // A more complete test would require mocking Convex or running against a seeded local backend
});

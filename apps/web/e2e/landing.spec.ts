import { test, expect } from "@playwright/test";

test("landing page renders", async ({ page }) => {
  await page.goto("/en");

  await expect(
    page.getByRole("button", { name: /Start Learning/i })
  ).toBeVisible();

  await expect(
    page.getByRole("heading", { name: /Visualize Tech/i })
  ).toBeVisible();
});

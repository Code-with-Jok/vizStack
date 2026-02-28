import { describe, it, expect } from "vitest";
import { cn } from "./cn";

describe("cn", () => {
  it("joins truthy class names", () => {
    expect(cn("btn", false, undefined, "primary")).toBe("btn primary");
  });

  it("returns empty string for no values", () => {
    expect(cn()).toBe("");
  });
});

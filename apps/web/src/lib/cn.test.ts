import { describe, expect, it } from "vitest";
import { cn } from "./cn";

describe("cn", () => {
  it("joins truthy class names with spaces", () => {
    expect(cn("a", "b")).toBe("a b");
  });
  it("skips falsy values", () => {
    expect(cn("a", false, null, undefined, "b")).toBe("a b");
  });
  it("handles conditional objects", () => {
    expect(cn("a", { b: true, c: false })).toBe("a b");
  });
  it("handles arrays recursively", () => {
    expect(cn(["a", ["b", { c: true }]])).toBe("a b c");
  });
  it("returns empty string when nothing is truthy", () => {
    expect(cn(undefined, null, false)).toBe("");
  });
});

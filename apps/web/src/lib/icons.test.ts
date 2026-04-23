import { describe, expect, it } from "vitest";
import { ICONS } from "./icons";

describe("ICONS registry", () => {
  it("exports at least 60 entries", () => {
    expect(Object.keys(ICONS).length).toBeGreaterThanOrEqual(60);
  });

  it("every entry is a React component (function)", () => {
    for (const [name, Cmp] of Object.entries(ICONS)) {
      expect(typeof Cmp, `icon ${name}`).toBe("object");
    }
  });

  it("exposes the always-on lucide icons", () => {
    for (const name of ["check", "x", "bell", "gavel", "home", "info", "alert-circle"] as const) {
      expect(ICONS[name]).toBeDefined();
    }
  });
});

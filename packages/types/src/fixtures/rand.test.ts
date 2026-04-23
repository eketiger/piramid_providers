import { describe, expect, it } from "vitest";
import { pick, seededRandom } from "./rand";

describe("seededRandom", () => {
  it("is deterministic for a given seed", () => {
    expect(seededRandom(1)).toBeCloseTo(seededRandom(1));
    expect(seededRandom(2)).not.toBe(seededRandom(1));
  });
  it("always returns a number in [0, 1)", () => {
    for (let i = 0; i < 100; i++) {
      const v = seededRandom(i);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe("pick", () => {
  it("picks a deterministic element from the array", () => {
    const arr = ["a", "b", "c", "d"];
    expect(arr).toContain(pick(arr, 0));
    expect(pick(arr, 0)).toBe(pick(arr, 0));
  });
});

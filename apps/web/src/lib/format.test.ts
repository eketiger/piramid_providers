import { describe, expect, it } from "vitest";
import { money, slaLabel, slaState } from "./format";

describe("money", () => {
  it("formats ARS with thousand separators", () => {
    expect(money(1234567)).toBe("$ 1.234.567");
  });
  it("formats 0", () => {
    expect(money(0)).toBe("$ 0");
  });
  it("passes non-numbers through as strings", () => {
    expect(money("N/A" as unknown as number)).toBe("N/A");
  });
});

describe("slaState", () => {
  it("returns 'ok' when pct is low and hours positive", () => {
    expect(slaState(30, 48)).toBe("ok");
  });
  it("returns 'warn' at 50%", () => {
    expect(slaState(50, 24)).toBe("warn");
  });
  it("returns 'risk' at 80%", () => {
    expect(slaState(80, 12)).toBe("risk");
  });
  it("returns 'risk' when already breached regardless of pct", () => {
    expect(slaState(10, -1)).toBe("risk");
  });
});

describe("slaLabel", () => {
  it("shows '-Xh (breach)' when breached", () => {
    expect(slaLabel(-3)).toBe("-3h (breach)");
  });
  it("shows hours when under a day", () => {
    expect(slaLabel(5)).toBe("5h restantes");
  });
  it("shows 'Xd Yh' when over a day", () => {
    expect(slaLabel(50)).toBe("2d 2h");
  });
});

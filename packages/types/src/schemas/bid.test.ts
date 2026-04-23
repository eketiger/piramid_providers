import { describe, expect, it } from "vitest";
import { BidQuoteBody, BidListQuery } from "./bid";

describe("BidQuoteBody", () => {
  it("accepts valid payload", () => {
    const r = BidQuoteBody.safeParse({
      laborCost: 1000,
      partsCost: 500,
      commitedDays: "3-5 días",
      notes: "ok",
    });
    expect(r.success).toBe(true);
  });

  it("rejects negative costs", () => {
    const r = BidQuoteBody.safeParse({
      laborCost: -1,
      partsCost: 0,
      commitedDays: "1",
    });
    expect(r.success).toBe(false);
  });

  it("rejects missing commitedDays", () => {
    const r = BidQuoteBody.safeParse({ laborCost: 1, partsCost: 1 });
    expect(r.success).toBe(false);
  });

  it("caps notes at 2000 chars", () => {
    const r = BidQuoteBody.safeParse({
      laborCost: 1,
      partsCost: 1,
      commitedDays: "1",
      notes: "x".repeat(2001),
    });
    expect(r.success).toBe(false);
  });
});

describe("BidListQuery", () => {
  it("defaults limit to 30", () => {
    const r = BidListQuery.parse({});
    expect(r.limit).toBe(30);
  });

  it("coerces a string limit from query string", () => {
    const r = BidListQuery.parse({ limit: "50" });
    expect(r.limit).toBe(50);
  });

  it("caps limit at 100", () => {
    const r = BidListQuery.safeParse({ limit: "500" });
    expect(r.success).toBe(false);
  });

  it("accepts known status values only", () => {
    expect(BidListQuery.safeParse({ status: "abierta" }).success).toBe(true);
    expect(BidListQuery.safeParse({ status: "no-existe" }).success).toBe(false);
  });
});

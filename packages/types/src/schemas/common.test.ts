import { describe, expect, it } from "vitest";
import { z } from "zod";
import { ErrorBody, Money, Paginated, Prioridad, VerticalKey } from "./common";

describe("Money", () => {
  it("accepts non-negative integers only", () => {
    expect(Money.safeParse(0).success).toBe(true);
    expect(Money.safeParse(100).success).toBe(true);
    expect(Money.safeParse(-1).success).toBe(false);
    expect(Money.safeParse(1.5).success).toBe(false);
  });
});

describe("VerticalKey / Prioridad", () => {
  it("are enums with the documented values", () => {
    expect(VerticalKey.options).toEqual(["hogar", "taller", "medico", "logistica"]);
    expect(Prioridad.options).toEqual(["baja", "normal", "alta", "urgente"]);
  });
});

describe("Paginated", () => {
  it("wraps a schema with items + nextCursor", () => {
    const sch = Paginated(z.object({ id: z.string() }));
    expect(sch.safeParse({ items: [{ id: "1" }], nextCursor: null }).success).toBe(true);
    expect(sch.safeParse({ items: "not-array", nextCursor: null }).success).toBe(false);
  });
});

describe("ErrorBody", () => {
  it("matches the API error shape", () => {
    const r = ErrorBody.safeParse({
      error: { code: "BID_ALREADY_QUOTED", message: "Ya cotizaste" },
    });
    expect(r.success).toBe(true);
  });
});

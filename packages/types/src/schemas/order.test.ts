import { describe, expect, it } from "vitest";
import { OrderListQuery, Order } from "./order";

describe("OrderListQuery", () => {
  it("defaults tab to 'activas'", () => {
    expect(OrderListQuery.parse({}).tab).toBe("activas");
  });
  it("rejects unknown tabs", () => {
    expect(OrderListQuery.safeParse({ tab: "???" }).success).toBe(false);
  });
  it("coerces and caps limit", () => {
    expect(OrderListQuery.parse({ limit: "40" }).limit).toBe(40);
    expect(OrderListQuery.safeParse({ limit: "9999" }).success).toBe(false);
  });
});

describe("Order", () => {
  it("parses a fully-populated order", () => {
    const r = Order.safeParse({
      id: "ord1",
      code: "ORD-0001",
      titulo: "Heladera",
      vertical: "hogar",
      tipo: "Línea blanca",
      empresa: "Seguros",
      cliente: "Cliente",
      estado: "en_curso",
      monto: 1000,
      sla: { pct: 40, horasRestantes: 10, etapa: "Ejecución" },
      prioridad: "normal",
      retrabajo: false,
      clienteTel: "+54",
      direccion: "Dir",
      fechaInicio: new Date().toISOString(),
      fechaFin: new Date().toISOString(),
      etapas: [{ nombre: "Diagnóstico", done: true, pct: 100 }],
    });
    expect(r.success).toBe(true);
  });
});

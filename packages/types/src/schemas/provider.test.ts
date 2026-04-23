import { describe, expect, it } from "vitest";
import { Cuit, Provider } from "./provider";

describe("Cuit", () => {
  it("accepts a valid Argentine CUIT", () => {
    expect(Cuit.safeParse("30-71298764-3").success).toBe(true);
  });
  it("rejects obvious mistakes", () => {
    expect(Cuit.safeParse("30712987643").success).toBe(false);
    expect(Cuit.safeParse("30-71298764").success).toBe(false);
    expect(Cuit.safeParse("AB-12345678-0").success).toBe(false);
  });
});

describe("Provider", () => {
  it("parses a complete provider", () => {
    const r = Provider.safeParse({
      id: "prv_1",
      legalName: "Técnica Austral S.R.L.",
      tradeName: "Técnica Austral",
      cuit: "30-71298764-3",
      email: "x@y.com",
      phone: "+54",
      description: null,
      verticalPrimary: "hogar",
      score: 4.7,
      status: "approved",
      categorias: [],
      productos: [],
      cobertura: [],
      certificaciones: [],
      horarios: null,
      tiempoRespuesta: "00:27",
      costoVisita: 18500,
      cumplimientoSLA: 94,
      retrabajos: 2.1,
      satisfaccion: 4.8,
      volumen: 127,
      createdAt: new Date().toISOString(),
    });
    expect(r.success).toBe(true);
  });
});

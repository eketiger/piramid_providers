import { z } from "zod";
import { Money, VerticalKey } from "./common";

// Argentine CUIT: 11 digits with dashes (XX-XXXXXXXX-X).
export const Cuit = z.string().regex(/^\d{2}-\d{8}-\d$/);

export const ProviderStatus = z.enum(["pending", "approved", "suspended"]);
export type ProviderStatus = z.infer<typeof ProviderStatus>;

export const ProviderSummary = z.object({
  id: z.string(),
  legalName: z.string(),
  tradeName: z.string(),
  cuit: Cuit,
  email: z.string().email(),
  phone: z.string(),
  verticalPrimary: VerticalKey,
  score: z.number().min(0).max(5),
  status: ProviderStatus,
});
export type ProviderSummary = z.infer<typeof ProviderSummary>;

export const Provider = ProviderSummary.extend({
  description: z.string().nullable(),
  categorias: z.array(z.string()),
  productos: z.array(z.string()),
  cobertura: z.array(z.string()),
  certificaciones: z.array(z.string()),
  horarios: z.string().nullable(),
  tiempoRespuesta: z.string(),
  costoVisita: Money,
  cumplimientoSLA: z.number().min(0).max(100),
  retrabajos: z.number().min(0).max(100),
  satisfaccion: z.number().min(0).max(5),
  volumen: z.number().int().nonnegative(),
  createdAt: z.string().datetime(),
});
export type Provider = z.infer<typeof Provider>;

export const ProviderUpdateBody = Provider.partial().omit({
  id: true,
  cuit: true,
  status: true,
  createdAt: true,
});
export type ProviderUpdateBody = z.infer<typeof ProviderUpdateBody>;

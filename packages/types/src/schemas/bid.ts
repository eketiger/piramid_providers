import { z } from "zod";
import { Money, VerticalKey } from "./common";

export const BidStatus = z.enum([
  "abierta",
  "cotizada",
  "en_revision",
  "adjudicada",
  "perdida",
  "vencida",
]);
export type BidStatus = z.infer<typeof BidStatus>;

export const Sla = z.object({
  pct: z.number().min(0).max(100),
  horasRestantes: z.number().int(),
  etapa: z.string(),
});
export type Sla = z.infer<typeof Sla>;

export const BidSummary = z.object({
  id: z.string(),
  code: z.string(),
  titulo: z.string(),
  vertical: VerticalKey,
  categoria: z.string(),
  empresa: z.string(),
  ciudad: z.string(),
  cliente: z.string(),
  estado: BidStatus,
  monto: Money,
  sla: Sla,
  fechaLimite: z.string().datetime(),
  fechaRegistro: z.string().datetime(),
  competidores: z.number().int().nonnegative(),
});
export type BidSummary = z.infer<typeof BidSummary>;

export const Bid = BidSummary.extend({
  descripcion: z.string(),
  tiempoEstimado: z.string(),
  adjuntos: z.array(
    z.object({
      nombre: z.string(),
      tipo: z.enum(["pdf", "image"]),
      url: z.string().url().optional(),
    }),
  ),
});
export type Bid = z.infer<typeof Bid>;

export const BidQuoteBody = z.object({
  laborCost: Money,
  partsCost: Money,
  commitedDays: z.string().min(1),
  notes: z.string().max(2000).optional(),
});
export type BidQuoteBody = z.infer<typeof BidQuoteBody>;

export const BidListQuery = z.object({
  status: BidStatus.optional(),
  vertical: VerticalKey.optional(),
  q: z.string().max(256).optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(30),
});
export type BidListQuery = z.infer<typeof BidListQuery>;

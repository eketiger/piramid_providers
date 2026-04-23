import { z } from "zod";
import { Money, Prioridad, VerticalKey } from "./common";
import { Sla } from "./bid";

export const OrderStatus = z.enum([
  "asignada",
  "agendada",
  "en_curso",
  "diag_subido",
  "pendiente_aprobacion",
  "en_ejecucion",
  "finalizada",
  "facturada",
  "rechazada",
]);
export type OrderStatus = z.infer<typeof OrderStatus>;

export const Etapa = z.object({
  nombre: z.string(),
  done: z.boolean(),
  pct: z.number().min(0).max(100),
});
export type Etapa = z.infer<typeof Etapa>;

export const OrderSummary = z.object({
  id: z.string(),
  code: z.string(),
  titulo: z.string(),
  vertical: VerticalKey,
  tipo: z.string(),
  empresa: z.string(),
  cliente: z.string(),
  estado: OrderStatus,
  monto: Money,
  sla: Sla,
  prioridad: Prioridad,
  retrabajo: z.boolean(),
});
export type OrderSummary = z.infer<typeof OrderSummary>;

export const Order = OrderSummary.extend({
  clienteTel: z.string(),
  direccion: z.string(),
  fechaInicio: z.string().datetime(),
  fechaFin: z.string().datetime(),
  etapas: z.array(Etapa),
});
export type Order = z.infer<typeof Order>;

export const OrderListQuery = z.object({
  tab: z.enum(["activas", "todas", "finalizadas", "rechazadas"]).default("activas"),
  vertical: VerticalKey.optional(),
  status: OrderStatus.optional(),
  q: z.string().max(256).optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(30),
});
export type OrderListQuery = z.infer<typeof OrderListQuery>;

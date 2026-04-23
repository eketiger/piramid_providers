import { z } from "zod";

export const VerticalKey = z.enum(["hogar", "taller", "medico", "logistica"]);
export type VerticalKey = z.infer<typeof VerticalKey>;

export const Prioridad = z.enum(["baja", "normal", "alta", "urgente"]);
export type Prioridad = z.infer<typeof Prioridad>;

export const Money = z.number().int().nonnegative();

export const Cursor = z.string().min(1).max(256).optional();

export const Paginated = <T extends z.ZodTypeAny>(item: T) =>
  z.object({
    items: z.array(item),
    nextCursor: z.string().nullable(),
  });

export const ErrorBody = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.record(z.string(), z.unknown()).optional(),
  }),
});
export type ErrorBody = z.infer<typeof ErrorBody>;

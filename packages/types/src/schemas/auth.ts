import { z } from "zod";

export const UserRole = z.enum(["owner", "admin", "operator", "viewer"]);
export type UserRole = z.infer<typeof UserRole>;

export const LoginBody = z.object({
  email: z.string().email(),
  // Login doesn't enforce password policy — it would leak the policy via
  // validation errors (400 vs 401). Registration enforces it.
  password: z.string().min(1),
});
export type LoginBody = z.infer<typeof LoginBody>;

export const RegisterBody = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(6).max(32),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/, "Debe incluir una mayúscula")
    .regex(/\d/, "Debe incluir un número"),
});
export type RegisterBody = z.infer<typeof RegisterBody>;

export const GoogleExchangeBody = z.object({
  idToken: z.string().min(10),
});
export type GoogleExchangeBody = z.infer<typeof GoogleExchangeBody>;

export const AuthResponse = z.object({
  token: z.string(),
  expiresAt: z.string().datetime(),
  user: z.object({
    id: z.string(),
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    role: UserRole,
    providerId: z.string().nullable(),
  }),
});
export type AuthResponse = z.infer<typeof AuthResponse>;

export const UserExportResponse = z.object({
  exportedAt: z.string().datetime(),
  user: z.record(z.string(), z.unknown()),
  provider: z.record(z.string(), z.unknown()).nullable(),
  bids: z.array(z.record(z.string(), z.unknown())),
});
export type UserExportResponse = z.infer<typeof UserExportResponse>;

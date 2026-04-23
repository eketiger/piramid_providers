import { z } from "zod";

export const UserRole = z.enum(["owner", "admin", "operator", "viewer"]);
export type UserRole = z.infer<typeof UserRole>;

export const LoginBody = z.object({
  email: z.string().email(),
  // Don't enforce password policy here — login shouldn't leak the policy via
  // validation errors. Registration enforces the rules below.
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

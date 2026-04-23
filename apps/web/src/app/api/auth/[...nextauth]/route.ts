import { handlers } from "@/auth";

// NextAuth v5 route handlers. Export GET and POST so the framework can
// service /api/auth/signin, /api/auth/callback/google, /api/auth/session, etc.
export const { GET, POST } = handlers;

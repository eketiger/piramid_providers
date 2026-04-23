import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

/**
 * NextAuth setup (v5 / Auth.js).
 *
 * Flow:
 *   1. User clicks "Ingresar con Google" on /login.
 *   2. NextAuth runs the OAuth dance, comes back with a Google `id_token`.
 *   3. The `signIn` callback POSTs it to the NestJS backend at /auth/google.
 *      The backend verifies the token with Google's public keys, finds or
 *      creates a user, and returns a Piramid JWT.
 *   4. We stash that JWT on the session.user.piramidToken so client-side
 *      requests (openapi-fetch) can attach it as Authorization: Bearer.
 *
 * This keeps NestJS as the single source of truth for "is this user allowed"
 * and avoids two parallel identity systems.
 */

const apiBase = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:4000/api/v1";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account }) {
      // First hop after Google succeeds — exchange the ID token with our API.
      if (account?.provider === "google" && account.id_token) {
        try {
          const res = await fetch(`${apiBase}/auth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken: account.id_token }),
          });
          if (res.ok) {
            const body = (await res.json()) as {
              token: string;
              expiresAt: string;
              user: { id: string; email: string; role: string };
            };
            token.piramidToken = body.token;
            token.piramidExpiresAt = body.expiresAt;
            token.piramidUserId = body.user.id;
            token.role = body.user.role;
          }
        } catch {
          // Leave the token unauthenticated; the session will be unauthorized.
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token.piramidToken) {
        session.piramidToken = token.piramidToken as string;
        session.piramidExpiresAt = token.piramidExpiresAt as string;
      }
      if (session.user && token.role) {
        (session.user as unknown as { role: string }).role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});

declare module "next-auth" {
  interface Session {
    piramidToken?: string;
    piramidExpiresAt?: string;
  }
  interface JWT {
    piramidToken?: string;
    piramidExpiresAt?: string;
    piramidUserId?: string;
    role?: string;
  }
}

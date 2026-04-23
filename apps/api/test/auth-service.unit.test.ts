import { describe, expect, it } from "vitest";
import { Test } from "@nestjs/testing";
import { BadRequestException, UnauthorizedException } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";
import { AuthService } from "../src/modules/auth/auth.service";
import { PrismaService } from "../src/prisma/prisma.service";

/**
 * Pure unit tests for AuthService edge-cases that don't need the database or
 * a real HTTP request — guards against Google OAuth misconfiguration and
 * bogus tokens. Keeps us from shipping silent regressions in the exchange path.
 */

async function makeService(env: Record<string, string | undefined>) {
  const prev = { ...process.env };
  // process.env values are always strings — assigning undefined stores the
  // literal "undefined", which is truthy. Delete the key to actually unset.
  for (const [k, v] of Object.entries(env)) {
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
  const mod = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({ isGlobal: true, ignoreEnvFile: true }),
      JwtModule.register({ secret: "test-secret", signOptions: { expiresIn: "1h" } }),
    ],
    providers: [
      AuthService,
      // Minimal PrismaService stub — none of these tests hit the DB.
      {
        provide: PrismaService,
        useValue: { user: { findUnique: async () => null, findFirst: async () => null } },
      },
    ],
  }).compile();
  const svc = mod.get(AuthService);
  return {
    svc,
    restore: () => {
      process.env = prev;
    },
  };
}

describe("AuthService.googleExchange", () => {
  it("returns GOOGLE_OAUTH_NOT_CONFIGURED when GOOGLE_CLIENT_ID is unset", async () => {
    const { svc, restore } = await makeService({ GOOGLE_CLIENT_ID: undefined });
    try {
      await svc.googleExchange("any-token");
      throw new Error("expected to throw");
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
      const body = (err as BadRequestException).getResponse() as {
        error: { code: string };
      };
      expect(body.error.code).toBe("GOOGLE_OAUTH_NOT_CONFIGURED");
    }
    restore();
  });

  it("rejects an obviously invalid ID token with AUTH_INVALID_CREDENTIALS", async () => {
    const { svc, restore } = await makeService({
      GOOGLE_CLIENT_ID: "test-client.apps.googleusercontent.com",
    });
    try {
      await svc.googleExchange("not-a-real-jwt");
      throw new Error("expected to throw");
    } catch (err) {
      expect(err).toBeInstanceOf(UnauthorizedException);
    }
    restore();
  });
});

import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as argon2 from "argon2";
import { OAuth2Client } from "google-auth-library";
import { PrismaService } from "../../prisma/prisma.service";
import type { LoginBody, RegisterBody, AuthResponse } from "@piramid/types";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly cfg: ConfigService,
  ) {}

  async register(body: RegisterBody): Promise<AuthResponse> {
    const existing = await this.prisma.user.findUnique({ where: { email: body.email } });
    if (existing) {
      throw new ConflictException({
        error: { code: "AUTH_EMAIL_TAKEN", message: "Ya existe una cuenta con ese email" },
      });
    }
    const passwordHash = await argon2.hash(body.password);
    const user = await this.prisma.user.create({
      data: {
        email: body.email,
        firstName: body.firstName,
        lastName: body.lastName,
        phone: body.phone,
        passwordHash,
        role: "owner",
      },
    });
    return this.buildAuthResponse(user);
  }

  async login(body: LoginBody): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({ where: { email: body.email } });
    if (!user || user.deletedAt) throw this.invalidCredentials();
    const ok = await argon2.verify(user.passwordHash, body.password);
    if (!ok) throw this.invalidCredentials();
    return this.buildAuthResponse(user);
  }

  /**
   * NextAuth on the web obtains a Google ID token via the official Google
   * OAuth flow. It POSTs that token here; we verify it with Google's public
   * keys, find-or-create the user, and return our own JWT so the rest of the
   * API stays uniform (any auth strategy reduces to "has a Piramid JWT").
   */
  async googleExchange(idToken: string): Promise<AuthResponse> {
    const clientId = this.cfg.get<string>("GOOGLE_CLIENT_ID");
    if (!clientId) {
      throw new BadRequestException({
        error: {
          code: "GOOGLE_OAUTH_NOT_CONFIGURED",
          message: "El servidor no tiene configurado GOOGLE_CLIENT_ID",
        },
      });
    }
    const client = new OAuth2Client(clientId);
    let payload:
      | {
          sub?: string;
          email?: string;
          email_verified?: boolean;
          given_name?: string;
          family_name?: string;
        }
      | undefined;
    try {
      const ticket = await client.verifyIdToken({ idToken, audience: clientId });
      payload = ticket.getPayload();
    } catch {
      throw this.invalidCredentials();
    }
    if (!payload?.sub || !payload.email || !payload.email_verified) {
      throw this.invalidCredentials();
    }
    const existing = await this.prisma.user.findFirst({
      where: { OR: [{ googleId: payload.sub }, { email: payload.email }] },
    });
    let user = existing;
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: payload.email,
          googleId: payload.sub,
          firstName: payload.given_name ?? "",
          lastName: payload.family_name ?? "",
          // No password for OAuth-only users — store a random hash so the
          // column stays non-null and login-via-password is impossible.
          passwordHash: await argon2.hash(cryptoRandom()),
          role: "owner",
        },
      });
    } else if (!user.googleId) {
      // Link the Google identity to an existing email-based account.
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { googleId: payload.sub },
      });
    }
    if (user.deletedAt) throw this.invalidCredentials();
    return this.buildAuthResponse(user);
  }

  async userFromToken(token: string) {
    try {
      const payload = await this.jwt.verifyAsync<{ sub: string }>(token, {
        secret: this.cfg.get<string>("JWT_SECRET", "dev-only-secret-change-me"),
      });
      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
      return user?.deletedAt ? null : user;
    } catch {
      return null;
    }
  }

  private async buildAuthResponse(user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    providerId: string | null;
  }): Promise<AuthResponse> {
    const expiresInStr = this.cfg.get<string>("JWT_EXPIRES_IN", "7d");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const signOpts = { expiresIn: expiresInStr as any };
    const token = await this.jwt.signAsync({ sub: user.id, email: user.email }, signOpts);
    const expiresAt = new Date(Date.now() + parseDuration(expiresInStr)).toISOString();
    return {
      token,
      expiresAt,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role as AuthResponse["user"]["role"],
        providerId: user.providerId,
      },
    };
  }

  private invalidCredentials() {
    return new UnauthorizedException({
      error: { code: "AUTH_INVALID_CREDENTIALS", message: "Email o contraseña incorrectos" },
    });
  }
}

function parseDuration(s: string): number {
  const m = /^(\d+)([smhd])$/.exec(s);
  if (!m) return Number(s) * 1000;
  const n = Number(m[1]);
  const unit = m[2];
  const mult: Record<string, number> = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };
  return n * mult[unit];
}

function cryptoRandom(): string {
  // 32-byte random string; good enough for "this account can't log in with
  // password" sentinels.
  return Array.from({ length: 32 }, () => Math.random().toString(36).slice(2, 10)).join("");
}

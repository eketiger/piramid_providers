import { Injectable, UnauthorizedException, ConflictException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as argon2 from "argon2";
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
    if (!user) throw this.invalidCredentials();
    const ok = await argon2.verify(user.passwordHash, body.password);
    if (!ok) throw this.invalidCredentials();
    return this.buildAuthResponse(user);
  }

  async userFromToken(token: string) {
    try {
      const payload = await this.jwt.verifyAsync<{ sub: string }>(token, {
        secret: this.cfg.get<string>("JWT_SECRET", "dev-only-secret-change-me"),
      });
      return this.prisma.user.findUnique({ where: { id: payload.sub } });
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

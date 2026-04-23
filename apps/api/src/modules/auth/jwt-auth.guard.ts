import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import type { Request } from "express";
import { AuthService } from "./auth.service";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly auth: AuthService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<Request & { user?: unknown }>();
    const header = req.headers["authorization"];
    if (!header || Array.isArray(header) || !header.startsWith("Bearer ")) {
      throw new UnauthorizedException({
        error: { code: "AUTH_MISSING_TOKEN", message: "Falta el token" },
      });
    }
    const token = header.slice(7);
    const user = await this.auth.userFromToken(token);
    if (!user) {
      throw new UnauthorizedException({
        error: { code: "AUTH_INVALID_TOKEN", message: "Token inválido o expirado" },
      });
    }
    req.user = user;
    return true;
  }
}

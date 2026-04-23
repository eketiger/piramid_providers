import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PrismaService } from "../../prisma/prisma.service";

@ApiTags("health")
@Controller("healthz")
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async check() {
    const started = Date.now();
    // Shallow check: runs a trivial query via Prisma. If the DB is down the
    // healthcheck fails which is exactly what the ALB should route on.
    let db: "ok" | "down" = "ok";
    try {
      await this.prisma.$queryRawUnsafe("SELECT 1");
    } catch {
      db = "down";
    }
    return {
      status: db === "ok" ? "ok" : "degraded",
      db,
      uptimeMs: process.uptime() * 1000,
      checkMs: Date.now() - started,
      version: process.env.APP_VERSION ?? "dev",
    };
  }
}

import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import type { UserExportResponse } from "@piramid/types";

/**
 * Data-subject rights implementation (GDPR/LGPD-style).
 * - export(): dumps everything we hold about the user + their provider + bids.
 * - softDelete(): anonymizes PII, tombstones the account.
 *
 * Every action is logged to AuditLog so we have an immutable compliance trail.
 */
@Injectable()
export class PrivacyService {
  constructor(private readonly prisma: PrismaService) {}

  async export(userId: string): Promise<UserExportResponse> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException();
    const provider = user.providerId
      ? await this.prisma.provider.findUnique({ where: { id: user.providerId } })
      : null;
    const bids = provider
      ? await this.prisma.bid.findMany({ where: { providerId: provider.id } })
      : [];
    await this.prisma.auditLog.create({
      data: { userId, action: "data.export", payload: JSON.stringify({ bids: bids.length }) },
    });
    return {
      exportedAt: new Date().toISOString(),
      user: { ...user, passwordHash: "[redacted]" },
      provider: provider as unknown as Record<string, unknown> | null,
      bids: bids as unknown as Record<string, unknown>[],
    };
  }

  /**
   * Soft delete — keeps the row for the audit trail but scrubs PII and
   * prevents further logins. Bids remain because they contain business-party
   * data (clients, insurers) that isn't owned by the user.
   */
  async softDelete(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException();
    const tombstone = `deleted+${user.id}@piramid.local`;
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        email: tombstone,
        firstName: "Deleted",
        lastName: "User",
        phone: null,
        googleId: null,
        passwordHash: "[deleted]",
        deletedAt: new Date(),
      },
    });
    await this.prisma.auditLog.create({
      data: { userId, action: "data.delete", payload: "{}" },
    });
  }
}

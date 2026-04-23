import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import type { Bid, BidListQuery, BidQuoteBody, BidSummary } from "@piramid/types";

@Injectable()
export class BidsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(providerId: string, query: BidListQuery) {
    const where = {
      providerId,
      ...(query.status ? { estado: query.status } : {}),
      ...(query.vertical ? { vertical: query.vertical } : {}),
      ...(query.q
        ? {
            OR: [
              { code: { contains: query.q } },
              { titulo: { contains: query.q } },
              { empresa: { contains: query.q } },
              { cliente: { contains: query.q } },
            ],
          }
        : {}),
    };

    const rows = await this.prisma.bid.findMany({
      where,
      orderBy: { fechaLimite: "asc" },
      take: query.limit + 1,
      ...(query.cursor ? { cursor: { id: query.cursor }, skip: 1 } : {}),
    });

    const hasNext = rows.length > query.limit;
    const items = (hasNext ? rows.slice(0, -1) : rows).map(toSummary);
    const nextCursor = hasNext ? items[items.length - 1].id : null;
    return { items, nextCursor };
  }

  async getById(providerId: string, id: string): Promise<Bid> {
    const row = await this.prisma.bid.findFirst({
      where: { id, providerId },
      include: { quote: true },
    });
    if (!row) {
      throw new NotFoundException({
        error: { code: "BID_NOT_FOUND", message: "Licitación inexistente" },
      });
    }
    return toDetail(row);
  }

  async quote(providerId: string, id: string, body: BidQuoteBody): Promise<Bid> {
    const bid = await this.prisma.bid.findFirst({
      where: { id, providerId },
      include: { quote: true },
    });
    if (!bid) {
      throw new NotFoundException({
        error: { code: "BID_NOT_FOUND", message: "Licitación inexistente" },
      });
    }
    if (bid.estado !== "abierta") {
      throw new ConflictException({
        error: {
          code: "BID_ALREADY_CLOSED",
          message: "La licitación no está abierta a cotización",
        },
      });
    }
    if (bid.quote) {
      throw new ConflictException({
        error: { code: "BID_ALREADY_QUOTED", message: "Ya cotizaste esta licitación" },
      });
    }
    if (bid.fechaLimite.getTime() < Date.now()) {
      throw new BadRequestException({
        error: { code: "SLA_EXPIRED", message: "La ventana de cotización venció" },
      });
    }
    const total = body.laborCost + body.partsCost;
    await this.prisma.$transaction([
      this.prisma.bidQuote.create({
        data: {
          bidId: bid.id,
          laborCost: body.laborCost,
          partsCost: body.partsCost,
          total,
          commitedDays: body.commitedDays,
          notes: body.notes,
        },
      }),
      this.prisma.bid.update({
        where: { id: bid.id },
        data: { estado: "cotizada", monto: total },
      }),
    ]);

    return this.getById(providerId, id);
  }
}

type BidRow = {
  id: string;
  code: string;
  titulo: string;
  vertical: string;
  categoria: string;
  empresa: string;
  ciudad: string;
  cliente: string;
  estado: string;
  monto: number;
  slaPct: number;
  horasRestantes: number;
  etapa: string;
  competidores: number;
  fechaLimite: Date;
  fechaRegistro: Date;
};

function toSummary(row: BidRow): BidSummary {
  return {
    id: row.id,
    code: row.code,
    titulo: row.titulo,
    vertical: row.vertical as BidSummary["vertical"],
    categoria: row.categoria,
    empresa: row.empresa,
    ciudad: row.ciudad,
    cliente: row.cliente,
    estado: row.estado as BidSummary["estado"],
    monto: row.monto,
    sla: { pct: row.slaPct, horasRestantes: row.horasRestantes, etapa: row.etapa },
    fechaLimite: row.fechaLimite.toISOString(),
    fechaRegistro: row.fechaRegistro.toISOString(),
    competidores: row.competidores,
  };
}

function toDetail(row: BidRow & { descripcion: string; tiempoEstimado: string }): Bid {
  return {
    ...toSummary(row),
    descripcion: row.descripcion,
    tiempoEstimado: row.tiempoEstimado,
    adjuntos: [],
  };
}

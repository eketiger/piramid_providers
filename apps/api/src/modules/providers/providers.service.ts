import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import type { Provider, ProviderUpdateBody } from "@piramid/types";

@Injectable()
export class ProvidersService {
  constructor(private readonly prisma: PrismaService) {}

  async getById(id: string): Promise<Provider> {
    const row = await this.prisma.provider.findUnique({ where: { id } });
    if (!row) {
      throw new NotFoundException({
        error: { code: "PROVIDER_NOT_FOUND", message: "Proveedor inexistente" },
      });
    }
    return toProviderDto(row);
  }

  async getByUserId(userId: string): Promise<Provider | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { provider: true },
    });
    if (!user?.provider) return null;
    return toProviderDto(user.provider);
  }

  async update(id: string, body: ProviderUpdateBody): Promise<Provider> {
    const row = await this.prisma.provider.update({
      where: { id },
      data: {
        legalName: body.legalName,
        tradeName: body.tradeName,
        email: body.email,
        phone: body.phone,
        description: body.description,
        verticalPrimary: body.verticalPrimary,
        horarios: body.horarios,
        tiempoRespuesta: body.tiempoRespuesta,
        costoVisita: body.costoVisita,
        categorias: body.categorias ? JSON.stringify(body.categorias) : undefined,
        productos: body.productos ? JSON.stringify(body.productos) : undefined,
        cobertura: body.cobertura ? JSON.stringify(body.cobertura) : undefined,
        certificaciones: body.certificaciones ? JSON.stringify(body.certificaciones) : undefined,
      },
    });
    return toProviderDto(row);
  }
}

function toProviderDto(row: {
  id: string;
  legalName: string;
  tradeName: string;
  cuit: string;
  email: string;
  phone: string;
  description: string | null;
  verticalPrimary: string;
  status: string;
  score: number;
  cumplimientoSLA: number;
  tiempoRespuesta: string;
  costoVisita: number;
  satisfaccion: number;
  volumen: number;
  retrabajos: number;
  categorias: string;
  productos: string;
  cobertura: string;
  certificaciones: string;
  horarios: string | null;
  createdAt: Date;
}): Provider {
  return {
    id: row.id,
    legalName: row.legalName,
    tradeName: row.tradeName,
    cuit: row.cuit,
    email: row.email,
    phone: row.phone,
    description: row.description,
    verticalPrimary: row.verticalPrimary as Provider["verticalPrimary"],
    status: row.status as Provider["status"],
    score: row.score,
    cumplimientoSLA: row.cumplimientoSLA,
    tiempoRespuesta: row.tiempoRespuesta,
    costoVisita: row.costoVisita,
    satisfaccion: row.satisfaccion,
    volumen: row.volumen,
    retrabajos: row.retrabajos,
    categorias: safeParseArray(row.categorias),
    productos: safeParseArray(row.productos),
    cobertura: safeParseArray(row.cobertura),
    certificaciones: safeParseArray(row.certificaciones),
    horarios: row.horarios,
    createdAt: row.createdAt.toISOString(),
  };
}

function safeParseArray(s: string): string[] {
  try {
    const v = JSON.parse(s);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import type { Request } from "express";
import { ProviderUpdateBody } from "@piramid/types";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { ZodValidationPipe } from "../../common/zod-pipe";
import { ProvidersService } from "./providers.service";

@ApiTags("providers")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("providers")
export class ProvidersController {
  constructor(private readonly providers: ProvidersService) {}

  @Get("me")
  @ApiOperation({ summary: "Proveedor del usuario autenticado" })
  async getMe(@Req() req: Request & { user?: { id: string } }) {
    const id = req.user?.id;
    if (!id) throw new NotFoundException();
    const provider = await this.providers.getByUserId(id);
    if (!provider) {
      throw new NotFoundException({
        error: {
          code: "PROVIDER_NOT_LINKED",
          message: "El usuario aún no está asociado a un proveedor",
        },
      });
    }
    return provider;
  }

  @Patch("me")
  @ApiOperation({ summary: "Actualiza datos del proveedor del usuario autenticado" })
  async updateMe(
    @Req() req: Request & { user?: { id: string; providerId: string | null } },
    @Body(new ZodValidationPipe(ProviderUpdateBody)) body: typeof ProviderUpdateBody._type,
  ) {
    const providerId = req.user?.providerId;
    if (!providerId) {
      throw new NotFoundException({
        error: { code: "PROVIDER_NOT_LINKED", message: "Sin proveedor asociado" },
      });
    }
    return this.providers.update(providerId, body);
  }

  @Get(":id")
  @ApiOperation({ summary: "Ficha pública de un proveedor" })
  getById(@Param("id") id: string) {
    return this.providers.getById(id);
  }
}

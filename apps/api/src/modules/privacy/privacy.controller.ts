import {
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import type { Request } from "express";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { PrivacyService } from "./privacy.service";

@ApiTags("privacy")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("me")
export class PrivacyController {
  constructor(private readonly privacy: PrivacyService) {}

  @Get("export")
  @ApiOperation({
    summary:
      "Descarga todos los datos que Piramid tiene sobre el usuario autenticado (GDPR Art. 20).",
  })
  export(@Req() req: Request & { user?: { id: string } }) {
    const id = req.user?.id;
    if (!id) throw new NotFoundException();
    return this.privacy.export(id);
  }

  @Delete()
  @HttpCode(204)
  @ApiOperation({
    summary: "Solicita la eliminación de la cuenta (soft-delete + anonimización). Irreversible.",
  })
  async delete(@Req() req: Request & { user?: { id: string } }) {
    const id = req.user?.id;
    if (!id) throw new NotFoundException();
    await this.privacy.softDelete(id);
  }
}

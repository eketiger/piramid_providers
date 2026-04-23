import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import type { Request } from "express";
import { BidListQuery, BidQuoteBody } from "@piramid/types";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { ZodValidationPipe } from "../../common/zod-pipe";
import { BidsService } from "./bids.service";

@ApiTags("bids")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("bids")
export class BidsController {
  constructor(private readonly bids: BidsService) {}

  @Get()
  @ApiOperation({ summary: "Lista licitaciones del proveedor autenticado" })
  list(
    @Req() req: Request & { user?: { providerId: string | null } },
    @Query(new ZodValidationPipe(BidListQuery)) query: typeof BidListQuery._type,
  ) {
    const providerId = req.user?.providerId;
    if (!providerId) throw new ForbiddenException();
    return this.bids.list(providerId, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Detalle de una licitación" })
  getById(
    @Req() req: Request & { user?: { providerId: string | null } },
    @Param("id") id: string,
  ) {
    const providerId = req.user?.providerId;
    if (!providerId) throw new ForbiddenException();
    return this.bids.getById(providerId, id);
  }

  @Post(":id/quote")
  @ApiOperation({ summary: "Envía la cotización y mueve la licitación a `cotizada`" })
  quote(
    @Req() req: Request & { user?: { providerId: string | null } },
    @Param("id") id: string,
    @Body(new ZodValidationPipe(BidQuoteBody)) body: typeof BidQuoteBody._type,
  ) {
    const providerId = req.user?.providerId;
    if (!providerId) throw new ForbiddenException();
    return this.bids.quote(providerId, id, body);
  }
}

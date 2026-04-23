import { Body, Controller, Get, Post, UseGuards, Req, HttpCode } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import type { Request } from "express";
import { ZodValidationPipe } from "../../common/zod-pipe";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { LoginBody, RegisterBody } from "@piramid/types";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post("register")
  @HttpCode(201)
  @ApiOperation({ summary: "Crea un usuario y (opcionalmente) vincula un proveedor pending." })
  register(@Body(new ZodValidationPipe(RegisterBody)) body: typeof RegisterBody._type) {
    return this.auth.register(body);
  }

  @Post("login")
  @HttpCode(200)
  @ApiOperation({ summary: "Ingresa con email + password y devuelve el JWT." })
  login(@Body(new ZodValidationPipe(LoginBody)) body: typeof LoginBody._type) {
    return this.auth.login(body);
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Devuelve el usuario autenticado." })
  me(@Req() req: Request & { user?: unknown }) {
    return { user: req.user };
  }
}

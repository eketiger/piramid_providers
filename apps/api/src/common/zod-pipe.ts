import { BadRequestException, PipeTransform } from "@nestjs/common";
import { ZodSchema, ZodError } from "zod";

/**
 * Minimal Zod ValidationPipe.
 * We use this instead of class-validator DTOs so the backend and the web app
 * share the exact same schemas from @piramid/types.
 */
export class ZodValidationPipe<T> implements PipeTransform<unknown, T> {
  constructor(private readonly schema: ZodSchema<T>) {}

  transform(value: unknown): T {
    try {
      return this.schema.parse(value);
    } catch (err) {
      if (err instanceof ZodError) {
        throw new BadRequestException({
          error: {
            code: "VALIDATION_ERROR",
            message: "El payload no cumple el contrato",
            details: err.flatten(),
          },
        });
      }
      throw err;
    }
  }
}

import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { apiReference } from "@scalar/nestjs-api-reference";
import pinoHttp from "pino-http";
import { AppModule } from "./app.module";
import { initSentry } from "./common/sentry";

async function bootstrap() {
  initSentry();
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.use(
    pinoHttp({
      level: process.env.LOG_LEVEL ?? "info",
      redact: ["req.headers.authorization", "req.headers.cookie"],
    }),
  );

  app.enableCors({
    origin: (process.env.CORS_ORIGIN ?? "http://localhost:3000").split(","),
    credentials: true,
  });

  app.setGlobalPrefix("api/v1");
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle("Piramid Providers API")
    .setDescription("MVP: auth + providers + bids + privacy + health.")
    .setVersion("0.3.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  // Raw OpenAPI JSON (consumed by apps/web openapi:generate).
  SwaggerModule.setup("api/v1/docs-json", app, document, { jsonDocumentUrl: "api/v1/docs-json" });
  // Legacy Swagger UI still lives at /api/v1/docs for anyone who prefers it.
  SwaggerModule.setup("api/v1/docs", app, document);
  // Modern API reference (Scalar) — nicer UX, supports try-it-out.
  app.use(
    "/api/v1/reference",
    apiReference({
      spec: { content: document },
      theme: "purple",
    }),
  );

  const port = Number(process.env.PORT ?? 4000);
  await app.listen(port);
  console.log(`API ready on http://localhost:${port}`);
  console.log(`  Scalar reference: http://localhost:${port}/api/v1/reference`);
  console.log(`  Swagger UI:       http://localhost:${port}/api/v1/docs`);
}

bootstrap();

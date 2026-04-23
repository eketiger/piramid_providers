#!/usr/bin/env tsx
// Exports the OpenAPI document for @piramid/api without starting a server.
// Consumed by apps/web via `openapi-typescript` to generate type-safe clients
// — keeps the web contract in sync with whatever the controllers actually
// expose (no more hand-authored paths drift).

import "reflect-metadata";
import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { mkdirSync } from "node:fs";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "../src/app.module";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = resolve(__dirname, "../openapi.json");

async function main() {
  const app = await NestFactory.create(AppModule, { logger: false });
  app.setGlobalPrefix("api/v1");

  const config = new DocumentBuilder()
    .setTitle("Piramid Providers API")
    .setDescription("MVP: auth + providers + bids + health.")
    .setVersion("0.3.0")
    .addBearerAuth()
    .build();
  const doc = SwaggerModule.createDocument(app, config);

  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, JSON.stringify(doc, null, 2));
  await app.close();
  // eslint-disable-next-line no-console
  console.log(`OpenAPI exported to ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

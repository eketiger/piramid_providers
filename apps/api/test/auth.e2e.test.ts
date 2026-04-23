import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { Test } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import request from "supertest";
import { PrismaClient } from "@prisma/client";
import { AppModule } from "../src/app.module";

const TEST_DB = process.env.DATABASE_URL ?? "mysql://piramid:dev@localhost:3306/piramid_test";

describe("AuthController (integration)", () => {
  let app: INestApplication;
  let prisma: PrismaClient;

  beforeAll(async () => {
    process.env.DATABASE_URL = TEST_DB;
    process.env.JWT_SECRET = "test-secret";

    prisma = new PrismaClient({ datasources: { db: { url: TEST_DB } } });
    // Reset using the generated API so we're immune to MySQL table-name
    // case sensitivity and to FK-ordering concerns.
    await prisma.bidQuote.deleteMany();
    await prisma.bid.deleteMany();
    await prisma.user.deleteMany();
    await prisma.provider.deleteMany();
    await prisma.auditLog.deleteMany();

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    );
    app.setGlobalPrefix("api/v1");
    await app.init();
  });

  afterAll(async () => {
    await app?.close();
    await prisma?.$disconnect();
  });

  it("POST /auth/register creates a user and returns a JWT", async () => {
    const res = await request(app.getHttpServer())
      .post("/api/v1/auth/register")
      .send({
        firstName: "Ezequiel",
        lastName: "Niefeld",
        email: "owner@example.com",
        phone: "+54 9 11 5123-4587",
        password: "Demo1234!",
      })
      .expect(201);
    expect(res.body.token).toBeTypeOf("string");
    expect(res.body.user.email).toBe("owner@example.com");
    expect(res.body.user.role).toBe("owner");
  });

  it("POST /auth/register rejects duplicate email with AUTH_EMAIL_TAKEN", async () => {
    await request(app.getHttpServer())
      .post("/api/v1/auth/register")
      .send({
        firstName: "A",
        lastName: "B",
        email: "dup@example.com",
        phone: "+54 9 11 1234-5678",
        password: "Demo1234!",
      })
      .expect(201);

    const res = await request(app.getHttpServer())
      .post("/api/v1/auth/register")
      .send({
        firstName: "A",
        lastName: "B",
        email: "dup@example.com",
        phone: "+54 9 11 1234-5678",
        password: "Demo1234!",
      })
      .expect(409);
    expect(res.body.error.code).toBe("AUTH_EMAIL_TAKEN");
  });

  it("POST /auth/login rejects bad credentials", async () => {
    const res = await request(app.getHttpServer())
      .post("/api/v1/auth/login")
      .send({ email: "owner@example.com", password: "WRONG" })
      .expect(401);
    expect(res.body.error.code).toBe("AUTH_INVALID_CREDENTIALS");
  });

  it("POST /auth/login returns a JWT for correct credentials", async () => {
    const res = await request(app.getHttpServer())
      .post("/api/v1/auth/login")
      .send({ email: "owner@example.com", password: "Demo1234!" })
      .expect(200);
    expect(res.body.token).toBeTypeOf("string");
  });

  it("GET /auth/me requires bearer token", async () => {
    await request(app.getHttpServer()).get("/api/v1/auth/me").expect(401);
  });

  it("GET /auth/me returns the user when authenticated", async () => {
    const login = await request(app.getHttpServer())
      .post("/api/v1/auth/login")
      .send({ email: "owner@example.com", password: "Demo1234!" });
    const token = login.body.token;
    const res = await request(app.getHttpServer())
      .get("/api/v1/auth/me")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(res.body.user.email).toBe("owner@example.com");
  });

  it("validates the request body via ZodValidationPipe", async () => {
    const res = await request(app.getHttpServer())
      .post("/api/v1/auth/register")
      .send({ email: "not-an-email", password: "short" })
      .expect(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("POST /auth/google returns 400 GOOGLE_OAUTH_NOT_CONFIGURED when client id is unset", async () => {
    // The test runner doesn't set GOOGLE_CLIENT_ID by default (test/setup.ts
    // keeps it unset), so the service should reject the attempt early without
    // ever touching Google's servers.
    const res = await request(app.getHttpServer())
      .post("/api/v1/auth/google")
      .send({ idToken: "some-id-token-that-looks-legit" })
      .expect(400);
    expect(res.body.error.code).toBe("GOOGLE_OAUTH_NOT_CONFIGURED");
  });

  it("POST /auth/google returns 400 VALIDATION_ERROR when the idToken is missing", async () => {
    const res = await request(app.getHttpServer()).post("/api/v1/auth/google").send({}).expect(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });
});

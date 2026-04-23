import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { Test } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import request from "supertest";
import { PrismaClient, Vertical, BidStatus, ProviderStatus } from "@prisma/client";
import { AppModule } from "../src/app.module";
import * as argon2 from "argon2";

const TEST_DB = "file:./test.db";

describe("BidsController (integration)", () => {
  let app: INestApplication;
  let prisma: PrismaClient;
  let token: string;
  let bidId: string;

  beforeAll(async () => {
    process.env.DATABASE_URL = TEST_DB;
    process.env.JWT_SECRET = "test-secret";

    prisma = new PrismaClient({ datasources: { db: { url: TEST_DB } } });
    await prisma.$executeRawUnsafe("DELETE FROM BidQuote");
    await prisma.$executeRawUnsafe("DELETE FROM Bid");
    await prisma.$executeRawUnsafe("DELETE FROM User");
    await prisma.$executeRawUnsafe("DELETE FROM Provider");

    const provider = await prisma.provider.create({
      data: {
        legalName: "Técnica Austral",
        tradeName: "Técnica Austral",
        cuit: "30-71298764-3",
        email: "contacto@ta.com",
        phone: "+54",
        verticalPrimary: Vertical.hogar,
        status: ProviderStatus.approved,
      },
    });
    await prisma.user.create({
      data: {
        email: "operator@example.com",
        passwordHash: await argon2.hash("Demo1234!"),
        firstName: "Op",
        lastName: "Erator",
        role: "owner",
        providerId: provider.id,
      },
    });
    const bid = await prisma.bid.create({
      data: {
        code: "LIC-TEST-001",
        titulo: "Heladera no enfría",
        descripcion: "Descripción de prueba",
        vertical: Vertical.hogar,
        categoria: "Electro línea blanca",
        empresa: "Seguros Alfa",
        ciudad: "CABA",
        cliente: "Cliente Test",
        estado: BidStatus.abierta,
        monto: 300_000,
        slaPct: 40,
        horasRestantes: 24,
        etapa: "Cotización",
        tiempoEstimado: "2-4 días",
        competidores: 3,
        fechaLimite: new Date(Date.now() + 24 * 3600 * 1000),
        providerId: provider.id,
      },
    });
    bidId = bid.id;

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    );
    app.setGlobalPrefix("api/v1");
    await app.init();

    const res = await request(app.getHttpServer())
      .post("/api/v1/auth/login")
      .send({ email: "operator@example.com", password: "Demo1234!" });
    token = res.body.token;
  });

  afterAll(async () => {
    await app?.close();
    await prisma?.$disconnect();
  });

  it("GET /bids requires auth", async () => {
    await request(app.getHttpServer()).get("/api/v1/bids").expect(401);
  });

  it("GET /bids returns the seeded bid", async () => {
    const res = await request(app.getHttpServer())
      .get("/api/v1/bids")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(res.body.items.length).toBeGreaterThan(0);
    expect(res.body.items[0].code).toBe("LIC-TEST-001");
  });

  it("POST /bids/:id/quote stores the quote and moves the bid to cotizada", async () => {
    const res = await request(app.getHttpServer())
      .post(`/api/v1/bids/${bidId}/quote`)
      .set("Authorization", `Bearer ${token}`)
      .send({ laborCost: 120_000, partsCost: 85_000, commitedDays: "3-5 días" })
      .expect(201);
    expect(res.body.estado).toBe("cotizada");
    expect(res.body.monto).toBe(205_000);
  });

  it("POST /bids/:id/quote twice fails with BID_ALREADY_QUOTED/CLOSED", async () => {
    const res = await request(app.getHttpServer())
      .post(`/api/v1/bids/${bidId}/quote`)
      .set("Authorization", `Bearer ${token}`)
      .send({ laborCost: 1, partsCost: 1, commitedDays: "1" })
      .expect(409);
    expect(["BID_ALREADY_QUOTED", "BID_ALREADY_CLOSED"]).toContain(res.body.error.code);
  });
});

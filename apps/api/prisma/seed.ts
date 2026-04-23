import { PrismaClient, Vertical, BidStatus, ProviderStatus } from "@prisma/client";
import * as argon2 from "argon2";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await argon2.hash("Demo1234");

  const provider = await prisma.provider.upsert({
    where: { cuit: "30-71298764-3" },
    update: {},
    create: {
      legalName: "Técnica Austral S.R.L.",
      tradeName: "Técnica Austral",
      cuit: "30-71298764-3",
      email: "contacto@tecnicaaustral.com.ar",
      phone: "+54 9 11 5123-4587",
      description: "Servicio técnico de electrodomésticos línea blanca y climatización.",
      verticalPrimary: Vertical.hogar,
      status: ProviderStatus.approved,
      score: 4.7,
      cumplimientoSLA: 94,
      tiempoRespuesta: "00:27",
      costoVisita: 18500,
      satisfaccion: 4.8,
      volumen: 127,
      retrabajos: 2.1,
      categorias: JSON.stringify(["Electro línea blanca", "Aire acondicionado", "Electro pequeño"]),
      productos: JSON.stringify(["Heladeras", "Lavarropas", "Secarropas", "Split"]),
      cobertura: JSON.stringify(["CABA", "Vicente López", "San Isidro", "Pilar"]),
      certificaciones: JSON.stringify(["Samsung", "BGH", "Whirlpool"]),
      horarios: "Lun–Vie 08:00–19:00 · Sáb 09:00–13:00",
    },
  });

  await prisma.user.upsert({
    where: { email: "en@revelaciondata.com.ar" },
    update: {},
    create: {
      email: "en@revelaciondata.com.ar",
      passwordHash,
      firstName: "Ezequiel",
      lastName: "Niefeld",
      phone: "+54 9 11 5123-4587",
      role: "owner",
      providerId: provider.id,
    },
  });

  const titles = [
    "Heladera no enfría",
    "Split no prende",
    "Lavarropas filtra agua",
    "Termotanque sin gas",
    "Tablero eléctrico disparado",
  ];

  for (let i = 0; i < titles.length; i++) {
    const code = `LIC-2026${String(1000 + i).padStart(4, "0")}`;
    await prisma.bid.upsert({
      where: { code },
      update: {},
      create: {
        code,
        titulo: titles[i],
        descripcion: "Se requiere cotización y propuesta de ejecución en base a diagnóstico.",
        vertical: Vertical.hogar,
        categoria: "Electro línea blanca",
        empresa: "Seguros Alfa",
        ciudad: "CABA — Palermo",
        cliente: "María López",
        estado: BidStatus.abierta,
        monto: 350_000 + i * 25_000,
        slaPct: 30 + i * 10,
        horasRestantes: 48 - i * 6,
        etapa: "Cotización",
        tiempoEstimado: "2-4 días",
        competidores: 3 + i,
        fechaLimite: new Date(Date.now() + (48 - i * 6) * 3600 * 1000),
        providerId: provider.id,
      },
    });
  }

  console.log(`Seeded provider=${provider.tradeName} with ${titles.length} bids.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

# Piramid Providers

Plataforma web + API para proveedores de la red de Piramid. Monorepo Turborepo con un frontend Next.js 15, un backend NestJS 11 y contratos zod compartidos.

## Stack

- **Monorepo**: pnpm workspaces + Turborepo
- **Frontend** (`apps/web`): Next.js 15 App Router, React 19, Tailwind v4, TanStack Query, `openapi-fetch`
- **Backend** (`apps/api`): NestJS 11, Prisma 6 sobre SQLite (dev) / MySQL (prod), JWT + argon2, Swagger autogenerado, pino structured logs
- **Contratos** (`packages/types`): zod schemas consumidos tanto por la API (ValidationPipe) como por el web (types de `openapi-fetch`)
- **Lint/format** (root): ESLint 9 flat config + Prettier (con `prettier-plugin-tailwindcss`)

## Estructura

```
piramid-providers/
├─ apps/
│  ├─ web/                           # Next.js 15
│  │  └─ src/
│  │     ├─ app/                     # rutas (auth) + (app) con layout, loading, error, not-found
│  │     ├─ components/
│  │     │  ├─ ui/                   # primitivos (button, pill, sla-meter, drawer, tabs, table, …)
│  │     │  ├─ shell/                # sidebar, topbar, auth-shell, onboarding-banner
│  │     │  └─ providers/            # QueryProvider
│  │     ├─ data/fixtures.ts         # mocks mientras el backend se termina
│  │     └─ lib/
│  │        ├─ api/                  # openapi-fetch client + typed hooks (TanStack Query)
│  │        ├─ icons.ts              # registry tipado de lucide
│  │        └─ format.ts
│  └─ api/                           # NestJS 11
│     ├─ prisma/
│     │  ├─ schema.prisma            # MVP: users, providers, bids, bid_quotes
│     │  └─ seed.ts
│     └─ src/
│        ├─ main.ts                  # bootstrap + Swagger en /api/v1/docs
│        ├─ app.module.ts
│        ├─ common/zod-pipe.ts       # ValidationPipe que usa schemas de @piramid/types
│        ├─ prisma/                  # PrismaService global
│        └─ modules/
│           ├─ auth/                 # register, login, me, JwtAuthGuard
│           ├─ providers/            # /providers/me, /providers/:id
│           └─ bids/                 # /bids (lista), /bids/:id, /bids/:id/quote
├─ packages/
│  └─ types/                         # zod schemas (common, auth, provider, bid, order) + fixtures seeded
├─ turbo.json
├─ pnpm-workspace.yaml
├─ eslint.config.mjs                 # aplica a todo el monorepo
└─ .prettierrc.json
```

## Cómo correrlo en local

```bash
# 1. Instalar
pnpm install

# 2. DB local
cd apps/api
cp .env.example .env
pnpm exec prisma migrate dev --name init
pnpm db:seed

# 3. Dev (dos terminales)
pnpm --filter @piramid/api dev    # http://localhost:4000 (docs en /api/v1/docs)
pnpm --filter @piramid/web dev    # http://localhost:3000
```

Credenciales del seed: `en@revelaciondata.com.ar` / `Demo1234`.

## Contratos zod compartidos

`packages/types` es la única fuente de verdad para shape de requests/responses. La API los consume con un `ZodValidationPipe` custom; el frontend los consume vía `openapi-fetch` + `@tanstack/react-query` hooks en `apps/web/src/lib/api/hooks/`.

Ejemplo end-to-end (licitaciones):

```
packages/types/src/schemas/bid.ts   →  Bid, BidQuoteBody, BidListQuery
apps/api/src/modules/bids/*         →  controller + service usan los mismos zod schemas
apps/web/src/lib/api/hooks/bids.ts  →  useBidsQuery, useBidQuery, useQuoteMutation
```

## Principios del HANDOFF respetados

1. **SLA discreto**: verde salvo riesgo real (≥50% → warn, ≥80% o vencido → risk). Regla centralizada en `apps/web/src/lib/format.ts::slaState`.
2. **Workflow primero**: drawer de cotización sobre el listado; detalle de orden con 6 tabs persistentes.
3. **Brand editorial**: Archivo Black + naranja Piramid solo en auth/hero/ficha pública. UI operativa en neutrales tierra.
4. **Desktop-first**: grids densos optimizados para operación.

## Qué quedó deferido (se retoma en Phase 3+)

- **GitHub Actions CI/CD** (Phase 3): `typecheck + lint + build + test + e2e` por paquete.
- **Tests** (Phase 3): Vitest + RTL en `apps/web`, Supertest en `apps/api`, Playwright E2E.
- **AWS CDK** (Phase 4): stack mínima de S3 + CloudFront + App Runner/Fargate para API. No se anticipa infra antes de que haya un servicio corriendo.
- **Sentry + OTel** (Phase 4): `pino` ya está listo del lado API.
- **Planetscale**, cookies `HttpOnly` + refresh rotativo, 2FA TOTP, BullMQ, presigned S3, webhooks externos.
- Resto de módulos de negocio (orders, reports, schedule, scorecard, notifications, marketplace, audit).

## Scripts de root (orquestados por Turborepo)

| Script | Qué hace |
|---|---|
| `pnpm dev` | Levanta `apps/web` y `apps/api` en paralelo |
| `pnpm build` | Build ordenado (`@piramid/types` → `api` → `web`) |
| `pnpm typecheck` | `tsc --noEmit` en todos los paquetes |
| `pnpm lint` | ESLint 9 flat config sobre todo el repo |
| `pnpm test` | Unit tests (Phase 3) |
| `pnpm test:e2e` | Playwright (Phase 3) |
| `pnpm format` | Prettier write |

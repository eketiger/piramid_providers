# Piramid Providers

Plataforma web + API + docs para proveedores de la red de Piramid. Monorepo Turborepo con frontend Next.js 15, backend NestJS 11, docs (Fumadocs + Scalar) y contratos zod compartidos.

## Stack

- **Monorepo**: pnpm workspaces + Turborepo
- **Frontend** (`apps/web`): Next.js 15 App Router, React 19, Tailwind v4, TanStack Query, `openapi-fetch`, **NextAuth v5 con Google OAuth**, **Mixpanel**, Sentry
- **Backend** (`apps/api`): NestJS 11, **Prisma 6 sobre MySQL (docker-compose local / Planetscale en prod)** con `relationMode = "prisma"`, JWT + argon2 + **Google ID token verify**, Swagger/OpenAPI, **Scalar API reference**, pino, Sentry
- **Docs** (`apps/docs`): **Next.js + Fumadocs** para documentación de producto y help-center; iframe con la API reference de Scalar
- **Infra** (`infra/`): **AWS CDK** — Network / Data (S3 + Secrets) / Api (ECS Fargate + ECR + ALB) / Web (S3 + CloudFront)
- **Contratos** (`packages/types`): zod schemas — fuente de verdad para API y web
- **Lint/format** (root): ESLint 9 flat config + Prettier + `prettier-plugin-tailwindcss`
- **Tests**: Vitest + React Testing Library + Supertest + Playwright; coverage con v8

## Estructura

```
piramid-providers/
├─ apps/
│  ├─ web/                  # Next.js 15 + NextAuth + TanStack Query
│  ├─ api/                  # NestJS 11 + Prisma + Swagger/Scalar
│  └─ docs/                 # Fumadocs product docs + API Reference (Scalar iframe)
├─ packages/
│  └─ types/                # zod schemas compartidos
├─ infra/                   # AWS CDK stacks
├─ docker-compose.yml       # MySQL + Redis para dev
├─ turbo.json
├─ pnpm-workspace.yaml
├─ eslint.config.mjs
└─ .github/workflows/       # ci.yml + deploy.yml (OIDC → ECR + cdk deploy)
```

## Cómo correrlo en local — paso a paso

### 1) Prerequisitos

- **Node 22+**, **pnpm 10+**, **Docker Desktop** (para MySQL/Redis locales)
- Puertos libres: **3000** (web), **3100** (docs), **4000** (api), **3306** (mysql), **6379** (redis)

### 2) Instalar y arrancar infra local

```bash
git clone https://github.com/eketiger/piramid_providers.git
cd piramid_providers
pnpm install

# MySQL + Redis en docker
docker compose up -d
```

### 3) Inicializar la base de datos

```bash
cd apps/api
cp .env.example .env           # ajustar GOOGLE_CLIENT_ID/SECRET si vas a probar Google OAuth
pnpm exec prisma generate
pnpm exec prisma db push       # crea el schema contra localhost:3306/piramid
pnpm db:seed                   # provider demo + 5 licitaciones
cd ../..
```

Credenciales del seed: **`en@revelaciondata.com.ar`** / **`Demo1234`**.

### 4) Levantar todo

```bash
# Con Turborepo (todo en paralelo)
pnpm dev

# o en terminales separadas:
pnpm --filter @piramid/api dev    # http://localhost:4000
pnpm --filter @piramid/web dev    # http://localhost:3000
pnpm --filter @piramid/docs dev   # http://localhost:3100
```

Endpoints clave:

| URL                                    | Qué es                                            |
| -------------------------------------- | ------------------------------------------------- |
| http://localhost:3000                  | App web (redirige a /inicio)                      |
| http://localhost:3000/api/healthz      | Liveness del web (Next.js route handler)          |
| http://localhost:3000/privacy          | Preferencias de cookies + export/delete de datos  |
| http://localhost:4000/api/v1/healthz   | Liveness del backend + DB check                   |
| http://localhost:4000/api/v1/reference | **API Reference (Scalar)**                        |
| http://localhost:4000/api/v1/docs      | Swagger UI legacy                                 |
| http://localhost:4000/api/v1/docs-json | OpenAPI JSON (consumido por `openapi-typescript`) |
| http://localhost:3100/docs             | **Product docs + help-center (Fumadocs)**         |
| http://localhost:3100/api-reference    | API reference embebida                            |

### 5) Flujo con Google OAuth (opcional)

1. En [Google Cloud Console](https://console.cloud.google.com/) creá un OAuth client **Web** con callback `http://localhost:3000/api/auth/callback/google`.
2. Pegá el `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` en `apps/web/.env.local` y `apps/api/.env`.
3. Reiniciá los dev servers y entrá a `/login` → clickeá **Ingresar con Google**.
4. NextAuth obtiene el `id_token`, lo intercambia contra `POST /auth/google`, la API verifica con las claves de Google y devuelve un JWT de Piramid.

### 6) Validar todo

```bash
pnpm typecheck      # 5 paquetes verdes
pnpm lint           # 0 errores
pnpm format:check   # Prettier OK
pnpm test           # 72+ tests
pnpm test:coverage  # web ≥95% + types 100% + api integration (Supertest)
pnpm build          # turbo build ordenado
```

Smoke tests:

```bash
curl -s http://localhost:4000/api/v1/healthz | jq
curl -s http://localhost:3000/api/healthz | jq
curl -s -X POST http://localhost:4000/api/v1/auth/login \
     -H 'Content-Type: application/json' \
     -d '{"email":"en@revelaciondata.com.ar","password":"Demo1234"}' | jq
```

### 7) E2E

```bash
pnpm --filter @piramid/web exec playwright install chromium
pnpm test:e2e
```

### 8) Infra (CDK sin credenciales)

```bash
cd infra
CDK_DEFAULT_ACCOUNT=000000000000 CDK_DEFAULT_REGION=us-east-1 \
  pnpm exec cdk synth --quiet
```

Para deploy real ver `.github/workflows/deploy.yml` — usa OIDC federation, builda el Docker de la API, pushea a ECR y corre `cdk deploy --all`. Necesita estos secrets en el repo:

- `AWS_DEPLOY_ROLE_ARN` → rol con trust relationship a `token.actions.githubusercontent.com`
- Un bootstrap previo del CDK (`cdk bootstrap`) en la cuenta AWS.

## Cobertura de requisitos funcionales

| #   | Item                                       |                                                     Estado                                                     |
| --- | ------------------------------------------ | :------------------------------------------------------------------------------------------------------------: |
| 1   | **CI/CD: GitHub Actions + AWS ECS/ECR**    |       ✅ `ci.yml` (install/test/build/cdk-synth/e2e) + `deploy.yml` con OIDC → ECR → `cdk deploy --all`        |
| 2   | **Test Coverage**                          |           ✅ Vitest `@vitest/coverage-v8` con thresholds (web ≥95%, types 100%). ~72 tests totales.            |
| 3   | **Data Privacy: Native**                   |  ✅ Cookie consent banner + `/privacy` + `GET /me/export` + `DELETE /me` + AuditLog + redacción `pino`/Sentry  |
| 4   | **Analytics: Mixpanel**                    |      ✅ `apps/web/src/lib/analytics.ts` respeta consent; eventos tipados (`auth.signin`, `bid.quoted`, …)      |
| 5   | **Google Auth: NextAuth**                  |  ✅ `apps/web/src/auth.ts` con `GoogleProvider`; el ID token se canjea por JWT propio en `POST /auth/google`   |
| 6   | **Database: Planetscale (MySQL) + Prisma** | ✅ `provider = "mysql"` + `relationMode = "prisma"`. Local con docker-compose, prod con Planetscale via secret |
| 7   | **Fumadocs + Scalar**                      |                    ✅ `apps/docs` (Fumadocs) + Scalar API reference en `/api/v1/reference`                     |
| 8   | **Health checks**                          |          ✅ `GET /api/v1/healthz` (API + DB `SELECT 1`, expuesto al ALB) + `GET /api/healthz` en web           |

## Contratos zod compartidos

`packages/types` es la única fuente de verdad para shape de requests/responses. La API los consume con un `ZodValidationPipe` custom; el frontend los consume vía `openapi-fetch` + `@tanstack/react-query` hooks en `apps/web/src/lib/api/hooks/`.

Ejemplo end-to-end (licitaciones):

```
packages/types/src/schemas/bid.ts   →  Bid, BidQuoteBody, BidListQuery
apps/api/src/modules/bids/*         →  controller + service usan los mismos zod schemas
apps/web/src/lib/api/hooks/bids.ts  →  useBidsQuery, useBidQuery, useQuoteMutation
```

Para regenerar los types OpenAPI del web:

```bash
pnpm --filter @piramid/web openapi:generate   # exporta spec + corre openapi-typescript
```

## Observabilidad

- **Logs**: `pino` structured con redacción de `authorization`, `cookie`, `password`.
- **Errores**: Sentry (SDK `@sentry/node` en API, `@sentry/browser` en web). Sin DSN en dev = no-op.
- **Uptime**: `/api/v1/healthz` (API con check de DB) + `/api/healthz` (web).
- **Audit**: tabla `AuditLog` en Prisma para DSR (export/delete).

## Scripts root (Turborepo)

| Script                         | Qué hace                              |
| ------------------------------ | ------------------------------------- |
| `pnpm dev`                     | Levanta los tres apps en paralelo     |
| `pnpm build`                   | Build ordenado (types → api/docs/web) |
| `pnpm typecheck`               | `tsc --noEmit` en los 5 paquetes      |
| `pnpm lint`                    | ESLint 9 flat config                  |
| `pnpm format` / `format:check` | Prettier                              |
| `pnpm test`                    | Unit + integration                    |
| `pnpm test:coverage`           | Idem + coverage v8 con threshold      |
| `pnpm test:e2e`                | Playwright                            |

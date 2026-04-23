# Piramid Providers

Plataforma web para proveedores de servicios (técnicos, talleres, prestadores médicos, logística) que operan sobre la red de Piramid.

Este repositorio implementa el **frontend Next.js** derivado del prototipo descrito en `HANDOFF.md` y del mock en HTML. Respeta tokens de diseño, brand editorial (Archivo Black + Inter + naranja Piramid) y la jerarquía de flujos (ver oportunidad → cotizar → agendar → reportar).

## Stack

- **Next.js 15** (App Router, React 19)
- **Tailwind CSS v4** con los tokens editoriales del prototipo
- **TypeScript** estricto
- **lucide-react** para iconografía
- Todo el server-state se simula con data determinística en `src/lib/mock-data.ts` — no hay backend en este repo.

## Cómo correrlo

```bash
pnpm install     # o npm install / yarn
pnpm dev         # http://localhost:3000
```

El root (`/`) redirige a `/inicio`. El shell autenticado está en el grupo de rutas `(app)` y no requiere credenciales para demo; podés acceder al flujo de auth vía el botón "Auth demo" del topbar o directamente a `/login`.

## Estructura

```
src/
├─ app/
│  ├─ (auth)/
│  │  ├─ login/page.tsx
│  │  ├─ register/page.tsx
│  │  └─ onboarding/page.tsx       # wizard de 5 pasos
│  ├─ (app)/
│  │  ├─ layout.tsx                # Sidebar + Topbar + OnboardingBanner
│  │  ├─ inicio/                   # dashboard con KPIs + licitaciones, órdenes, visitas, novedades
│  │  ├─ licitaciones/             # listado + drawer de cotización (query param id)
│  │  ├─ ordenes/                  # listado y detalle con 6 tabs (detalle, actividad, novedades, reportes, facturas, visitas)
│  │  ├─ agenda/                   # día / semana / mes + disponibilidad
│  │  ├─ reportes/                 # dropzone + tabla de rondas de revisión
│  │  ├─ perfil/                   # datos, categorías, cobertura, disponibilidad, docs, ficha pública
│  │  ├─ scorecard/                # score + tendencia + reviews
│  │  ├─ notificaciones/           # centro con sidebar de filtros
│  │  ├─ marketplace/              # grid + ficha pública del proveedor
│  │  └─ cuenta/                   # datos personales, seguridad, prefs de notificación
│  ├─ globals.css                  # tokens editoriales + utilidades (card, tabs, pills, sla-bar, drawer)
│  └─ layout.tsx                   # root layout con tipografía (Inter, Archivo Black, JetBrains Mono)
├─ components/
│  ├─ shell/                       # Sidebar, Topbar, OnboardingBanner, AuthShell, logo
│  └─ ui/primitives.tsx            # Icon, Pill, EstadoBadge, Button, SlaMeter, Table, Tabs, Drawer, Modal, Stepper, Field, Stat
└─ lib/
   ├─ mock-data.ts                 # VERTICALS, BIDS, ORDERS, VISITS, NOTIFS, PROVIDER (ports del data.jsx del prototipo)
   ├─ format.ts                    # money() en ARS + helpers de SLA
   └─ cn.ts
```

## Principios respetados del HANDOFF

1. **SLA discreto**: la barra de SLA cambia de verde a naranja a rojo solo cuando el riesgo es real. Nunca rojo gratuito.
2. **Workflow primero, formularios segundo**: cotización y visitas se abren como drawer/modal sobre el listado. El detalle de orden usa tabs persistentes.
3. **Brand editorial, UI neutra**: Archivo Black + naranja Piramid en auth/hero/ficha pública. El resto, neutrales tierra (`#F6F3EA` papel + `#F1ECDE` sidebar + `#FFFFFF` cards).
4. **Desktop-first**: grids densos optimizados para operaciones; mobile queda fuera de alcance de esta iteración.

## Scope no implementado (deferido)

El HANDOFF describe un sistema end-to-end mucho más amplio. Este repo cubre el frontend; quedaron **explícitamente fuera de alcance** de esta entrega:

- **Backend NestJS 11** (`apps/api`): módulos de auth, bids, orders, reports, schedule, scorecard, notifications, audit.
- **Prisma / Planetscale**: schema completo y migraciones.
- **Monorepo Turborepo + pnpm workspaces** (`apps/*`, `packages/*`): este repo es un app único de Next.js. El paso a monorepo se hace moviendo `src/` a `apps/web/src/` y extrayendo `src/lib/mock-data.ts` → `packages/types/src/fixtures.ts`.
- **S3 presigned uploads**, BullMQ workers, colas de notificación, scorecard recompute.
- **JWT + 2FA TOTP**, cookies `piramid_session`, rate limiting.
- **OpenTelemetry / Sentry / Datadog**, feature flags, CI/CD.
- **Playwright E2E** sobre los 5 flujos críticos.
- **`next-intl`** (el copy está hardcoded en español rioplatense).
- **TanStack Query / Zustand**: los estados son locales a cada vista; al conectar el backend habrá que agregar Query + el cliente `openapi-fetch`.

## Decisiones de implementación

- **Tailwind v4 beta**: usé `@theme { ... }` en `globals.css` para los tokens, junto con clases semánticas legacy (`.card`, `.tabs-list`, `.sla-bar`, `.pill`) portadas del CSS del prototipo. Esto acelera la migración sin pedir rehacer cada vista como clases utilitarias.
- **Iconos dinámicos**: `<Icon name="gavel" />` resuelve contra `lucide-react` en runtime. Es una compensación pragmática para replicar el patrón `data-lucide` del prototipo sin listar 80 imports nominales.
- **shadcn sin CLI**: construí los primitives (Drawer, Modal, Tabs, Table) siguiendo el shape shadcn (composable, clases semánticas) pero sin instalar el generador, para mantener el repo liviano. La migración a `shadcn add` sigue siendo trivial.
- **Datos mock determinísticos**: `BIDS`, `ORDERS`, `VISITS` se generan con una función seeded para que la UI se vea idéntica entre reloads y SSR/CSR.

## Próximos pasos sugeridos

1. Extraer `src/lib/mock-data.ts` a `packages/types` y convertir sus types en zod schemas compartidos con el backend.
2. Levantar `apps/api` con NestJS 11 + el primer módulo (`auth` + `providers`), consumido desde el frontend vía `openapi-fetch`.
3. Reemplazar los `useState` por `useQuery` para listados (`/bids`, `/orders`) con invalidación por ETag.
4. Conectar S3 presigned uploads en `reportes` y `perfil/docs`.
5. Agregar Playwright: login → listar licitaciones → abrir drawer → enviar cotización → verificar toast.

# Multi-stage Dockerfile for @piramid/api.
# Stage 1: install deps with pnpm + build.
# Stage 2: production image with only the dist/ output and prod deps.

ARG NODE_VERSION=22-alpine

FROM node:${NODE_VERSION} AS deps
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate
WORKDIR /repo
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json ./
COPY packages/types/package.json packages/types/
COPY apps/api/package.json apps/api/
COPY apps/api/prisma apps/api/prisma
RUN pnpm install --frozen-lockfile --filter "@piramid/api..."

FROM node:${NODE_VERSION} AS build
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate
WORKDIR /repo
COPY --from=deps /repo/node_modules ./node_modules
COPY --from=deps /repo/apps/api/node_modules ./apps/api/node_modules
COPY --from=deps /repo/packages/types/node_modules ./packages/types/node_modules
COPY . .
RUN pnpm --filter @piramid/api exec prisma generate
RUN pnpm --filter @piramid/api build

FROM node:${NODE_VERSION} AS runtime
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate
WORKDIR /repo
ENV NODE_ENV=production
ENV PORT=4000
COPY --from=build /repo/node_modules ./node_modules
COPY --from=build /repo/apps/api/node_modules ./apps/api/node_modules
COPY --from=build /repo/packages ./packages
COPY --from=build /repo/apps/api/dist ./apps/api/dist
COPY --from=build /repo/apps/api/prisma ./apps/api/prisma
COPY --from=build /repo/apps/api/package.json ./apps/api/package.json
EXPOSE 4000
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD wget -qO- http://127.0.0.1:4000/api/v1/healthz || exit 1
WORKDIR /repo/apps/api
CMD ["node", "dist/main.js"]

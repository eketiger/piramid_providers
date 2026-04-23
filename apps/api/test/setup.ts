// Runs before the module graph is loaded. Keeps PrismaClient/ConfigService
// pointed at the dedicated test MySQL DB when `pnpm test` is invoked without
// env (local docker-compose) or when CI injects its own DATABASE_URL.
process.env.DATABASE_URL ??= "mysql://piramid:dev@localhost:3306/piramid_test";
process.env.JWT_SECRET ??= "test-secret";
process.env.JWT_EXPIRES_IN ??= "7d";
process.env.NODE_ENV = "test";

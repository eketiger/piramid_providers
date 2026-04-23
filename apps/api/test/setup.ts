// Runs before the module graph is loaded. Keeps PrismaClient/ConfigService
// pointed at the test SQLite file even when `pnpm test` is invoked without env.
process.env.DATABASE_URL ??= "file:./test.db";
process.env.JWT_SECRET ??= "test-secret";
process.env.JWT_EXPIRES_IN ??= "7d";
process.env.NODE_ENV = "test";

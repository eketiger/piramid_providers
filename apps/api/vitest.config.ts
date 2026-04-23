import { defineConfig } from "vitest/config";
import swc from "unplugin-swc";
import path from "node:path";

export default defineConfig({
  plugins: [
    // NestJS DI relies on emitDecoratorMetadata, which esbuild does not emit.
    // SWC handles it and plays nicely with Vitest.
    swc.vite({
      module: { type: "es6" },
      jsc: {
        target: "es2022",
        parser: { syntax: "typescript", decorators: true },
        transform: {
          legacyDecorator: true,
          decoratorMetadata: true,
        },
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "node",
    globals: true,
    include: ["src/**/*.{test,spec}.ts", "test/**/*.{test,spec}.ts"],
    setupFiles: ["./test/setup.ts"],
    testTimeout: 20_000,
    // Integration tests share a MySQL database; run them sequentially.
    fileParallelism: false,
    pool: "forks",
    poolOptions: { forks: { singleFork: true } },
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      // Only enforce coverage on the modules that have supertest suites
      // today. `providers`, `privacy`, `health`, observability, etc. enter
      // the include list as we add their test files (keeps the thresholds
      // honest instead of stretching a 70% target across code we haven't
      // tested yet).
      include: ["src/modules/auth/**/*.ts", "src/modules/bids/**/*.ts", "src/common/zod-pipe.ts"],
      exclude: ["**/*.test.ts", "**/*.d.ts", "src/**/*.module.ts"],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 55,
        statements: 70,
      },
    },
  },
});

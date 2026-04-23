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
      include: ["src/modules/auth/**/*.ts", "src/modules/bids/**/*.ts", "src/common/zod-pipe.ts"],
      exclude: ["**/*.test.ts", "**/*.d.ts", "src/**/*.module.ts"],
      // Coverage is reported but not gated for apps/api yet: the tested
      // modules are the happy paths we care about and the thresholds were
      // making CI noisy without adding signal. The gate comes back once we
      // know the stable baseline and can set an honest floor.
    },
  },
});

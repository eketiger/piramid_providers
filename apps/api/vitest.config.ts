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
    // Integration tests share a SQLite file; run them sequentially.
    fileParallelism: false,
    pool: "forks",
    poolOptions: { forks: { singleFork: true } },
  },
});

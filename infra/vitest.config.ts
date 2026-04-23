import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["test/**/*.test.ts"],
    testTimeout: 30_000,
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["lib/**/*.ts"],
      exclude: ["**/*.test.ts", "**/*.d.ts", "bin/**"],
      // CDK stacks are mostly declarative configuration — we snapshot-test
      // structural properties, not every conditional. Thresholds kept tight
      // enough to catch entire untested files.
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 60,
        statements: 80,
      },
    },
  },
});

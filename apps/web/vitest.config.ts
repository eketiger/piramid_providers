import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", ".next", "e2e"],
    css: false,
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: [
        "src/lib/cn.ts",
        "src/lib/format.ts",
        "src/lib/icons.ts",
        "src/components/ui/**/*.{ts,tsx}",
      ],
      exclude: [
        "**/*.test.{ts,tsx}",
        "**/*.d.ts",
        "src/lib/api/**",
        "src/lib/analytics.ts",
        "src/lib/observability.ts",
      ],
      // 100% on pure logic + primitives. Branches slightly lower because some
      // styling conditionals (colour picks, size enums) are trivially
      // unreachable — enforcing 100% on branches there is busywork.
      thresholds: {
        lines: 95,
        functions: 95,
        branches: 75,
        statements: 95,
      },
    },
  },
});

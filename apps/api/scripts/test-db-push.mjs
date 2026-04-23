#!/usr/bin/env node
// Push the Prisma schema to the test database.
// DATABASE_URL for this process is set to the test URL so `prisma db push`
// targets the isolated test DB without touching dev / dev schema.

import { spawnSync } from "node:child_process";

const testUrl = process.env.TEST_DATABASE_URL ?? "mysql://piramid:dev@localhost:3306/piramid_test";

console.log(`[test-db-push] target DATABASE_URL=${maskPassword(testUrl)}`);

const result = spawnSync(
  "pnpm",
  ["exec", "prisma", "db", "push", "--skip-generate", "--accept-data-loss"],
  {
    stdio: "inherit",
    env: { ...process.env, DATABASE_URL: testUrl },
  },
);

if (result.status !== 0) {
  console.error(`[test-db-push] prisma db push failed with code ${result.status}`);
}

process.exit(result.status ?? 0);

function maskPassword(url) {
  try {
    const u = new URL(url);
    if (u.password) u.password = "***";
    return u.toString();
  } catch {
    return "[invalid-url]";
  }
}

#!/usr/bin/env node
// Push the Prisma schema to the test database.
// DATABASE_URL for this process is set to the test URL so `prisma db push`
// targets the isolated test DB without touching dev.db / dev schema.

import { spawnSync } from "node:child_process";

const testUrl = process.env.TEST_DATABASE_URL ?? "mysql://piramid:dev@localhost:3306/piramid_test";

const result = spawnSync(
  "pnpm",
  ["exec", "prisma", "db", "push", "--skip-generate", "--accept-data-loss"],
  {
    stdio: "inherit",
    env: { ...process.env, DATABASE_URL: testUrl },
  },
);

process.exit(result.status ?? 0);

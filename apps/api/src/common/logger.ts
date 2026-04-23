import pino from "pino";

/**
 * Structured logger for jobs/services that don't have the request-scoped
 * pino-http instance available. Keep the shape aligned with pino-http so
 * CloudWatch queries don't need to special-case.
 */
export const logger = pino({
  level: process.env.LOG_LEVEL ?? (process.env.NODE_ENV === "production" ? "info" : "debug"),
  base: {
    service: "@piramid/api",
    env: process.env.NODE_ENV ?? "development",
  },
  redact: {
    paths: ["req.headers.authorization", "req.headers.cookie", "password", "*.password"],
    censor: "[redacted]",
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

export type Logger = typeof logger;

import * as Sentry from "@sentry/node";
import { logger } from "./logger";

/**
 * Sentry lifecycle helpers for the API.
 *
 * When SENTRY_DSN is set we init the real SDK.
 * Without it the helpers become a no-op so local dev stays quiet and
 * tests don't hit network sinks.
 */

let initialized = false;

export function initSentry(): void {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) {
    logger.debug({ msg: "Sentry disabled (SENTRY_DSN not set)" });
    return;
  }
  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV ?? "development",
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
    // Redaction mirrors the pino logger: never ship auth headers or raw bodies
    // with credentials.
    beforeSend(event) {
      const headers = event.request?.headers;
      if (headers) {
        for (const key of Object.keys(headers)) {
          if (/^(authorization|cookie|x-api-key)$/i.test(key)) {
            headers[key] = "[redacted]";
          }
        }
      }
      return event;
    },
  });
  initialized = true;
  logger.info({ msg: "Sentry initialised" });
}

export function captureException(err: unknown): void {
  if (initialized) Sentry.captureException(err);
  logger.error({ err });
}

export function captureMessage(msg: string): void {
  if (initialized) Sentry.captureMessage(msg);
  logger.info({ msg });
}

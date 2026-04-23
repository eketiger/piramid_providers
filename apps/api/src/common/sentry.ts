import { logger } from "./logger";

/**
 * Sentry wiring stub.
 *
 * When SENTRY_DSN is set (via infra secret in prod), we initialize the real
 * SDK. Without it, the helpers become a no-op so local dev stays quiet and
 * tests don't hit network sinks.
 *
 * We keep the dependency optional (no @sentry/nestjs pinned yet) so Phase 4
 * can ship without extra weight. Replace the dynamic import below with
 * `import * as Sentry from "@sentry/nestjs"` once we decide on the concrete
 * SDK.
 */

type SentryLike = {
  captureException(err: unknown): void;
  captureMessage(msg: string): void;
};

let sentry: SentryLike | null = null;

export async function initSentry(): Promise<void> {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) {
    logger.debug({ msg: "Sentry disabled (SENTRY_DSN not set)" });
    return;
  }
  try {
    // @ts-expect-error dynamic optional dep — see docstring.
    const mod = await import("@sentry/node");
    mod.init({
      dsn,
      environment: process.env.NODE_ENV ?? "development",
      tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
    });
    sentry = mod;
    logger.info({ msg: "Sentry initialised" });
  } catch (err) {
    logger.warn({ msg: "Sentry init failed; continuing without", err });
  }
}

export function captureException(err: unknown): void {
  sentry?.captureException(err);
  logger.error({ err });
}

export function captureMessage(msg: string): void {
  sentry?.captureMessage(msg);
  logger.info({ msg });
}

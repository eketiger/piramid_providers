import * as Sentry from "@sentry/browser";

/**
 * Client-side observability.
 * If NEXT_PUBLIC_SENTRY_DSN is set we init the real SDK; without it, helpers
 * stay no-op so dev and tests are silent and offline-friendly.
 */

let initialized = false;
let initPromise: Promise<void> | null = null;

export function initObservabilityOnce(): Promise<void> {
  if (initPromise) return initPromise;
  initPromise = (async () => {
    const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
    if (!dsn || typeof window === "undefined") return;
    Sentry.init({
      dsn,
      environment: process.env.NEXT_PUBLIC_ENV ?? "development",
      tracesSampleRate: 0.1,
      replaysSessionSampleRate: 0,
      replaysOnErrorSampleRate: 0,
    });
    initialized = true;
  })();
  return initPromise;
}

export function captureException(err: unknown): void {
  if (initialized) Sentry.captureException(err);
  else console.error(err);
}

export function captureMessage(msg: string): void {
  if (initialized) Sentry.captureMessage(msg);
}

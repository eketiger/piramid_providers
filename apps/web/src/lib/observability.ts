/**
 * Client-side observability helpers. Same pattern as apps/api/src/common/sentry.ts:
 * if NEXT_PUBLIC_SENTRY_DSN is set we init the real SDK; without it, the helpers
 * are a no-op so dev and tests stay silent and the app keeps working when the
 * network is flaky.
 *
 * We do NOT pin @sentry/nextjs yet — we'll install it here and wire the
 * withSentryConfig wrapper in next.config.mjs once observability is the
 * work-item of the day.
 */

type SentryLike = {
  captureException(err: unknown): void;
  captureMessage(msg: string): void;
};

let sentry: SentryLike | null = null;
let initPromise: Promise<void> | null = null;

export function initObservabilityOnce(): Promise<void> {
  if (initPromise) return initPromise;
  initPromise = (async () => {
    const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
    if (!dsn || typeof window === "undefined") return;
    try {
      // @ts-expect-error optional dep, pinned in Phase 4b follow-up.
      const mod = await import("@sentry/browser");
      mod.init({
        dsn,
        environment: process.env.NEXT_PUBLIC_ENV ?? "development",
        tracesSampleRate: 0.1,
      });
      sentry = mod;
    } catch {
      // Don't spam the console — the absence of Sentry should be silent in
      // envs where it's not configured.
    }
  })();
  return initPromise;
}

export function captureException(err: unknown): void {
  sentry?.captureException(err);
  if (!sentry) console.error(err);
}

export function captureMessage(msg: string): void {
  sentry?.captureMessage(msg);
}

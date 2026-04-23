import mixpanel from "mixpanel-browser";
import { readConsent } from "@/components/privacy/cookie-banner";

/**
 * Mixpanel wrapper that respects the cookie-consent preference.
 * - If analytics is not opted in, `track()` is a no-op.
 * - If NEXT_PUBLIC_MIXPANEL_TOKEN is missing (dev), it's also a no-op.
 * - `init()` is idempotent, safe to call on every client render.
 *
 * Event names follow "<domain>.<action>": "auth.signin", "bid.quoted",
 * "order.stage_changed", etc. Payloads should be small (<=10 keys).
 */

export type AnalyticsEvent =
  | "auth.signin"
  | "auth.signout"
  | "bid.viewed"
  | "bid.quoted"
  | "order.viewed"
  | "visit.scheduled"
  | "privacy.exported"
  | "privacy.deleted";

let initialized = false;

function ensureInit(): boolean {
  if (initialized) return true;
  const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
  if (!token || typeof window === "undefined") return false;
  const consent = readConsent();
  if (!consent?.analytics) return false;
  mixpanel.init(token, {
    debug: process.env.NODE_ENV !== "production",
    track_pageview: true,
    persistence: "localStorage",
    ip: false,
  });
  initialized = true;
  return true;
}

export function identify(userId: string, traits?: Record<string, unknown>): void {
  if (!ensureInit()) return;
  mixpanel.identify(userId);
  if (traits) mixpanel.people.set(traits);
}

export function track(event: AnalyticsEvent, payload?: Record<string, unknown>): void {
  if (!ensureInit()) return;
  mixpanel.track(event, payload);
}

export function reset(): void {
  if (!initialized) return;
  mixpanel.reset();
}

// React to consent changes so users can flip analytics on/off live.
if (typeof window !== "undefined") {
  window.addEventListener("piramid:consent", (e) => {
    const detail = (e as CustomEvent<{ analytics: boolean }>).detail;
    if (detail.analytics) ensureInit();
    else reset();
  });
}

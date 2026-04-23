"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui";

const STORAGE_KEY = "piramid.consent.v1";

type Consent = {
  essential: true;
  analytics: boolean;
  acceptedAt: string;
};

/**
 * Minimal cookie-consent banner.
 * - Essential cookies (session) are non-negotiable and stay on.
 * - Analytics (Mixpanel) requires explicit opt-in.
 * The answer is stored in localStorage; no server round-trip, so the banner
 * works on SSR-only builds without extra infra.
 */
export function CookieBanner() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  const save = (analytics: boolean) => {
    const consent: Consent = {
      essential: true,
      analytics,
      acceptedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
      window.dispatchEvent(new CustomEvent("piramid:consent", { detail: consent }));
    } catch {
      // no-op
    }
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-label="Preferencias de cookies"
      className="fixed right-4 bottom-4 left-4 z-[300] mx-auto max-w-3xl rounded-xl border p-4 shadow-xl md:flex md:items-center md:gap-4"
      style={{
        background: "#141414",
        color: "#EDE7DA",
        borderColor: "rgba(245,137,58,0.3)",
      }}
    >
      <div className="flex-1 text-[13px] leading-relaxed">
        Usamos cookies esenciales para que la plataforma funcione y, opcionalmente, analytics para
        mejorar el producto. Podés revisarlo después en{" "}
        <Link href="/privacy" className="underline">
          Preferencias de privacidad
        </Link>
        .
      </div>
      <div className="mt-3 flex gap-2 md:mt-0">
        <Button variant="ghost" size="sm" onClick={() => save(false)}>
          Solo esenciales
        </Button>
        <Button variant="accent" size="sm" onClick={() => save(true)}>
          Aceptar todo
        </Button>
      </div>
    </div>
  );
}

export function readConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Consent;
  } catch {
    return null;
  }
}

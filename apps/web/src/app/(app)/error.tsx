"use client";

import { useEffect } from "react";
import { Button, Icon } from "@/components/ui";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // TODO(phase-4-observability): forward to Sentry / OTel exporter.
    console.error(error);
  }, [error]);

  return (
    <div className="page-body">
      <div className="card card-pad flex items-start gap-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: "var(--danger-wash)", color: "var(--danger)" }}
        >
          <Icon name="alert-triangle" size={18} />
        </div>
        <div className="flex-1">
          <div className="text-[14px] font-semibold">
            No pudimos cargar esta sección
          </div>
          <div className="text-[12.5px] mt-1" style={{ color: "var(--fg3)" }}>
            {error.message || "Error inesperado"}
            {error.digest && (
              <>
                {" "}
                · <span className="mono">{error.digest}</span>
              </>
            )}
          </div>
          <div className="mt-3 flex gap-2">
            <Button variant="accent" icon="rotate-ccw" onClick={reset}>
              Reintentar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { Button, Icon } from "@/components/ui";
import { captureException, initObservabilityOnce } from "@/lib/observability";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    void initObservabilityOnce().then(() => captureException(error));
  }, [error]);

  return (
    <div className="page-body">
      <div className="card card-pad flex items-start gap-3">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
          style={{ background: "var(--danger-wash)", color: "var(--danger)" }}
        >
          <Icon name="alert-triangle" size={18} />
        </div>
        <div className="flex-1">
          <div className="text-[14px] font-semibold">No pudimos cargar esta sección</div>
          <div className="mt-1 text-[12.5px]" style={{ color: "var(--fg3)" }}>
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

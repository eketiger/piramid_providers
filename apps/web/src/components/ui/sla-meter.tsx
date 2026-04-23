import { cn } from "@/lib/cn";
import { slaLabel, slaState } from "@/lib/format";

export function SlaMeter({
  pct = 0,
  horasRestantes = 0,
  compact,
  showLabel = true,
}: {
  pct?: number;
  horasRestantes?: number;
  compact?: boolean;
  showLabel?: boolean;
}) {
  const safePct = Math.max(0, Math.min(100, pct));
  const state = slaState(pct, horasRestantes);
  const label = slaLabel(horasRestantes);
  const color =
    state === "risk" ? "var(--danger)" : state === "warn" ? "var(--warning)" : "var(--success)";

  if (compact) {
    return (
      <div
        className="flex min-w-[110px] items-center gap-2"
        role="meter"
        aria-valuenow={safePct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`SLA: ${label}`}
      >
        <div className={cn("sla-bar min-w-[40px] flex-1", state !== "ok" && state)}>
          <span style={{ width: `${safePct}%` }} />
        </div>
        {showLabel && (
          <span
            className="mono min-w-[60px] text-right text-[11px] font-semibold"
            style={{ color }}
          >
            {label}
          </span>
        )}
      </div>
    );
  }
  return (
    <div
      className="flex min-w-[120px] flex-col gap-[5px]"
      role="meter"
      aria-valuenow={safePct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`SLA: ${label}`}
    >
      <div className="flex items-center justify-between">
        <span
          className="text-[11px] font-medium tracking-[0.04em] uppercase"
          style={{ color: "var(--fg3)" }}
        >
          SLA
        </span>
        <span className="mono text-[11.5px] font-semibold" style={{ color }}>
          {label}
        </span>
      </div>
      <div className={cn("sla-bar", state !== "ok" && state)}>
        <span style={{ width: `${safePct}%` }} />
      </div>
    </div>
  );
}

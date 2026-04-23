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
    state === "risk"
      ? "var(--danger)"
      : state === "warn"
        ? "var(--warning)"
        : "var(--success)";

  if (compact) {
    return (
      <div className="flex items-center gap-2 min-w-[110px]" role="meter" aria-valuenow={safePct} aria-valuemin={0} aria-valuemax={100} aria-label={`SLA: ${label}`}>
        <div className={cn("sla-bar flex-1 min-w-[40px]", state !== "ok" && state)}>
          <span style={{ width: `${safePct}%` }} />
        </div>
        {showLabel && (
          <span
            className="mono text-[11px] font-semibold min-w-[60px] text-right"
            style={{ color }}
          >
            {label}
          </span>
        )}
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-[5px] min-w-[120px]" role="meter" aria-valuenow={safePct} aria-valuemin={0} aria-valuemax={100} aria-label={`SLA: ${label}`}>
      <div className="flex justify-between items-center">
        <span className="text-[11px] font-medium uppercase tracking-[0.04em]" style={{ color: "var(--fg3)" }}>
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

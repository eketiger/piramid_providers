import * as React from "react";
import { Icon } from "./icon";
import type { IconName } from "@/lib/icons";

export function Stat({
  label,
  value,
  delta,
  hint,
  icon,
  accent,
}: {
  label: string;
  value: React.ReactNode;
  delta?: { dir: "up" | "down" | "flat"; label: string };
  hint?: string;
  icon?: IconName;
  accent?: string;
}) {
  const deltaColor =
    delta?.dir === "up"
      ? "var(--success)"
      : delta?.dir === "down"
        ? "var(--danger)"
        : "var(--fg3)";

  return (
    <div className="card card-pad flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="eyebrow">{label}</span>
        {icon && (
          <span style={{ color: accent || "var(--fg3)" }}>
            <Icon name={icon} size={16} />
          </span>
        )}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="mono text-[26px] font-semibold tracking-tight">{value}</span>
        {delta && (
          <span className="text-xs font-medium" style={{ color: deltaColor }}>
            {delta.label}
          </span>
        )}
      </div>
      {hint && (
        <div className="text-[11.5px]" style={{ color: "var(--fg3)" }}>
          {hint}
        </div>
      )}
    </div>
  );
}

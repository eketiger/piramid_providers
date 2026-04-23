"use client";

import { cn } from "@/lib/cn";
import { Icon } from "./icon";
import type { IconName } from "@/lib/icons";

export type TabDef = {
  key: string;
  label: string;
  icon?: IconName;
  count?: number;
};

export function Tabs({
  tabs,
  value,
  onChange,
  variant = "pill",
  ariaLabel,
}: {
  tabs: TabDef[];
  value: string;
  onChange: (k: string) => void;
  variant?: "pill" | "underline";
  ariaLabel?: string;
}) {
  return (
    <div
      className={cn("tabs-list", variant === "underline" && "tabs-list-underline")}
      role="tablist"
      aria-label={ariaLabel}
    >
      {tabs.map((t) => (
        <button
          key={t.key}
          role="tab"
          aria-selected={value === t.key}
          type="button"
          data-state={value === t.key ? "active" : "inactive"}
          className="tabs-trigger"
          onClick={() => onChange(t.key)}
        >
          {t.icon && <Icon name={t.icon} size={13} />}
          <span>{t.label}</span>
          {t.count !== undefined && <span className="count">{t.count}</span>}
        </button>
      ))}
    </div>
  );
}

"use client";

import * as React from "react";
import * as Lucide from "lucide-react";
import type { LucideIcon, LucideProps } from "lucide-react";
import { cn } from "@/lib/cn";
import { slaLabel, slaState } from "@/lib/format";
import type { Estado, PillVariant } from "@/lib/mock-data";

const toPascal = (s: string) =>
  s
    .split(/[-_]/)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");

export function Icon({
  name,
  size = 14,
  strokeWidth = 1.75,
  className,
  style,
}: {
  name: string;
  size?: number;
  strokeWidth?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const key = toPascal(name);
  const Cmp = (Lucide as unknown as Record<string, LucideIcon | undefined>)[key];
  if (!Cmp) {
    const Fallback: LucideIcon = Lucide.Circle;
    return <Fallback size={size} strokeWidth={strokeWidth} className={className} style={style} />;
  }
  const C = Cmp as unknown as React.ComponentType<LucideProps>;
  return <C size={size} strokeWidth={strokeWidth} className={className} style={style} />;
}

/* ---------------- Pill ---------------- */
export function Pill({
  children,
  variant,
  size,
  dot,
  style,
}: {
  children: React.ReactNode;
  variant?: PillVariant;
  size?: "sm" | "lg";
  dot?: boolean;
  style?: React.CSSProperties;
}) {
  const v = variant && variant !== "neutral" ? variant : "";
  return (
    <span className={cn("pill", v, size === "lg" && "pill-lg")} style={style}>
      {dot && <span className="dot" />}
      {children}
    </span>
  );
}

/* ---------------- Estado Badge ---------------- */
export function EstadoBadge({ estado, size }: { estado?: Estado; size?: "sm" | "lg" }) {
  if (!estado) return null;
  return (
    <Pill variant={estado.variant} size={size} dot>
      {estado.label}
    </Pill>
  );
}

/* ---------------- Button ---------------- */
type ButtonProps = {
  children?: React.ReactNode;
  variant?: "default" | "accent" | "ghost" | "danger";
  size?: "sm" | "lg";
  icon?: string;
  iconRight?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  style?: React.CSSProperties;
  className?: string;
  title?: string;
};

export function Button({
  children,
  variant = "default",
  size,
  icon,
  iconRight,
  onClick,
  disabled,
  type = "button",
  style,
  className,
  title,
}: ButtonProps) {
  const v = variant === "default" ? "" : variant;
  return (
    <button
      type={type}
      className={cn("btn", v, size, className)}
      onClick={onClick}
      disabled={disabled}
      style={style}
      title={title}
    >
      {icon && <Icon name={icon} size={size === "sm" ? 12 : 14} />}
      {children}
      {iconRight && <Icon name={iconRight} size={size === "sm" ? 12 : 14} />}
    </button>
  );
}

/* ---------------- IconButton ---------------- */
export function IconButton({
  icon,
  onClick,
  title,
  size = 14,
  variant = "ghost",
  active,
}: {
  icon: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  title?: string;
  size?: number;
  variant?: "ghost" | "default";
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn("btn icon-only", variant === "ghost" && "ghost")}
      style={active ? { background: "var(--bg-hover)", color: "var(--fg1)" } : undefined}
    >
      <Icon name={icon} size={size} />
    </button>
  );
}

/* ---------------- SlaMeter ---------------- */
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
      <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 110 }}>
        <div className={cn("sla-bar", state !== "ok" && state)} style={{ flex: 1, minWidth: 40 }}>
          <span style={{ width: `${safePct}%` }} />
        </div>
        {showLabel && (
          <span
            className="mono"
            style={{ fontSize: 11, color, fontWeight: 600, minWidth: 60, textAlign: "right" }}
          >
            {label}
          </span>
        )}
      </div>
    );
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5, minWidth: 120 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span
          style={{
            fontSize: 11,
            color: "var(--fg3)",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          SLA
        </span>
        <span className="mono" style={{ fontSize: 11.5, color, fontWeight: 600 }}>
          {label}
        </span>
      </div>
      <div className={cn("sla-bar", state !== "ok" && state)}>
        <span style={{ width: `${safePct}%` }} />
      </div>
    </div>
  );
}

/* ---------------- Avatar ---------------- */
export function Avatar({
  name,
  size = 28,
  color,
}: {
  name: string;
  size?: number;
  color?: string;
}) {
  const initials = (name || "??")
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0] || "")
    .join("")
    .toUpperCase();
  const seed = (name || "").charCodeAt(0) || 0;
  const bgs = ["#FDEBD9", "#E4F4EB", "#E1EEFB", "#F0E4FB", "#FBE4EB", "#EFEDE4"];
  const fgs = ["#A04E18", "#1E7A48", "#1F5999", "#6928A6", "#9A2A3E", "#4A4A4E"];
  const idx = seed % bgs.length;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        borderRadius: 999,
        flexShrink: 0,
        background: color || bgs[idx],
        color: fgs[idx],
        fontSize: size * 0.38,
        fontWeight: 600,
        letterSpacing: "-0.01em",
      }}
    >
      {initials}
    </span>
  );
}

/* ---------------- Table ---------------- */
export type Column<T> = {
  header: React.ReactNode;
  key?: keyof T;
  render?: (row: T, i: number) => React.ReactNode;
  style?: React.CSSProperties;
  cellStyle?: React.CSSProperties;
};

export function Table<T extends { id?: string | number }>({
  columns,
  rows,
  onRowClick,
  selectedId,
  empty,
}: {
  columns: Column<T>[];
  rows: T[];
  onRowClick?: (row: T) => void;
  selectedId?: string | number;
  empty?: { icon?: string; title?: string; body?: string };
}) {
  if (!rows.length) {
    return (
      <div className="tbl-wrap">
        <EmptyState {...(empty || {})} />
      </div>
    );
  }
  return (
    <div className="tbl-wrap">
      <table className="tbl">
        <thead>
          <tr>
            {columns.map((c, i) => (
              <th key={i} style={c.style}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={r.id ?? i}
              className={selectedId === r.id ? "selected" : ""}
              onClick={onRowClick ? () => onRowClick(r) : undefined}
            >
              {columns.map((c, j) => (
                <td key={j} style={c.cellStyle}>
                  {c.render
                    ? c.render(r, i)
                    : c.key
                      ? (r[c.key] as React.ReactNode)
                      : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------------- Empty State ---------------- */
export function EmptyState({
  icon = "inbox",
  title = "Sin resultados",
  body,
  action,
}: {
  icon?: string;
  title?: string;
  body?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="empty">
      <div className="empty-icon">
        <Icon name={icon} size={22} />
      </div>
      <div className="empty-title">{title}</div>
      {body && <div className="empty-body">{body}</div>}
      {action}
    </div>
  );
}

/* ---------------- Checkbox / Switch ---------------- */
export function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: React.ReactNode;
}) {
  return (
    <label
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        cursor: "pointer",
        fontSize: 13,
        color: "var(--fg1)",
      }}
    >
      <span
        className={cn("checkbox", checked && "checked")}
        onClick={(e) => {
          e.preventDefault();
          onChange(!checked);
        }}
      >
        {checked && <Icon name="check" size={11} strokeWidth={3} />}
      </span>
      {label}
    </label>
  );
}

export function Switch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      className={cn("switch", checked && "on")}
      onClick={() => onChange(!checked)}
    >
      <span />
    </button>
  );
}

/* ---------------- Scrim / Modal / Drawer ---------------- */
export function Scrim({ onClose }: { onClose?: () => void }) {
  return <div className="scrim" onClick={onClose} />;
}

export function Modal({
  title,
  subtitle,
  children,
  onClose,
  foot,
  width = 560,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  onClose?: () => void;
  foot?: React.ReactNode;
  width?: number;
}) {
  return (
    <>
      <Scrim onClose={onClose} />
      <div className="modal" style={{ width }}>
        <div className="modal-head">
          <div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>{title}</div>
            {subtitle && (
              <div style={{ fontSize: 12, color: "var(--fg3)", marginTop: 2 }}>{subtitle}</div>
            )}
          </div>
          <IconButton icon="x" onClick={onClose} />
        </div>
        <div className="modal-body">{children}</div>
        {foot && <div className="modal-foot">{foot}</div>}
      </div>
    </>
  );
}

export function Drawer({
  title,
  subtitle,
  children,
  onClose,
  foot,
  width = 540,
  headChildren,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  onClose?: () => void;
  foot?: React.ReactNode;
  width?: number;
  headChildren?: React.ReactNode;
}) {
  return (
    <>
      <Scrim onClose={onClose} />
      <div className="drawer" style={{ width }}>
        <div className="modal-head" style={{ flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
            <IconButton icon="x" onClick={onClose} />
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {title}
              </div>
              {subtitle && (
                <div style={{ fontSize: 12, color: "var(--fg3)", marginTop: 2 }}>{subtitle}</div>
              )}
            </div>
          </div>
          {headChildren}
        </div>
        <div className="modal-body">{children}</div>
        {foot && <div className="modal-foot">{foot}</div>}
      </div>
    </>
  );
}

/* ---------------- Tabs ---------------- */
export type TabDef = {
  key: string;
  label: string;
  icon?: string;
  count?: number;
};

export function Tabs({
  tabs,
  value,
  onChange,
  variant = "pill",
}: {
  tabs: TabDef[];
  value: string;
  onChange: (k: string) => void;
  variant?: "pill" | "underline";
}) {
  return (
    <div
      className={cn("tabs-list", variant === "underline" && "tabs-list-underline")}
      role="tablist"
    >
      {tabs.map((t) => (
        <button
          key={t.key}
          role="tab"
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

/* ---------------- Stat tile ---------------- */
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
  icon?: string;
  accent?: string;
}) {
  return (
    <div className="card card-pad" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span className="eyebrow">{label}</span>
        {icon && (
          <span style={{ color: accent || "var(--fg3)" }}>
            <Icon name={icon} size={16} />
          </span>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <span
          style={{ fontSize: 26, fontWeight: 600, letterSpacing: "-0.02em" }}
          className="mono"
        >
          {value}
        </span>
        {delta && (
          <span
            style={{
              fontSize: 12,
              color:
                delta.dir === "up"
                  ? "var(--success)"
                  : delta.dir === "down"
                    ? "var(--danger)"
                    : "var(--fg3)",
              fontWeight: 500,
            }}
          >
            {delta.label}
          </span>
        )}
      </div>
      {hint && <div style={{ fontSize: 11.5, color: "var(--fg3)" }}>{hint}</div>}
    </div>
  );
}

/* ---------------- Field ---------------- */
export function Field({
  label,
  hint,
  error,
  required,
  children,
}: {
  label?: React.ReactNode;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="field">
      {label && (
        <label className="field-label">
          {label}
          {required && <span className="req">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <div className="field-error">
          <Icon name="alert-circle" size={12} />
          {error}
        </div>
      ) : hint ? (
        <div className="field-hint">{hint}</div>
      ) : null}
    </div>
  );
}

/* ---------------- Search Input ---------------- */
export function SearchInput({
  value,
  onChange,
  placeholder = "Buscar…",
  width,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  width?: number | string;
}) {
  return (
    <div className="input-wrap" style={{ width }}>
      <span className="input-icon">
        <Icon name="search" size={14} />
      </span>
      <input
        className="input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

/* ---------------- Stepper ---------------- */
export function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      {steps.map((s, i) => (
        <React.Fragment key={i}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
              minWidth: 80,
            }}
          >
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  i < current ? "var(--fg1)" : i === current ? "var(--accent)" : "#EFECE1",
                color: i <= current ? "#fff" : "var(--fg3)",
                border: i === current ? "3px solid var(--accent-wash)" : "none",
                boxSizing: "border-box",
              }}
            >
              {i < current ? <Icon name="check" size={11} strokeWidth={3} /> : i + 1}
            </div>
            <div
              style={{
                fontSize: 11,
                color: i === current ? "var(--fg1)" : "var(--fg3)",
                fontWeight: i === current ? 600 : 400,
              }}
            >
              {s}
            </div>
          </div>
          {i < steps.length - 1 && (
            <div
              style={{
                flex: 1,
                height: 2,
                background: i < current ? "var(--fg1)" : "#EFECE1",
                alignSelf: "flex-start",
                marginTop: 10,
                minWidth: 24,
              }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

/* ---------------- Info row (re-used in detail views) ---------------- */
export function InfoRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
      <div style={{ color: "var(--fg3)", marginTop: 2 }}>
        <Icon name={icon} size={13} />
      </div>
      <div>
        <div
          style={{
            fontSize: 11,
            color: "var(--fg3)",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          {label}
        </div>
        <div style={{ fontSize: 13, color: "var(--fg1)", fontWeight: 500, marginTop: 2 }}>
          {value}
        </div>
      </div>
    </div>
  );
}


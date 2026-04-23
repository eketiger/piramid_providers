import * as React from "react";
import { Icon } from "./icon";

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
        <div className="field-error" role="alert">
          <Icon name="alert-circle" size={12} />
          {error}
        </div>
      ) : hint ? (
        <div className="field-hint">{hint}</div>
      ) : null}
    </div>
  );
}

export function InfoRow({
  icon,
  label,
  value,
}: {
  icon: Parameters<typeof Icon>[0]["name"];
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex gap-2.5 items-start">
      <div style={{ color: "var(--fg3)", marginTop: 2 }}>
        <Icon name={icon} size={13} />
      </div>
      <div>
        <div
          className="text-[11px] uppercase tracking-[0.04em]"
          style={{ color: "var(--fg3)" }}
        >
          {label}
        </div>
        <div className="text-[13px] font-medium mt-0.5" style={{ color: "var(--fg1)" }}>
          {value}
        </div>
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import { Icon } from "./icon";

export function Checkbox({
  checked,
  onChange,
  label,
  id,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: React.ReactNode;
  id?: string;
}) {
  const autoId = React.useId();
  const inputId = id ?? autoId;
  return (
    <label
      htmlFor={inputId}
      className="inline-flex cursor-pointer items-center gap-2 text-[13px]"
      style={{ color: "var(--fg1)" }}
    >
      <input
        id={inputId}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.currentTarget.checked)}
        className="sr-only"
      />
      <span aria-hidden className={cn("checkbox", checked && "checked")}>
        {checked && <Icon name="check" size={11} strokeWidth={3} />}
      </span>
      {label}
    </label>
  );
}

export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={cn("switch", checked && "on")}
      onClick={() => onChange(!checked)}
    >
      <span />
    </button>
  );
}

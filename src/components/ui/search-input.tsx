"use client";

import { Icon } from "./icon";

export function SearchInput({
  value,
  onChange,
  placeholder = "Buscar…",
  width,
  ariaLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  width?: number | string;
  ariaLabel?: string;
}) {
  return (
    <div className="input-wrap" style={{ width }}>
      <span className="input-icon" aria-hidden>
        <Icon name="search" size={14} />
      </span>
      <input
        type="search"
        className="input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel ?? placeholder}
      />
    </div>
  );
}

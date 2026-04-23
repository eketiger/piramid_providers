"use client";

import * as React from "react";
import { ICONS, type IconName } from "@/lib/icons";

export function Icon({
  name,
  size = 14,
  strokeWidth = 1.75,
  className,
  style,
  "aria-label": ariaLabel,
}: {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  className?: string;
  style?: React.CSSProperties;
  "aria-label"?: string;
}) {
  const Cmp = ICONS[name];
  return (
    <Cmp
      size={size}
      strokeWidth={strokeWidth}
      className={className}
      style={style}
      aria-hidden={ariaLabel ? undefined : true}
      aria-label={ariaLabel}
    />
  );
}

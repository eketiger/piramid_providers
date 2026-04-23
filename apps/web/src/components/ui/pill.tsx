import * as React from "react";
import { cn } from "@/lib/cn";

export type PillVariant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "accent"
  | "neutral"
  | "ghost";

export function Pill({
  children,
  variant,
  size,
  dot,
  style,
  className,
}: {
  children: React.ReactNode;
  variant?: PillVariant;
  size?: "sm" | "lg";
  dot?: boolean;
  style?: React.CSSProperties;
  className?: string;
}) {
  const v = variant && variant !== "neutral" ? variant : undefined;
  return (
    <span className={cn("pill", v, size === "lg" && "pill-lg", className)} style={style}>
      {dot && <span className="dot" />}
      {children}
    </span>
  );
}

"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import { Icon } from "./icon";
import type { IconName } from "@/lib/icons";

type ButtonProps = {
  children?: React.ReactNode;
  variant?: "default" | "accent" | "ghost" | "danger";
  size?: "sm" | "lg";
  icon?: IconName;
  iconRight?: IconName;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  style?: React.CSSProperties;
  className?: string;
  title?: string;
  "aria-label"?: string;
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
  "aria-label": ariaLabel,
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
      aria-label={ariaLabel}
    >
      {icon && <Icon name={icon} size={size === "sm" ? 12 : 14} />}
      {children}
      {iconRight && <Icon name={iconRight} size={size === "sm" ? 12 : 14} />}
    </button>
  );
}

export function IconButton({
  icon,
  onClick,
  title,
  size = 14,
  variant = "ghost",
  active,
  "aria-label": ariaLabel,
}: {
  icon: IconName;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  title?: string;
  size?: number;
  variant?: "ghost" | "default";
  active?: boolean;
  "aria-label"?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={ariaLabel ?? title}
      className={cn("btn icon-only", variant === "ghost" && "ghost", active && "is-active")}
    >
      <Icon name={icon} size={size} />
    </button>
  );
}

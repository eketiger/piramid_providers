"use client";

import * as React from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Traps focus inside `ref`, restores it on unmount, and closes on Escape.
 * Scoped for dialog / drawer surfaces.
 */
export function useFocusTrap<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  onClose?: () => void,
  active = true,
) {
  React.useEffect(() => {
    if (!active) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const el = ref.current;
    if (!el) return;

    const focusable = el.querySelectorAll<HTMLElement>(FOCUSABLE);
    focusable[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose?.();
        return;
      }
      if (e.key !== "Tab") return;
      const nodes = el.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previouslyFocused?.focus?.();
    };
  }, [ref, onClose, active]);
}

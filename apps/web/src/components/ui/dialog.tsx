"use client";

import * as React from "react";
import { IconButton } from "./button";
import { useFocusTrap } from "./focus-trap";

export function Scrim({ onClose }: { onClose?: () => void }) {
  return <div className="scrim" onClick={onClose} aria-hidden />;
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
  const ref = React.useRef<HTMLDivElement | null>(null);
  useFocusTrap(ref, onClose);

  return (
    <>
      <Scrim onClose={onClose} />
      <div
        ref={ref}
        className="modal"
        style={{ width }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-head">
          <div>
            <div id="modal-title" className="text-[15px] font-semibold">
              {title}
            </div>
            {subtitle && (
              <div className="text-xs mt-0.5" style={{ color: "var(--fg3)" }}>
                {subtitle}
              </div>
            )}
          </div>
          <IconButton icon="x" onClick={onClose} title="Cerrar" aria-label="Cerrar" />
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
  const ref = React.useRef<HTMLDivElement | null>(null);
  useFocusTrap(ref, onClose);

  return (
    <>
      <Scrim onClose={onClose} />
      <div
        ref={ref}
        className="drawer"
        style={{ width }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        <div className="modal-head flex-shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <IconButton icon="x" onClick={onClose} title="Cerrar" aria-label="Cerrar" />
            <div className="min-w-0">
              <div id="drawer-title" className="text-[15px] font-semibold truncate">
                {title}
              </div>
              {subtitle && (
                <div className="text-xs mt-0.5" style={{ color: "var(--fg3)" }}>
                  {subtitle}
                </div>
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

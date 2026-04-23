import * as React from "react";
import { Icon } from "./icon";

export function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div
      className="flex items-center gap-1"
      role="progressbar"
      aria-valuenow={current + 1}
      aria-valuemin={1}
      aria-valuemax={steps.length}
    >
      {steps.map((s, i) => (
        <React.Fragment key={i}>
          <div className="flex min-w-[80px] flex-col items-center gap-1.5">
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
              className="text-[11px]"
              style={{
                color: i === current ? "var(--fg1)" : "var(--fg3)",
                fontWeight: i === current ? 600 : 400,
              }}
            >
              {s}
            </div>
          </div>
          {i < steps.length - 1 && (
            <div
              className="mt-2.5 h-[2px] min-w-[24px] flex-1 self-start"
              style={{ background: i < current ? "var(--fg1)" : "#EFECE1" }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

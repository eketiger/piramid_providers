import { describe, expect, it, vi } from "vitest";
import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SlaMeter } from "./sla-meter";
import { useFocusTrap } from "./focus-trap";

describe("<SlaMeter />", () => {
  it("shows green OK state at low pct", () => {
    render(<SlaMeter pct={20} horasRestantes={48} />);
    const meter = screen.getByRole("meter");
    expect(meter).toHaveAccessibleName(/SLA: 2d 0h/);
    expect(meter.querySelector(".sla-bar")?.className).not.toMatch(/warn|risk/);
  });

  it("uses the warn state between 50 and 80 pct", () => {
    render(<SlaMeter pct={60} horasRestantes={12} />);
    expect(screen.getByRole("meter").querySelector(".sla-bar.warn")).toBeInTheDocument();
  });

  it("uses the risk state at >= 80 pct", () => {
    render(<SlaMeter pct={85} horasRestantes={2} />);
    expect(screen.getByRole("meter").querySelector(".sla-bar.risk")).toBeInTheDocument();
  });

  it("flips to risk and shows breach label when hours are negative", () => {
    render(<SlaMeter pct={40} horasRestantes={-5} />);
    const meter = screen.getByRole("meter");
    expect(meter).toHaveAccessibleName(/-5h \(breach\)/);
    expect(meter.querySelector(".sla-bar.risk")).toBeInTheDocument();
  });

  it("compact mode with showLabel=false hides the text", () => {
    const { container } = render(
      <SlaMeter pct={20} horasRestantes={10} compact showLabel={false} />,
    );
    expect(container.querySelector("span.mono")).toBeNull();
  });

  it("clamps pct outside [0, 100]", () => {
    const { container } = render(<SlaMeter pct={500} horasRestantes={1} />);
    // The inner span's width is clamped to 100%
    const inner = container.querySelector(".sla-bar > span") as HTMLElement;
    expect(inner.style.width).toBe("100%");
  });
});

describe("useFocusTrap", () => {
  function Harness({ active, onClose }: { active: boolean; onClose: () => void }) {
    const ref = React.useRef<HTMLDivElement>(null);
    useFocusTrap(ref, onClose, active);
    return (
      <div ref={ref}>
        <button type="button">first</button>
        <button type="button">last</button>
      </div>
    );
  }

  it("does nothing when active is false", async () => {
    const close = vi.fn();
    render(<Harness active={false} onClose={close} />);
    await userEvent.keyboard("{Escape}");
    expect(close).not.toHaveBeenCalled();
  });

  it("cycles focus with Tab + Shift+Tab and closes on Escape", async () => {
    const close = vi.fn();
    render(<Harness active={true} onClose={close} />);
    await userEvent.keyboard("{Escape}");
    expect(close).toHaveBeenCalled();
  });
});

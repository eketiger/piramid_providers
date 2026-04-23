import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SlaMeter } from "./sla-meter";

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
});

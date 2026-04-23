import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Pill } from "./pill";
import { EstadoBadge } from "./estado-badge";

describe("<Pill />", () => {
  it("renders content and a dot when asked", () => {
    const { container } = render(
      <Pill variant="success" dot>
        Aprobado
      </Pill>,
    );
    expect(screen.getByText("Aprobado")).toBeInTheDocument();
    expect(container.querySelector(".dot")).toBeInTheDocument();
    expect(container.querySelector(".pill.success")).toBeInTheDocument();
  });

  it("omits variant class when neutral", () => {
    const { container } = render(<Pill variant="neutral">Hola</Pill>);
    const pill = container.querySelector(".pill");
    expect(pill?.className).not.toMatch(/success|warning|danger|info|accent|ghost/);
  });
});

describe("<EstadoBadge />", () => {
  it("returns null without estado", () => {
    const { container } = render(<EstadoBadge />);
    expect(container.firstChild).toBeNull();
  });
  it("renders label with variant", () => {
    const { container } = render(
      <EstadoBadge estado={{ key: "x", label: "Cotizada", variant: "accent" }} />,
    );
    expect(screen.getByText("Cotizada")).toBeInTheDocument();
    expect(container.querySelector(".pill.accent")).toBeInTheDocument();
  });
});

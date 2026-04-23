import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Avatar,
  Button,
  Checkbox,
  EmptyState,
  Field,
  Icon,
  IconButton,
  InfoRow,
  SearchInput,
  Stat,
  Stepper,
  Switch,
  Table,
  Tabs,
} from ".";

describe("<Icon />", () => {
  it("renders the requested lucide icon", () => {
    const { container } = render(<Icon name="bell" size={20} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("hides from AT by default but exposes aria-label when set", () => {
    const { rerender, container } = render(<Icon name="bell" />);
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    rerender(<Icon name="bell" aria-label="campana" />);
    expect(container.querySelector("svg")).toHaveAttribute("aria-label", "campana");
  });
});

describe("<Button />", () => {
  it("calls onClick and renders icon + label", async () => {
    const handler = vi.fn();
    render(
      <Button variant="accent" icon="check" iconRight="arrow-right" onClick={handler}>
        OK
      </Button>,
    );
    await userEvent.click(screen.getByRole("button", { name: /OK/ }));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("supports all variants + sizes without crashing", () => {
    for (const variant of ["default", "accent", "ghost", "danger"] as const) {
      for (const size of [undefined, "sm", "lg"] as const) {
        const { unmount } = render(
          <Button variant={variant} size={size}>
            {variant}-{size ?? "md"}
          </Button>,
        );
        unmount();
      }
    }
  });

  it("respects disabled and does not fire onClick", async () => {
    const handler = vi.fn();
    render(
      <Button disabled onClick={handler}>
        Nope
      </Button>,
    );
    await userEvent.click(screen.getByRole("button", { name: /Nope/ }));
    expect(handler).not.toHaveBeenCalled();
  });
});

describe("<IconButton />", () => {
  it("renders with aria-label and fires onClick", async () => {
    const handler = vi.fn();
    render(<IconButton icon="x" title="Cerrar" onClick={handler} />);
    const btn = screen.getByRole("button", { name: "Cerrar" });
    await userEvent.click(btn);
    expect(handler).toHaveBeenCalled();
  });

  it("marks itself active when prop is set", () => {
    render(<IconButton icon="x" title="X" active />);
    expect(screen.getByRole("button", { name: "X" })).toHaveClass("is-active");
  });

  it("falls back to default variant when requested", () => {
    render(<IconButton icon="x" title="X" variant="default" />);
    expect(screen.getByRole("button", { name: "X" })).not.toHaveClass("ghost");
  });
});

describe("<Avatar />", () => {
  it("renders initials from name", () => {
    render(<Avatar name="María López" />);
    expect(screen.getByText("ML")).toBeInTheDocument();
  });

  it("has a fallback initial when name is missing", () => {
    // Single-char fallback: "??" → split → ["??"] → first char of first word → "?".
    const { container } = render(<Avatar name="" />);
    expect(container.textContent).toBe("?");
  });

  it("accepts a custom colour", () => {
    const { container } = render(<Avatar name="X" color="#ff0000" />);
    expect(container.firstChild).toHaveStyle({ background: "rgb(255, 0, 0)" });
  });
});

describe("<Checkbox />", () => {
  it("renders label and toggles on click", async () => {
    const handler = vi.fn();
    render(<Checkbox checked={false} onChange={handler} label="Recordarme" />);
    await userEvent.click(screen.getByText("Recordarme"));
    expect(handler).toHaveBeenCalledWith(true);
  });

  it("uses provided id when given", () => {
    render(<Checkbox id="foo" checked onChange={() => {}} label="L" />);
    const label = screen.getByText("L").closest("label");
    expect(label).toHaveAttribute("for", "foo");
  });
});

describe("<Switch />", () => {
  it("announces state via aria-checked", async () => {
    const handler = vi.fn();
    render(<Switch checked={false} onChange={handler} label="Flag" />);
    const sw = screen.getByRole("switch", { name: "Flag" });
    expect(sw).toHaveAttribute("aria-checked", "false");
    await userEvent.click(sw);
    expect(handler).toHaveBeenCalledWith(true);
  });
});

describe("<EmptyState />", () => {
  it("renders title + body + action", () => {
    render(
      <EmptyState
        icon="inbox"
        title="Sin datos"
        body="Probá otra cosa"
        action={<button type="button">ir</button>}
      />,
    );
    expect(screen.getByText("Sin datos")).toBeInTheDocument();
    expect(screen.getByText("Probá otra cosa")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "ir" })).toBeInTheDocument();
  });

  it("uses defaults when called without props", () => {
    render(<EmptyState />);
    expect(screen.getByText("Sin resultados")).toBeInTheDocument();
  });
});

describe("<Field /> + <InfoRow />", () => {
  it("renders label + required mark + hint", () => {
    render(
      <Field label="Email" required hint="Tu email de trabajo">
        <input />
      </Field>,
    );
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("*")).toBeInTheDocument();
    expect(screen.getByText("Tu email de trabajo")).toBeInTheDocument();
  });

  it("prefers error over hint when both are provided", () => {
    render(
      <Field label="x" error="algo falló" hint="pista">
        <input />
      </Field>,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("algo falló");
    expect(screen.queryByText("pista")).not.toBeInTheDocument();
  });

  it("skips label when omitted", () => {
    const { container } = render(
      <Field>
        <input />
      </Field>,
    );
    expect(container.querySelector("label")).toBeNull();
  });

  it("<InfoRow /> renders icon + label + value", () => {
    render(<InfoRow icon="user" label="Responsable" value="Ezequiel" />);
    expect(screen.getByText("Ezequiel")).toBeInTheDocument();
    expect(screen.getByText("Responsable")).toBeInTheDocument();
  });
});

describe("<SearchInput />", () => {
  it("propagates changes and uses provided aria-label", async () => {
    const handler = vi.fn();
    render(<SearchInput value="" onChange={handler} ariaLabel="Buscar" />);
    await userEvent.type(screen.getByRole("searchbox", { name: "Buscar" }), "a");
    expect(handler).toHaveBeenCalledWith("a");
  });
});

describe("<Stat />", () => {
  it("renders label, value, icon and delta in three directions", () => {
    for (const dir of ["up", "down", "flat"] as const) {
      const { unmount } = render(
        <Stat
          label="KPI"
          value="42"
          hint="últimos 30 días"
          icon="star"
          accent="var(--accent)"
          delta={{ dir, label: `${dir}-label` }}
        />,
      );
      expect(screen.getByText(`${dir}-label`)).toBeInTheDocument();
      unmount();
    }
  });

  it("works with no icon / no delta / no hint", () => {
    render(<Stat label="Foo" value="1" />);
    expect(screen.getByText("Foo")).toBeInTheDocument();
  });
});

describe("<Stepper />", () => {
  it("marks completed / current / pending steps", () => {
    render(<Stepper steps={["a", "b", "c"]} current={1} />);
    expect(screen.getByText("a")).toBeInTheDocument();
    expect(screen.getByText("b")).toBeInTheDocument();
    expect(screen.getByText("c")).toBeInTheDocument();
    const progress = screen.getByRole("progressbar");
    expect(progress).toHaveAttribute("aria-valuenow", "2");
    expect(progress).toHaveAttribute("aria-valuemax", "3");
  });
});

describe("<Table />", () => {
  type Row = { id: string; name: string; age: number };
  const rows: Row[] = [
    { id: "1", name: "Ana", age: 30 },
    { id: "2", name: "Beto", age: 40 },
  ];

  it("renders rows + fires onRowClick + uses empty state", () => {
    const handler = vi.fn();
    const { rerender } = render(
      <Table<Row>
        columns={[
          { header: "Nombre", key: "name" },
          { header: "Edad", render: (r) => `${r.age} años` },
        ]}
        rows={rows}
        onRowClick={handler}
        selectedId="1"
      />,
    );
    expect(screen.getByText("Ana")).toBeInTheDocument();
    expect(screen.getByText("40 años")).toBeInTheDocument();
    expect(screen.getByText("Ana").closest("tr")).toHaveClass("selected");

    rerender(
      <Table<Row>
        columns={[{ header: "Nombre", key: "name" }]}
        rows={[]}
        empty={{ title: "Sin filas", body: "Probá cargar una" }}
      />,
    );
    expect(screen.getByText("Sin filas")).toBeInTheDocument();
  });

  it("row is keyboard-activable when clickable", async () => {
    const handler = vi.fn();
    render(
      <Table<Row> columns={[{ header: "Nombre", key: "name" }]} rows={rows} onRowClick={handler} />,
    );
    const row = screen.getByText("Ana").closest("tr");
    row?.focus();
    await userEvent.keyboard("{Enter}");
    expect(handler).toHaveBeenCalled();
    handler.mockClear();
    await userEvent.keyboard(" ");
    expect(handler).toHaveBeenCalled();
  });
});

describe("<Tabs />", () => {
  it("marks the active tab and fires onChange", async () => {
    const handler = vi.fn();
    render(
      <Tabs
        value="a"
        onChange={handler}
        tabs={[
          { key: "a", label: "A" },
          { key: "b", label: "B", count: 5, icon: "bell" },
        ]}
        variant="underline"
        ariaLabel="secs"
      />,
    );
    expect(screen.getByRole("tablist", { name: "secs" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "A" })).toHaveAttribute("aria-selected", "true");
    await userEvent.click(screen.getByRole("tab", { name: /B/ }));
    expect(handler).toHaveBeenCalledWith("b");
  });
});

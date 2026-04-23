import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Drawer, Modal } from "./dialog";

describe("<Modal />", () => {
  it("closes on Escape via useFocusTrap", async () => {
    const onClose = vi.fn();
    render(
      <Modal title="Demo" onClose={onClose}>
        <button type="button">inside</button>
      </Modal>,
    );
    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("focuses the first focusable on mount", async () => {
    render(
      <Modal title="Demo" onClose={() => {}}>
        <input aria-label="first" />
        <input aria-label="second" />
      </Modal>,
    );
    // The close button (IconButton) renders before body content, so it's first.
    // Either the close button or the 'first' input must have focus.
    const close = screen.getByRole("button", { name: /cerrar/i });
    const first = screen.getByLabelText("first");
    expect([close, first]).toContain(document.activeElement);
  });
});

describe("<Drawer />", () => {
  it("renders title, subtitle and footer", () => {
    render(
      <Drawer title="Titulo" subtitle="Subtítulo" onClose={() => {}} foot={<span>foot</span>}>
        body
      </Drawer>,
    );
    expect(screen.getByText("Titulo")).toBeInTheDocument();
    expect(screen.getByText("Subtítulo")).toBeInTheDocument();
    expect(screen.getByText("foot")).toBeInTheDocument();
  });
});

import { expect, test } from "@playwright/test";

test.describe("critical flow: login → licitaciones → drawer → cotizar", () => {
  test("navigates from login to inicio and opens the cotización drawer", async ({ page }) => {
    // 1. Login (mock flow — the button redirects to /inicio without real auth in Phase 2).
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: "Ingresar", level: 2 })).toBeVisible();
    await page.getByRole("button", { name: "Ingresar" }).click();

    // 2. Dashboard loads with KPIs + "Licitaciones esperando respuesta".
    await expect(page).toHaveURL(/\/inicio$/);
    await expect(page.getByRole("heading", { name: "Inicio", level: 1 })).toBeVisible();

    // 3. Go to licitaciones.
    await page
      .getByRole("link", { name: /Licitaciones/ })
      .first()
      .click();
    await expect(page).toHaveURL(/\/licitaciones/);

    // 4. Table renders and clicking the first row opens the drawer (URL gets ?id=).
    const firstRow = page.locator("table.tbl tbody tr").first();
    await firstRow.click();
    await expect(page).toHaveURL(/\?id=LIC-/);
    const drawer = page.getByRole("dialog");
    await expect(drawer).toBeVisible();

    // 5. The footer shows "Enviar cotización $ ..." with the total.
    await expect(drawer.getByText(/Enviar cotización \$/)).toBeVisible();

    // 6. Escape closes the drawer (focus trap handles it).
    await page.keyboard.press("Escape");
    await expect(drawer).toBeHidden();
    await expect(page).not.toHaveURL(/\?id=/);
  });

  test("order detail shows all six tabs", async ({ page }) => {
    await page.goto("/ordenes");
    // Open the first row.
    await page.locator("table.tbl tbody tr").first().click();
    await expect(page).toHaveURL(/\/ordenes\/ORD-/);

    for (const tab of ["Detalle", "Actividad", "Novedades", "Reportes", "Facturas", "Visitas"]) {
      await expect(page.getByRole("tab", { name: new RegExp(tab) })).toBeVisible();
    }

    await page.getByRole("tab", { name: /Actividad/ }).click();
    await expect(page.getByText(/Orden creada/)).toBeVisible();

    await page.getByRole("tab", { name: /Reportes/ }).click();
    await expect(page.getByText(/Archivos cargados/)).toBeVisible();
  });
});

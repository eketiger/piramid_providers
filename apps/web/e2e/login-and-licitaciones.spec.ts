import { expect, test } from "@playwright/test";

// Mock the NestJS /auth/login so Playwright can run the web in isolation
// without spinning up the full API + MySQL stack. The important part of
// these specs is the UX flow, not the authentication crypto — supertest
// has that covered on the backend side.
test.beforeEach(async ({ page }) => {
  await page.route("**/auth/login", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        token: "test-jwt",
        expiresAt: new Date(Date.now() + 3600_000).toISOString(),
        user: {
          id: "u_test",
          email: "en@revelaciondata.com.ar",
          firstName: "Ezequiel",
          lastName: "Niefeld",
          role: "owner",
          providerId: "prv_test",
        },
      }),
    });
  });
});

test.describe("critical flow: login → licitaciones → drawer → cotizar", () => {
  test("navigates from login to inicio and opens the cotización drawer", async ({ page }) => {
    // 1. Login.
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: "Ingresar", level: 2 })).toBeVisible();
    // Two "Ingresar"-prefixed buttons exist ("Ingresar con Google" + the
    // email submit). Target the submit specifically by exact match.
    await page.getByRole("button", { name: "Ingresar", exact: true }).click();

    // 2. Dashboard loads.
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

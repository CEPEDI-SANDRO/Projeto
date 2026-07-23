import { expect, test } from "@playwright/test";

test.describe("Responsividade mobile", () => {
  test("abre a sidebar pelo botão do menu", async ({ page }) => {
    await page.goto("/");

    await page
      .getByRole("button", {
        name: "Abrir menu",
        exact: true,
      })
      .click();

    await expect(
      page.getByRole("link", {
        name: "Dashboard",
        exact: true,
      }),
    ).toBeVisible();

    await expect(
      page.getByRole("link", {
        name: "Funcionários",
        exact: true,
      }),
    ).toBeVisible();
  });

  test("navega pela sidebar mobile", async ({ page }) => {
    await page.goto("/");

    await page
      .getByRole("button", {
        name: "Abrir menu",
        exact: true,
      })
      .click();

    await page
      .getByRole("link", {
        name: "Registros",
        exact: true,
      })
      .click();

    await expect(page).toHaveURL("/registros");

    await expect(
      page.getByRole("heading", {
        name: "Registros de ponto",
        exact: true,
      }),
    ).toBeVisible();
  });

  test("fecha a sidebar mobile", async ({ page }) => {
    await page.goto("/");

    await page
      .getByRole("button", {
        name: "Abrir menu",
        exact: true,
      })
      .click();

    await page
      .getByRole("button", {
        name: "Fechar menu",
        exact: true,
      })
      .last()
      .click();

    await expect(
      page.getByRole("link", {
        name: "Dashboard",
        exact: true,
      }),
    ).not.toBeVisible();
  });

  test("não apresenta rolagem horizontal no dashboard", async ({ page }) => {
    await page.goto("/");

    const dimensoes = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));

    expect(dimensoes.scrollWidth).toBeLessThanOrEqual(
      dimensoes.clientWidth + 1,
    );
  });
});
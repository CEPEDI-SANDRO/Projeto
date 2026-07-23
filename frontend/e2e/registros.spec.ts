import { expect, test } from "@playwright/test";

test.describe("Registros de ponto", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/registros");
  });

  test("abre a página de registros", async ({ page }) => {
    await expect(
      page.getByRole("heading", {
        name: "Registros de ponto",
        exact: true,
      }),
    ).toBeVisible();

    await expect(
      page.getByRole("heading", {
        name: "Marcações registradas",
        exact: true,
      }),
    ).toBeVisible();
  });

  test("filtra registros pela busca", async ({ page }) => {
    const busca = page.getByPlaceholder("Buscar no sistema...");

    await busca.fill("Ana");

    await expect(page.getByText("Ana Paula Souza").first()).toBeVisible();
  });

  test("abre o formulário de novo registro", async ({ page }) => {
    await page
      .getByRole("button", {
        name: "Novo registro",
        exact: true,
      })
      .click();

    await expect(
      page.getByRole("heading", {
        name: "Novo registro de ponto",
        exact: true,
      }),
    ).toBeVisible();

    await expect(
      page.getByRole("button", {
        name: "Salvar registro",
        exact: true,
      }),
    ).toBeVisible();
  });

  test("cancela o cadastro de registro", async ({ page }) => {
    await page
      .getByRole("button", {
        name: "Novo registro",
        exact: true,
      })
      .click();

    await page
      .getByRole("button", {
        name: "Cancelar",
        exact: true,
      })
      .click();

    await expect(
      page.getByRole("heading", {
        name: "Novo registro de ponto",
        exact: true,
      }),
    ).toHaveCount(0);
  });
});
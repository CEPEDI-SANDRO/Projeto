import { expect, test } from "@playwright/test";

test.describe("Funcionários", () => {
  test("abre a listagem", async ({ page }) => {
    await page.goto("/funcionarios");

    await expect(
  page.getByRole("heading", {
    name: "Funcionários",
    exact: true,
  }),
).toBeVisible();

    await expect(
  page.getByRole("heading", {
    name: "Lista de funcionários",
    exact: true,
  }),
).toBeVisible();
  });

  test("filtra funcionário pela busca local", async ({
    page,
  }) => {
    await page.goto("/funcionarios");

    const input = page.getByPlaceholder(
      "Buscar por nome, cargo ou matrícula...",
    );

    await input.fill("Ana");

    await expect(
      page.getByText(/Ana/i).first(),
    ).toBeVisible();
  });

  test("abre a tela de novo funcionário", async ({
    page,
  }) => {
    await page.goto("/funcionarios");

    await page
      .getByRole("link", {
        name: "Novo funcionário",
      })
      .first()
      .click();

    await expect(page).toHaveURL(
      "/funcionarios/novo",
    );

    await expect(
      page.getByRole("heading", {
        name: "Novo funcionário",
      }),
    ).toBeVisible();
  });

  test("valida campos obrigatórios do cadastro", async ({
    page,
  }) => {
    await page.goto("/funcionarios/novo");

    await page
      .getByRole("button", {
        name: "Salvar funcionário",
      })
      .click();

    const nome = page.getByPlaceholder(
      "Ex.: Ana Paula Souza",
    );

    await expect(nome).toBeFocused();
  });
});
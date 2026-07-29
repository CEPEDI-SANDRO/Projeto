import { expect, test } from "@playwright/test";

test.describe("Exportação", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/exportar");
  });

  test("abre a página de exportação", async ({ page }) => {
    await expect(
      page.getByRole("heading", {
        name: "Exportar relatórios",
        exact: true,
      }),
    ).toBeVisible();

    await expect(page.getByText("Configurações da exportação")).toBeVisible();
    await expect(page.getByText("Resumo da exportação")).toBeVisible();
  });

  test("alterna para relatório individual", async ({ page }) => {
    await page
      .getByRole("button", {
        name: /Relatório individual/i,
      })
      .click();

    await expect(page.getByLabel("Funcionário")).toBeVisible();

    await expect(
      page.getByRole("button", {
        name: "Exportar relatório",
        exact: true,
      }),
    ).toBeDisabled();
  });

  test("exporta relatório individual em Excel", async ({ page }) => {
    await page
      .getByRole("button", {
        name: /Relatório individual/i,
      })
      .click();

    await page.getByLabel("Funcionário").selectOption({
      index: 1,
    });

    await page
      .getByRole("button", {
        name: "Exportar relatório",
        exact: true,
      })
      .click();

    await expect(
      page.getByText("Exportação concluída"),
    ).toBeVisible();
  });

  test("exporta relatório geral em Excel", async ({ page }) => {
    await page
      .getByRole("button", {
        name: "Exportar relatório",
        exact: true,
      })
      .click();

    await expect(
      page.getByText("Exportação concluída"),
    ).toBeVisible();
  });
});
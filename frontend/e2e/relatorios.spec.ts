import { expect, test } from "@playwright/test";

test.describe("Relatório geral", () => {
  test("gera e exibe o relatório geral", async ({ page }) => {
    await page.goto("/relatorios/geral");

    await expect(
      page.getByRole("heading", {
        name: "Relatório geral",
        exact: true,
      }),
    ).toBeVisible();

    await page
      .getByRole("button", {
        name: "Gerar relatório",
        exact: true,
      })
      .click();

    await expect(
      page.getByRole("heading", {
        name: "Horas por funcionário",
        exact: true,
      }),
    ).toBeVisible();

    await expect(
      page.getByRole("heading", {
        name: "Distribuição de ocorrências",
        exact: true,
      }),
    ).toBeVisible();

    await expect(
      page.getByRole("heading", {
        name: "Resumo geral por funcionário",
        exact: true,
      }),
    ).toBeVisible();
  });

  test("renderiza os gráficos do relatório geral", async ({ page }) => {
    await page.goto("/relatorios/geral");

    await page
      .getByRole("button", {
        name: "Gerar relatório",
        exact: true,
      })
      .click();

    await expect(
      page.locator(".recharts-responsive-container").first(),
    ).toBeVisible();

    await expect(
      page.locator(".recharts-responsive-container").nth(1),
    ).toBeVisible();
  });
});

test.describe("Relatório individual", () => {
  test("gera relatório para um funcionário", async ({ page }) => {
    await page.goto("/relatorios/individual");

    await expect(
      page.getByRole("heading", {
        name: "Relatório individual",
        exact: true,
      }),
    ).toBeVisible();

    const funcionario = page.getByLabel("Funcionário");

    await funcionario.selectOption({
      index: 1,
    });

    await page
      .getByRole("button", {
        name: "Gerar relatório individual",
        exact: true,
      })
      .click();

    await expect(
      page.getByRole("heading", {
        name: "Histórico de registros",
        exact: true,
      }),
    ).toBeVisible();

    await expect(page.getByText("Horas trabalhadas").first()).toBeVisible();
    await expect(page.getByText("Horas extras").first()).toBeVisible();
  });

  test("mantém o botão desabilitado sem funcionário", async ({ page }) => {
    await page.goto("/relatorios/individual");

    await expect(
      page.getByRole("button", {
        name: "Gerar relatório individual",
        exact: true,
      }),
    ).toBeDisabled();
  });
});
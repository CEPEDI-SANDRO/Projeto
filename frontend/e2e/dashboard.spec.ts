import { expect, test } from "@playwright/test";

test.describe("Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("exibe os indicadores principais", async ({ page }) => {
    await expect(
      page.getByRole("heading", {
        name: "Dashboard",
        exact: true,
      }),
    ).toBeVisible();

    await expect(page.getByText("Funcionários cadastrados")).toBeVisible();
    await expect(page.getByText("Registros no dia")).toBeVisible();
    await expect(page.getByText("Faltas registradas")).toBeVisible();
    await expect(page.getByText("Total computado hoje")).toBeVisible();
  });

  test("exibe status e pendências", async ({ page }) => {
    await expect(
      page.getByRole("heading", {
        name: "Status de hoje",
        exact: true,
      }),
    ).toBeVisible();

    await expect(
      page.getByRole("heading", {
        name: "Pendências recentes",
        exact: true,
      }),
    ).toBeVisible();

    await expect(page.getByText("Ana Paula Souza")).toBeVisible();
    await expect(page.getByText("Registro #4")).toBeVisible();
  });

  test("renderiza o gráfico semanal", async ({ page }) => {
    await expect(
      page.getByRole("heading", {
        name: "Horas trabalhadas na semana",
        exact: true,
      }),
    ).toBeVisible();

    const grafico = page.locator(".recharts-responsive-container");

    await expect(grafico).toBeVisible();
    await expect(grafico.locator("svg")).toBeVisible();
  });

  test("exibe o resumo operacional", async ({ page }) => {
    await expect(
      page.getByRole("heading", {
        name: "Resumo operacional",
        exact: true,
      }),
    ).toBeVisible();

    await expect(page.getByText("Horas extras")).toBeVisible();
    await expect(page.getByText("Atrasos registrados")).toBeVisible();
    await expect(page.getByText("Registros pendentes")).toBeVisible();
  });
});
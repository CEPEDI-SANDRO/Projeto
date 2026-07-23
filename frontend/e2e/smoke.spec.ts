import { expect, test } from "@playwright/test";

const routes = [
  "/",
  "/funcionarios",
  "/funcionarios/novo",
  "/funcionarios/1",
  "/funcionarios/1/jornada",
  "/registros",
  "/relatorios/geral",
  "/relatorios/individual",
  "/exportar",
  "/configuracoes",
  "/login",
];

for (const route of routes) {
  test(`a rota ${route} carrega sem quebrar`, async ({
    page,
  }) => {
    await page.goto(route);

    await expect(page.locator("body")).toBeVisible();

    await expect(
      page.getByText(
        /Application error|Internal Server Error/i,
      ),
    ).toHaveCount(0);
  });
}
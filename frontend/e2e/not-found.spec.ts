import { expect, test } from "@playwright/test";

test("exibe a página 404 personalizada", async ({
  page,
}) => {
  await page.goto("/pagina-inexistente");

  await expect(
    page.getByRole("heading", {
      name: "Página não encontrada",
    }),
  ).toBeVisible();

  await expect(
    page.getByRole("link", {
      name: "Ir para o Dashboard",
    }),
  ).toBeVisible();
});
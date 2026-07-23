import { expect, test } from "@playwright/test";

test("usa a busca global da header", async ({ page }) => {
  await page.goto("/");

  const busca = page.getByPlaceholder(
    "Buscar no sistema...",
  );

  await busca.fill("relatório");

  await expect(
    page.getByText("Busca global"),
  ).toBeVisible();

  await page
    .getByRole("button", {
      name: /Relatório geral/i,
    })
    .click();

  await expect(page).toHaveURL(
    "/relatorios/geral",
  );
});

test("abre notificações", async ({ page }) => {
  await page.goto("/");

  await page
    .getByRole("button", {
      name: "Abrir notificações",
    })
    .click();

  await expect(
    page.getByText("Notificações"),
  ).toBeVisible();
});

test("abre menu de perfil", async ({ page }) => {
  await page.goto("/");

  const header = page.getByRole("banner");

  await header
    .getByRole("button", {
      name: "Abrir menu do perfil",
    })
    .click();

  await expect(
    header.getByRole("button", {
      name: "Configurações",
      exact: true,
    }),
  ).toBeVisible();

  await expect(
    header.getByRole("button", {
      name: "Sair",
      exact: true,
    }),
  ).toBeVisible();
});
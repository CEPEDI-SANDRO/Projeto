import { expect, test } from "@playwright/test";

test("realiza o login simulado", async ({ page }) => {
  await page.goto("/login");

  await expect(
    page.getByRole("heading", {
      name: "Acesse sua conta",
    }),
  ).toBeVisible();

  await page
    .getByPlaceholder("Digite seu usuário")
    .fill("admin");

  await page
    .getByPlaceholder("Digite sua senha")
    .fill("123456");

  await page
    .getByRole("button", { name: "Entrar" })
    .click();

  await expect(page).toHaveURL("/");

  await expect(
    page.getByRole("heading", {
      name: "Dashboard",
    }),
  ).toBeVisible();
});

test("impede login com campos vazios", async ({
  page,
}) => {
  await page.goto("/login");

  await page
    .getByRole("button", { name: "Entrar" })
    .click();

  await expect(
    page.getByText("Preencha os campos"),
  ).toBeVisible();
});
import { expect, test } from "@playwright/test";

test("altera o tema para escuro", async ({ page }) => {
  await page.goto("/configuracoes");

  await page
    .getByRole("button", {
      name: /Escuro/i,
    })
    .click();

  await expect(page.locator("html")).toHaveClass(
    /dark/,
  );

  await page.reload();

  await expect(page.locator("html")).toHaveClass(
    /dark/,
  );
});
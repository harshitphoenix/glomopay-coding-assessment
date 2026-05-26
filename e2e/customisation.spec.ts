import { test, expect } from "@playwright/test";

test.describe("customisation page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(page.getByLabel("Button text")).toBeVisible({ timeout: 3000 });
  });

  test("loads with API defaults and both buttons disabled", async ({ page }) => {
    await expect(page.getByLabel("Button text")).toHaveValue("Pay now");
    await expect(page.getByLabel("Background colour")).toHaveValue("#0F172A");
    await expect(page.getByRole("button", { name: "Save" })).toBeDisabled();
    await expect(page.getByRole("button", { name: "Reset" })).toBeDisabled();
  });

  test("shows validation error and disables Save on invalid input", async ({ page }) => {
    await page.getByLabel("Button text").clear();

    await expect(page.getByText("Button text is required")).toBeVisible();
    await expect(page.getByRole("button", { name: "Save" })).toBeDisabled();
    await expect(page.getByRole("button", { name: "Reset" })).toBeEnabled();
  });

  test("enables Save once all fields are valid and dirty", async ({ page }) => {
    await page.getByLabel("Button text").clear();
    await page.getByLabel("Button text").fill("Buy now");

    await expect(page.getByRole("button", { name: "Save" })).toBeEnabled();
  });

  test("happy path: edit → save → Saved toast → buttons disabled", async ({ page }) => {
    await page.getByLabel("Button text").clear();
    await page.getByLabel("Button text").fill("Buy now");
    await expect(page.getByRole("button", { name: "Save" })).toBeEnabled();

    await page.getByRole("button", { name: "Save" }).click();

    // saving state — spinner + "Saving..." briefly visible
    await expect(page.getByRole("button", { name: /saving/i })).toBeDisabled();

    // success state
    await expect(page.getByText("Saved")).toBeVisible({ timeout: 3000 });
    await expect(page.getByRole("button", { name: "Save" })).toBeDisabled();
    await expect(page.getByRole("button", { name: "Reset" })).toBeDisabled();
  });

  test("Reset restores form to last saved values", async ({ page }) => {
    await page.getByLabel("Button text").clear();
    await page.getByLabel("Button text").fill("Temporary text");
    await expect(page.getByRole("button", { name: "Reset" })).toBeEnabled();

    await page.getByRole("button", { name: "Reset" }).click();

    await expect(page.getByLabel("Button text")).toHaveValue("Pay now");
    await expect(page.getByRole("button", { name: "Reset" })).toBeDisabled();
  });

  test("preview reflects draft changes in real time", async ({ page }) => {
    await page.getByLabel("Button text").clear();
    await page.getByLabel("Button text").fill("Checkout");

    // The preview button is aria-hidden but still in DOM — check by its container
    const preview = page.locator('[data-testid="checkout-preview"]');
    await expect(preview.getByText("Checkout")).toBeVisible();
  });
});

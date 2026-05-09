import { test, expect } from '@playwright/test';

test('search bar is visible on homepage', async ({ page }) => {
  await page.goto('/');
  const searchInput = page.locator('[data-search-input]');
  await expect(searchInput).toBeVisible();
});

test('search bar is visible on blog post page', async ({ page }) => {
  await page.goto('/blog/trying-gemini-free-tier-on-avante-nvim/');
  const searchInput = page.locator('[data-search-input]');
  await expect(searchInput).toBeVisible();
});

test('typing a query shows results dropdown', async ({ page }) => {
  await page.goto('/');
  const searchInput = page.locator('[data-search-input]');
  await searchInput.fill('vim');

  const resultsDropdown = page.locator('[data-search-results]');
  await expect(resultsDropdown).toBeVisible();
  await expect(resultsDropdown).toContainText('Trying Gemini free tier on Avante.nvim');
});

test('clicking a result navigates to the correct post', async ({ page }) => {
  await page.goto('/');
  const searchInput = page.locator('[data-search-input]');
  await searchInput.fill('gemini');

  const resultsDropdown = page.locator('[data-search-results]');
  await expect(resultsDropdown).toBeVisible();

  const resultLink = page.locator('[data-search-result]').first();
  await resultLink.click();

  await expect(page).toHaveURL(/\/blog\/trying-gemini-free-tier-on-avante-nvim\//);
});

test('escape closes the dropdown', async ({ page }) => {
  await page.goto('/');
  const searchInput = page.locator('[data-search-input]');
  await searchInput.fill('vim');

  const resultsDropdown = page.locator('[data-search-results]');
  await expect(resultsDropdown).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(resultsDropdown).toBeHidden();
});

test('keyboard shortcut focuses search input', async ({ page }) => {
  await page.goto('/');
  const searchInput = page.locator('[data-search-input]');

  await page.keyboard.press('Control+k');
  await expect(searchInput).toBeFocused();
});

import { test, expect } from '@playwright/test';

test('homepage has title and navigation', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle("Ken's Blog");
  await expect(page.locator('h1')).toContainText("Ken's Blog");
});

test('about page loads correctly', async ({ page }) => {
  await page.goto('/about');
  await expect(page).toHaveTitle(/About/);
  await expect(page.locator('h1')).toContainText('About');
});

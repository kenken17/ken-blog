import { test, expect } from '@playwright/test';

test('homepage has title and hero', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle("Ken's Blog");
  await expect(page.locator('h1')).toContainText("KEN'S");
});

test('homepage shows recent posts', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h2')).toContainText('RECENT POSTS');
});

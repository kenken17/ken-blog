import { test, expect } from '@playwright/test';

const NEWEST_TO_OLDEST = [
  'A taste of Hermes',
  'My AI era...',
  'Trying Gemini free tier on Avante.nvim',
];

const OLDEST_TO_NEWEST = [...NEWEST_TO_OLDEST].reverse();

test.describe('story 1: blog listing order toggle', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.removeItem('blog:sort-order');
    });
  });

  test('toggle is visible and blog posts are newest-first by default', async ({ page }) => {
    await page.goto('/blog');

    const toggle = page.locator('button[data-order-toggle-button]');
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');

    const titles = await page
      .locator('[data-sort-list="blog-posts"] [data-sort-item] h2')
      .allTextContents();

    expect(titles.map((title) => title.trim())).toEqual(NEWEST_TO_OLDEST);
  });

  test('clicking toggle switches blog posts to oldest-first and updates UI state', async ({ page }) => {
    await page.goto('/blog');

    const toggle = page.locator('button[data-order-toggle-button]');
    await toggle.click();

    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');

    const titles = await page
      .locator('[data-sort-list="blog-posts"] [data-sort-item] h2')
      .allTextContents();

    expect(titles.map((title) => title.trim())).toEqual(OLDEST_TO_NEWEST);
  });
});

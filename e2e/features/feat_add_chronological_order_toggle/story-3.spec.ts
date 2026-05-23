import { test, expect } from '@playwright/test';

test.describe('story 3: sort preference persistence', () => {
  test('selected sort order persists across reloads on blog listing page', async ({ page }) => {
    await page.goto('/blog');
    await page.evaluate(() => {
      localStorage.removeItem('blog:sort-order');
    });
    await page.reload();

    const toggle = page.locator('button[data-order-toggle-button]');
    await toggle.click();

    await expect(toggle).toHaveAttribute('aria-pressed', 'true');

    await page.reload();

    await expect(toggle).toHaveAttribute('aria-pressed', 'true');

    const firstTitle = page.locator('[data-sort-list="blog-posts"] [data-sort-item] h2').first();
    await expect(firstTitle).toHaveText('Trying Gemini free tier on Avante.nvim');
  });

  test('saved preference is shared between blog and tag pages', async ({ page }) => {
    await page.goto('/blog');
    await page.evaluate(() => {
      localStorage.removeItem('blog:sort-order');
    });
    await page.reload();

    const toggle = page.locator('button[data-order-toggle-button]');
    await toggle.click();

    await page.goto('/tags/ai');

    const tagToggle = page.locator('button[data-order-toggle-button]');
    await expect(tagToggle).toHaveAttribute('aria-pressed', 'true');

    const firstTitle = page.locator('[data-sort-list="tag-posts"] [data-sort-item] h2').first();
    await expect(firstTitle).toHaveText('Trying Gemini free tier on Avante.nvim');
  });
});

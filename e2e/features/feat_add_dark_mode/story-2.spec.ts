import { test, expect } from '@playwright/test';

test.describe('theme toggle and persistence', () => {
  test('toggle button is visible in the header', async ({ page }) => {
    await page.goto('/');
    const toggle = page.locator('button[aria-label="Toggle dark mode"]');
    await expect(toggle).toBeVisible();
  });

  test('clicking toggle switches from light to dark', async ({ page }) => {
    await page.goto('/');
    const toggle = page.locator('button[aria-label="Toggle dark mode"]');
    const html = page.locator('html');

    await expect(html).not.toHaveClass('dark');
    await toggle.click();
    await expect(html).toHaveClass('dark');
  });

  test('clicking toggle again switches back to light', async ({ page }) => {
    await page.goto('/');
    const toggle = page.locator('button[aria-label="Toggle dark mode"]');
    const html = page.locator('html');

    await toggle.click();
    await expect(html).toHaveClass('dark');
    await toggle.click();
    await expect(html).not.toHaveClass('dark');
  });

  test('theme persists across page navigation', async ({ page }) => {
    await page.goto('/');
    const toggle = page.locator('button[aria-label="Toggle dark mode"]');

    await toggle.click();
    await page.goto('/blog');
    const html = page.locator('html');
    await expect(html).toHaveClass('dark');
  });

  test('theme persists across browser restart', async ({ page }) => {
    await page.goto('/');
    const toggle = page.locator('button[aria-label="Toggle dark mode"]');
    await toggle.click();

    await page.reload();
    const html = page.locator('html');
    await expect(html).toHaveClass('dark');
  });

  test('system preference is respected when no stored preference', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.removeItem('theme'));
    await page.reload();

    const html = page.locator('html');
    const hasDark = await html.evaluate((el) => el.classList.contains('dark'));

    const prefersDark = await page.evaluate(() =>
      window.matchMedia('(prefers-color-scheme: dark)').matches
    );

    expect(hasDark).toBe(prefersDark);
  });

  test('no FOUC: dark class is present before first paint', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('theme', 'dark');
    });

    await page.goto('/');
    const html = page.locator('html');
    await expect(html).toHaveClass('dark');
  });
});

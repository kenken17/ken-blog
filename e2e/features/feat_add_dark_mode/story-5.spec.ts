import { test, expect } from '@playwright/test';

test.describe('full dark mode flow', () => {
  test('fresh visit with system light renders in light mode', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.removeItem('theme');
    });
    await page.goto('/');
    const html = page.locator('html');
    await expect(html).not.toHaveClass('dark');
  });

  test('fresh visit with system dark renders in dark mode without FOUC', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.removeItem('theme');
    });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    const html = page.locator('html');
    await expect(html).toHaveClass('dark');
  });

  test('toggle to dark persists and applies', async ({ page }) => {
    await page.goto('/');
    const toggle = page.locator('button[aria-label="Toggle dark mode"]');
    const html = page.locator('html');

    await toggle.click();
    await expect(html).toHaveClass('dark');

    const stored = await page.evaluate(() => localStorage.getItem('theme'));
    expect(stored).toBe('dark');
  });

  test('navigate to another page and dark mode persists', async ({ page }) => {
    await page.goto('/');
    const toggle = page.locator('button[aria-label="Toggle dark mode"]');
    await toggle.click();

    await page.goto('/blog');
    const html = page.locator('html');
    await expect(html).toHaveClass('dark');
  });

  test('toggle back to light persists and applies', async ({ page }) => {
    await page.goto('/');
    const toggle = page.locator('button[aria-label="Toggle dark mode"]');
    const html = page.locator('html');

    await toggle.click();
    await expect(html).toHaveClass('dark');

    await toggle.click();
    await expect(html).not.toHaveClass('dark');

    const stored = await page.evaluate(() => localStorage.getItem('theme'));
    expect(stored).toBe('light');
  });

  test('clear localStorage and set system to dark activates dark mode', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.removeItem('theme');
    });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');

    const html = page.locator('html');
    await expect(html).toHaveClass('dark');
  });

  test('all pages render correctly in both themes', async ({ page }) => {
    const pages = ['/', '/blog', '/tags'];
    for (const url of pages) {
      await page.goto(url);
      const toggle = page.locator('button[aria-label="Toggle dark mode"]');
      const html = page.locator('html');

      await expect(html).not.toHaveClass('dark');
      await toggle.click();
      await expect(html).toHaveClass('dark');
      await toggle.click();
      await expect(html).not.toHaveClass('dark');
    }
  });

  test('toggle is keyboard accessible', async ({ page }) => {
    await page.goto('/');
    const toggle = page.locator('button[aria-label="Toggle dark mode"]');
    const html = page.locator('html');

    await toggle.focus();
    await toggle.press('Enter');
    await expect(html).toHaveClass('dark');

    await toggle.press('Space');
    await expect(html).not.toHaveClass('dark');
  });
});

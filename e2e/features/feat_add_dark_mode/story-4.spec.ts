import { test, expect } from '@playwright/test';

test.describe('dynamic theme integration', () => {
  test('theme-color meta tag updates when toggling between light and dark', async ({ page }) => {
    await page.goto('/');
    const toggle = page.locator('button[aria-label="Toggle dark mode"]');

    const metaLight = await page.locator('meta[name="theme-color"]').getAttribute('content');
    expect(metaLight).toBe('#FAFAFA');

    await toggle.click();
    const metaDark = await page.locator('meta[name="theme-color"]').getAttribute('content');
    expect(metaDark).toBe('#09090B');

    await toggle.click();
    const metaBack = await page.locator('meta[name="theme-color"]').getAttribute('content');
    expect(metaBack).toBe('#FAFAFA');
  });

  test('theme-color meta tag is correct on initial load with dark preference', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('theme', 'dark');
    });

    await page.goto('/');
    const meta = await page.locator('meta[name="theme-color"]').getAttribute('content');
    expect(meta).toBe('#09090B');
  });

  test('apple-mobile-web-app-status-bar-style updates with theme', async ({ page }) => {
    await page.goto('/');
    const toggle = page.locator('button[aria-label="Toggle dark mode"]');

    const lightStyle = await page.locator('meta[name="apple-mobile-web-app-status-bar-style"]').getAttribute('content');
    expect(lightStyle).toBe('default');

    await toggle.click();
    const darkStyle = await page.locator('meta[name="apple-mobile-web-app-status-bar-style"]').getAttribute('content');
    expect(darkStyle).toBe('black-translucent');
  });

  test('offline page renders in dark mode when dark preference is stored', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('theme', 'dark');
    });

    await page.goto('/offline.html');
    const html = page.locator('html');
    await expect(html).toHaveClass('dark');

    const body = page.locator('body');
    const bg = await body.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    expect(bg).toBe('rgb(9, 9, 11)');
  });
});

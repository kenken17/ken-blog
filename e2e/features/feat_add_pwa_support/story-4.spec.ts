import { test, expect } from '@playwright/test';

test('homepage has all PWA meta tags', async ({ page }) => {
  await page.goto('/');

  const capableMeta = page.locator('meta[name="apple-mobile-web-app-capable"]');
  await expect(capableMeta).toHaveAttribute('content', 'yes');

  const statusBarMeta = page.locator('meta[name="apple-mobile-web-app-status-bar-style"]');
  await expect(statusBarMeta).toHaveAttribute('content', 'default');

  const titleMeta = page.locator('meta[name="apple-mobile-web-app-title"]');
  await expect(titleMeta).toHaveAttribute('content', "Ken's Blog");

  const themeColorMeta = page.locator('meta[name="theme-color"]');
  await expect(themeColorMeta).toHaveAttribute('content', '#FAFAFA');
});

test('manifest theme_color matches meta theme-color', async ({ page, request }) => {
  await page.goto('/');
  const themeColorMeta = page.locator('meta[name="theme-color"]');
  const metaThemeColor = await themeColorMeta.getAttribute('content');

  const manifestResponse = await request.get('/manifest.json');
  const manifest = await manifestResponse.json();

  expect(manifest.theme_color).toBe(metaThemeColor);
  expect(manifest.background_color).toBe('#FAFAFA');
});

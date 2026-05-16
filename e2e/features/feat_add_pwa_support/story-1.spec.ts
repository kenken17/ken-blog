import { test, expect } from '@playwright/test';

test('homepage has manifest link in head', async ({ page }) => {
  await page.goto('/');
  const manifestLink = page.locator('link[rel="manifest"]');
  await expect(manifestLink).toHaveAttribute('href', '/manifest.json');
});

test('manifest.json is accessible and valid JSON', async ({ request }) => {
  const response = await request.get('/manifest.json');
  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.name).toBe("Ken's Blog");
  expect(body.short_name).toBe("Ken's Blog");
  expect(body.start_url).toBe('/');
  expect(body.display).toBe('standalone');
  expect(body.theme_color).toBe('#FAFAFA');
  expect(body.background_color).toBe('#FAFAFA');
  expect(Array.isArray(body.icons)).toBe(true);
});

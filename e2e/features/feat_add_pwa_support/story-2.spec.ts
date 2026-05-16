import { test, expect } from '@playwright/test';

test('homepage has Apple touch icon link', async ({ page }) => {
  await page.goto('/');
  const appleTouchIcon = page.locator('link[rel="apple-touch-icon"]');
  await expect(appleTouchIcon).toHaveAttribute('href', '/icons/apple-touch-icon.png');
});

test('icon files are accessible', async ({ request }) => {
  const icon192 = await request.get('/icons/icon-192x192.png');
  expect(icon192.status()).toBe(200);
  expect(icon192.headers()['content-type']).toContain('image/png');

  const icon512 = await request.get('/icons/icon-512x512.png');
  expect(icon512.status()).toBe(200);

  const maskable = await request.get('/icons/maskable-icon-512x512.png');
  expect(maskable.status()).toBe(200);

  const appleTouch = await request.get('/icons/apple-touch-icon.png');
  expect(appleTouch.status()).toBe(200);
});

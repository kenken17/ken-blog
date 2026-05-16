import { test, expect } from '@playwright/test';

test('service worker registration script is present', async ({ page }) => {
  await page.goto('/');
  const html = await page.content();
  expect(html).toContain('"serviceWorker"in navigator');
  expect(html).toContain('navigator.serviceWorker.register("/sw.js")');
});

test('sw.js is accessible and valid JavaScript', async ({ request }) => {
  const response = await request.get('/sw.js');
  expect(response.status()).toBe(200);
  const contentType = response.headers()['content-type'];
  expect(contentType === 'application/javascript' || contentType === 'text/javascript' || contentType === 'application/x-javascript').toBe(true);

  const body = await response.text();
  expect(body).toContain("const CACHE_VERSION = 'ken-blog-v1'");
  expect(body).toContain("self.addEventListener('install'");
  expect(body).toContain("self.addEventListener('activate'");
  expect(body).toContain("self.addEventListener('fetch'");
});

test('offline.html is accessible', async ({ request }) => {
  const response = await request.get('/offline.html');
  expect(response.status()).toBe(200);

  const body = await response.text();
  expect(body).toContain("You're Offline");
  expect(body).toContain('location.reload()');
});

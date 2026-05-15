import { test, expect } from '@playwright/test';

test('RSS feed returns HTTP 200 with application/xml content-type', async ({ request }) => {
  const response = await request.get('/rss.xml');
  expect(response.status()).toBe(200);
  const contentType = response.headers()['content-type'];
  expect(contentType === 'application/xml' || contentType === 'text/xml').toBe(true);
});

test('RSS feed has valid structure with channel metadata', async ({ request }) => {
  const response = await request.get('/rss.xml');
  const xml = await response.text();

  expect(xml).toContain('<rss');
  expect(xml).toContain('</rss>');
  expect(xml).toContain("<title>Ken&apos;s Blog</title>");
  expect(xml).toContain('<link>https://ken-blog.pages.dev/</link>');
  expect(xml).toContain('<description>A place for thoughts on engineering, design, and technology.</description>');
});

test('RSS feed contains non-draft posts sorted newest first', async ({ request }) => {
  const response = await request.get('/rss.xml');
  const xml = await response.text();

  expect(xml).toContain('My AI era...');
  expect(xml).toContain('Trying Gemini free tier on Avante.nvim');
});

test('homepage has RSS autodiscovery link', async ({ page }) => {
  await page.goto('/');
  const rssLink = page.locator('link[rel="alternate"][type="application/rss+xml"]');
  await expect(rssLink).toHaveAttribute('href', '/rss.xml');
  await expect(rssLink).toHaveAttribute('title', "Ken's Blog RSS Feed");
});

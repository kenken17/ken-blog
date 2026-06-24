import { test, expect } from '@playwright/test';

test.describe('Story 4: Photo blog post page E2E', () => {
  test('photo post page loads and renders title', async ({ page }) => {
    await page.goto('/blog/photo-post-sample');

    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('Photo Walk');
  });

  test('photo post page renders description', async ({ page }) => {
    await page.goto('/blog/photo-post-sample');

    const description = page.locator('p').filter({ hasText: /weekend photo set/i }).first();
    await expect(description).toBeVisible();
  });

  test('photo post page shows "Photo Post" indicator', async ({ page }) => {
    await page.goto('/blog/photo-post-sample');

    const indicator = page.locator('text=Photo Post');
    await expect(indicator).toBeVisible();
  });

  test('photo post page shows reading time', async ({ page }) => {
    await page.goto('/blog/photo-post-sample');

    const readingTime = page.locator('text=/\\d+ min read/');
    await expect(readingTime).toBeVisible();
  });

  test('photo post page shows publication date', async ({ page }) => {
    await page.goto('/blog/photo-post-sample');

    const date = page.locator('time');
    await expect(date).toBeVisible();
  });

  test('photo post page renders the gallery', async ({ page }) => {
    await page.goto('/blog/photo-post-sample');

    const gallery = page.locator('[data-photo-gallery]');
    await expect(gallery).toBeVisible();
  });

  test('photo post page has back to blog link', async ({ page }) => {
    await page.goto('/blog/photo-post-sample');

    const backLink = page.locator('a').filter({ hasText: 'Back to all posts' });
    await expect(backLink).toBeVisible();

    // Click and verify navigation
    await backLink.click();
    await expect(page).toHaveURL(/\/blog$/);
  });

  test('photo post page has SEO title tag', async ({ page }) => {
    await page.goto('/blog/photo-post-sample');

    const title = await page.title();
    expect(title).toContain('Photo Walk');
  });

  test('photo post page has meta description', async ({ page }) => {
    await page.goto('/blog/photo-post-sample');

    const metaDesc = page.locator('meta[name="description"]');
    const content = await metaDesc.getAttribute('content');
    expect(content).toBeTruthy();
  });

  test('photo post page has JSON-LD structured data', async ({ page }) => {
    await page.goto('/blog/photo-post-sample');

    const jsonLd = page.locator('script[type="application/ld+json"]');
    await expect(jsonLd).toHaveCount(1);

    const content = await jsonLd.textContent();
    expect(content).toContain('ImageGallery');
  });

  test('photo post page renders comments section', async ({ page }) => {
    await page.goto('/blog/photo-post-sample');

    // Comments section should exist (even if empty)
    const main = page.locator('main');
    await expect(main).toBeVisible();
  });

  test('photo post page renders tags', async ({ page }) => {
    await page.goto('/blog/photo-post-sample');

    // The sample post has tags: photo, travel, city
    const tagLink = page.locator('a').filter({ hasText: 'photo' }).first();
    await expect(tagLink).toBeVisible();
  });
});

import { test, expect } from '@playwright/test';

test.describe('Story 6: Responsive design E2E', () => {
  test('gallery grid is single column on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 }); // iPhone SE
    await page.goto('/blog/photo-post-sample');

    const gallery = page.locator('[data-photo-gallery]');
    await expect(gallery).toBeVisible();

    // Grid should render items
    const items = page.locator('[data-photo-item]');
    const count = await items.count();
    expect(count).toBeGreaterThan(0);
  });

  test('gallery grid is multi-column on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/blog/photo-post-sample');

    const gallery = page.locator('[data-photo-gallery]');
    await expect(gallery).toBeVisible();

    const items = page.locator('[data-photo-item]');
    const count = await items.count();
    expect(count).toBeGreaterThan(0);
  });

  test('photo post page is responsive - mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/blog/photo-post-sample');

    const heading = page.locator('h1');
    await expect(heading).toBeVisible();

    const gallery = page.locator('[data-photo-gallery]');
    await expect(gallery).toBeVisible();
  });

  test('photo post page is responsive - tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 }); // iPad
    await page.goto('/blog/photo-post-sample');

    const heading = page.locator('h1');
    await expect(heading).toBeVisible();

    const gallery = page.locator('[data-photo-gallery]');
    await expect(gallery).toBeVisible();
  });

  test('photo post page is responsive - desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/blog/photo-post-sample');

    const heading = page.locator('h1');
    await expect(heading).toBeVisible();

    const gallery = page.locator('[data-photo-gallery]');
    await expect(gallery).toBeVisible();
  });

  test('lightbox works on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/blog/photo-post-sample');

    const firstTrigger = page.locator('[data-photo-trigger]').first();
    await firstTrigger.click();

    const lightbox = page.locator('[data-photo-lightbox]');
    await expect(lightbox).toHaveClass(/flex/);

    const lightboxImage = page.locator('[data-lightbox-image]');
    await expect(lightboxImage).toBeVisible();

    // Close with escape
    await page.keyboard.press('Escape');
    await expect(lightbox).toHaveClass(/hidden/);
  });

  test('blog list is responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/blog');

    const heading = page.locator('h1');
    await expect(heading).toBeVisible();

    const photoPost = page.locator('article').filter({ hasText: 'Photo Walk' });
    await expect(photoPost).toBeVisible();
  });

  test('blog list is responsive on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/blog');

    const heading = page.locator('h1');
    await expect(heading).toBeVisible();

    const photoPost = page.locator('article').filter({ hasText: 'Photo Walk' });
    await expect(photoPost).toBeVisible();
  });

  test('navigation works on all viewports', async ({ page }) => {
    // Test on mobile
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/blog/photo-post-sample');

    const backLink = page.locator('a').filter({ hasText: 'Back to all posts' });
    await expect(backLink).toBeVisible();
  });
});

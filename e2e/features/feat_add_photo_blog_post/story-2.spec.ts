import { test, expect } from '@playwright/test';

test.describe('Story 2: Photo Gallery E2E', () => {
  test('photo post page renders gallery with images', async ({ page }) => {
    // Navigate to the sample photo post
    await page.goto('/blog/photo-post-sample');

    // Gallery section should exist
    const gallery = page.locator('[data-photo-gallery]');
    await expect(gallery).toBeVisible();

    // Should contain photo items
    const photoItems = page.locator('[data-photo-item]');
    const count = await photoItems.count();
    expect(count).toBeGreaterThan(0);
  });

  test('gallery images have alt text', async ({ page }) => {
    await page.goto('/blog/photo-post-sample');

    const images = page.locator('[data-photo-gallery] img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt).toBeTruthy();
    }
  });

  test('gallery images have lazy loading attribute', async ({ page }) => {
    await page.goto('/blog/photo-post-sample');

    const images = page.locator('[data-photo-gallery] img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const loading = await images.nth(i).getAttribute('loading');
      expect(loading).toBe('lazy');
    }
  });

  test('clicking an image opens lightbox', async ({ page }) => {
    await page.goto('/blog/photo-post-sample');

    const lightbox = page.locator('[data-photo-lightbox]');
    await expect(lightbox).toHaveClass(/hidden/);

    // Click first photo trigger
    const firstTrigger = page.locator('[data-photo-trigger]').first();
    await firstTrigger.click();

    // Lightbox should become visible
    await expect(lightbox).toBeVisible();
    await expect(lightbox).toHaveClass(/flex/);
  });

  test('lightbox displays correct image', async ({ page }) => {
    await page.goto('/blog/photo-post-sample');

    const firstTrigger = page.locator('[data-photo-trigger]').first();
    await firstTrigger.click();

    const lightboxImage = page.locator('[data-lightbox-image]');
    await expect(lightboxImage).toBeVisible();
    const src = await lightboxImage.getAttribute('src');
    expect(src).toBeTruthy();
  });

  test('lightbox shows counter', async ({ page }) => {
    await page.goto('/blog/photo-post-sample');

    const firstTrigger = page.locator('[data-photo-trigger]').first();
    await firstTrigger.click();

    const counter = page.locator('[data-lightbox-counter]');
    await expect(counter).toBeVisible();
    const text = await counter.textContent();
    expect(text).toMatch(/\d+ \/ \d+/);
  });

  test('lightbox can be closed with close button', async ({ page }) => {
    await page.goto('/blog/photo-post-sample');

    const firstTrigger = page.locator('[data-photo-trigger]').first();
    await firstTrigger.click();

    const lightbox = page.locator('[data-photo-lightbox]');
    await expect(lightbox).toHaveClass(/flex/);

    // Click close button
    const closeButton = page.locator('[data-lightbox-close]');
    await closeButton.click();

    // Lightbox should be hidden
    await expect(lightbox).toHaveClass(/hidden/);
  });

  test('lightbox can be closed with Escape key', async ({ page }) => {
    await page.goto('/blog/photo-post-sample');

    const firstTrigger = page.locator('[data-photo-trigger]').first();
    await firstTrigger.click();

    const lightbox = page.locator('[data-photo-lightbox]');
    await expect(lightbox).toHaveClass(/flex/);

    await page.keyboard.press('Escape');

    await expect(lightbox).toHaveClass(/hidden/);
  });

  test('lightbox navigation with prev/next buttons', async ({ page }) => {
    await page.goto('/blog/photo-post-sample');

    const firstTrigger = page.locator('[data-photo-trigger]').first();
    await firstTrigger.click();

    const counter = page.locator('[data-lightbox-counter]');
    const initialText = await counter.textContent();

    // Click next
    await page.locator('[data-lightbox-next]').click();
    const nextText = await counter.textContent();
    expect(nextText).not.toBe(initialText);

    // Click prev to go back
    await page.locator('[data-lightbox-prev]').click();
    const prevText = await counter.textContent();
    expect(prevText).toBe(initialText);
  });

  test('lightbox closes when clicking overlay background', async ({ page }) => {
    await page.goto('/blog/photo-post-sample');

    const firstTrigger = page.locator('[data-photo-trigger]').first();
    await firstTrigger.click();

    const lightbox = page.locator('[data-photo-lightbox]');
    await expect(lightbox).toHaveClass(/flex/);

    // Click on the overlay (not on image or buttons)
    await lightbox.click({ position: { x: 10, y: 10 } });

    await expect(lightbox).toHaveClass(/hidden/);
  });

  test('photo post title is displayed on the page', async ({ page }) => {
    await page.goto('/blog/photo-post-sample');

    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('Photo Walk');
  });

  test('photo post description is displayed', async ({ page }) => {
    await page.goto('/blog/photo-post-sample');

    const description = page.locator('p').filter({ hasText: 'weekend photo set' });
    await expect(description.first()).toBeVisible();
  });
});

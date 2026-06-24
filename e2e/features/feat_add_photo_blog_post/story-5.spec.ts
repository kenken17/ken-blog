import { test, expect } from '@playwright/test';

test.describe('Story 5: Photo posts in blog list E2E', () => {
  test('blog list page loads', async ({ page }) => {
    await page.goto('/blog');

    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('BLOG');
  });

  test('blog list displays post count', async ({ page }) => {
    await page.goto('/blog');

    const postCount = page.locator('[data-post-count]');
    await expect(postCount).toBeVisible();
    const text = await postCount.textContent();
    expect(text).toMatch(/\d+ post/);
  });

  test('photo post appears in blog list with thumbnail', async ({ page }) => {
    await page.goto('/blog');

    // Find the photo post entry (Photo Walk: Kuala Lumpur Weekend)
    const photoPost = page.locator('article').filter({ hasText: 'Photo Walk' });
    await expect(photoPost).toBeVisible();

    // Thumbnail should be present
    const thumbnail = photoPost.locator('img');
    await expect(thumbnail).toBeVisible();

    const src = await thumbnail.getAttribute('src');
    expect(src).toBeTruthy();
  });

  test('photo post shows camera icon indicator in blog list', async ({ page }) => {
    await page.goto('/blog');

    const photoPost = page.locator('article').filter({ hasText: 'Photo Walk' });
    const photoLabel = photoPost.getByLabel('Photo post');
    await expect(photoLabel).toBeVisible();
  });

  test('photo post shows title in blog list', async ({ page }) => {
    await page.goto('/blog');

    const title = page.locator('h2').filter({ hasText: 'Photo Walk' });
    await expect(title).toBeVisible();
  });

  test('photo post shows description in blog list', async ({ page }) => {
    await page.goto('/blog');

    const photoPost = page.locator('article').filter({ hasText: 'Photo Walk' });
    const description = photoPost.locator('p').filter({ hasText: /weekend photo set/i });
    await expect(description).toBeVisible();
  });

  test('photo post shows reading time in blog list', async ({ page }) => {
    await page.goto('/blog');

    const photoPost = page.locator('article').filter({ hasText: 'Photo Walk' });
    const readingTime = photoPost.locator('text=/\\d+ min read/');
    await expect(readingTime).toBeVisible();
  });

  test('photo post shows publication date in blog list', async ({ page }) => {
    await page.goto('/blog');

    const photoPost = page.locator('article').filter({ hasText: 'Photo Walk' });
    const date = photoPost.locator('time');
    await expect(date).toBeVisible();
  });

  test('clicking photo post in blog list navigates to post page', async ({ page }) => {
    await page.goto('/blog');

    const photoPost = page.locator('article').filter({ hasText: 'Photo Walk' });
    const link = photoPost.locator('a[href="/blog/photo-post-sample"]');
    await link.click();

    await expect(page).toHaveURL(/\/blog\/photo-post-sample/);
  });

  test('thumbnail has lazy loading attribute', async ({ page }) => {
    await page.goto('/blog');

    const photoPost = page.locator('article').filter({ hasText: 'Photo Walk' });
    const thumbnail = photoPost.locator('img');
    const loading = await thumbnail.getAttribute('loading');
    expect(loading).toBe('lazy');
  });

  test('thumbnail has alt text', async ({ page }) => {
    await page.goto('/blog');

    const photoPost = page.locator('article').filter({ hasText: 'Photo Walk' });
    const thumbnail = photoPost.locator('img');
    const alt = await thumbnail.getAttribute('alt');
    expect(alt).toBeTruthy();
  });

  test('photo post shows tags in blog list', async ({ page }) => {
    await page.goto('/blog');

    const photoPost = page.locator('article').filter({ hasText: 'Photo Walk' });
    const tagLink = photoPost.getByLabel('Posts tagged photo');
    await expect(tagLink).toBeVisible();
  });
});

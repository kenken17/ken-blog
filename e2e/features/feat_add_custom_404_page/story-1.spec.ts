import { test, expect } from '@playwright/test';

const missingPath = '/this-route-does-not-exist-for-404-tests';

test('visiting a non-existent route renders the custom 404 page', async ({ page }) => {
  const response = await page.goto(missingPath);

  // Static hosting can return 200 with a 404 document body in some environments.
  expect(response?.status() === 404 || response?.status() === 200).toBe(true);
  await expect(page.getByRole('heading', { name: '404', level: 1 })).toBeVisible();
  await expect(page.getByText('Page Not Found')).toBeVisible();
  await expect(page.getByText('The page you were trying to reach does not exist or may have been moved.')).toBeVisible();
});

test('Back to Home link navigates to homepage', async ({ page }) => {
  await page.goto(missingPath);
  await page.getByRole('link', { name: 'Back to Home' }).click();
  await expect(page).toHaveURL('/');
});

test('navigation links route to Home, Blog, and Tags', async ({ page }) => {
  await page.goto(missingPath);

  const nav = page.getByRole('navigation', { name: 'Main navigation links' });
  await nav.getByRole('link', { name: 'Blog' }).click();
  await expect(page).toHaveURL('/blog');

  await page.goto(missingPath);
  await nav.getByRole('link', { name: 'Tags' }).click();
  await expect(page).toHaveURL('/tags');

  await page.goto(missingPath);
  await nav.getByRole('link', { name: 'Home' }).click();
  await expect(page).toHaveURL('/');
});

test('search bar is rendered on the 404 page', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(missingPath);
  await expect(page.locator('[data-search-input]').first()).toBeVisible();
});

test('404 page remains readable at mobile and desktop viewport sizes', async ({ page }) => {
  for (const viewport of [
    { width: 375, height: 812 },
    { width: 1280, height: 800 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto(missingPath);

    await expect(page.getByRole('heading', { name: '404', level: 1 })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Recent Posts', level: 2 })).toBeVisible();
  }
});

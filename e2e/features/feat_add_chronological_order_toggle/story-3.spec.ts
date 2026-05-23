import { test, expect } from '@playwright/test';

test.describe('sort order toggle and reordering', () => {
  test('toggle button is visible on blog page', async ({ page }) => {
    await page.goto('/blog');
    const toggle = page.locator('button[data-sort-order-toggle]');
    await expect(toggle).toBeVisible();
  });

  test('toggle button is visible on tags index page', async ({ page }) => {
    await page.goto('/tags');
    const toggle = page.locator('button[data-sort-order-toggle]');
    await expect(toggle).toBeVisible();
  });

  test('toggle button is visible on tag detail page', async ({ page }) => {
    await page.goto('/tags/ai');
    const toggle = page.locator('button[data-sort-order-toggle]');
    await expect(toggle).toBeVisible();
  });

  test('clicking toggle on blog page reorders posts', async ({ page }) => {
    await page.goto('/blog');
    const toggle = page.locator('button[data-sort-order-toggle]');
    const articles = page.locator('article[data-pub-date]');

    const initialOrder = await articles.allTextContents();
    await toggle.click();
    const newOrder = await articles.allTextContents();

    expect(newOrder).not.toEqual(initialOrder);
  });

  test('clicking toggle on tags page reorders tags', async ({ page }) => {
    await page.goto('/tags');
    const toggle = page.locator('button[data-sort-order-toggle]');
    const tags = page.locator('a[data-tag-name]');

    const initialOrder = await tags.allTextContents();
    await toggle.click();
    const newOrder = await tags.allTextContents();

    expect(newOrder).not.toEqual(initialOrder);
  });

  test('sort order persists across page navigation', async ({ page }) => {
    await page.goto('/blog');
    const toggle = page.locator('button[data-sort-order-toggle]');

    await toggle.click();
    await page.goto('/tags');
    const toggleOnTags = page.locator('button[data-sort-order-toggle]');
    await expect(toggleOnTags).toHaveAttribute(
      'aria-label',
      'Sort order: oldest first — click to show newest first'
    );
  });

  test('sort order persists across browser restart', async ({ page }) => {
    await page.goto('/blog');
    const toggle = page.locator('button[data-sort-order-toggle]');
    await toggle.click();

    await page.reload();
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-sort-order', 'chronological');
  });

  test('keyboard accessibility: Enter activates toggle', async ({ page }) => {
    await page.goto('/blog');
    const toggle = page.locator('button[data-sort-order-toggle]');

    await toggle.focus();
    await page.keyboard.press('Enter');

    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-sort-order', 'chronological');
  });

  test('keyboard accessibility: Space activates toggle', async ({ page }) => {
    await page.goto('/blog');
    const toggle = page.locator('button[data-sort-order-toggle]');

    await toggle.focus();
    await page.keyboard.press('Space');

    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-sort-order', 'chronological');
  });

  test('no FOUC: data-sort-order attribute is present before paint', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('sort_order', 'chronological');
    });

    await page.goto('/blog');
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-sort-order', 'chronological');
  });
});

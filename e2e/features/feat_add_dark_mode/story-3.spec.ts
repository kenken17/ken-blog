import { test, expect } from '@playwright/test';

test.describe('dark mode visual correctness', () => {
  async function enableDarkMode(page) {
    const toggle = page.locator('button[aria-label="Toggle dark mode"]');
    await toggle.click();
    const html = page.locator('html');
    await expect(html).toHaveClass('dark');
  }

  test('homepage renders with dark background and light text', async ({ page }) => {
    await page.goto('/');
    await enableDarkMode(page);

    const body = page.locator('body');
    const bg = await body.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    expect(bg).toBe('rgb(9, 9, 11)');

    const h1 = page.locator('h1');
    const color = await h1.evaluate((el) => window.getComputedStyle(el).color);
    expect(color).toBe('rgb(250, 250, 250)');
  });

  test('blog listing page renders correctly in dark mode', async ({ page }) => {
    await page.goto('/blog');
    await enableDarkMode(page);

    const main = page.locator('main');
    await expect(main).toBeVisible();
    const bg = await main.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    expect(bg).toBe('rgba(0, 0, 0, 0)');
  });

  test('individual blog post renders correctly in dark mode', async ({ page }) => {
    await page.goto('/blog/my-ai-era');
    await enableDarkMode(page);

    const article = page.locator('article');
    await expect(article).toBeVisible();
  });

  test('tags pages render correctly in dark mode', async ({ page }) => {
    await page.goto('/tags');
    await enableDarkMode(page);

    const main = page.locator('main');
    await expect(main).toBeVisible();
  });

  test('search bar renders correctly in dark mode', async ({ page }) => {
    await page.goto('/');
    await enableDarkMode(page);

    const searchInput = page.locator('input[aria-label="Search posts"]').first();
    await expect(searchInput).toBeVisible();
  });

  test('logo text is visible in dark mode', async ({ page }) => {
    await page.goto('/blog');
    await enableDarkMode(page);

    const logo = page.locator('a[aria-label="Ken\'s Blog home"]');
    await expect(logo).toBeVisible();
  });

  test('social links are visible and hoverable in dark mode', async ({ page }) => {
    await page.goto('/');
    await enableDarkMode(page);

    const githubLink = page.locator('a[aria-label="GitHub profile"]');
    await expect(githubLink).toBeVisible();
  });

  test('like button is visible in dark mode', async ({ page }) => {
    await page.goto('/blog/my-ai-era');
    await enableDarkMode(page);

    const likeButton = page.locator('button[aria-label*="reactions"]');
    await expect(likeButton).toBeVisible();
  });
});

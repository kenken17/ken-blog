import { test, expect } from '@playwright/test';

test('homepage has title and hero', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle("Ken's Blog");
  await expect(page.locator('h1')).toContainText("KEN'S");
});

test('homepage shows recent posts', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h2')).toContainText('RECENT POSTS');
});

test('homepage shows GitHub and LinkedIn social links', async ({ page }) => {
  await page.goto('/');

  const githubLink = page.locator('a[aria-label="GitHub profile"]');
  await expect(githubLink).toBeVisible();
  await expect(githubLink).toHaveAttribute('href', 'https://github.com/kenken17');
  await expect(githubLink).toHaveAttribute('target', '_blank');
  await expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');

  const linkedinLink = page.locator('a[aria-label="LinkedIn profile"]');
  await expect(linkedinLink).toBeVisible();
  await expect(linkedinLink).toHaveAttribute('href', 'https://www.linkedin.com/in/tze-ken-lee/');
  await expect(linkedinLink).toHaveAttribute('target', '_blank');
  await expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer');
});

import { test, expect } from '@playwright/test';

const TEST_POST_URL = '/blog/test-code-blocks/';

test.describe('Story 1: Enhanced Code Block Rendering', () => {
  test.beforeEach(async ({ page, context }) => {
    await page.goto(TEST_POST_URL);
    await page.waitForTimeout(500);
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  });

  test('language badge is visible for JavaScript code block', async ({ page }) => {
    const jsBlock = page.locator('[data-language="javascript"]').first();
    await expect(jsBlock).toBeVisible();

    const badge = jsBlock.locator('.language-badge');
    await expect(badge).toBeVisible();
    await expect(badge).toContainText('JavaScript');
  });

  test('language badge is visible for Python code block', async ({ page }) => {
    const pyBlock = page.locator('[data-language="python"]').first();
    await expect(pyBlock).toBeVisible();

    const badge = pyBlock.locator('.language-badge');
    await expect(badge).toBeVisible();
    await expect(badge).toContainText('Python');
  });

  test('no language badge for plain text block', async ({ page }) => {
    const textBlock = page.locator('[data-language="text"]').first();
    await expect(textBlock).toBeVisible();

    const badge = textBlock.locator('.language-badge');
    await expect(badge).toHaveCount(0);
  });

  test('filename header is visible when title is specified', async ({ page }) => {
    const jsBlock = page.locator('[data-language="javascript"]').first();
    const filename = jsBlock.locator('.filename');
    await expect(filename).toBeVisible();
    await expect(filename).toContainText('hello.js');
  });

  test('filename header shows correct filename for Python', async ({ page }) => {
    const pyBlock = page.locator('[data-language="python"]').first();
    const filename = pyBlock.locator('.filename');
    await expect(filename).toBeVisible();
    await expect(filename).toContainText('script.py');
  });

  test('copy button is visible and has correct accessibility attributes', async ({ page }) => {
    const firstBlock = page.locator('.code-block-wrapper').first();
    const copyBtn = firstBlock.locator('button[aria-label="Copy code to clipboard"]');
    await expect(copyBtn).toBeVisible();
    await expect(copyBtn).toHaveAttribute('title', 'Copy code');
  });

  test('copying code places only code content on clipboard', async ({ page }) => {
    const jsBlock = page.locator('[data-language="javascript"]').first();
    const copyBtn = jsBlock.locator('button[aria-label="Copy code to clipboard"]');

    await copyBtn.click();

    // Wait a moment for clipboard to update
    await page.waitForTimeout(300);

    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toContain('function greet(name)');
    expect(clipboardText).not.toContain('JavaScript');
    expect(clipboardText).not.toContain('hello.js');
  });

  test('copy button shows visual feedback after clicking', async ({ page }) => {
    const firstBlock = page.locator('.code-block-wrapper').first();
    const copyBtn = firstBlock.locator('button[aria-label="Copy code to clipboard"]');

    await copyBtn.click();

    // Check that the button text changes to "Copied!"
    const copyText = copyBtn.locator('.copy-text');
    await expect(copyText).toContainText('Copied!');

    // Wait for it to reset
    await page.waitForTimeout(2500);
    await expect(copyText).toContainText('Copy');
  });

  test('code block wrapper preserves original pre content', async ({ page }) => {
    const jsBlock = page.locator('[data-language="javascript"]').first();
    const pre = jsBlock.locator('pre');
    await expect(pre).toBeVisible();
    await expect(pre).toContainText('function greet');
  });

  test('code blocks render in dark mode correctly', async ({ page }) => {
    // Toggle dark mode if possible
    const themeToggle = page.locator('button[aria-label="Toggle theme"]');
    if (await themeToggle.isVisible().catch(() => false)) {
      await themeToggle.click();
    }

    const wrapper = page.locator('.code-block-wrapper').first();
    await expect(wrapper).toBeVisible();

    const header = wrapper.locator('.code-block-header');
    await expect(header).toBeVisible();
  });
});

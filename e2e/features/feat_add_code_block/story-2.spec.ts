import { test, expect } from '@playwright/test';

const TEST_POST_URL = '/blog/test-code-blocks/';

test.describe('Story 2: Line Numbers in Code Blocks', () => {
  test.beforeEach(async ({ page, context }) => {
    await page.goto(TEST_POST_URL);
    await page.waitForTimeout(500);
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  });

  test('line numbers are visible in code blocks', async ({ page }) => {
    const codeBlock = page.locator('.code-block-wrapper').first();
    const lineNumbers = codeBlock.locator('.line-number');
    await expect(lineNumbers.first()).toBeVisible();
    const count = await lineNumbers.count();
    expect(count).toBeGreaterThan(0);
  });

  test('line numbers start at 1 and increment correctly', async ({ page }) => {
    const codeBlock = page.locator('.code-block-wrapper').first();
    const lineNumbers = codeBlock.locator('.line-number');

    const firstNumber = await lineNumbers.first().textContent();
    expect(firstNumber).toContain('1');

    const secondNumber = await lineNumbers.nth(1).textContent();
    expect(secondNumber).toContain('2');
  });

  test('copying code does not include line numbers in clipboard', async ({ page }) => {
    const codeBlock = page.locator('.code-block-wrapper').first();
    const copyBtn = codeBlock.locator('button[aria-label="Copy code to clipboard"]');

    await copyBtn.click();
    await page.waitForTimeout(300);

    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());

    // Should not contain line number text like "1" at the start of lines
    const lines = clipboardText.split('\n');
    for (const line of lines) {
      // Line numbers should not appear as prefixes
      expect(line).not.toMatch(/^\s*\d+\s/);
    }
  });

  test('line numbers are readable in light mode', async ({ page }) => {
    const codeBlock = page.locator('.code-block-wrapper').first();
    const lineNumber = codeBlock.locator('.line-number').first();
    await expect(lineNumber).toBeVisible();

    const color = await lineNumber.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });
    // Should be a visible muted color (not fully transparent)
    expect(color).not.toBe('rgba(0, 0, 0, 0)');
  });

  test('line numbers use tabular-nums for alignment', async ({ page }) => {
    const lineNumber = page.locator('.line-number').first();
    const fontVariant = await lineNumber.evaluate((el) => {
      return window.getComputedStyle(el).fontVariantNumeric;
    });
    expect(fontVariant).toContain('tabular-nums');
  });

  test('line numbers are not selectable by user', async ({ page }) => {
    const lineNumber = page.locator('.line-number').first();
    const userSelect = await lineNumber.evaluate((el) => {
      return window.getComputedStyle(el).userSelect;
    });
    expect(userSelect).toBe('none');
  });
});

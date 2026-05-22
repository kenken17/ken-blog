import { test, expect } from '@playwright/test';

const TEST_POST_URL = '/blog/test-code-blocks/';

test.describe('Story 3: Responsive Code Block Design', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(TEST_POST_URL);
    await page.waitForTimeout(500);
  });

  test('code block renders correctly at mobile viewport (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const codeBlock = page.locator('.code-block-wrapper').first();
    await expect(codeBlock).toBeVisible();

    // Check no horizontal page overflow
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1); // allow 1px rounding
  });

  test('copy button is accessible at mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const copyBtn = page.locator('button[aria-label="Copy code to clipboard"]').first();
    await expect(copyBtn).toBeVisible();

    const box = await copyBtn.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      expect(box.width).toBeGreaterThanOrEqual(44);
      expect(box.height).toBeGreaterThanOrEqual(44);
    }
  });

  test('code block renders correctly at tablet viewport (768px)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    const codeBlock = page.locator('.code-block-wrapper').first();
    await expect(codeBlock).toBeVisible();

    const header = codeBlock.locator('.code-block-header');
    await expect(header).toBeVisible();
  });

  test('code block renders correctly at desktop viewport (1280px)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    const codeBlock = page.locator('.code-block-wrapper').first();
    await expect(codeBlock).toBeVisible();

    const header = codeBlock.locator('.code-block-header');
    await expect(header).toBeVisible();
  });

  test('horizontal scroll is present on mobile for long lines', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const codeBody = page.locator('.code-block-body').first();
    await expect(codeBody).toBeVisible();

    // Check that overflow-x is set to auto/scroll
    const overflowX = await codeBody.evaluate((el) => {
      return window.getComputedStyle(el).overflowX;
    });
    expect(['auto', 'scroll', 'clip']).toContain(overflowX);
  });

  test('language badge and filename do not overflow header on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const header = page.locator('.code-block-header').first();
    const headerBox = await header.boundingBox();
    const wrapperBox = await page.locator('.code-block-wrapper').first().boundingBox();

    if (headerBox && wrapperBox) {
      expect(headerBox.width).toBeLessThanOrEqual(wrapperBox.width + 1);
    }
  });

  test('line numbers remain aligned at mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const lineNumbers = page.locator('.line-number');
    await expect(lineNumbers.first()).toBeVisible();

    const firstLineNumber = lineNumbers.first();
    const alignment = await firstLineNumber.evaluate((el) => {
      return window.getComputedStyle(el).textAlign;
    });
    expect(alignment).toBe('right');
  });
});

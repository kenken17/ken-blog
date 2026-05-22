import { test, expect } from '@playwright/test';

test.describe('dark mode CSS foundation', () => {
  test('body has light background by default', async ({ page }) => {
    await page.goto('/');
    const body = page.locator('body');
    const bg = await body.evaluate((el) =>
      window.getComputedStyle(el).backgroundColor
    );
    expect(bg).toBe('rgb(250, 250, 250)');
  });

  test('adding dark class changes background color', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');

    await html.evaluate((el) => el.classList.add('dark'));
    const body = page.locator('body');
    const bg = await body.evaluate((el) =>
      window.getComputedStyle(el).backgroundColor
    );
    expect(bg).toBe('rgb(9, 9, 11)');

    await html.evaluate((el) => el.classList.remove('dark'));
    const bgLight = await body.evaluate((el) =>
      window.getComputedStyle(el).backgroundColor
    );
    expect(bgLight).toBe('rgb(250, 250, 250)');
  });
});

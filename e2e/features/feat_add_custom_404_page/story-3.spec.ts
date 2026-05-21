import { test, expect } from '@playwright/test';

const missingPath = '/this-route-does-not-exist-for-404-responsive-tests';

const viewports = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 800 },
] as const;

for (const viewport of viewports) {
  test(`404 layout is responsive on ${viewport.name} (${viewport.width}px)`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto(missingPath);

    await expect(page.getByRole('heading', { name: '404', level: 1 })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Recent Posts', level: 2 })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Explore', level: 2 })).toBeVisible();

    const hasHorizontalOverflow = await page.evaluate(() => {
      const root = document.documentElement;
      const body = document.body;
      return root.scrollWidth > window.innerWidth || body.scrollWidth > window.innerWidth;
    });

    expect(hasHorizontalOverflow).toBe(false);
  });
}

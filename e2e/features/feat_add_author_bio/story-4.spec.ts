import { test, expect } from '@playwright/test';

const authorPath = '/author/ken';

test.describe('Story 4: SEO and accessibility on author page', () => {
  test('page has a single h1 with author name', async ({ page }) => {
    await page.goto(authorPath);
    const h1s = page.locator('h1');
    await expect(h1s).toHaveCount(1);
    await expect(h1s).toContainText('Ken');
  });

  test('page has h2 for posts section', async ({ page }) => {
    await page.goto(authorPath);
    const h2s = page.locator('h2');
    await expect(h2s).toContainText('Posts by Ken');
  });

  test('avatar image has descriptive alt text', async ({ page }) => {
    await page.goto(authorPath);
    const avatar = page.locator('img[alt="Portrait of Ken"]');
    await expect(avatar).toBeVisible();
  });

  test('author link in blog post header is focusable', async ({ page }) => {
    await page.goto('/blog');
    const firstPostLink = page.locator('article a[href^="/blog/"]').first();
    await firstPostLink.click();

    const authorLink = page.locator('a[href="/author/ken"]');
    await expect(authorLink).toBeVisible();

    await authorLink.focus();
    const isFocused = await authorLink.evaluate((el) => el === document.activeElement);
    expect(isFocused).toBe(true);
  });

  test('page title includes author name', async ({ page }) => {
    await page.goto(authorPath);
    await expect(page).toHaveTitle(/Ken/);
  });

  test('meta description matches author bio', async ({ page }) => {
    await page.goto(authorPath);
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /Software engineer and designer/);
  });

  test('canonical link points to author page', async ({ page }) => {
    await page.goto(authorPath);
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', /\/author\/ken/);
  });

  test('JSON-LD Person schema is present', async ({ page }) => {
    await page.goto(authorPath);
    const jsonLdScript = page.locator('script[type="application/ld+json"]');
    await expect(jsonLdScript).toHaveCount(1);

    const jsonLd = await jsonLdScript.evaluate((el) => {
      try {
        return JSON.parse(el.textContent || '{}');
      } catch {
        return null;
      }
    });

    expect(jsonLd).not.toBeNull();
    expect(jsonLd['@context']).toBe('https://schema.org');
    expect(jsonLd['@type']).toBe('Person');
    expect(jsonLd.name).toBe('Ken');
    expect(jsonLd.description).toContain('Software engineer');
    expect(jsonLd.url).toMatch(/\/author\/ken/);
  });

  test('og:type is profile', async ({ page }) => {
    await page.goto(authorPath);
    const ogType = page.locator('meta[property="og:type"]');
    await expect(ogType).toHaveAttribute('content', 'profile');
  });

  test('page is responsive on mobile and desktop', async ({ page }) => {
    for (const viewport of [
      { width: 375, height: 812 },
      { width: 1280, height: 800 },
    ]) {
      await page.setViewportSize(viewport);
      await page.goto(authorPath);

      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('img[alt="Portrait of Ken"]')).toBeVisible();

      const hasHorizontalOverflow = await page.evaluate(() => {
        const root = document.documentElement;
        const body = document.body;
        return root.scrollWidth > window.innerWidth || body.scrollWidth > window.innerWidth;
      });

      expect(hasHorizontalOverflow).toBe(false);
    }
  });
});

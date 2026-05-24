import { test, expect } from '@playwright/test';

test.describe('blog tag filtering', () => {
  test('tag filter is visible on blog page', async ({ page }) => {
    await page.goto('/blog');
    const filterContainer = page.locator('[data-blog-tag-filter-container]');
    await expect(filterContainer).toBeVisible();
    const buttons = page.locator('button[data-blog-tag-filter]');
    await expect(buttons.first()).toBeVisible();
  });

  test('clicking a tag filters posts to show only matching ones', async ({ page }) => {
    await page.goto('/blog');
    const articles = page.locator('article[data-tags]');
    const initialCount = await articles.count();
    expect(initialCount).toBeGreaterThan(0);

    const firstTagBtn = page.locator('button[data-blog-tag-filter]').first();
    const tagName = await firstTagBtn.getAttribute('data-tag');
    await firstTagBtn.click();
    await page.waitForTimeout(100);

    const visibleArticles = articles.filter({ hasNot: page.locator('.hidden') });
    const visibleCount = await visibleArticles.count();

    for (let i = 0; i < visibleCount; i++) {
      const tagsAttr = await visibleArticles.nth(i).getAttribute('data-tags');
      const tags = JSON.parse(tagsAttr ?? '[]');
      expect(tags).toContain(tagName);
    }
  });

  test('clicking multiple tags shows posts matching any (OR logic)', async ({ page }) => {
    await page.goto('/blog');
    const buttons = page.locator('button[data-blog-tag-filter]');
    const count = await buttons.count();
    if (count < 2) {
      test.skip('Not enough tags to test multi-select');
      return;
    }

    await buttons.nth(0).click();
    await buttons.nth(1).click();
    await page.waitForTimeout(100);

    const articles = page.locator('article[data-tags]');
    const articleCount = await articles.count();
    let visibleCount = 0;
    const tag0 = await buttons.nth(0).getAttribute('data-tag');
    const tag1 = await buttons.nth(1).getAttribute('data-tag');

    for (let i = 0; i < articleCount; i++) {
      const article = articles.nth(i);
      const isHidden = await article.evaluate((el) => el.classList.contains('hidden'));
      if (!isHidden) {
        visibleCount++;
        const tagsAttr = await article.getAttribute('data-tags');
        const tags = JSON.parse(tagsAttr ?? '[]');
        expect(tags.includes(tag0) || tags.includes(tag1)).toBe(true);
      }
    }

    expect(visibleCount).toBeGreaterThan(0);
  });

  test('clicking an active tag deselects it', async ({ page }) => {
    await page.goto('/blog');
    const firstTagBtn = page.locator('button[data-blog-tag-filter]').first();
    await firstTagBtn.click();
    await page.waitForTimeout(100);
    await expect(firstTagBtn).toHaveAttribute('aria-pressed', 'true');

    await firstTagBtn.click();
    await page.waitForTimeout(100);
    await expect(firstTagBtn).toHaveAttribute('aria-pressed', 'false');
  });

  test('tag selection persists across page navigation', async ({ page }) => {
    await page.goto('/blog');
    const firstTagBtn = page.locator('button[data-blog-tag-filter]').first();
    await firstTagBtn.click();
    await page.waitForTimeout(100);

    const tagName = await firstTagBtn.getAttribute('data-tag');
    await page.goto('/tags');
    await page.goto('/blog');

    const restoredBtn = page.locator(`button[data-tag="${tagName}"]`);
    await expect(restoredBtn).toHaveAttribute('aria-pressed', 'true');
  });

  test('tag selection persists across browser reload', async ({ page }) => {
    await page.goto('/blog');
    const firstTagBtn = page.locator('button[data-blog-tag-filter]').first();
    await firstTagBtn.click();
    await page.waitForTimeout(100);

    const tagName = await firstTagBtn.getAttribute('data-tag');
    await page.reload();

    const restoredBtn = page.locator(`button[data-tag="${tagName}"]`);
    await expect(restoredBtn).toHaveAttribute('aria-pressed', 'true');
  });

  test('keyboard accessibility: Tab + Enter selects a tag', async ({ page }) => {
    await page.goto('/blog');
    const firstTagBtn = page.locator('button[data-blog-tag-filter]').first();
    await firstTagBtn.focus();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(100);
    await expect(firstTagBtn).toHaveAttribute('aria-pressed', 'true');
  });

  test('keyboard accessibility: Tab + Space selects a tag', async ({ page }) => {
    await page.goto('/blog');
    const firstTagBtn = page.locator('button[data-blog-tag-filter]').first();
    await firstTagBtn.focus();
    await page.keyboard.press('Space');
    await page.waitForTimeout(100);
    await expect(firstTagBtn).toHaveAttribute('aria-pressed', 'true');
  });

  test('sort order toggle continues to work after filtering', async ({ page }) => {
    await page.goto('/blog');
    const toggle = page.locator('button[data-sort-order-toggle]');
    const firstTagBtn = page.locator('button[data-blog-tag-filter]').first();

    await firstTagBtn.click();
    await page.waitForTimeout(100);

    const articles = page.locator('article[data-pub-date]');
    const initialOrder = await articles.allTextContents();
    await toggle.click();
    await page.waitForTimeout(100);

    const newOrder = await articles.allTextContents();
    expect(newOrder).not.toEqual(initialOrder);
  });

  test('post count updates when filtering', async ({ page }) => {
    await page.goto('/blog');
    const postCountEl = page.locator('[data-post-count]');
    const initialText = await postCountEl.textContent();

    const firstTagBtn = page.locator('button[data-blog-tag-filter]').first();
    await firstTagBtn.click();
    await page.waitForTimeout(100);

    const filteredText = await postCountEl.textContent();
    expect(filteredText).not.toBe(initialText);
  });

  test('no FOUC: data-tag-filter attribute is present before paint', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('blog_tag_filter', JSON.stringify(['astro']));
    });

    await page.goto('/blog');
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-tag-filter', JSON.stringify(['astro']));
  });

  test('aria-live region announces filter changes', async ({ page }) => {
    await page.goto('/blog');
    const postCountEl = page.locator('[data-post-count]');
    await expect(postCountEl).toHaveAttribute('aria-live', 'polite');
  });
});

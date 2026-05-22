import { test, expect } from '@playwright/test';

const EDITOR_URL = '/admin/write';

test.describe('Story 4: Editor Integration for Code Blocks', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(EDITOR_URL);
  });

  test('code block button is visible in editor toolbar', async ({ page }) => {
    const codeBlockBtn = page.locator('button[data-command="codeBlock"]');
    await expect(codeBlockBtn).toBeVisible();
  });

  test('clicking code block button shows language selector', async ({ page }) => {
    const codeBlockBtn = page.locator('button[data-command="codeBlock"]');
    await codeBlockBtn.click();

    const langSelect = page.locator('#codeblock-lang-select');
    await expect(langSelect).toBeVisible();
  });

  test('language selector contains all supported languages', async ({ page }) => {
    const codeBlockBtn = page.locator('button[data-command="codeBlock"]');
    await codeBlockBtn.click();

    const langSelect = page.locator('#codeblock-lang-select');
    const options = await langSelect.locator('option').allTextContents();

    expect(options).toContain('Text');
    expect(options).toContain('Bash');
    expect(options).toContain('Python');
    expect(options).toContain('JavaScript');
    expect(options).toContain('Java');
    expect(options).toContain('C++');
    expect(options).toContain('Ruby');
  });

  test('default language selection is Text', async ({ page }) => {
    const codeBlockBtn = page.locator('button[data-command="codeBlock"]');
    await codeBlockBtn.click();

    const langSelect = page.locator('#codeblock-lang-select');
    await expect(langSelect).toHaveValue('text');
  });

  test('inserting a code block creates pre and code elements', async ({ page }) => {
    const contentInput = page.locator('#content-input');
    await contentInput.focus();
    await page.keyboard.type('Some test content');

    const codeBlockBtn = page.locator('button[data-command="codeBlock"]');
    await codeBlockBtn.click();

    const langSelect = page.locator('#codeblock-lang-select');
    await langSelect.selectOption('javascript');

    const applyBtn = page.locator('#codeblock-apply-btn');
    await applyBtn.click();

    const pre = contentInput.locator('pre');
    await expect(pre).toHaveCount(1);

    const code = pre.locator('code');
    await expect(code).toHaveCount(1);
    await expect(code).toHaveClass(/language-javascript/);
  });

  test('inserting code block with selected text wraps it in the block', async ({ page }) => {
    const contentInput = page.locator('#content-input');
    await contentInput.focus();
    await page.keyboard.type('const x = 1;');

    // Select all text
    await page.keyboard.press('Control+a');

    const codeBlockBtn = page.locator('button[data-command="codeBlock"]');
    await codeBlockBtn.click();

    const langSelect = page.locator('#codeblock-lang-select');
    await langSelect.selectOption('javascript');

    const applyBtn = page.locator('#codeblock-apply-btn');
    await applyBtn.click();

    const pre = contentInput.locator('pre');
    await expect(pre).toBeVisible();
    await expect(pre).toContainText('const x = 1;');
  });

  test('filename input is optional and shown in selector', async ({ page }) => {
    const codeBlockBtn = page.locator('button[data-command="codeBlock"]');
    await codeBlockBtn.click();

    const filenameInput = page.locator('#codeblock-filename-input');
    await expect(filenameInput).toBeVisible();
  });

  test('cancel button hides language selector', async ({ page }) => {
    const codeBlockBtn = page.locator('button[data-command="codeBlock"]');
    await codeBlockBtn.click();

    const cancelBtn = page.locator('#codeblock-cancel-btn');
    await cancelBtn.click();

    const wrapper = page.locator('#codeblock-input-wrapper');
    await expect(wrapper).toBeHidden();
  });
});

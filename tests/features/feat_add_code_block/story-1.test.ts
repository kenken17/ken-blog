import { describe, it, expect } from 'vitest';
import { transform } from '@astrojs/compiler';
import fs from 'node:fs';
import path from 'node:path';

const componentPath = path.resolve(
  process.cwd(),
  'src/components/CodeBlock.astro'
);

async function compileComponent() {
  const source = fs.readFileSync(componentPath, 'utf-8');
  const result = await transform(source, {
    filename: 'CodeBlock.astro',
    moduleId: 'CodeBlock.astro',
    sourcemap: false,
  });
  return result.code;
}

describe('CodeBlock component', () => {
  it('compiles without errors', async () => {
    const code = await compileComponent();
    expect(code).toBeTruthy();
    expect(code.length).toBeGreaterThan(0);
  });

  it('renders a wrapper div with code-block-wrapper class', async () => {
    const code = await compileComponent();
    expect(code).toContain('code-block-wrapper');
  });

  it('renders a header with code-block-header class', async () => {
    const code = await compileComponent();
    expect(code).toContain('code-block-header');
  });

  it('renders a language badge with language-badge class', async () => {
    const code = await compileComponent();
    expect(code).toContain('language-badge');
  });

  it('renders a copy button with copy-btn class and data-copy attribute', async () => {
    const code = await compileComponent();
    expect(code).toContain('copy-btn');
  });

  it('has copy button with aria-label for accessibility', async () => {
    const source = fs.readFileSync(componentPath, 'utf-8');
    expect(source).toContain('aria-label="Copy code to clipboard"');
  });

  it('renders a slot for pre content', async () => {
    const code = await compileComponent();
    expect(code).toContain('$$renderSlot');
    expect(code).toContain('default');
  });

  it('accepts class prop for language detection', async () => {
    const source = fs.readFileSync(componentPath, 'utf-8');
    expect(source).toContain("class?: string");
  });

  it('accepts data-filename prop', async () => {
    const source = fs.readFileSync(componentPath, 'utf-8');
    expect(source).toContain("'data-filename'?: string");
  });

  it('extracts language from class prop using regex', async () => {
    const source = fs.readFileSync(componentPath, 'utf-8');
    expect(source).toContain('language-');
    expect(source).toContain('match');
  });

  it('includes copy script with clipboard functionality', async () => {
    const source = fs.readFileSync(componentPath, 'utf-8');
    expect(source).toContain('navigator.clipboard.writeText');
  });

  it('has visual feedback on copy success', async () => {
    const source = fs.readFileSync(componentPath, 'utf-8');
    expect(source).toContain('Copied!');
    expect(source).toContain('copy-icon');
    expect(source).toContain('check-icon');
  });

  it('uses theme-aware Tailwind classes', async () => {
    const source = fs.readFileSync(componentPath, 'utf-8');
    expect(source).toContain('bg-background-elevated');
    expect(source).toContain('bg-background-surface');
    expect(source).toContain('border-background-hover');
    expect(source).toContain('text-foreground-muted');
    expect(source).toContain('hover:text-foreground');
  });

  it('has responsive touch target for copy button', async () => {
    const source = fs.readFileSync(componentPath, 'utf-8');
    expect(source).toContain('min-w-[44px]');
    expect(source).toContain('min-h-[44px]');
  });

  it('maps common language aliases for display', async () => {
    const source = fs.readFileSync(componentPath, 'utf-8');
    expect(source).toContain('js:');
    expect(source).toContain('JavaScript');
    expect(source).toContain('Python');
    expect(source).toContain('Bash');
  });
});

describe('Language detection logic', () => {
  const source = fs.readFileSync(componentPath, 'utf-8');

  it('handles language-js class', () => {
    expect(source).toMatch(/language-\(\[a-zA-Z0-9\+#\]\+\)/);
  });

  it('defaults to text when no language class is found', () => {
    expect(source).toContain("let language = 'text'");
  });
});

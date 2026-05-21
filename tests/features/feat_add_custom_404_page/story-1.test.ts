import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const pagePath = path.resolve(process.cwd(), 'src/pages/404.astro');

describe('custom 404 page (story 1 + story 2)', () => {
  it('renders 404 heading and page not found message in BaseLayout', () => {
    const source = fs.readFileSync(pagePath, 'utf-8');

    expect(source).toContain('BaseLayout');
    expect(source).toContain('404 - Page Not Found | Ken\'s Blog');
    expect(source).toContain('<h1 id="error-title"');
    expect(source).toContain('>\n        404\n      </h1>');
    expect(source).toContain('Page Not Found');
  });

  it('includes Back to Home link', () => {
    const source = fs.readFileSync(pagePath, 'utf-8');
    expect(source).toContain('Back to Home');
    expect(source).toContain('href="/"');
  });

  it('fetches and renders recent posts', () => {
    const source = fs.readFileSync(pagePath, 'utf-8');
    expect(source).toContain("getCollection('posts'");
    expect(source).toContain('!data.draft');
    expect(source).toContain('.slice(0, 3)');
    expect(source).toContain('Recent Posts');
    expect(source).toContain('href={`/blog/${post.id}`}');
  });

  it('renders navigation links to Home, Blog, and Tags', () => {
    const source = fs.readFileSync(pagePath, 'utf-8');
    expect(source).toContain('aria-label="Main navigation links"');
    expect(source).toContain('<a href="/"');
    expect(source).toContain('<a href="/blog"');
    expect(source).toContain('<a href="/tags"');
  });
});

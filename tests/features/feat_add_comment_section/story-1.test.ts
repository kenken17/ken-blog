import { describe, it, expect } from 'vitest';
import { transform } from '@astrojs/compiler';
import fs from 'fs';
import path from 'path';

const componentPath = path.resolve(
  process.cwd(),
  'src/components/Comments.astro'
);

async function compileComponent() {
  const source = fs.readFileSync(componentPath, 'utf-8');
  const result = await transform(source, {
    filename: 'Comments.astro',
    moduleId: 'Comments.astro',
    sourcemap: false,
  });
  return result.code;
}

describe('Comments component', () => {
  it('renders a <section> with <h2>Comments</h2>', async () => {
    const code = await compileComponent();
    expect(code).toContain('<section');
    expect(code).toContain('<h2');
    expect(code).toContain('Comments</h2>');
  });

  it('renders <div id="giscus">', async () => {
    const code = await compileComponent();
    expect(code).toContain('<div id="giscus"></div>');
  });

  it('renders a <script> with src="https://giscus.app/client.js"', async () => {
    const code = await compileComponent();
    expect(code).toContain('https://giscus.app/client.js');
    expect(code).toContain('<script');
  });

  it('script includes data-loading="lazy"', async () => {
    const source = fs.readFileSync(componentPath, 'utf-8');
    expect(source).toContain("data-loading");
    expect(source).toContain("'lazy'");
  });

  it('passes slug prop correctly', async () => {
    const source = fs.readFileSync(componentPath, 'utf-8');
    expect(source).toContain('slug?: string');
    expect(source).toContain('const { slug } = Astro.props');
    expect(source).toContain('slug ?? Astro.url.pathname');
  });
});

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('sitemap integration', () => {
  it('astro.config.mjs includes @astrojs/sitemap in integrations', () => {
    const configPath = resolve(process.cwd(), 'astro.config.mjs');
    const configContent = readFileSync(configPath, 'utf-8');
    expect(configContent).toContain("import sitemap from '@astrojs/sitemap'");
    expect(configContent).toContain('integrations: [sitemap()]');
  });

  it('robots.txt references the sitemap', () => {
    const robotsPath = resolve(process.cwd(), 'public/robots.txt');
    const robotsContent = readFileSync(robotsPath, 'utf-8');
    expect(robotsContent).toContain('User-agent: *');
    expect(robotsContent).toContain('Allow: /');
    expect(robotsContent).toContain('Sitemap: https://ken-blog.pages.dev/sitemap-index.xml');
  });
});

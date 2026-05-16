import { describe, it, expect } from 'vitest';
import { siteConfig, SITE_URL } from '../../../src/config/seo';

describe('SEO config consistency', () => {
  it('SITE_URL matches astro.config.mjs site value', () => {
    expect(SITE_URL).toBe('https://ken-blog.pages.dev');
  });

  it('siteConfig has all required fields', () => {
    expect(siteConfig.title).toBe("Ken's Blog");
    expect(siteConfig.description).toBeDefined();
    expect(siteConfig.lang).toBe('en');
    expect(siteConfig.author).toBeDefined();
    expect(siteConfig.ogImage).toBeDefined();
  });

  it('siteConfig values are non-empty strings', () => {
    expect(siteConfig.title.length).toBeGreaterThan(0);
    expect(siteConfig.description.length).toBeGreaterThan(0);
    expect(siteConfig.lang.length).toBeGreaterThan(0);
    expect(siteConfig.author.length).toBeGreaterThan(0);
    expect(siteConfig.ogImage.length).toBeGreaterThan(0);
  });
});

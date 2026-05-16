import { describe, it, expect } from 'vitest';
import { generateMetaTags } from '../../../src/utils/seo';
import { siteConfig, SITE_URL } from '../../../src/config/seo';

describe('generateMetaTags', () => {
  it('returns basic meta tags with defaults', () => {
    const tags = generateMetaTags({ title: 'Home' });
    const byName = (name: string) => tags.find((t) => t.name === name);
    const byProperty = (property: string) => tags.find((t) => t.property === property);

    expect(byName('description')?.content).toBe(siteConfig.description);
    expect(byProperty('og:title')?.content).toBe(`Home | ${siteConfig.title}`);
    expect(byProperty('og:description')?.content).toBe(siteConfig.description);
    expect(byProperty('og:type')?.content).toBe('website');
    expect(byProperty('og:url')?.content).toBe(SITE_URL);
    expect(byProperty('og:image')?.content).toBe(`${SITE_URL}${siteConfig.ogImage}`);
    expect(byProperty('og:site_name')?.content).toBe(siteConfig.title);
    expect(byProperty('og:locale')?.content).toBe('en_US');
    expect(byName('twitter:card')?.content).toBe('summary_large_image');
    expect(byName('twitter:title')?.content).toBe(`Home | ${siteConfig.title}`);
    expect(byName('twitter:description')?.content).toBe(siteConfig.description);
    expect(byName('twitter:image')?.content).toBe(`${SITE_URL}${siteConfig.ogImage}`);
  });

  it('uses provided description instead of default', () => {
    const tags = generateMetaTags({ title: 'About', description: 'Custom desc' });
    expect(tags.find((t) => t.name === 'description')?.content).toBe('Custom desc');
    expect(tags.find((t) => t.property === 'og:description')?.content).toBe('Custom desc');
  });

  it('builds canonical URL from canonicalPath', () => {
    const tags = generateMetaTags({ title: 'Post', canonicalPath: '/blog/my-post' });
    expect(tags.find((t) => t.property === 'og:url')?.content).toBe(`${SITE_URL}/blog/my-post`);
  });

  it('resolves relative ogImage to absolute URL', () => {
    const tags = generateMetaTags({ title: 'Post', ogImage: '/custom.png' });
    expect(tags.find((t) => t.property === 'og:image')?.content).toBe(`${SITE_URL}/custom.png`);
  });

  it('preserves absolute ogImage URL', () => {
    const tags = generateMetaTags({ title: 'Post', ogImage: 'https://example.com/img.png' });
    expect(tags.find((t) => t.property === 'og:image')?.content).toBe('https://example.com/img.png');
  });

  it('does not duplicate site title if already present', () => {
    const tags = generateMetaTags({ title: `Home | ${siteConfig.title}` });
    expect(tags.find((t) => t.property === 'og:title')?.content).toBe(`Home | ${siteConfig.title}`);
  });

  it('includes article tags when ogType is article', () => {
    const tags = generateMetaTags({
      title: 'My Post',
      ogType: 'article',
      pubDate: '2026-05-10T00:00:00.000Z',
      updatedDate: '2026-05-11T00:00:00.000Z',
      tags: ['astro', 'seo'],
      author: 'Ken',
    });

    expect(tags.find((t) => t.property === 'article:published_time')?.content).toBe('2026-05-10T00:00:00.000Z');
    expect(tags.find((t) => t.property === 'article:modified_time')?.content).toBe('2026-05-11T00:00:00.000Z');
    expect(tags.filter((t) => t.property === 'article:tag').map((t) => t.content)).toEqual(['astro', 'seo']);
    expect(tags.find((t) => t.name === 'author')?.content).toBe('Ken');
  });

  it('omits article dates when not provided', () => {
    const tags = generateMetaTags({ title: 'My Post', ogType: 'article' });
    expect(tags.some((t) => t.property === 'article:published_time')).toBe(false);
    expect(tags.some((t) => t.property === 'article:modified_time')).toBe(false);
  });

  it('omits article tags when tags array is empty', () => {
    const tags = generateMetaTags({ title: 'My Post', ogType: 'article', tags: [] });
    expect(tags.some((t) => t.property === 'article:tag')).toBe(false);
  });

  it('uses default author from siteConfig', () => {
    const tags = generateMetaTags({ title: 'My Post', ogType: 'article', pubDate: '2026-05-10T00:00:00.000Z' });
    expect(tags.find((t) => t.name === 'author')?.content).toBe(siteConfig.author);
  });
});

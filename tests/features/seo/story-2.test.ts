import { describe, it, expect } from 'vitest';
import { generateJsonLd } from '../../../src/utils/seo';
import { siteConfig, SITE_URL } from '../../../src/config/seo';

describe('generateJsonLd', () => {
  it('generates WebSite schema', () => {
    const result = generateJsonLd({
      type: 'WebSite',
      title: "Ken's Blog",
      description: 'A blog about engineering.',
      canonicalPath: '/',
    });

    expect(result['@context']).toBe('https://schema.org');
    expect(result['@type']).toBe('WebSite');
    expect(result.url).toBe(SITE_URL);
    expect(result.name).toBe("Ken's Blog");
    expect(result.description).toBe('A blog about engineering.');
    expect(result.publisher).toEqual({
      '@type': 'Organization',
      name: siteConfig.title,
      url: SITE_URL,
    });
  });

  it('generates Article schema with all fields', () => {
    const result = generateJsonLd({
      type: 'Article',
      title: 'My Post',
      description: 'A great post.',
      canonicalPath: '/blog/my-post',
      pubDate: '2026-05-10T00:00:00.000Z',
      updatedDate: '2026-05-11T00:00:00.000Z',
      tags: ['astro', 'seo'],
      author: 'Ken',
    });

    expect(result['@type']).toBe('Article');
    expect(result.headline).toBe('My Post');
    expect(result.description).toBe('A great post.');
    expect(result.url).toBe(`${SITE_URL}/blog/my-post`);
    expect(result.author).toEqual({ '@type': 'Person', name: 'Ken' });
    expect(result.publisher).toEqual({
      '@type': 'Organization',
      name: siteConfig.title,
      url: SITE_URL,
    });
    expect(result.datePublished).toBe('2026-05-10T00:00:00.000Z');
    expect(result.dateModified).toBe('2026-05-11T00:00:00.000Z');
    expect(result.keywords).toBe('astro, seo');
    expect(result.mainEntityOfPage).toEqual({
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/my-post`,
    });
  });

  it('falls back dateModified to datePublished when updatedDate is missing', () => {
    const result = generateJsonLd({
      type: 'Article',
      title: 'My Post',
      canonicalPath: '/blog/my-post',
      pubDate: '2026-05-10T00:00:00.000Z',
    });

    expect(result.dateModified).toBe('2026-05-10T00:00:00.000Z');
  });

  it('generates CollectionPage schema', () => {
    const result = generateJsonLd({
      type: 'CollectionPage',
      title: 'Blog',
      description: 'All posts.',
      canonicalPath: '/blog',
    });

    expect(result['@type']).toBe('CollectionPage');
    expect(result.name).toBe('Blog');
    expect(result.description).toBe('All posts.');
    expect(result.url).toBe(`${SITE_URL}/blog`);
    expect(result.isPartOf).toEqual({
      '@type': 'WebSite',
      name: siteConfig.title,
      url: SITE_URL,
    });
  });

  it('generates BreadcrumbList schema', () => {
    const result = generateJsonLd({
      type: 'BreadcrumbList',
      title: 'Tag: astro',
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Tags', url: '/tags' },
        { name: 'astro', url: '/tags/astro' },
      ],
    });

    expect(result['@type']).toBe('BreadcrumbList');
    expect(Array.isArray(result.itemListElement)).toBe(true);
    expect(result.itemListElement).toHaveLength(3);
    expect(result.itemListElement[0]).toEqual({
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: `${SITE_URL}/`,
    });
    expect(result.itemListElement[2]).toEqual({
      '@type': 'ListItem',
      position: 3,
      name: 'astro',
      item: `${SITE_URL}/tags/astro`,
    });
  });

  it('returns base object for unknown type', () => {
    const result = generateJsonLd({
      type: 'UnknownType',
      title: 'Something',
      canonicalPath: '/something',
    });

    expect(result['@context']).toBe('https://schema.org');
    expect(result['@type']).toBe('UnknownType');
    expect(result.url).toBe(`${SITE_URL}/something`);
    expect(result.name).toBeUndefined();
  });

  it('uses default description and author from siteConfig', () => {
    const result = generateJsonLd({
      type: 'WebSite',
      title: 'Home',
    });

    expect(result.description).toBe(siteConfig.description);
  });

  it('handles breadcrumbs with absolute URLs', () => {
    const result = generateJsonLd({
      type: 'BreadcrumbList',
      title: 'External',
      breadcrumbs: [
        { name: 'External', url: 'https://example.com/page' },
      ],
    });

    expect(result.itemListElement[0].item).toBe('https://example.com/page');
  });
});

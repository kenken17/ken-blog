import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { generateJsonLd, generateMetaTags } from '../../../src/utils/seo';
import { SITE_URL } from '../../../src/config/seo';

const authorPagePath = path.resolve(process.cwd(), 'src/pages/author/[id].astro');

function readAuthorPageSource(): string {
  return fs.readFileSync(authorPagePath, 'utf-8');
}

describe('Story 2: Author bio page', () => {
  describe('TASK-2-1: Author page route and structure', () => {
    it('creates the author page file', () => {
      expect(fs.existsSync(authorPagePath)).toBe(true);
    });

    it('exports getStaticPaths that fetches authors collection', () => {
      const source = readAuthorPageSource();
      expect(source).toContain('export async function getStaticPaths()');
      expect(source).toContain("await getCollection('authors')");
    });

    it('maps each author to params with id and props with author', () => {
      const source = readAuthorPageSource();
      expect(source).toContain('params: { id: author.id }');
      expect(source).toContain('props: { author }');
    });

    it('uses BaseLayout for page wrapper', () => {
      const source = readAuthorPageSource();
      expect(source).toContain("import BaseLayout from '../../layouts/BaseLayout.astro'");
      expect(source).toContain('<BaseLayout');
    });

    it('renders author avatar as rounded-full image with alt text', () => {
      const source = readAuthorPageSource();
      expect(source).toContain('rounded-full');
      expect(source).toContain('object-cover');
      expect(source).toContain('alt={`Portrait of ${author.data.name}`}');
    });

    it('renders author name as h1 with display font classes', () => {
      const source = readAuthorPageSource();
      expect(source).toContain('<h1');
      expect(source).toContain('font-display');
      expect(source).toContain('text-display-sm');
      expect(source).toContain('md:text-display-md');
      expect(source).toContain('{author.data.name}');
    });

    it('renders bio paragraph with secondary foreground and max width', () => {
      const source = readAuthorPageSource();
      expect(source).toContain('text-foreground-secondary');
      expect(source).toContain('max-w-2xl');
      expect(source).toContain('{author.data.bio}');
    });

    it('has a Posts by section with h2 heading', () => {
      const source = readAuthorPageSource();
      expect(source).toContain('<h2');
      expect(source).toContain('Posts by {author.data.name}');
    });

    it('filters posts by author id or defaults to ken', () => {
      const source = readAuthorPageSource();
      expect(source).toContain("post.data.author === author.id");
      expect(source).toContain("!post.data.author && author.id === 'ken'");
    });

    it('sorts posts by pubDate descending', () => {
      const source = readAuthorPageSource();
      expect(source).toContain('b.data.pubDate.valueOf() - a.data.pubDate.valueOf()');
    });

    it('includes a Back to blog footer link', () => {
      const source = readAuthorPageSource();
      expect(source).toContain('href="/blog"');
      expect(source).toContain('Back to all posts');
    });
  });

  describe('TASK-2-2: Author page styling', () => {
    it('uses animate-fade-in for entrance animation', () => {
      const source = readAuthorPageSource();
      expect(source).toContain('animate-fade-in');
    });

    it('uses max-w-3xl mx-auto px-6 py-24 layout container', () => {
      const source = readAuthorPageSource();
      expect(source).toContain('max-w-3xl mx-auto px-6 py-24');
    });

    it('does not introduce new global CSS or style tags', () => {
      const source = readAuthorPageSource();
      expect(source).not.toContain('<style>');
      expect(source).not.toContain('is:global');
    });
  });

  describe('Author page JSON-LD', () => {
    it('generates Person schema with name, bio, and canonical URL', () => {
      const jsonLd = generateJsonLd({
        type: 'Person',
        title: 'Ken',
        description: 'Software engineer and designer.',
        canonicalPath: '/author/ken',
      });

      expect(jsonLd['@context']).toBe('https://schema.org');
      expect(jsonLd['@type']).toBe('Person');
      expect(jsonLd.name).toBe('Ken');
      expect(jsonLd.description).toBe('Software engineer and designer.');
      expect(jsonLd.url).toBe(`${SITE_URL}/author/ken`);
    });

    it('generates Person schema without canonicalPath', () => {
      const jsonLd = generateJsonLd({
        type: 'Person',
        title: 'Jane',
        description: 'Writer and poet.',
      });

      expect(jsonLd['@context']).toBe('https://schema.org');
      expect(jsonLd['@type']).toBe('Person');
      expect(jsonLd.name).toBe('Jane');
      expect(jsonLd.description).toBe('Writer and poet.');
      expect(jsonLd.url).toBe(SITE_URL);
    });
  });

  describe('generateMetaTags utility', () => {
    it('returns an array of meta tags for a basic page', () => {
      const tags = generateMetaTags({
        title: 'About',
        description: 'About page description.',
        canonicalPath: '/about',
      });

      expect(Array.isArray(tags)).toBe(true);
      expect(tags.length).toBeGreaterThan(0);

      const descriptionTag = tags.find((t) => t.name === 'description');
      expect(descriptionTag).toBeDefined();
      expect(descriptionTag!.content).toBe('About page description.');

      const ogTitle = tags.find((t) => t.property === 'og:title');
      expect(ogTitle).toBeDefined();
      expect(ogTitle!.content).toContain('About');
    });

    it('includes article-specific tags when ogType is article', () => {
      const tags = generateMetaTags({
        title: 'My Post',
        description: 'A blog post.',
        canonicalPath: '/blog/my-post',
        ogType: 'article',
        pubDate: '2024-01-01T00:00:00Z',
        updatedDate: '2024-01-02T00:00:00Z',
        tags: ['astro', 'web'],
        author: 'Ken',
      });

      const publishedTime = tags.find((t) => t.property === 'article:published_time');
      expect(publishedTime).toBeDefined();
      expect(publishedTime!.content).toBe('2024-01-01T00:00:00Z');

      const modifiedTime = tags.find((t) => t.property === 'article:modified_time');
      expect(modifiedTime).toBeDefined();
      expect(modifiedTime!.content).toBe('2024-01-02T00:00:00Z');

      const tagProps = tags.filter((t) => t.property === 'article:tag');
      expect(tagProps.length).toBe(2);

      const authorTag = tags.find((t) => t.name === 'author');
      expect(authorTag).toBeDefined();
      expect(authorTag!.content).toBe('Ken');
    });
  });
});

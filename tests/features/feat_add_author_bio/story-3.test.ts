import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { calculateReadingTime } from '../../../src/utils/reading-time';
import {
  getAllTags,
  getTagCounts,
  filterPostsByTags,
  getPostsByTag,
} from '../../../src/utils/tags';
import {
  toggleSortOrder,
  sortPosts,
  getDefaultSortOrder,
  getEffectiveSortOrder,
} from '../../../src/utils/sort-order';

const postPagePath = path.resolve(process.cwd(), 'src/pages/blog/[slug].astro');

function readPostPageSource(): string {
  return fs.readFileSync(postPagePath, 'utf-8');
}

describe('Story 3: Author link from blog posts', () => {
  describe('TASK-3-1: Author name as clickable link', () => {
    it('renders author name as a link in post header metadata', () => {
      const source = readPostPageSource();
      expect(source).toContain('<a');
      expect(source).toContain('href={`/author/${author.id}`}');
      expect(source).toContain('{author.data.name}');
    });

    it('uses specified Tailwind utility classes for author link', () => {
      const source = readPostPageSource();
      expect(source).toContain('text-foreground-muted');
      expect(source).toContain('text-sm');
      expect(source).toContain('uppercase');
      expect(source).toContain('tracking-wider');
      expect(source).toContain('font-sans');
      expect(source).toContain('hover:text-foreground');
      expect(source).toContain('transition-colors');
      expect(source).toContain('duration-200');
    });

    it('has aria-label for author link accessibility', () => {
      const source = readPostPageSource();
      expect(source).toContain('aria-label={`Posts by ${author.data.name}`}');
    });
  });

  describe('TASK-3-2: getStaticPaths passes author data as prop', () => {
    it('fetches authors collection in getStaticPaths', () => {
      const source = readPostPageSource();
      expect(source).toContain("const authors = await getCollection('authors')");
    });

    it('finds matching author by post author field or defaults to ken', () => {
      const source = readPostPageSource();
      expect(source).toContain("const authorId = post.data.author ?? 'ken'");
      expect(source).toContain("authors.find((a: CollectionEntry<'authors'>) => a.id === authorId)");
    });

    it('passes author as prop to each post page', () => {
      const source = readPostPageSource();
      expect(source).toContain('props: { post, author }');
    });

    it('declares author in Props interface', () => {
      const source = readPostPageSource();
      expect(source).toContain('author?: CollectionEntry<\'authors\'>');
    });
  });

  describe('calculateReadingTime utility', () => {
    it('returns 1 minute for very short markdown', () => {
      const markdown = 'Hello world.';
      expect(calculateReadingTime(markdown)).toBe(1);
    });

    it('correctly calculates reading time for ~400 words', () => {
      const words = Array.from({ length: 400 }, (_, i) => `word${i}`).join(' ');
      expect(calculateReadingTime(words)).toBe(2);
    });

    it('ignores markdown syntax when counting', () => {
      const markdown = `# Title\n\n> Quote block\n\n- item one\n- item two\n\n**bold** _italic_ \`code\``;
      const result = calculateReadingTime(markdown);
      expect(result).toBe(1);
    });
  });

  describe('tags utility functions', () => {
    const mockPosts = [
      { data: { tags: ['astro', 'web'], pubDate: new Date('2024-01-01') } },
      { data: { tags: ['web', 'design'], pubDate: new Date('2024-02-01') } },
      { data: { tags: ['astro'], pubDate: new Date('2024-03-01') } },
    ] as any[];

    it('getAllTags returns sorted unique tags', () => {
      const tags = getAllTags(mockPosts);
      expect(tags).toEqual(['astro', 'design', 'web']);
    });

    it('getTagCounts returns correct occurrence map', () => {
      const counts = getTagCounts(mockPosts);
      expect(counts.get('astro')).toBe(2);
      expect(counts.get('web')).toBe(2);
      expect(counts.get('design')).toBe(1);
    });

    it('filterPostsByTags returns posts matching any selected tag', () => {
      const filtered = filterPostsByTags(mockPosts, ['design']);
      expect(filtered.length).toBe(1);
      expect(filtered[0].data.tags).toContain('design');
    });

    it('filterPostsByTags returns all posts when no tags selected', () => {
      const filtered = filterPostsByTags(mockPosts, []);
      expect(filtered.length).toBe(3);
    });

    it('getPostsByTag filters and sorts by pubDate descending', () => {
      const posts = getPostsByTag(mockPosts, 'astro');
      expect(posts.length).toBe(2);
      expect(posts[0].data.pubDate.getTime()).toBeGreaterThan(
        posts[1].data.pubDate.getTime()
      );
    });
  });

  describe('sort-order utility functions', () => {
    it('toggleSortOrder switches between chronological and reverse-chronological', () => {
      expect(toggleSortOrder('chronological')).toBe('reverse-chronological');
      expect(toggleSortOrder('reverse-chronological')).toBe('chronological');
    });

    it('getDefaultSortOrder returns reverse-chronological', () => {
      expect(getDefaultSortOrder()).toBe('reverse-chronological');
    });

    it('sortPosts sorts correctly in both directions', () => {
      const posts = [
        { data: { pubDate: new Date('2024-01-01') } },
        { data: { pubDate: new Date('2024-03-01') } },
        { data: { pubDate: new Date('2024-02-01') } },
      ] as any[];

      const chronological = sortPosts(posts, 'chronological');
      expect(chronological[0].data.pubDate.toISOString()).toBe('2024-01-01T00:00:00.000Z');

      const reverse = sortPosts(posts, 'reverse-chronological');
      expect(reverse[0].data.pubDate.toISOString()).toBe('2024-03-01T00:00:00.000Z');
    });
  });
});

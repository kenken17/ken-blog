import { describe, it, expect, vi, beforeEach } from 'vitest';
import { searchPosts, highlightText, debounce, fetchSearchIndex, clearSearchIndexCache } from '../search';
import type { SearchIndexEntry } from '../search';

function makeEntry(
  slug: string,
  title: string,
  description: string,
  tags: string[],
  pubDate: string
): SearchIndexEntry {
  return { slug, title, description, tags, pubDate };
}

const index: SearchIndexEntry[] = [
  makeEntry('a', 'Getting Started with Astro', 'A guide to building static sites', ['astro', 'ssg'], '2024-01-15'),
  makeEntry('b', 'TypeScript Tips', 'Advanced patterns for TypeScript developers', ['typescript', 'javascript'], '2024-02-10'),
  makeEntry('c', 'CSS Grid Mastery', 'Learn CSS Grid layout techniques', ['css', 'layout'], '2024-03-05'),
  makeEntry('d', 'Vim Workflow', 'Boost your productivity with Vim', ['vim', 'editor'], '2024-01-20'),
];

describe('searchPosts', () => {
  it('filters by title match', () => {
    const results = searchPosts(index, 'astro');
    expect(results).toHaveLength(1);
    expect(results[0]!.entry.slug).toBe('a');
  });

  it('filters by description match', () => {
    const results = searchPosts(index, 'productivity');
    expect(results).toHaveLength(1);
    expect(results[0]!.entry.slug).toBe('d');
  });

  it('filters by tag match', () => {
    const results = searchPosts(index, 'typescript');
    expect(results).toHaveLength(1);
    expect(results[0]!.entry.slug).toBe('b');
  });

  it('is case-insensitive', () => {
    const results = searchPosts(index, 'ASTRO');
    expect(results).toHaveLength(1);
    expect(results[0]!.entry.slug).toBe('a');
  });

  it('returns empty array for empty query', () => {
    expect(searchPosts(index, '')).toEqual([]);
    expect(searchPosts(index, '   ')).toEqual([]);
  });

  it('returns empty array when no matches', () => {
    expect(searchPosts(index, 'react')).toEqual([]);
  });

  it('returns up to 8 results', () => {
    const largeIndex = Array.from({ length: 12 }, (_, i) =>
      makeEntry(String(i), `Post ${i}`, 'description', ['tag'], '2024-01-01')
    );
    const results = searchPosts(largeIndex, 'post');
    expect(results).toHaveLength(8);
  });

  it('matches multiple fields for same entry', () => {
    const results = searchPosts(index, 'vim');
    expect(results).toHaveLength(1);
    expect(results[0]!.entry.slug).toBe('d');
  });
});

describe('highlightText', () => {
  it('wraps matches in mark tags', () => {
    const result = highlightText('Hello Astro World', 'astro');
    expect(result).toContain('<mark');
    expect(result).toContain('Astro');
    expect(result).toContain('</mark>');
  });

  it('is case-insensitive', () => {
    const result = highlightText('Hello Astro World', 'ASTRO');
    expect(result).toContain('Astro');
  });

  it('returns original text when no query', () => {
    expect(highlightText('Hello World', '')).toBe('Hello World');
  });

  it('handles special regex characters in query', () => {
    const result = highlightText('File [test].txt', '[test]');
    expect(result).toContain('<mark');
  });
});

describe('debounce', () => {
  it('delays function execution', () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const debounced = debounce(fn, 200);

    debounced();
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(200);
    expect(fn).toHaveBeenCalledOnce();

    vi.useRealTimers();
  });

  it('resets timer on subsequent calls', () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const debounced = debounce(fn, 200);

    debounced();
    vi.advanceTimersByTime(100);
    debounced();
    vi.advanceTimersByTime(100);
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledOnce();

    vi.useRealTimers();
  });
});

describe('fetchSearchIndex', () => {
  beforeEach(() => {
    clearSearchIndexCache();
  });

  it('fetches and caches the search index', async () => {
    const mockData: SearchIndexEntry[] = [
      makeEntry('a', 'Title', 'Desc', ['tag'], '2024-01-01'),
    ];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockData,
    } as Response);

    const result1 = await fetchSearchIndex();
    expect(result1).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledOnce();

    const result2 = await fetchSearchIndex();
    expect(result2).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledOnce();
  });

  it('throws on failed fetch', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    } as Response);

    await expect(fetchSearchIndex()).rejects.toThrow('Failed to fetch search index: 404');
  });
});

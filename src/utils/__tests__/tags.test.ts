import { describe, it, expect } from 'vitest';
import { getAllTags, getPostsByTag, getTagCounts } from '../tags';
import type { CollectionEntry } from 'astro:content';

function makePost(
  id: string,
  tags: string[],
  pubDate: Date
): CollectionEntry<'posts'> {
  return {
    id,
    collection: 'posts',
    data: {
      title: `Post ${id}`,
      description: `Description ${id}`,
      pubDate,
      draft: false,
      tags,
    },
    filePath: `src/content/posts/${id}.md`,
    body: '',
    rendered: undefined,
  } as CollectionEntry<'posts'>;
}

const posts: CollectionEntry<'posts'>[] = [
  makePost('a', ['typescript', 'astro'], new Date('2024-01-15')),
  makePost('b', ['astro', 'css'], new Date('2024-02-10')),
  makePost('c', ['typescript'], new Date('2024-03-05')),
  makePost('d', [], new Date('2024-01-20')),
];

describe('getAllTags', () => {
  it('returns deduplicated tags sorted alphabetically', () => {
    expect(getAllTags(posts)).toEqual(['astro', 'css', 'typescript']);
  });

  it('returns empty array when no posts have tags', () => {
    expect(getAllTags([posts[3]!])).toEqual([]);
  });

  it('returns empty array for empty input', () => {
    expect(getAllTags([])).toEqual([]);
  });
});

describe('getPostsByTag', () => {
  it('returns posts with the given tag sorted by pubDate descending', () => {
    const result = getPostsByTag(posts, 'typescript');
    expect(result.map((p) => p.id)).toEqual(['c', 'a']);
  });

  it('returns empty array when no posts match', () => {
    expect(getPostsByTag(posts, 'react')).toEqual([]);
  });

  it('returns empty array for empty input', () => {
    expect(getPostsByTag([], 'astro')).toEqual([]);
  });
});

describe('getTagCounts', () => {
  it('returns correct counts for each tag', () => {
    const counts = getTagCounts(posts);
    expect(counts.get('astro')).toBe(2);
    expect(counts.get('css')).toBe(1);
    expect(counts.get('typescript')).toBe(2);
  });

  it('returns empty map for empty input', () => {
    expect(getTagCounts([]).size).toBe(0);
  });
});

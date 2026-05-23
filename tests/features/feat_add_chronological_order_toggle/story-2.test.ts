import { describe, it, expect } from 'vitest';
import { getPostsByTag } from '../../../src/utils/tags';
import type { CollectionEntry } from 'astro:content';

function makePost(
  id: string,
  tags: string[],
  pubDate: string
): CollectionEntry<'posts'> {
  return {
    id,
    collection: 'posts',
    data: {
      title: `Post ${id}`,
      description: `Description ${id}`,
      pubDate: new Date(pubDate),
      draft: false,
      tags,
    },
    filePath: `src/content/posts/${id}.md`,
    body: '',
    rendered: undefined,
  } as CollectionEntry<'posts'>;
}

const posts: CollectionEntry<'posts'>[] = [
  makePost('one', ['ai'], '2024-01-01'),
  makePost('two', ['ai', 'vim'], '2024-04-01'),
  makePost('three', ['vim'], '2024-06-01'),
  makePost('four', ['ai'], '2024-08-01'),
];

describe('story 2: tag sort order logic', () => {
  it('returns matching tag posts sorted descending by default', () => {
    const result = getPostsByTag(posts, 'ai');
    expect(result.map((post) => post.id)).toEqual(['four', 'two', 'one']);
  });

  it('returns matching tag posts sorted ascending when sortOrder is asc', () => {
    const result = getPostsByTag(posts, 'ai', 'asc');
    expect(result.map((post) => post.id)).toEqual(['one', 'two', 'four']);
  });

  it('returns only posts containing the selected tag', () => {
    const result = getPostsByTag(posts, 'vim', 'desc');
    expect(result.map((post) => post.id)).toEqual(['three', 'two']);
  });

  it('returns empty array when no posts match the tag', () => {
    expect(getPostsByTag(posts, 'react', 'asc')).toEqual([]);
  });
});

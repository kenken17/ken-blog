import { describe, it, expect } from 'vitest';
import { sortPostsByDate } from '../../../src/utils/tags';
import type { CollectionEntry } from 'astro:content';

function makePost(id: string, pubDate: string): CollectionEntry<'posts'> {
  return {
    id,
    collection: 'posts',
    data: {
      title: `Post ${id}`,
      description: `Description ${id}`,
      pubDate: new Date(pubDate),
      draft: false,
      tags: ['ai'],
    },
    filePath: `src/content/posts/${id}.md`,
    body: '',
    rendered: undefined,
  } as CollectionEntry<'posts'>;
}

const posts: CollectionEntry<'posts'>[] = [
  makePost('oldest', '2024-01-01'),
  makePost('middle', '2024-06-01'),
  makePost('newest', '2024-12-01'),
];

describe('story 1: blog sort order logic', () => {
  it('sorts posts descending by default when sortOrder is omitted', () => {
    const result = sortPostsByDate(posts);
    expect(result.map((post) => post.id)).toEqual(['newest', 'middle', 'oldest']);
  });

  it('sorts posts ascending when sortOrder is asc', () => {
    const result = sortPostsByDate(posts, 'asc');
    expect(result.map((post) => post.id)).toEqual(['oldest', 'middle', 'newest']);
  });

  it('sorts posts descending when sortOrder is desc', () => {
    const result = sortPostsByDate(posts, 'desc');
    expect(result.map((post) => post.id)).toEqual(['newest', 'middle', 'oldest']);
  });

  it('does not mutate the original posts array', () => {
    const originalOrder = posts.map((post) => post.id);
    void sortPostsByDate(posts, 'asc');
    expect(posts.map((post) => post.id)).toEqual(originalOrder);
  });
});

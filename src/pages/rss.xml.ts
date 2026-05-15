import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import type { CollectionEntry } from 'astro:content';

export async function GET(context: APIContext) {
  const posts = await getCollection('posts');
  const nonDraftPosts = posts.filter((post: CollectionEntry<'posts'>) => !post.data.draft);

  return rss({
    title: "Ken's Blog",
    description: "A place for thoughts on engineering, design, and technology.",
    site: context.site ?? 'https://ken-blog.pages.dev',
    items: nonDraftPosts
      .sort((a: CollectionEntry<'posts'>, b: CollectionEntry<'posts'>) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
      .map((post: CollectionEntry<'posts'>) => ({
        title: post.data.title,
        pubDate: post.data.pubDate,
        description: post.data.description || '',
        link: `/blog/${post.id}`,
        guid: `/blog/${post.id}`,
      })),
  });
}

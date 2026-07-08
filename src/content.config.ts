import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    draft: z.boolean().optional().default(false),
    tags: z.array(z.string()).optional().default([]),
    author: z.string().optional().default('ken'),
    postType: z.enum(['article', 'photo', 'video']).optional().default('article'),
    images: z
      .array(
        z.object({
          url: z.string(),
          alt: z.string(),
          caption: z.string().optional(),
        }),
      )
      .optional()
      .default([]),
    video: z
      .object({
        type: z.enum(['upload', 'embed']),
        url: z.string(),
        caption: z.string().optional(),
        autoplay: z.boolean().optional().default(false),
        loop: z.boolean().optional().default(false),
        controls: z.boolean().optional().default(true),
      })
      .optional(),
  }),
});

const authors = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/authors' }),
  schema: z.object({
    name: z.string(),
    avatar: z.string(),
    bio: z.string(),
  }),
});

export const collections = { posts, authors };
